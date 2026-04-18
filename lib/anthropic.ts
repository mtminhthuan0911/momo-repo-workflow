// lib/anthropic.ts
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1500,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }] as Message[],
  };

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[Anthropic] Attempt ${attempt}/${MAX_RETRIES}...`);
    const t0 = Date.now();

    try {
      const res = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      });

      // Overloaded — wait and retry
      if (res.status === 529) {
        const wait = 2000 * attempt; // 2s, 4s, 6s
        console.warn(
          `[Anthropic] Overloaded (529), waiting ${wait}ms before retry...`,
        );
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      // Rate limit — wait and retry
      if (res.status === 429) {
        const wait = 3000 * attempt;
        console.warn(
          `[Anthropic] Rate limited (429), waiting ${wait}ms before retry...`,
        );
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Anthropic API error ${res.status}: ${err}`);
      }

      const data: ClaudeResponse = await res.json();
      console.log(`[Anthropic] Done in ${Date.now() - t0}ms`);

      const textBlock = data.content.find((c) => c.type === "text");
      if (!textBlock) throw new Error("No text in Claude response");
      return textBlock.text;
    } catch (err: any) {
      // Network timeout — retry
      if (err.name === "TimeoutError" || err.code === "ETIMEDOUT") {
        console.warn(`[Anthropic] Timeout on attempt ${attempt}, retrying...`);
        if (attempt < MAX_RETRIES) continue;
      }
      throw err;
    }
  }

  throw new Error("[Anthropic] Max retries exceeded");
}

export async function callClaudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1000,
): Promise<T> {
  const raw = await callClaude(systemPrompt, userMessage, maxTokens);
  const clean = raw.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(clean) as T;
}
