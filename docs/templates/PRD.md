# Template: [PRD] — Product Requirements Document
# Dùng cho: Tính năng mới chưa từng có trong hệ thống

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có mô tả 1 câu rõ ràng (section: Mô tả)
- [ ] Có user journey từng bước (section: User Journey)
- [ ] Có tối thiểu 3 acceptance criteria (section: Acceptance Criteria)
- [ ] Acceptance criteria cover ít nhất 1 edge case
- [ ] Có Figma link HOẶC mô tả UI chi tiết (section: UI/UX)
- [ ] Scope ước tính dưới 5 ngày (section: Scope & Effort)
- [ ] Không có dependency chưa resolve (section: Dependencies)

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → tag @Thuận Minh để review

---

## Template anh Bảo điền

```markdown
---
type: PRD
title: [Tên tính năng ngắn gọn]
author: Bảo
date: YYYY-MM-DD
version: 1.0
---

## Mô tả
<!-- 1 câu duy nhất. Ai làm gì để đạt kết quả gì. -->
<!-- ✅ Ví dụ: "Cho phép advertiser xem tổng quan hiệu suất ads theo ngày/tuần/tháng trên dashboard." -->
<!-- ❌ Anti-pattern: "Tính năng dashboard ads rất quan trọng và cần thiết cho business." -->


## Problem Statement
<!-- Vấn đề hiện tại là gì? Tại sao cần làm? -->
<!-- ✅ Ví dụ: "Hiện tại advertiser phải export CSV rồi tự tính toán, mất 30 phút mỗi ngày." -->
<!-- ❌ Anti-pattern: "Dashboard hiện tại không đủ tốt." -->


## User Journey
<!-- Từng bước user làm gì. Dùng numbered list. -->
<!-- ✅ Ví dụ:
1. User vào trang Ads Management
2. User chọn date range (today / 7 days / 30 days / custom)
3. Dashboard load chart hiển thị: impressions, clicks, CTR, spend
4. User hover vào chart → tooltip hiện số liệu chi tiết
5. User click "Export" → download CSV
-->
<!-- ❌ Anti-pattern: "User xem dashboard và thấy thông tin ads." -->


## Acceptance Criteria
<!-- Tối thiểu 3 điểm. Dùng format: GIVEN / WHEN / THEN hoặc bullet rõ ràng. -->
<!-- ✅ Ví dụ:
- [ ] GIVEN user chọn date range "Last 7 days" WHEN dashboard load THEN hiển thị đúng data 7 ngày gần nhất
- [ ] GIVEN không có data trong date range WHEN dashboard load THEN hiển thị empty state "No data available"
- [ ] GIVEN user trên mobile WHEN xem dashboard THEN chart responsive, không bị overflow
- [ ] GIVEN data đang load WHEN user thấy chart THEN có skeleton loading, không blank screen
-->
<!-- ❌ Anti-pattern: "Dashboard hiển thị đúng data và không có lỗi." -->


## UI/UX
<!-- Figma link HOẶC mô tả chi tiết layout. Phải có 1 trong 2. -->
<!-- ✅ Ví dụ:
Figma: https://figma.com/file/xxx/ads-dashboard
Hoặc mô tả:
- Header: Date range picker (dropdown) + Export button
- Main: Line chart (impressions vs clicks) + 4 metric cards bên dưới
- Metric cards: Impressions | Clicks | CTR | Total Spend
- Color: dùng design system MoMo, primary #D82D8B
-->
<!-- ❌ Anti-pattern: "UI thiết kế đẹp theo style MoMo." -->


## Scope & Effort
<!-- Ước tính số ngày. Liệt kê những gì IN scope và OUT scope. -->
<!-- ✅ Ví dụ:
Ước tính: 3-4 ngày
IN scope:
- Chart tổng quan (line chart)
- 4 metric cards
- Date range picker
- Export CSV

OUT scope (phase sau):
- So sánh 2 period
- Breakdown theo campaign
-->
<!-- ❌ Anti-pattern: "Khoảng 1 tuần, tùy." -->


## Dependencies
<!-- Liệt kê những gì cần từ team khác hoặc service khác. Nếu không có thì ghi "None". -->
<!-- ✅ Ví dụ:
- API: /api/ads/metrics endpoint (Backend team - đã có, cần confirm schema)
- Design: Figma component DateRangePicker (Design team - đang làm, ETA 12/04)
- Data: Ads data warehouse đã có data từ 01/01/2026
-->
<!-- ❌ Anti-pattern: "Cần backend làm API." -->


## Open Questions
<!-- Những điểm chưa rõ, cần confirm trước khi implement. Nếu không có thì ghi "None". -->
<!-- ✅ Ví dụ:
- Timezone: data hiển thị theo UTC hay GMT+7?
- Data refresh: realtime hay mỗi 1 giờ?
- Permission: advertiser nào cũng thấy hay chỉ verified accounts?
-->
```

---

## Ví dụ PRD hoàn chỉnh (anh Bảo tham khảo)

```markdown
---
type: PRD
title: Ads Dashboard tổng quan
author: Bảo
date: 2026-04-13
version: 1.0
---

## Mô tả
Cho phép advertiser xem tổng quan hiệu suất ads (impressions, clicks, CTR, spend) theo date range tùy chọn trên trang Ads Management.

## Problem Statement
Hiện tại advertiser không có cách nào xem nhanh hiệu suất ads mà không cần export CSV. Việc này tốn thời gian và khiến advertiser ít optimize campaign hơn.

## User Journey
1. User vào /ads-management
2. User thấy dashboard với date range mặc định "Last 7 days"
3. User có thể đổi date range: Today / Last 7 days / Last 30 days / Custom
4. Dashboard hiển thị line chart + 4 metric cards
5. User hover chart → tooltip hiện số liệu
6. User click Export → download file CSV

## Acceptance Criteria
- [ ] GIVEN user chọn "Last 7 days" WHEN page load THEN chart hiển thị đúng 7 ngày
- [ ] GIVEN không có data WHEN page load THEN empty state với message rõ ràng
- [ ] GIVEN user trên mobile WHEN xem dashboard THEN layout responsive
- [ ] GIVEN data đang fetch WHEN user thấy page THEN skeleton loading hiển thị

## UI/UX
Figma: https://figma.com/file/abc123/ads-dashboard-v1

## Scope & Effort
Ước tính: 4 ngày
IN: Chart, metric cards, date picker, export CSV
OUT: Comparison mode, breakdown by campaign

## Dependencies
- API /api/ads/metrics: Backend đã có, cần confirm response schema
- Design tokens: Có sẵn trong design system

## Open Questions
- Data refresh rate: realtime hay cache 1 giờ?
- Timezone display: UTC hay GMT+7?
```
