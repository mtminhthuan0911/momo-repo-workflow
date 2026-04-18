// agents/status.ts
// Insert feature_statuses → update feature_requests.status → reply Slack thread

import { replyThread } from "@/lib/slack";
import { ReviewResult } from "./review";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type RequestStatus = "pending" | "in_progress" | "done" | "rejected";

export interface StatusResult {
  slackMessage: string;
}

export async function runStatusAgent(
  requestId: string,
  reviewResult: ReviewResult,
  channel: string,
  thread_ts: string,
  status: RequestStatus = "pending",
  demoUrl?: string,
): Promise<StatusResult> {
  const t0 = Date.now();
  console.log(`[StatusAgent] START — requestId:${requestId} status:${status} channel:${channel} thread_ts:${thread_ts}`);

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  // Insert vào feature_statuses (lưu history, không update)
  console.log(`[StatusAgent] Inserting into feature_statuses...`);
  const t1 = Date.now();
  const { error: statusError } = await supabase
    .from("feature_statuses")
    .insert({
      request_id: requestId,
      status,
      updated_by: "Claude Bot",
      demo_url: demoUrl ?? null,
    });

  if (statusError) {
    console.error(`[StatusAgent] feature_statuses insert FAILED: ${statusError.message}`);
    throw new Error(`Supabase status insert error: ${statusError.message}`);
  }
  console.log(`[StatusAgent] feature_statuses insert OK (${Date.now() - t1}ms)`);

  // Update status trên feature_requests để dễ query
  console.log(`[StatusAgent] Updating feature_requests status → ${status}...`);
  const t2 = Date.now();
  const { error: updateError } = await supabase
    .from("feature_requests")
    .update({ status, demo_url: demoUrl ?? null })
    .eq("id", requestId);

  if (updateError) {
    console.error(`[StatusAgent] feature_requests update FAILED: ${updateError.message}`);
    throw new Error(`Supabase update error: ${updateError.message}`);
  }
  console.log(`[StatusAgent] feature_requests update OK (${Date.now() - t2}ms)`);

  // Build và gửi Slack message
  const slackMessage = buildSlackMessage({
    requestName: reviewResult.requestName,
    status,
    updatedBy: "Claude Bot",
    timestamp: now,
    tagTarget: reviewResult.tagTarget,
    reviewSummary: reviewResult.summary,
    demoUrl,
  });

  console.log(`[StatusAgent] Posting Slack reply to thread ${thread_ts}...`);
  const t3 = Date.now();
  await replyThread(channel, thread_ts, slackMessage);
  console.log(`[StatusAgent] Slack reply sent (${Date.now() - t3}ms)`);
  console.log(`[StatusAgent] DONE in ${Date.now() - t0}ms`);

  return { slackMessage };
}

// ─── TechLead approve — gọi từ molanding Claude Code ─────────────────────────
export async function handleTechLeadDone(
  requestId: string,
  channel: string,
  thread_ts: string,
  demoUrl?: string,
): Promise<void> {
  // Insert status history
  await supabase.from("feature_statuses").insert({
    request_id: requestId,
    status: "done",
    updated_by: "TechLead",
    demo_url: demoUrl ?? null,
  });

  // Update feature_requests
  await supabase
    .from("feature_requests")
    .update({ status: "done", demo_url: demoUrl ?? null })
    .eq("id", requestId);

  // Notify Slack
  const BAO = process.env.SLACK_USER_BAO ?? "@Bảo";
  const msg = demoUrl
    ? `✅ Task xong. Demo: ${demoUrl}\n<@${BAO}>`
    : `✅ Task xong.\n<@${BAO}>`;

  await replyThread(channel, thread_ts, msg);
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function buildSlackMessage(opts: {
  requestName: string;
  status: RequestStatus;
  updatedBy: string;
  timestamp: string;
  tagTarget: string;
  reviewSummary: string;
  demoUrl?: string;
}): string {
  const emoji: Record<RequestStatus, string> = {
    pending: "⏳",
    in_progress: "🔄",
    done: "✅",
    rejected: "❌",
  };

  const lines = [
    `📋 *Status Update — ${opts.requestName}*`,
    `• Status: ${emoji[opts.status]} ${opts.status}`,
    `• Updated by: ${opts.updatedBy}`,
    `• Updated at: ${opts.timestamp}`,
  ];

  if (opts.demoUrl) lines.push(`• Demo: ${opts.demoUrl}`);

  lines.push(`\n${opts.reviewSummary}`);
  lines.push(`\n${opts.tagTarget}`);

  return lines.join("\n");
}
