// agents/review.ts
// Đọc PRD từ Supabase → chạy checklist → insert vào feature_feedbacks

import { callClaudeJSON } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface ReviewResult {
  feedbackId: string;
  requestName: string;
  allPassed: boolean;
  tagTarget: "@Bảo" | "@Thuận Minh";
  summary: string;
}

interface ChecklistItem {
  label: string;
  passed: boolean;
  note: string;
}

interface ChecklistResult {
  items: ChecklistItem[];
  allPassed: boolean;
  failCount: number;
  recommendation: string;
}

const REVIEW_PROMPT = `Bạn là Review Agent cho MoMo workflow.
Chạy PRD Review Checklist và đánh giá chất lượng tài liệu.

Checklist 7 điểm:
1. Có mô tả ngắn gọn 1 câu
2. Có user journey rõ ràng
3. Có acceptance criteria tối thiểu 3 điểm
4. Acceptance criteria cover edge case
5. Có Figma link hoặc mô tả UI
6. Scope fit trong 1 sprint dưới 5 ngày
7. Không có dependency chưa resolve

Trả về JSON:
{
  "items": [
    { "label": "...", "passed": true|false, "note": "..." }
  ],
  "allPassed": true|false,
  "failCount": number,
  "recommendation": "..."
}

Chỉ trả về JSON thuần.`;

const SIMPLE_REVIEW_PROMPT = `Bạn là Review Agent.
Đánh giá tài liệu với 3 tiêu chí:
1. Có mô tả rõ ràng về vấn đề
2. Có đủ thông tin để TechLead hành động
3. Không thiếu context quan trọng

Trả về JSON:
{
  "items": [
    { "label": "...", "passed": bool, "note": "" }
  ],
  "allPassed": bool,
  "failCount": number,
  "recommendation": "..."
}`;

export async function runReviewAgent(
  requestId: string,
  docType: string,
): Promise<ReviewResult> {
  const t0 = Date.now();
  console.log(`[ReviewAgent] START — requestId:${requestId} docType:${docType}`);

  // Đọc content từ Supabase thay vì file system
  console.log(`[ReviewAgent] Fetching content from Supabase...`);
  const t1 = Date.now();
  const { data: request, error } = await supabase
    .from("feature_requests")
    .select("content, request_name")
    .eq("id", requestId)
    .single();

  if (error || !request) {
    console.error(`[ReviewAgent] Supabase fetch FAILED: ${error?.message}`);
    throw new Error(`Cannot fetch request: ${error?.message}`);
  }
  console.log(`[ReviewAgent] Supabase fetch OK (${Date.now() - t1}ms) — requestName:${request.request_name} contentLength:${request.content?.length ?? 0}`);

  // Chạy checklist phù hợp với docType
  const isSImple = docType === "BUG" || docType === "RESEARCH";
  const promptType = isSImple ? "SIMPLE (3 tiêu chí)" : "FULL (7 tiêu chí)";
  const prompt = isSImple ? SIMPLE_REVIEW_PROMPT : REVIEW_PROMPT;
  console.log(`[ReviewAgent] Calling Claude — checklist: ${promptType}...`);
  const t2 = Date.now();
  const checklistResult = await callClaudeJSON<ChecklistResult>(
    prompt,
    `Tài liệu:\n\n${request.content}`,
  );
  console.log(`[ReviewAgent] Claude checklist done (${Date.now() - t2}ms) — allPassed:${checklistResult.allPassed} failCount:${checklistResult.failCount}`);
  checklistResult.items?.forEach((item, i) => {
    console.log(`[ReviewAgent]   [${i + 1}] ${item.passed ? "✅" : "❌"} ${item.label}${item.note ? ` — ${item.note}` : ""}`);
  });
  console.log(`[ReviewAgent] Recommendation: "${checklistResult.recommendation}"`);

  const allPassed =
    checklistResult.allPassed ?? checklistResult.failCount === 0;
  const tagTarget: "@Bảo" | "@Thuận Minh" = allPassed ? "@Thuận Minh" : "@Bảo";
  console.log(`[ReviewAgent] Result: allPassed=${allPassed} → tag ${tagTarget}`);

  // Insert feedback vào Supabase
  console.log(`[ReviewAgent] Inserting into feature_feedbacks...`);
  const t3 = Date.now();
  const { data: feedback, error: fbError } = await supabase
    .from("feature_feedbacks")
    .insert({
      request_id: requestId,
      all_passed: allPassed,
      checklist: checklistResult.items,
      recommendation: checklistResult.recommendation,
      tag_target: tagTarget,
    })
    .select("id")
    .single();

  if (fbError) {
    console.error(`[ReviewAgent] Supabase feedback insert FAILED: ${fbError.message}`);
    throw new Error(`Supabase feedback insert error: ${fbError.message}`);
  }
  console.log(`[ReviewAgent] Supabase insert OK (${Date.now() - t3}ms) → feedbackId:${feedback.id}`);

  const summary = allPassed
    ? `✅ Review xong — tất cả ${checklistResult.items.length} tiêu chí đạt. Tag ${tagTarget} để confirm.`
    : `❌ Review xong — ${checklistResult.failCount}/${checklistResult.items.length} tiêu chí chưa đạt. Tag ${tagTarget} để bổ sung.`;

  console.log(`[ReviewAgent] DONE in ${Date.now() - t0}ms`);
  return {
    feedbackId: feedback.id,
    requestName: request.request_name,
    allPassed,
    tagTarget,
    summary,
  };
}
