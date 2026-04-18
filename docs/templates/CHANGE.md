# Template: [CHANGE] — Change Request
# Dùng cho: Thay đổi tính năng hoặc behavior đã có trong hệ thống

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có mô tả rõ thay đổi gì (section: Mô tả thay đổi)
- [ ] Có mô tả trạng thái Before / After (section: Before & After)
- [ ] Có lý do thay đổi rõ ràng (section: Lý do)
- [ ] Có impact analysis — ảnh hưởng tới đâu (section: Impact)
- [ ] Có tối thiểu 2 acceptance criteria (section: Acceptance Criteria)
- [ ] Scope ước tính dưới 3 ngày (thay đổi thường nhỏ hơn PRD)
- [ ] Không có regression risk chưa được address

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → tag @Thuận Minh để review

---

## Template anh Bảo điền

```markdown
---
type: CHANGE
title: [Tên thay đổi ngắn gọn]
author: Bảo
date: YYYY-MM-DD
affects: [Tên component / page / feature bị ảnh hưởng]
---

## Mô tả thay đổi
<!-- 1-2 câu: Thay đổi cái gì, ở đâu. -->
<!-- ✅ Ví dụ: "Cập nhật UI bảng danh sách ads: thêm cột 'Status' và đổi màu badge." -->
<!-- ❌ Anti-pattern: "Update UI cho đẹp hơn." -->


## Lý do thay đổi
<!-- Tại sao cần thay đổi? Data/feedback nào drive decision này? -->
<!-- ✅ Ví dụ: "Advertiser feedback không phân biệt được ads đang active hay paused vì không có visual indicator rõ ràng. 12/20 user test gặp confusion." -->
<!-- ❌ Anti-pattern: "Design mới hơn, UX tốt hơn." -->


## Before & After

### Before (hiện tại)
<!-- Mô tả hoặc screenshot behavior hiện tại -->
<!-- ✅ Ví dụ:
- Bảng ads list có 4 cột: Name | Budget | Clicks | Spend
- Không có cột Status
- Không phân biệt được ads active / paused
-->

### After (sau thay đổi)
<!-- Mô tả behavior mới -->
<!-- ✅ Ví dụ:
- Bảng ads list có 5 cột: Name | Status | Budget | Clicks | Spend
- Cột Status dùng badge: Active (xanh) | Paused (xám) | Rejected (đỏ)
- User click vào badge → toggle status trực tiếp
-->


## Impact Analysis
<!-- Những gì có thể bị ảnh hưởng. Cần kiểm tra kỹ trước khi release. -->
<!-- ✅ Ví dụ:
- Component AdsTable: cần thêm column definition
- API: cần field "status" trong response /api/ads/list (confirm với backend)
- Mobile: cần test layout với 5 cột trên màn hình nhỏ
- Không ảnh hưởng: logic filter, pagination, export CSV
-->
<!-- ❌ Anti-pattern: "Chỉ ảnh hưởng UI, không ảnh hưởng gì khác." -->


## Acceptance Criteria
<!-- Tối thiểu 2 điểm. Focus vào verify Before → After đúng. -->
<!-- ✅ Ví dụ:
- [ ] Cột Status hiển thị đúng badge color theo trạng thái
- [ ] Click badge → status toggle thành công, không cần reload page
- [ ] Mobile: bảng vẫn readable, không overflow ngang
- [ ] Regression: filter và pagination vẫn hoạt động bình thường
-->


## Scope & Effort
<!-- Ước tính số ngày. -->
<!-- ✅ Ví dụ: Ước tính 2 ngày (1 ngày UI + 1 ngày test + fix) -->


## Rollback Plan
<!-- Nếu có lỗi sau deploy thì rollback thế nào? -->
<!-- ✅ Ví dụ: "Revert PR #xxx là đủ, không có DB migration." -->
<!-- ❌ Anti-pattern: Để trống -->
```
