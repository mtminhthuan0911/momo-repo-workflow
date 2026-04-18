# Template: [RESEARCH] — Research / Competitor Analysis
# Dùng cho: Nghiên cứu, phân tích đối thủ, khảo sát user, technical research

---

## Checklist Claude Bot verify (✅ / ❌)

- [ ] Có objective rõ ràng — research này để trả lời câu hỏi gì (section: Objective)
- [ ] Có methodology — nghiên cứu bằng cách nào (section: Methodology)
- [ ] Có findings — kết quả cụ thể (section: Findings)
- [ ] Có recommendation actionable (section: Recommendation)
- [ ] Có nguồn tham khảo nếu là competitor research

Nếu có ❌ → tag @Bảo yêu cầu bổ sung
Nếu tất cả ✅ → tóm tắt key findings + tag @Thuận Minh

---

## Template anh Bảo điền

```markdown
---
type: RESEARCH
title: [Tên research ngắn gọn]
author: Bảo
date: YYYY-MM-DD
research_type: Competitor | User Research | Technical | Market
---

## Objective
<!-- Research này để trả lời câu hỏi gì? -->
<!-- ✅ Ví dụ: "Tìm hiểu cách các platform ads (Google Ads, Meta Ads) implement dashboard analytics để đưa ra quyết định feature cho Ads Dashboard MoMo." -->
<!-- ❌ Anti-pattern: "Nghiên cứu về ads platform." -->


## Scope
<!-- Nghiên cứu những gì, không bao gồm những gì -->
<!-- ✅ Ví dụ:
IN scope: Google Ads, Meta Ads Manager, TikTok Ads
OUT scope: Programmatic DSP platforms (quá phức tạp cho giai đoạn này)
-->


## Methodology
<!-- Làm thế nào để research? -->
<!-- ✅ Ví dụ:
- Hands-on: Tạo test account trên từng platform và thao tác trực tiếp
- Screenshot + ghi chú UX patterns
- Phỏng vấn 3 advertiser đang dùng Google Ads
-->


## Findings
<!-- Kết quả cụ thể. Dùng subsection cho từng đối tượng nghiên cứu. -->
<!-- ✅ Ví dụ:

### Google Ads Dashboard
- Date range picker: presets + custom, default "Last 30 days"
- Metrics: Impressions, Clicks, CTR, Avg CPC, Conversions, Cost
- Chart: Line chart với option chuyển sang bar chart
- Điểm mạnh: Comparison mode (so sánh 2 period)
- Điểm yếu: Quá nhiều metrics, overwhelming cho beginner

### Meta Ads Manager
- Summary cards ở trên, chart ở dưới
- Có "Performance overview" vs "Detailed breakdown"
- Mobile app tốt hơn Google Ads
-->


## Key Insights
<!-- 3-5 điểm quan trọng nhất, súc tích -->
<!-- ✅ Ví dụ:
1. Tất cả platform đều có date range picker với presets (Today/7d/30d)
2. CTR và Spend là 2 metric advertiser quan tâm nhất
3. Empty state quan trọng — platform tốt đều có guidance khi chưa có data
4. Mobile experience thường kém desktop, đây là cơ hội để MoMo differentiate
-->


## Recommendation
<!-- Hành động cụ thể cần làm dựa trên research. Actionable. -->
<!-- ✅ Ví dụ:
- SHOULD DO: Implement date range picker với presets giống Google Ads
- SHOULD DO: Focus 4 metrics: Impressions, Clicks, CTR, Spend (không nhiều hơn)
- CONSIDER: Comparison mode — defer sang phase 2
- SKIP: Tự động optimization suggestions — quá complex, không phù hợp giai đoạn này
-->
<!-- ❌ Anti-pattern: "Nên làm dashboard tốt như Google Ads." -->


## References
<!-- Link nguồn, screenshot folder, tên người phỏng vấn -->
<!-- ✅ Ví dụ:
- Google Ads UI: [screenshot folder link]
- Meta Ads Manager: [screenshot folder link]
- Phỏng vấn: Anh Hùng (advertiser SME), Chị Mai (agency buyer)
-->
```
