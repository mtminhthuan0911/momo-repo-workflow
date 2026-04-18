# MoMo Agentic Workflow — Architecture Note
**Cập nhật:** 13/04/2026 · v1.0

---

## Tổng quan

Workflow gồm **2 repo độc lập** + **Supabase** làm cầu nối.

```
momo-repo-workflow          Supabase DB           molanding
(Tool xử lý workflow)   (Single source of truth)  (Product repo)
        │                        │                     │
        │   write ────────────→  │  ←──────── read     │
        │                        │  ←──────── write    │
```

---

## Repo 1 — momo-repo-workflow

**Vai trò:** Tool xử lý workflow giữa anh Bảo và TechLead. Không chứa product code.

### Cấu trúc
```
momo-repo-workflow/
├── pages/api/
│   ├── slack-webhook.ts        ← Webhook endpoint chính (Vercel)
│   └── agents/
│       ├── intake.ts           ← Agent 1: Classify + lưu Supabase
│       ├── review.ts           ← Agent 2: PRD checklist
│       └── status.ts           ← Agent 3: Update status + notify Slack
├── lib/
│   ├── slack.ts                ← Slack API helper + verify signature
│   └── anthropic.ts            ← Anthropic API helper
├── agents/                     ← CLAUDE.md cho từng agent (Claude Code)
│   ├── orchestrator/CLAUDE.md
│   ├── intake/CLAUDE.md
│   ├── review/CLAUDE.md
│   └── status/CLAUDE.md
├── docs/templates/             ← Template PRD, BUG, CHANGE...
│   ├── PRD.md
│   ├── BUG.md
│   ├── CHANGE.md
│   ├── DESIGN.md
│   ├── RESEARCH.md
│   └── AUDIT.md
├── CLAUDE.md                   ← Convention workflow tổng
└── TEMPLATES.md                ← Routing guide
```

### Nhiệm vụ
- Nhận Slack event từ #feature-inbox
- Chạy pipeline: Intake → Review → Status
- Ghi kết quả vào Supabase
- Notify Slack đúng người

---

## Repo 2 — molanding (giữ nguyên)

**Vai trò:** Product repo — React components, pages, business logic.

### Thay đổi duy nhất
- Xóa `pages/api/agents/` và `lib/` liên quan đến workflow
- Giữ nguyên `src/component/ads-management/` và các component khác
- Claude Code trong repo này **chỉ đọc từ Supabase**, không xử lý workflow

### Cách TechLead làm việc
```bash
# Mở Claude Code trong ads-management
cd src/component/ads-management
claude
```

Hỏi Claude Code:
```
Có PRD nào pending không?
→ Claude query Supabase → trả về danh sách

Kéo PRD ads-dashboard về docs/feature-request/
→ Claude lấy content từ Supabase → ghi file local

Task ads-dashboard xong rồi, demo: https://...
→ Claude update Supabase status: done
→ Claude post Slack tag anh Bảo
```

---

## Supabase — Single Source of Truth

### Schema 3 tables

```sql
-- Table 1: Lưu PRD/BUG/CHANGE từ anh Bảo
feature_requests (
  id          uuid PRIMARY KEY,
  project     text,              -- 'ads-management', 'payment', ...
  slack_ts    text,              -- timestamp message Slack
  channel     text,
  doc_type    text,              -- PRD | BUG | CHANGE | DESIGN | RESEARCH | AUDIT
  request_name text,
  content     text,              -- Toàn bộ nội dung tài liệu
  summary     text,              -- Tóm tắt 1 câu
  status      text DEFAULT 'pending',  -- pending | in_progress | done | rejected
  demo_url    text,
  created_at  timestamptz DEFAULT now()
)

-- Table 2: Lưu kết quả review
feature_feedbacks (
  id            uuid PRIMARY KEY,
  request_id    uuid REFERENCES feature_requests(id),
  all_passed    boolean,
  checklist     jsonb,           -- Kết quả 7 tiêu chí
  recommendation text,
  tag_target    text,            -- '@Bảo' hoặc '@Thuận Minh'
  created_at    timestamptz DEFAULT now()
)

-- Table 3: Lưu lịch sử status (insert, không update)
feature_statuses (
  id          uuid PRIMARY KEY,
  request_id  uuid REFERENCES feature_requests(id),
  status      text,
  updated_by  text,             -- 'Claude Bot' | 'TechLead' | 'Bảo'
  demo_url    text,
  created_at  timestamptz DEFAULT now()
)
```

