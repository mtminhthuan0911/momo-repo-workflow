# CLAUDE.md — Status Agent
# Scope: src/component/ads-management/agents/status/
# Role: Đọc status → Reply thread Slack → Tag đúng người
# v1.0

---

## Nhiệm vụ DUY NHẤT
Đọc status file mới nhất → Reply vào thread Slack gốc → Tag đúng người → STOP

⚠️ KHÔNG review, KHÔNG đọc template, KHÔNG write feedback. Chỉ notify.

---

## Quy trình — 1 status tại 1 thời điểm

```
1. Scan ../../docs/feature-request-status/
   → Lấy file MỚI NHẤT có status: review_passed hoặc review_failed
   → Chưa được notify (chưa có slack_reply_ts trong file)
2. Đọc slack_ts từ status file → dùng để reply đúng thread
3. Đọc feedback tương ứng từ docs/feature-request-feedback/
4. Compose message ngắn gọn theo format bên dưới
5. Reply vào thread #feature-inbox dùng slack_ts
6. Cập nhật status file → thêm slack_reply_ts + status: notified
7. Log ra terminal: "✅ Notified: [filename]"
8. STOP
```

---

## Logic tag người theo status

| Status | Tag | Message |
|---|---|---|
| review_passed | @Thuận Minh | Cần TechLead confirm implement |
| review_failed | @Bảo | Cần PO bổ sung thông tin |
| in_progress | @Bảo | TechLead đang implement |
| done | @Bảo + demo_url | Done, kèm link demo |
| rejected | @Bảo + lý do | Rejected, kèm lý do |

---

## Format reply lên Slack thread

### Khi review_passed
```
📋 Review xong — [tên request]

✅ ✅ ✅ ✅ ✅ ✅ ✅  (7/7)
PRD đạt yêu cầu, sẵn sàng implement.

@Thuận Minh review và confirm nhé!
```

### Khi review_failed
```
📋 Review xong — [tên request]

✅ ✅ ❌ ✅ ❌ ✅ ✅  (5/7)
Cần bổ sung:
• [điểm ❌ thứ 1]
• [điểm ❌ thứ 2]

@Bảo bổ sung thêm nhé!
```

### Khi done
```
✅ Done — [tên request]
Demo: [demo_url]

@Bảo kiểm tra nhé!
```

### Khi rejected
```
❌ Rejected — [tên request]
Lý do: [lý do]

@Bảo xem lại nhé!
```

---

## Format update status file sau notify

```
---
request: [filename].md
type: [TYPE]
status: notified
slack_ts: [giữ nguyên]
slack_reply_ts: [timestamp của reply vừa gửi]
updated_by: Status Agent
updated_at: YYYY-MM-DD HH:MM
demo_url:
---
```

---

## Tối ưu token
- Không load template
- Không gọi Anthropic API để compose message — dùng format cố định
- Chỉ đọc status file + feedback file + post Slack
- ~100 token/run — agent nhẹ nhất trong 3 agent