# TEMPLATES.md — Master Template Guide
# Dành cho: Claude Bot (TechLead workflow) + anh Bảo (Cowork)
# Version: 1.0 | Tháng 4/2026

---

## Mục đích file này

File này có **2 vai trò**:

1. **Claude Bot (Claude Code)** — đọc để biết khi nhận message `🚀 [TYPE]` từ `#feature-inbox` thì dùng template nào để verify PRD
2. **Cowork của anh Bảo** — đọc để biết khi anh Bảo nói "viết PRD" hay "báo bug" thì scaffold đúng cấu trúc

---

## Routing Table — Claude Bot đọc tag và đi vào template tương ứng

| Tag nhận được | Template cần verify | File chi tiết | Hành động sau review |
|---|---|---|---|
| `🚀 [PRD]` | PRD Template | `docs/templates/PRD.md` | Notify @Thuận Minh confirm |
| `🚀 [CHANGE]` | CHANGE Template | `docs/templates/CHANGE.md` | Notify @Thuận Minh confirm |
| `🚀 [DESIGN]` | DESIGN Template | `docs/templates/DESIGN.md` | Notify @Thuận Minh confirm |
| `🚀 [BUG]` | BUG Template | `docs/templates/BUG.md` | Tóm tắt + notify @Thuận Minh |
| `🚀 [RESEARCH]` | RESEARCH Template | `docs/templates/RESEARCH.md` | Tóm tắt + notify @Thuận Minh |
| `🚀 [AUDIT]` | AUDIT Template | `docs/templates/AUDIT.md` | Crawl + check + post report |

---

## Cách Claude Bot sử dụng file này

```
Bước 1: Nhận message từ #feature-inbox có emoji 🚀
Bước 2: Extract tag [TYPE] từ message
Bước 3: Đọc Routing Table ở trên → xác định template tương ứng
Bước 4: Mở file chi tiết trong docs/templates/[TYPE].md
Bước 5: Chạy checklist verify theo đúng template đó
Bước 6: Lưu kết quả vào docs/feature-request-feedback/
Bước 7: Notify đúng người theo cột "Hành động sau review"
```

---

## Cách Cowork của anh Bảo sử dụng file này

Khi anh Bảo nói:
- _"Viết PRD cho tính năng X"_ → Cowork đọc PRD.md → scaffold đúng sections
- _"Báo bug crash filter ads"_ → Cowork đọc BUG.md → scaffold đúng sections
- _"Viết change request cho UI bảng ads"_ → Cowork đọc CHANGE.md → scaffold

Sau khi anh Bảo điền nội dung → Cowork post lên `#feature-inbox` đúng format:
```
🚀 [TYPE] Tên ngắn gọn @Thuận Minh
<đính kèm file .md>
```

---

## Cấu trúc folder templates

```
src/component/ads-management/
├── CLAUDE.md
├── TEMPLATES.md          ← file này (routing guide)
└── docs/
    └── templates/
        ├── PRD.md
        ├── CHANGE.md
        ├── DESIGN.md
        ├── BUG.md
        ├── RESEARCH.md
        └── AUDIT.md
```

---

## Độ ưu tiên xử lý

| Độ ưu tiên | Loại | Lý do |
|---|---|---|
| 🔴 Cao nhất | `[BUG]` | Ảnh hưởng user ngay lập tức |
| 🟠 Cao | `[CHANGE]` | Thay đổi behavior đang có |
| 🟡 Trung bình | `[PRD]` | Feature mới, cần plan |
| 🟡 Trung bình | `[DESIGN]` | UI/UX, cần Figma |
| 🟢 Thấp | `[RESEARCH]` | Không block implement |
| 🟢 Thấp | `[AUDIT]` | Định kỳ, không urgent |