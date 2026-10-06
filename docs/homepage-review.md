# AEGIS: rà soát trang chủ để trao đổi với chuyên gia UX

Ngày rà soát: 06/10/2026. Đọc mã nguồn hiện tại; tham khảo cấu trúc nội dung website chính thức. Chưa nghiên cứu người dùng thực tế, chưa đánh giá trực quan chi tiết các website tham khảo, chưa sửa giao diện Home.

## Kết luận đề xuất

Rút Home thành một trang giới thiệu ngắn và dẫn đường. Giữ một hình/mô hình chủ đạo, một câu giải thích cụ thể, các lối vào sản phẩm và công cụ. Không cần lặp lại toàn bộ nội dung About. Tuy nhiên, cần hoàn thiện các trang Products/Docs trước hoặc cùng lúc với việc chuyển nội dung khỏi Home; hiện các trang đó chưa có đủ nội dung để tiếp nhận người dùng.

## Nội dung hiện tại

| Trang | Thực tế trong mã nguồn | Ý nghĩa đối với Home |
|---|---|---|
| Home | 7 khối: hero, kiến trúc hệ thống, FC, TX, web tools, hardware/firmware/tools, giới thiệu | Nhiều khối cùng diễn giải một hệ sinh thái, nhưng khá ít thông tin cụ thể giúp chọn sản phẩm |
| Products | Danh sách hai liên kết FC và TX | Có đường dẫn nhưng chưa có thông tin so sánh |
| Product FC/TX | Tiêu đề và mô tả một dòng | Chưa có thông số, khả năng tương thích, ảnh sản phẩm, trạng thái phát triển, hướng dẫn bắt đầu |
| Docs hub | Hai liên kết tài liệu FC/TX | Có tổ chức nhưng chưa có hướng dẫn |
| Docs FC/TX | Tiêu đề và mô tả một dòng | Chưa có pinout, đấu nối hoặc trình tự setup thực tế |
| Configurator | Chọn thiết bị; FC tải firmware .px4 để cài bằng QGroundControl; Controller chuẩn bị/cài firmware qua USB; RF TX/RX đang planned | Hiện là nơi chọn và cài/tải firmware. Không nên mô tả đã có đầy đủ chỉnh tham số/diagnostics |
| About | 4 cảnh giải thích dự án, triết lý, ba thành phần hệ sinh thái và bắt đầu sử dụng | Phù hợp nhận nội dung giới thiệu và triết lý đang lặp ở Home |

Nguồn nội bộ: `src/pages/HomePage.tsx`, các trang Products/Docs, `src/pages/configurator/*`, `src/pages/AboutPage.tsx`.

Home hiện gọi TX là radio transmitter; Configurator phân biệt handheld Controller và RF TX Module. Cần thống nhất cách đặt tên để người dùng không chọn nhầm. Nhãn AVAILABLE trên Home cũng cần định nghĩa rõ là phần cứng có thể mua, thiết kế có thể dùng, hay firmware đã phát hành; mã giao diện không chứng minh khả năng mua hoặc mức độ hoàn thiện phần cứng.

## Người dùng có thể cần gì ở Home?

Đây là các giả thuyết cần kiểm chứng, không phải kết quả nghiên cứu người dùng AEGIS:

1. Người mới: AEGIS là dự án gì? Có những thiết bị nào? Phù hợp với việc mình đang làm không?
2. Người đã có phần cứng: đi đâu để lấy/cài firmware hoặc tìm hướng dẫn? Có cần về Home không?
3. Người đánh giá kỹ thuật: có bằng chứng gì về trạng thái dự án, tài liệu, phiên bản và mã nguồn?

Home nên giúp trả lời: mình đang ở đâu, ở đây có gì, và bước tiếp theo là gì. Một trang đẹp nhưng chỉ có slogan và mô hình sẽ khó làm việc này cho một thương hiệu người dùng chưa biết.

## Cấu trúc tối giản đề xuất

- Navbar hiện tại.
- Hero: một mô hình chủ đạo; headline nói rõ FC/radio/firmware thay vì chỉ nói autonomous flight chung chung. Mô tả ngắn xác định đây là dự án UAV hardware/software. Hai hành động: khám phá phần cứng và mở công cụ firmware.
- Một hàng hai sản phẩm FC và Controller/TX: mỗi sản phẩm có một câu giải thích vai trò, trạng thái đã kiểm chứng và liên kết đi tiếp. Đây là bản tóm tắt để định hướng, không phải sao chép trang sản phẩm.
- Footer: Docs, About, GitHub. Có thể thêm một câu về mã nguồn mở và link repository nếu phạm vi mã nguồn mở được xác nhận.

