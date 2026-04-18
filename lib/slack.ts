import crypto from "crypto";

// ─── Verify Slack Signing Secret ───────────────────────────────────────────
export function verifySlackSignature(
  signingSecret: string,
  requestSignature: string,
  requestTimestamp: string,
  rawBody: string,
): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(requestTimestamp, 10)) > 300) {
    return false;
  }
  const baseString = `v0:${requestTimestamp}:${rawBody}`;
  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");
  const computedSignature = `v0=${hmac}`;
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(requestSignature),
  );
}

// ─── Slack API helpers ──────────────────────────────────────────────────────
const SLACK_API = "https://slack.com/api";

interface SlackPostOptions {
  channel: string;
  text: string;
  thread_ts?: string;
  blocks?: object[];
}

export async function postToSlack(opts: SlackPostOptions): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN!;
  const res = await fetch(`${SLACK_API}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API error: ${data.error}`);
}

export async function replyThread(
  channel: string,
  thread_ts: string,
  text: string,
): Promise<void> {
  await postToSlack({ channel, text, thread_ts });
}

// ─── Download file text content từ Slack ───────────────────────────────────
export async function downloadSlackFileText(
  fileId: string,
): Promise<string | null> {
  const token = process.env.SLACK_BOT_TOKEN!;
  const infoRes = await fetch(`${SLACK_API}/files.info?file=${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const info = await infoRes.json();
  if (!info.ok || !info.file?.url_private) return null;
  const fileRes = await fetch(info.file.url_private, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return fileRes.text();
}

// ─── SlackEvent type ────────────────────────────────────────────────────────
export interface SlackEvent {
  type: string;
  subtype?: string;
  text?: string; // optional — Slack đôi khi không gửi text
  ts: string;
  thread_ts?: string;
  channel: string;
  user?: string;
  bot_id?: string;
  files?: Array<{ id: string; name: string; filetype: string }>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
export function extractDocType(text: string): string | null {
  const match = text.match(/\[(PRD|CHANGE|DESIGN|BUG|RESEARCH|AUDIT)\]/i);
  return match ? match[1].toUpperCase() : null;
}

export function extractRequestName(text: string): string {
  const match = text.match(
    /\[(?:PRD|CHANGE|DESIGN|BUG|RESEARCH|AUDIT)\]\s+(.+?)(?:\s*@|\s*$)/i,
  );
  if (!match) return "unknown-request";
  return match[1]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function hasRocketEmoji(text: string): boolean {
  return text.includes("🚀");
}
