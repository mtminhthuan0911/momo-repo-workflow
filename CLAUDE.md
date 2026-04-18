# CLAUDE.md — momo-repo-workflow

## Tổng quan
Repo này là **webhook automation tool** — nhận Slack events, chạy AI pipeline (Claude), ghi Supabase.

**KHÔNG** phải product repo. Không có UI. Không contain business logic của MoMo product.

## Cấu trúc repo
```
pages/api/
├── slack-webhook.ts   ← Entry point, verify Slack signature
└── agents/
    ├── intake.ts      ← Agent 1: Classify + insert feature_requests
    ├── review.ts      ← Agent 2: 7-criteria review + insert feature_feedbacks
    └── status.ts      ← Agent 3: Insert feature_statuses + Slack notify

lib/
├── supabase.ts        ← Supabase client (service role)
├── slack.ts           ← Slack helper: verify signature, post message
└── anthropic.ts       ← Claude helper: callClaude(), parseClaudeJson()

agents/
├── orchestrator/CLAUDE.md
├── intake/CLAUDE.md
├── review/CLAUDE.md
└── status/CLAUDE.md

docs/templates/
├── PRD.md | BUG.md | CHANGE.md | DESIGN.md | RESEARCH.md | AUDIT.md
```

## Flow chính
```
1. Anh Bảo gửi message [PRD/BUG/CHANGE/...] vào #feature-inbox
2. Slack gửi event → POST /api/slack-webhook
3. Verify Slack signature
4. Detect doc type keyword → trigger pipeline
5. Intake  → classify, insert feature_requests (status: pending)
6. Review  → 7 tiêu chí, insert feature_feedbacks
7. Status  → insert feature_statuses, post Slack reply + tag đúng người
```

## Supabase tables
| Table | Mô tả |
|-------|-------|
| `feature_requests` | PRD/BUG/CHANGE từ anh Bảo |
| `feature_feedbacks` | Kết quả review 7 tiêu chí |
| `feature_statuses` | Lịch sử status (append-only) |

## Quy tắc quan trọng
1. **Verify signature trước** — mọi request phải qua `verifySlackSignature()`
2. **Trả 200 ngay** — trước khi chạy AI pipeline (Slack chờ max 3s)
3. **Status = INSERT** — không bao giờ UPDATE feature_statuses
4. **Service role key** — dùng phía server only, không expose cho client

## Cách chạy local
```bash
npm run dev
# Dùng ngrok để test webhook
ngrok http 3000
# Copy URL → Slack Event Subscriptions → Request URL
```

## Deploy
```bash
# Đã config trên Vercel
# Push main → auto deploy
# Env vars cần set trên Vercel Dashboard
```
