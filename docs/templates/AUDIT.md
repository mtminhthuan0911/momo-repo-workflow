# Template: [AUDIT] — Website / Feature Audit
# Dùng cho: Audit định kỳ hoặc theo yêu cầu — performance, UX, accessibility, SEO, code quality

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có URL / scope cần audit (section: Scope)
- [ ] Có loại audit rõ ràng (section: Audit Type)
- [ ] Có criteria / benchmark để so sánh (section: Criteria)
- [ ] Có deadline cần report

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → Claude Bot tự crawl + check + post report lên #feature-inbox

---

## Template anh Bảo điền

```markdown
---
type: AUDIT
title: [Tên audit ngắn gọn]
author: Bảo
date: YYYY-MM-DD
deadline: YYYY-MM-DD
audit_type: Performance | UX | Accessibility | SEO | Code Quality | Security
---

## Scope
<!-- URL hoặc feature cần audit -->
<!-- ✅ Ví dụ:
- URL: https://momo.vn/ads-management
- Pages: Ads list page, Campaign detail page, Create ads form
- Exclude: Admin panel (separate audit)
-->


## Audit Type & Checklist

### Performance (nếu chọn loại này)
<!-- Claude Bot sẽ check: -->
- [ ] Core Web Vitals: LCP, FID/INP, CLS
- [ ] Page load time (target < 3s trên 4G)
- [ ] Bundle size (target < 200KB initial JS)
- [ ] Image optimization
- [ ] API response time

### UX (nếu chọn loại này)
- [ ] User flow không bị gián đoạn
- [ ] Error states có message rõ ràng
- [ ] Empty states có guidance
- [ ] Loading states có skeleton/spinner
- [ ] Mobile responsive
- [ ] Form validation đúng

### Accessibility (nếu chọn loại này)
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratio
- [ ] Alt text cho images

### SEO (nếu chọn loại này)
- [ ] Meta tags đúng
- [ ] OG tags cho sharing
- [ ] Structured data
- [ ] Sitemap
- [ ] Page speed (liên quan performance)

### Code Quality (nếu chọn loại này)
- [ ] TypeScript errors
- [ ] Unused dependencies
- [ ] Console errors/warnings
- [ ] Dead code
- [ ] Component complexity


## Criteria / Benchmark
<!-- Định nghĩa "pass" và "fail" cụ thể -->
<!-- ✅ Ví dụ:
- LCP < 2.5s = Pass | 2.5-4s = Warning | >4s = Fail
- No console errors = Pass | Warnings only = OK | Errors = Fail
- All form errors have messages = Pass | Any silent fail = Fail
-->


## Output Format mong muốn
<!-- Report cần có gì -->
<!-- ✅ Ví dụ:
- Summary: Pass/Fail overview với score
- Issues list: severity + description + recommendation
- Screenshots: đính kèm nếu là UI issues
- Priority: danh sách việc cần fix theo thứ tự ưu tiên
-->


## Context
<!-- Tại sao cần audit lúc này? -->
<!-- ✅ Ví dụ: "Chuẩn bị launch Ads Dashboard v1 tuần tới, cần verify không có critical issue trước khi release." -->
```

---

## Lưu ý cho Claude Bot khi nhận AUDIT request

1. **Đọc scope** → xác định URL và loại audit
2. **Crawl trang** nếu là performance/UX/SEO audit
3. **Chạy checks** theo checklist trong template
4. **Tạo report** theo output format yêu cầu
5. **Lưu report** vào `docs/feature-request-feedback/`
6. **Post summary** lên `#feature-inbox` + tag @Thuận Minh và @Bảo
