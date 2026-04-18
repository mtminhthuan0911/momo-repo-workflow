# CLAUDE.md — Intake Agent
# Scope: src/component/ads-management/agents/intake/
# Role: Fetch message Slack → Classify → Lưu file
# v1.0

---

## Nhiệm vụ DUY NHẤT
Fetch message → Extract nội dung → Classify [TYPE] → Lưu file → STOP

⚠️ KHÔNG review, KHÔNG write feedback, KHÔNG notify. Chỉ intake.

---

## Quy trình — 1 message tại 1 thời điểm

```
1. Fetch #feature-inbox hôm nay, limit=3
2. Lấy message MỚI NHẤT có 🚀 chưa có file trong docs/feature-request/
3. Extract [TYPE] từ message
4. Extract nội dung PRD từ message text
5. Tạo tên file: YYYY-MM-DD_HHMMSS_[ten-request].md
6. Lưu vào: ../../docs/feature-request/[filename]
7. Lưu metadata vào: ../../docs/feature-request-status/[filename]_status.md (status: intake_done)
8. Log ra terminal: "✅ Intake xong: [filename]"
9. STOP
```

---

## Classify [TYPE]

Đọc tag trong message:
- `[PRD]`      → type: prd
- `[CHANGE]`   → type: change
- `[DESIGN]`   → type: design
- `[BUG]`      → type: bug
- `[RESEARCH]` → type: research
- `[AUDIT]`    → type: audit

Nếu không có tag rõ ràng → type: unknown → log warning → STOP, không lưu file.

---

## Format file lưu vào docs/feature-request/

```markdown
---
type: [TYPE]
source: slack
channel: feature-inbox
received_at: YYYY-MM-DD HH:MM
slack_ts: [timestamp của message gốc — dùng để reply thread sau]
author: Bảo
---

[Nội dung message nguyên văn từ Slack]
```

⚠️ Lưu `slack_ts` — Review agent và Status agent cần để reply đúng thread.

---

## Format file status sau intake

```
---
request: [filename].md
type: [TYPE]
status: intake_done
slack_ts: [timestamp]
updated_by: Intake Agent
updated_at: YYYY-MM-DD HH:MM
demo_url:
---
```

---

## Tối ưu token
- Không load bất kỳ template file nào
- Không gọi Anthropic API — chỉ đọc Slack + write file
- Chỉ xử lý 1 message → ~100-150 token/run