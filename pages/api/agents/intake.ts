// agents/intake.ts
// Nhận Slack event → classify [TYPE] → insert vào Supabase feature_requests

import { callClaudeJSON } from "@/lib/anthropic";
import {
  downloadSlackFileText,
  extractDocType,
  extractRequestName,
  SlackEvent,
} from "@/lib/slack";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface IntakeResult {
  requestId: string;
  requestName: string;
  docType: string;
}

interface ClassifyResult {
  docType: string;
  requestName: string;
  summary: string;
}

const CLASSIFY_PROMPT = `Bạn là Intake Agent cho MoMo workflow.
Phân loại tài liệu và trích xuất thông tin cốt lõi.

Trả về JSON:
{
  "docType": "PRD|CHANGE|DESIGN|BUG|RESEARCH|AUDIT",
  "requestName": "ten-ngan-gon-khong-dau",
  "summary": "Mô tả 1 câu ngắn gọn"
}

Rules:
- requestName: lowercase, dùng dấu gạch ngang, tối đa 5 từ
- Chỉ trả về JSON thuần, không có preamble`;

export async function runIntakeAgent(
  event: SlackEvent,
  messageText: string,
): Promise<IntakeResult> {
  const t0 = Date.now();
  console.log(
    `[IntakeAgent] START — slack_ts:${event.ts} channel:${event.channel}`,
  );

  // ── Dedup check — tránh Slack retry chạy pipeline 2 lần ──────────────────
  const { data: existing } = await supabase
    .from("feature_requests")
    .select("id, request_name, doc_type")
    .eq("slack_ts", event.ts)
    .maybeSingle();

  if (existing) {
    console.log(`[IntakeAgent] Duplicate event detected — skipping insert`);
    return {
      requestId: existing.id,
      requestName: existing.request_name,
      docType: existing.doc_type,
    };
  }

  let docType = extractDocType(messageText) ?? "PRD";
  let content = messageText;
  console.log(`[IntakeAgent] Detected docType (pre-classify): ${docType}`);

  // ── Download file đính kèm nếu có ────────────────────────────────────────
  if (event.files && event.files.length > 0) {
    console.log(
      `[IntakeAgent] Found ${event.files.length} file(s), downloading...`,
    );
    const mdFile = event.files.find(
      (f) => f.filetype === "md" || f.name.endsWith(".md"),
    );
    const targetFile = mdFile ?? event.files[0];
    console.log(
      `[IntakeAgent] Downloading file: ${targetFile.name} (id:${targetFile.id})`,
    );
    const fileContent = await downloadSlackFileText(targetFile.id);
    if (fileContent) {
      content = fileContent;
      console.log(`[IntakeAgent] File downloaded — ${content.length} chars`);
    } else {
      console.warn(
        `[IntakeAgent] File download returned empty, using message text`,
      );
    }
  }

  // ── Classify qua Claude ───────────────────────────────────────────────────
  console.log(
    `[IntakeAgent] Calling Claude to classify (content length: ${content.length})...`,
  );
  const t1 = Date.now();
  const classified = await callClaudeJSON<ClassifyResult>(
    CLASSIFY_PROMPT,
    `Message: ${messageText}\n\nContent:\n${content.slice(0, 2000)}`,
  );
  console.log(
    `[IntakeAgent] Claude classify done (${Date.now() - t1}ms) → docType:${classified.docType} requestName:${classified.requestName}`,
  );
  console.log(`[IntakeAgent] Claude summary: "${classified.summary}"`);

  docType = classified.docType ?? docType;
  const requestName = classified.requestName ?? extractRequestName(messageText);

  // ── Insert vào Supabase ───────────────────────────────────────────────────
  console.log(
    `[IntakeAgent] Inserting into feature_requests — project:${extractProject(messageText)} docType:${docType} requestName:${requestName}`,
  );
  const t2 = Date.now();
  const { data, error } = await supabase
    .from("feature_requests")
    .insert({
      project: extractProject(messageText),
      slack_ts: event.ts,
      channel: event.channel,
      doc_type: docType,
      request_name: requestName,
      content: content,
      summary: classified.summary,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error(`[IntakeAgent] Supabase insert FAILED: ${error.message}`);
    throw new Error(`Supabase insert error: ${error.message}`);
  }
  console.log(
    `[IntakeAgent] Supabase insert OK (${Date.now() - t2}ms) → requestId:${data.id}`,
  );
  console.log(`[IntakeAgent] DONE in ${Date.now() - t0}ms`);

  return {
    requestId: data.id,
    requestName,
    docType,
  };
}

// Extract project name từ message, default là 'ads-management'
function extractProject(text: string): string {
  const match = text.match(/project:(\S+)/i);
  return match ? match[1] : "ads-management";
}
