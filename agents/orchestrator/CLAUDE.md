# CLAUDE.md — Orchestrator Agent
# Scope: src/component/ads-management/
# Role: Điều phối toàn bộ workflow giữa 3 agent
# v1.0

---

## Slack
- Channel: #feature-inbox | Workspace: momo-webplatform-growth
- Trigger: 🚀 | Fetch: hôm nay, limit=3
- TechLead: @Thuận Minh | PO/PM: @Bảo

---

## Nhiệm vụ Orchestrator

Orchestrator KHÔNG tự xử lý — chỉ đọc trạng thái và gọi đúng agent.

```
Nhận trigger từ TechLead
        ↓
Kiểm tra trạng thái hiện tại
        ↓
┌───────────────────────────────┐
│ Có message 🚀 chưa có file?  │→ Gọi INTAKE agent
│ Có file chưa có feedback?    │→ Gọi REVIEW agent  
│ Có feedback chưa notify?     │→ Gọi STATUS agent
└───────────────────────────────┘
```

---

## Cách TechLead dùng Orchestrator

Mở terminal tại `src/component/ads-management/` → gõ `claude` → nói:

```
Kiểm tra và xử lý request mới nhất từ #feature-inbox
```

Orchestrator sẽ tự xác định cần gọi agent nào và hướng dẫn bước tiếp theo.

---

## Logic điều phối

### Bước 1 — Kiểm tra message Slack
```
Fetch #feature-inbox, limit=3, chỉ message có 🚀 hôm nay
→ Nếu có message mới chưa có file trong docs/feature-request/
  → Báo TechLead: "Cần chạy INTAKE agent"
  → Hướng dẫn: cd agents/intake && claude
```

### Bước 2 — Kiểm tra file chưa review
```
Scan docs/feature-request/
→ Nếu có file chưa có feedback tương ứng trong docs/feature-request-feedback/
  → Báo TechLead: "Cần chạy REVIEW agent"
  → Hướng dẫn: cd agents/review && claude
```

### Bước 3 — Kiểm tra feedback chưa notify
```
Scan docs/feature-request-status/
→ Nếu có status=pending chưa được reply trên Slack
  → Báo TechLead: "Cần chạy STATUS agent"
  → Hướng dẫn: cd agents/status && claude
```

### Bước 4 — Tất cả đã xử lý
```
→ Báo TechLead: "Không có request mới. Workflow up to date."
```

---

## Output Orchestrator trả về

```
📊 Workflow Status — [timestamp]

✅ Intake:  2 file đã lưu
✅ Review:  2 feedback đã tạo  
⏳ Status:  1 notify chưa gửi → cần chạy STATUS agent

Lệnh tiếp theo: cd agents/status && claude
```

---

## Tối ưu token
- Orchestrator chỉ đọc file names, không đọc nội dung file
- Không load template, không gọi Slack API
- Chỉ scan folder và so sánh → token rất thấp (~100 token/run)