### Tại sao insert thay vì update cho status
Giữ được toàn bộ lịch sử: pending → in_progress → done. Dễ audit, dễ debug.

---

## Flow hoàn chỉnh

### Anh Bảo gửi PRD
```
1. Anh Bảo post #feature-inbox:
   🚀 [PRD] Ads dashboard @Thuận Minh + file .md

2. Slack gửi event → Vercel Function (momo-repo-workflow)

3. Webhook pipeline chạy tự động:
   Intake  → insert feature_requests (status: pending)
   Review  → insert feature_feedbacks
   Status  → insert feature_statuses
           → reply Slack thread + tag đúng người
```

### TechLead implement
```
4. TechLead nhận Slack notification

5. Mở Claude Code trong molanding/src/component/ads-management/

6. Hỏi: "Có PRD nào pending không?"
   → Claude query Supabase → thấy ads-dashboard

7. "Kéo PRD ads-dashboard về docs/feature-request/"
   → Claude lấy content từ Supabase
   → Ghi file: docs/feature-request/2026-04-13_ads-dashboard.md

8. TechLead đọc file, implement tính năng

9. Xong: "Task ads-dashboard done, demo: https://..."
   → Claude update Supabase: status = done, demo_url = ...
   → Claude post Slack: tag anh Bảo + demo URL
```

### Anh Bảo nhận kết quả
```
10. Anh Bảo nhận Slack notification
    ✅ ads-dashboard xong. Demo: https://...
```

---

## Notify khi TechLead done — 2 hướng

### Hướng 1 — Claude Code post Slack trực tiếp (Phase hiện tại)
Claude Code trong molanding có MCP Slack sẵn. Update Supabase xong thì post Slack luôn. Đơn giản, không cần setup thêm.

### Hướng 2 — Supabase Realtime (Phase sau)
`momo-repo-workflow` subscribe Supabase Realtime. Khi `status` đổi thành `done`, webhook tự post Slack. TechLead chỉ cần update Supabase, không cần nghĩ đến Slack.

---

## Environment Variables

### momo-repo-workflow (.env.local)
```
ANTHROPIC_API_KEY=sk-ant-...
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_CHANNEL_ID=C...
SLACK_USER_TECHLEAAD=U...
SLACK_USER_BAO=U...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### molanding (.env.local) — thêm vào existing
```
SUPABASE_URL=https://xxx.supabase.co     ← dùng chung instance
SUPABASE_SERVICE_ROLE_KEY=eyJ...         ← hoặc anon key nếu có RLS
```

---

## Roadmap

| Phase | Nội dung | Thời gian |
|-------|---------|-----------|
| Phase 1 ✅ | Setup infrastructure + agents + test end-to-end | Done |
| Phase 1.5 🔄 | Invite anh Bảo + test flow thật | Khi connect được |
| Phase 2 ⏳ | Tách momo-repo-workflow + setup Supabase + Webhook Vercel | Tháng 5/2026 |
| Phase 3 ⏳ | Supabase Realtime tự động notify | Tháng 6/2026 |
| Phase 4 ⏳ | Mở rộng multi-project (không chỉ ads-management) | Tháng 7+ |

---

## Điểm cần làm ngay cho Phase 2

1. Tạo repo `momo-repo-workflow` trên GitHub
2. Move agents/, docs/templates/, CLAUDE.md, TEMPLATES.md vào repo mới
3. Tạo Supabase project mới (hoặc dùng chung instance molanding)
4. Chạy migration SQL tạo 3 tables
5. Update intake.ts / review.ts / status.ts dùng Supabase thay vì fs
6. Deploy lên Vercel → lấy URL
7. Cắm URL vào Slack Event Subscriptions
8. Test end-to-end với PRD **thật**