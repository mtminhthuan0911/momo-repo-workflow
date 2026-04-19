// pages/api/telegram-webhook.ts
// Vercel chỉ nhận event + insert jobs — KHÔNG download file
// swift-endpoint (Supabase Edge Function) sẽ download file bằng TELEGRAM_BOT_TOKEN
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DOC_TAG_REGEX = /\[(PRD|BUG|CHANGE|DESIGN|RESEARCH|AUDIT)\]/i;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  // Verify secret token nếu đã set (optional nhưng recommended)
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretToken) {
    const incoming = req.headers["x-telegram-bot-api-secret-token"];
    if (incoming !== secretToken) return res.status(401).end();
  }

  const { message } = req.body;
  if (!message) return res.status(200).json({ ok: true });

  const caption = message.caption ?? "";
  const text = message.text ?? "";
  const rawText = caption || text;

  const isMdFile =
    message.document?.mime_type === "text/markdown" ||
    message.document?.file_name?.endsWith(".md");
  const hasDocTag = DOC_TAG_REGEX.test(rawText);

  // Bỏ qua nếu không phải file .md có tag hoặc text có tag
  if (!isMdFile && !hasDocTag) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Lưu file_id để swift-endpoint download sau — không cần token ở Vercel
  const { error } = await supabase.from("jobs").insert({
    slack_ts: String(message.message_id),
    channel: "telegram",
    thread_ts: null,
    message: rawText,
    status: "pending",
    source: "telegram",
    file_content: message.document?.file_id ?? null, // swift-endpoint sẽ dùng file_id này để download
    file_name: message.document?.file_name ?? null,
    sender_id: String(message.from?.id ?? ""),
    sender_name: message.from?.first_name ?? "Bảo",
  });

  if (error) {
    if (error.code === "23505") {
      // Duplicate message_id — Telegram retry, bỏ qua
      return res.status(200).json({ ok: true, skipped: true });
    }
    console.error("[TelegramWebhook] Insert job failed:", error.message);
    return res.status(500).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}
