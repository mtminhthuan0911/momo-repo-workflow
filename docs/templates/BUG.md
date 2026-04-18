# Template: [BUG] — Bug Report
# Dùng cho: Báo cáo lỗi cần fix, behavior không đúng với expected

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có mô tả bug rõ ràng 1 câu (section: Mô tả)
- [ ] Có steps to reproduce đủ để TechLead reproduce được
- [ ] Có Expected behavior vs Actual behavior
- [ ] Có severity (Critical / High / Medium / Low)
- [ ] Có environment (browser, device, account type)
- [ ] Có screenshot hoặc video nếu là UI bug

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → tóm tắt + tag @Thuận Minh ngay (BUG ưu tiên cao nhất)

---

## Template anh Bảo điền

```markdown
---
type: BUG
title: [Tên bug ngắn gọn - động từ + component + triệu chứng]
author: Bảo
date: YYYY-MM-DD
severity: Critical | High | Medium | Low
---

## Mô tả
<!-- 1 câu: Cái gì bị lỗi, ở đâu, triệu chứng gì. -->
<!-- ✅ Ví dụ: "Filter ads theo date range bị crash app khi chọn custom range quá 90 ngày." -->
<!-- ❌ Anti-pattern: "Filter ads bị lỗi." -->


## Severity
<!-- Chọn 1 và giải thích tại sao -->
<!-- 
🔴 Critical: App crash, data mất, user không dùng được tính năng core
🟠 High: Tính năng quan trọng không hoạt động, có workaround nhưng tệ
🟡 Medium: Tính năng phụ bị lỗi, có workaround dễ
🟢 Low: Cosmetic, typo, minor UI glitch
-->
<!-- ✅ Ví dụ: "High — Filter không dùng được nhưng user vẫn xem được list ads mặc định." -->


## Steps to Reproduce
<!-- Từng bước cụ thể. Ai cũng làm theo được và reproduce được bug. -->
<!-- ✅ Ví dụ:
1. Login vào tài khoản advertiser (dùng account test: test@momo.vn)
2. Vào trang /ads-management
3. Click vào Filter → chọn "Custom range"
4. Chọn start date: 01/01/2026, end date: 01/04/2026 (91 ngày)
5. Click Apply
→ App crash, trang trắng, console error: "Maximum date range exceeded"
-->
<!-- ❌ Anti-pattern: "Vào ads management, filter theo date, bị crash." -->


## Expected Behavior
<!-- Hành vi đúng là gì? -->
<!-- ✅ Ví dụ: "App hiển thị error message: 'Maximum date range is 90 days. Please select a shorter range.' Không crash." -->


## Actual Behavior
<!-- Hành vi thực tế sai như thế nào? -->
<!-- ✅ Ví dụ: "App crash toàn trang, phải reload. Console log: TypeError: Cannot read properties of undefined (reading 'length') at filterByDateRange.js:47" -->


## Environment
<!-- ✅ Ví dụ:
- Browser: Chrome 123, Safari 17
- Device: MacBook Pro M2, iPhone 14
- OS: macOS 14.3, iOS 17
- Account type: Advertiser (verified)
- URL: https://momo.vn/ads-management
- Có reproduce trên production: ✅ Yes / ❌ No (chỉ staging)
-->


## Attachments
<!-- Screenshot, video, console log -->
<!-- ✅ Đính kèm file hoặc paste console error -->
<!-- ❌ Anti-pattern: "Xem ảnh tôi đã chụp" mà không đính kèm -->


## Workaround tạm thời
<!-- Nếu có cách bypass thì ghi, nếu không có thì ghi "None" -->
<!-- ✅ Ví dụ: "Chọn date range tối đa 89 ngày là không bị crash." -->
```

---

## Severity Guide cho anh Bảo

| Severity | Ví dụ | SLA fix |
|---|---|---|
| 🔴 Critical | App crash, không login được, mất data | Trong ngày |
| 🟠 High | Tính năng core không dùng được | 1-2 ngày |
| 🟡 Medium | Tính năng phụ lỗi, có workaround | Trong sprint |
| 🟢 Low | UI glitch, typo | Backlog |
