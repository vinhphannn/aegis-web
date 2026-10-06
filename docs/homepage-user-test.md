# Kiểm tra Home AEGIS — 10 đến 15 phút/người

## Phương án đang triển khai

Home có 3 phần: Hero (Explore Hardware / Open Configurator), Current hardware (FC và Controller, WORKING PROTOTYPE được chủ dự án xác nhận), dải engineering ngắn dẫn sang About. Giữ drone như hình minh họa bối cảnh UAV; chưa có exploded view hay mô hình Controller thực tế. Trang sản phẩm có sơ đồ vai trò, mô tả và firmware workflow; Docs có Getting started / Firmware / Connections, dẫn tới repo gốc cho pinout chưa được đưa lên web.

Đường dẫn chính: /products/fc, /products/controller, /docs/fc, /docs/controller. Đường dẫn aegis-fc/aegis-tx cũ chuyển tiếp sang tên mới. Configurator không đổi workflow.

## Người tham gia

Một vòng định tính nhỏ với khoảng 5 người: người mới chưa biết AEGIS, người có kinh nghiệm UAV/embedded và người đã dùng thiết bị nếu có. Đây là kiểm tra để tìm vấn đề, không đủ để khẳng định tỷ lệ thành công của toàn bộ người dùng.

## Cách tiến hành

Không giới thiệu AEGIS trước. Không chỉ tay vào CTA hay giải thích tên thiết bị. Xin phép ghi chép/ghi hình nếu cần. Dùng thiết bị quen thuộc của người tham gia; thử cả desktop và mobile qua nhóm.

1. Cho xem Home trong khoảng 5–10 giây, rồi hỏi: “Bạn nghĩ dự án này làm gì? Có sản phẩm hay công cụ gì?” Ghi lại nguyên văn, đặc biệt xem họ có tưởng AEGIS bán drone nguyên chiếc không.
2. “Bạn đang tìm phần cứng điều khiển chuyến bay cho một dự án UAV. Bạn sẽ bắt đầu ở đâu?” Quan sát lựa chọn đầu tiên và có tới được FC không.
3. “Bạn có một tay điều khiển AEGIS và muốn cập nhật firmware.” Quan sát đường đi tới Configurator → Controller; xem có nhầm với TX Module không. Không cắm USB hoặc nạp thiết bị trong bài test này.
4. “Bạn cần biết cách cài firmware FC.” Quan sát có tìm được hướng dẫn QGroundControl và nhận ra browser không trực tiếp flash FC không.
5. “Bạn muốn biết phần nào đã có mẫu hoạt động, phần nào vẫn nghiên cứu.” Kiểm tra cách họ hiểu WORKING PROTOTYPE và NAV/VISION R&D.
6. Hỏi cuối: “Thông tin nào còn thiếu để bạn quyết định tìm hiểu tiếp? Phần nào gây khó hiểu hoặc làm bạn mất thời gian?”

## Ghi nhận

Với mỗi nhiệm vụ: lựa chọn đầu tiên, thành công/không thành công, có cần hỗ trợ không, thời gian tương đối, chỗ do dự, lời nói và kỳ vọng. Phân biệt quan sát trực tiếp và diễn giải của người đánh giá.

Nếu nhiều người nhầm drone minh họa thành sản phẩm chính, thay nội dung/hình hero theo cách biểu diễn hệ thống. Nếu họ vào Configurator để khám phá sản phẩm, làm rõ tên và vai trò CTA. Nếu đọc prototype thành phần cứng đang bán, bổ sung định nghĩa trạng thái. Nếu trang con chưa trả lời được câu hỏi quan trọng, ưu tiên nội dung đó trước khi thêm animation.
