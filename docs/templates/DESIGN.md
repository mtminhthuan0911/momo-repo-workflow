# Template: [DESIGN] — Design Brief / UI Scaffold Request
# Dùng cho: Brief UI/UX mới, yêu cầu scaffold component từ Figma hoặc mô tả

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có mô tả component / page cần build (section: Mô tả)
- [ ] Có Figma link HOẶC mô tả layout đủ chi tiết để scaffold
- [ ] Có liệt kê các states cần handle (section: States)
- [ ] Có spec responsive (desktop / mobile) nếu cần
- [ ] Có liệt kê interaction / behavior cần implement
- [ ] Rõ ràng dùng component có sẵn nào trong design system

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → tag @Thuận Minh để review + scaffold

---

## Template anh Bảo điền

```markdown
---
type: DESIGN
title: [Tên component / page]
author: Bảo
date: YYYY-MM-DD
figma: [link hoặc "N/A - xem mô tả bên dưới"]
---

## Mô tả
<!-- Component / page này làm gì, dùng ở đâu trong flow? -->
<!-- ✅ Ví dụ: "Card tổng quan campaign cho trang Ads Dashboard. Hiển thị KPIs chính của 1 campaign: tên, status, budget, impressions, clicks." -->
<!-- ❌ Anti-pattern: "Card đẹp để hiển thị thông tin ads." -->


## Figma / Visual Reference
<!-- Link Figma hoặc mô tả layout chi tiết. Phải có 1 trong 2. -->
<!-- ✅ Figma: https://figma.com/file/xxx/ads-campaign-card -->
<!-- ✅ Hoặc mô tả nếu chưa có Figma:
Layout:
- Container: rounded card, shadow nhẹ, padding 16px
- Row 1: Campaign name (bold, 16px) + Status badge (right-aligned)
- Row 2: 3 metric columns: Impressions | Clicks | CTR
- Row 3: Progress bar Budget used / Total budget
- Footer: "Last updated: X minutes ago" (gray text, 12px)
-->


## States cần handle
<!-- Liệt kê tất cả trạng thái UI cần thiết -->
<!-- ✅ Ví dụ:
- Loading: skeleton placeholder
- Empty: "No campaigns yet" + CTA button
- Error: error message + retry button
- Active campaign: badge xanh
- Paused campaign: badge xám
- Rejected campaign: badge đỏ + tooltip lý do
-->
<!-- ❌ Anti-pattern: Chỉ mô tả happy path, bỏ qua loading/error/empty -->


## Interactions / Behavior
<!-- User làm gì được với component này? -->
<!-- ✅ Ví dụ:
- Click vào card → navigate tới /ads-management/campaign/{id}
- Click badge Status → open dropdown: Active / Paused
- Hover metric → tooltip hiện full number (nếu bị truncate)
- Card có hover state: shadow tăng nhẹ
-->
<!-- ❌ Anti-pattern: "Click vào thì mở trang chi tiết." -->


## Responsive
<!-- Behavior trên các breakpoint khác nhau -->
<!-- ✅ Ví dụ:
- Desktop (>1024px): Grid 3 columns
- Tablet (768-1024px): Grid 2 columns
- Mobile (<768px): 1 column, metrics stack vertically
-->
<!-- ❌ Anti-pattern: Để trống nếu cần hỗ trợ mobile -->


## Design System / Component có sẵn
<!-- Liệt kê component nào dùng lại từ design system, component nào phải build mới -->
<!-- ✅ Ví dụ:
Dùng lại:
- Badge component (đã có trong /components/ui/Badge)
- ProgressBar (đã có trong /components/ui/ProgressBar)

Build mới:
- CampaignCard (chưa có)
- MetricColumn (chưa có, nhỏ, extract từ card)
-->
```