Docs phải tìm được ngay từ navbar. About là nơi dành cho trải nghiệm cuộn theo cảnh. Home không cần buộc người dùng đi qua nhiều cảnh để mở công cụ.

Dự kiến giữ Hero; gộp hai khối FC/TX thành một hàng ngắn; bỏ khối kiến trúc và khối hardware/firmware/tools lặp About; đưa mô tả web tools vào CTA; rút giới thiệu dự án thành một câu. Không đặt số màn hình hoặc lượng chữ cứng nhắc làm mục tiêu: đo khả năng hiểu và tìm đúng nơi trước.

Không thêm khối tin tức, testimonial, số liệu độ tin cậy, đối tác hoặc roadmap dài khi chưa có dữ liệu xác thực. Không chuyển các khẳng định marketing hiện tại thành thông số kỹ thuật đã được kiểm chứng.

## Tham khảo và giới hạn áp dụng

- [Apple](https://www.apple.com/): các khối sản phẩm có tên, thông điệp ngắn và hành động đi tiếp. Có thể học sự rõ ràng của từng khối; không suy ra AEGIS chỉ cần slogan vì Apple có mức độ nhận diện thương hiệu khác.
- [DJI](https://www.dji.com/br): các khối sản phẩm, liên kết tìm hiểu/mua và các nhánh theo lĩnh vực. Có thể học cách đi từ nội dung tổng quan tới sản phẩm; không cần mang toàn bộ danh mục hay nội dung chiến dịch về AEGIS.
- [Arduino](https://www.arduino.cc/): tách Products, Documentation, Cloud và nhóm người dùng; có giải thích nền tảng và đường dẫn học/bắt đầu. Gần bối cảnh phần cứng + phần mềm của AEGIS hơn, nhưng lượng nội dung cộng đồng và tin tức không phù hợp để sao chép nguyên.
- [NN/g: Homepage Design — 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/): nhấn mạnh diễn đạt mục đích website, hỗ trợ điều hướng và hành động, cùng sự đơn giản và tốc độ. Đây là cơ sở cho đề xuất; không thay thế việc kiểm tra với người dùng AEGIS.

Các nhận xét trên dựa trên cấu trúc nội dung đã đọc, không phải chứng minh các website này đẹp hoặc hiệu quả hơn.

## Prompt có thể gửi cho chuyên gia

Tôi đang xây AEGIS, một dự án phần cứng/phần mềm UAV với FC, handheld Controller/TX và công cụ firmware trên trình duyệt. Website có Home, Products, Docs, Configurator, About và GitHub.

Home hiện có 7 khối, khá nhiều nội dung hệ sinh thái/triết lý trùng About. About đã có trải nghiệm cuộn theo 4 cảnh và mô hình 3D. Configurator có chức năng tải firmware FC .px4 để cài bằng QGroundControl và cài firmware Controller qua USB. RF TX/RX modules đang planned. Product pages và Docs pages hiện mới là các trang khung, chưa có nội dung kỹ thuật đầy đủ.

Tôi muốn Home đơn giản, đẹp, nhanh và có ích: giúp người mới hiểu dự án và giúp người đã có thiết bị tìm công cụ/tài liệu. Phương án đang cân nhắc là một hero với mô hình 3D, một câu giải thích cụ thể, hai CTA, một hàng giới thiệu ngắn FC/Controller, rồi footer. Nội dung chi tiết thuộc Products/Docs; triết lý và trải nghiệm thương hiệu thuộc About.

Hãy đánh giá phương án theo nhu cầu người dùng, không mặc định website công ty lớn là chuẩn. Cụ thể:

1. Home nên có những thông tin tối thiểu nào khi thương hiệu chưa được biết đến? Những gì nên bỏ hoặc chuyển đi?
2. CTA chính nên ưu tiên khám phá phần cứng hay công cụ firmware? Giả thuyết nào cần kiểm chứng để quyết định?
3. Cần hoàn thiện nội dung tối thiểu gì trên các trang con trước khi rút Home?
4. Mô hình 3D drone nên là yếu tố thương hiệu hay có nguy cơ làm người dùng tưởng AEGIS bán drone nguyên chiếc? Có nên dùng FC làm hình chủ đạo?
5. Cách phân biệt Controller/TX và RF TX Module, cùng trạng thái dự án, nên thể hiện ra sao?
6. Đề xuất một cấu trúc Home cụ thể và một bài kiểm tra ngắn với người dùng mới/người đã có thiết bị. Phân biệt nhận định có bằng chứng và giả thuyết.

Tham khảo Apple, DJI, Arduino ở mức tổ chức nội dung và điều hướng. Không sao chép nguyên giao diện hoặc số lượng section.
