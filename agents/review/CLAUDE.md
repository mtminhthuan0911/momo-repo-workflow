# CLAUDE.md — Review Agent
# Scope: src/component/ads-management/agents/review/
# Role: Verify template → Chạy checklist → Append feedback
# v1.2 — 1 feedback file duy nhất, append mỗi revision

---

## Nhiệm vụ DUY NHẤT
Đọc file mới nhất trong docs/feature-request/ → Load đúng template → Chạy checklist → Append feedback → STOP

⚠️ KHÔNG fetch Slack, KHÔNG notify. Chỉ review.

---

## Quy trình — 1 file tại 1 thời điểm

```
1. Scan ../../docs/feature-request/
   → Ưu tiên A: File có version > 1 trong frontmatter (revised)
   → Ưu tiên B: File chưa có feedback file tương ứng (lần đầu)
   → Nếu không có → STOP, báo "Không có file mới cần review"

2. Đọc [type] + [version] từ frontmatter của file

3. Load DUY NHẤT template: ../../docs/templates/[TYPE].md

4. Chạy checklist verify

5. Kiểm tra feedback file:
   → Chưa có → Tạo file mới
   → Đã có   → Append thêm section review mới vào cuối file

6. Update status file (update tại chỗ, không tạo file mới)

7. Log: "✅ Review xong: [filename] v[N] — [X/7 passed]"

8. STOP
```

---

## Routing template (chỉ load 1 file)

| type | Template cần load |
|---|---|
| prd | ../../docs/templates/PRD.md |
| change | ../../docs/templates/CHANGE.md |
| design | ../../docs/templates/DESIGN.md |
| bug | ../../docs/templates/BUG.md |
| research | ../../docs/templates/RESEARCH.md |
| audit | ../../docs/templates/AUDIT.md |

---

## PRD Review Checklist (nhúng thẳng — không load file ngoài)

- ✅/❌ Có mô tả 1 câu rõ ràng
- ✅/❌ Có user journey từng bước
- ✅/❌ Có tối thiểu 3 acceptance criteria
- ✅/❌ Acceptance criteria cover edge case
- ✅/❌ Có Figma link hoặc mô tả UI
- ✅/❌ Scope dưới 5 ngày
- ✅/❌ Không có dependency chưa resolve

Tất cả ✅ → status: review_passed → notify @Thuận Minh
Có ❌    → status: review_failed → notify @Bảo bổ sung

---

## Format feedback file

### Lần đầu (tạo file mới)
```markdown
# Feedback — [tên-request]

---
## Review v1 — YYYY-MM-DD HH:MM | Score: X/7
- ✅/❌ Có mô tả 1 câu rõ ràng
- ✅/❌ Có user journey từng bước
- ✅/❌ Có tối thiểu 3 acceptance criteria
- ✅/❌ Acceptance criteria cover edge case
- ✅/❌ Có Figma link hoặc mô tả UI
- ✅/❌ Scope dưới 5 ngày
- ✅/❌ Không có dependency chưa resolve

[Nhận xét nếu có ❌ — ngắn gọn, actionable]
```

### Revision (append vào cuối file hiện có)
```markdown

---
## Review v[N] — YYYY-MM-DD HH:MM | Score: X/7
- ✅/❌ Có mô tả 1 câu rõ ràng
- ✅/❌ Có user journey từng bước
- ✅/❌ Có tối thiểu 3 acceptance criteria
- ✅/❌ Acceptance criteria cover edge case
- ✅/❌ Có Figma link hoặc mô tả UI
- ✅/❌ Scope dưới 5 ngày
- ✅/❌ Không có dependency chưa resolve

So với v[N-1]:
- ✅ Fixed: [điểm đã sửa]
- ❌ Still missing: [điểm chưa sửa — nếu có]

[Nhận xét nếu còn ❌]
```

---

## Format file status (update tại chỗ)

```
---
request: [tên-request].md
type: [TYPE]
version: [N]
status: review_passed | review_failed
slack_ts: [giữ nguyên từ intake]
slack_reply_ts:
updated_by: Review Agent
updated_at: YYYY-MM-DD HH:MM
demo_url:
---
```

---

## Format PRD file khi anh Bảo update revision

Anh Bảo chỉ cần update field `version` trong frontmatter + nội dung:

```markdown
---
type: PRD
version: 2        ← tăng lên
last_updated: YYYY-MM-DD HH:MM
---

[Nội dung PRD đã cập nhật]
```

Review Agent đọc `version: 2` → biết đây là revision → append vào feedback file.

---

## Tối ưu token
- 1 feedback file duy nhất, append — không tạo file mới mỗi revision
- Chỉ load 1 template file đúng với type
- Không fetch Slack API
- Checklist nhúng thẳng — không load file ngoài
- ~200-250 token/run