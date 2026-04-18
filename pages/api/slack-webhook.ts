// pages/api/slack-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  verifySlackSignature,
  extractDocType,
  SlackEvent,
} from "../../lib/slack";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  let payload: any;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Slack URL verification
  if (payload.type === "url_verification") {
    return res.status(200).json({ challenge: payload.challenge });
  }

  // Verify signature
  const signature = req.headers["x-slack-signature"] as string;
  const timestamp = req.headers["x-slack-request-timestamp"] as string;
  if (!signature || !timestamp) return res.status(401).end();

  const isValid = verifySlackSignature(
    process.env.SLACK_SIGNING_SECRET!,
    signature,
    timestamp,
    rawBody,
  );
  if (!isValid) return res.status(401).end();

  const event: SlackEvent = payload.event;
  if (!event) return res.status(200).json({ ok: true });

  // Filter: chỉ xử lý message thật có [TYPE] tag, không phải bot
  const isChannelMessage = event.type === "message" && !event.subtype;
  const isFromBot = Boolean(event.bot_id);
  const hasDocTag = extractDocType(event.text ?? "") !== null;

  if (!isChannelMessage || isFromBot || !hasDocTag) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Insert job vào Supabase — UNIQUE slack_ts tự dedup Slack retry
  const { error } = await supabase.from("jobs").insert({
    slack_ts: event.ts,
    channel: event.channel,
    thread_ts: event.thread_ts ?? event.ts,
    message: event.text ?? "",
    status: "pending",
  });

  if (error && error.code !== "23505") {
    // 23505 = unique violation = duplicate, bỏ qua
    console.error("[Webhook] Insert job failed:", error.message);
  }

  // Return 200 ngay — Slack không retry
  return res.status(200).json({ ok: true });
}
