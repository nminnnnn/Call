# PROJECT_BRIEF

## Mục tiêu bước 1

Xác định phạm vi web demo cho sản phẩm chat/call/send file. Bước này chỉ làm rõ màn hình, user flow, ranh giới demo và tiêu chí nghiệm thu. Chưa triển khai backend thật.

Web demo phải tạo cảm giác như một sản phẩm thật để khách hàng trải nghiệm, nhưng code và tài liệu phải phân biệt rõ phần đang mock, phần chỉ mô phỏng và phần sẽ làm ở giai đoạn hệ thống thật.

## Nguyên tắc kiến trúc cho demo

- Demo được phép dùng mock data và mock service.
- UI không import trực tiếp mock data.
- UI gọi qua service layer hoặc API adapter contract.
- Không hardcode logic demo vào component chính.
- Flow chat, file, call, profile và search phải mô phỏng đúng hướng production.
- Khi thay mock bằng API thật, thay đổi chủ yếu nằm ở service layer/API adapter.

## Phạm vi màn hình web demo

1. Trang đăng nhập demo với nút "Trải nghiệm demo".
2. Màn hình chính app chat.
3. Danh sách hội thoại.
4. Khung chat cá nhân.
5. Khung chat nhóm.
6. Danh bạ người dùng.
7. Màn hình hoặc modal bắt đầu hội thoại từ danh bạ.
8. Modal tạo nhóm.
9. Panel hoặc modal xem thành viên nhóm.
10. Composer gửi tin nhắn.
11. Preview file trước khi gửi.
12. Màn hình gọi thoại giả lập.
13. Màn hình gọi video giả lập.
14. Lịch sử cuộc gọi.
15. Hồ sơ cá nhân.
16. Cài đặt cơ bản.
17. Tìm kiếm trên dữ liệu demo.
18. Empty state, loading state và error state cho các luồng chính.

## User flow demo

### Vào demo -> chọn hội thoại -> gửi tin nhắn

1. Người dùng mở trang đăng nhập demo.
2. Bấm "Trải nghiệm demo".
3. Vào màn hình chính.
4. Chọn một hội thoại trong danh sách.
5. Xem lịch sử tin nhắn mock.
6. Nhập tin nhắn.
7. Bấm gửi.
8. Tin nhắn hiển thị trạng thái đang gửi, đã gửi hoặc lỗi gửi.

### Tìm người -> bắt đầu chat

1. Mở danh bạ.
2. Tìm người theo tên hoặc thông tin demo.
3. Chọn người.
4. Bắt đầu hội thoại cá nhân.
5. Gửi tin nhắn đầu tiên.

### Tạo nhóm -> thêm thành viên -> gửi tin

1. Bấm tạo nhóm.
2. Nhập tên nhóm.
3. Chọn thành viên từ danh bạ demo.
4. Tạo nhóm.
5. Xem nhóm trong danh sách hội thoại.
6. Mở nhóm, xem thành viên.
7. Gửi tin nhắn nhóm.

### Chọn file -> preview -> gửi

1. Bấm chọn file trong composer.
2. Chọn một hoặc nhiều file.
3. Xem preview tên file, loại file, dung lượng và ảnh xem trước nếu là ảnh.
4. Bấm gửi.
5. Tin nhắn file hiển thị trong khung chat với trạng thái gửi giả lập.

### Bấm gọi -> đang đổ chuông -> trong cuộc gọi -> kết thúc

1. Trong hội thoại, bấm gọi thoại hoặc gọi video.
2. Hiển thị màn hình call giả lập ở trạng thái đang đổ chuông.
3. Chuyển sang trạng thái trong cuộc gọi.
4. Có nút mute, bật/tắt camera và kết thúc.
5. Bấm kết thúc.
6. Ghi nhận một item trong lịch sử cuộc gọi demo.

## Phân loại phạm vi

### Có trong demo

- Trang đăng nhập demo với nút "Trải nghiệm demo".
- Danh sách hội thoại.
- Chat cá nhân.
- Chat nhóm.
- Danh bạ và bắt đầu hội thoại.
- Tạo nhóm.
- Xem thành viên nhóm.
- Gửi tin nhắn giả lập.
- Reply tin nhắn.
- Reaction tin nhắn.
- Sửa tin nhắn của mình.
- Xóa tin nhắn của mình.
- Chọn file.
- Preview file.
- Mô phỏng gửi file.
- Màn hình gọi thoại/video giả lập.
- Lịch sử cuộc gọi.
- Hồ sơ và cài đặt cơ bản.
- Tìm kiếm trên dữ liệu demo.
- Responsive desktop/mobile ở mức demo.

### Chỉ mô phỏng

- Đăng nhập: không có auth thật, chỉ vào phiên demo.
- Gửi tin nhắn: không lưu database thật.
- Realtime: không có Socket.IO/WebSocket thật.
- Presence, typing, unread: dùng dữ liệu demo.
- File upload: không upload lên S3 thật.
- Call audio/video: không có WebRTC/LiveKit thật.
- Lịch sử cuộc gọi: sinh từ dữ liệu mock hoặc state local.
- Search: tìm trên mock data, chưa có indexing/search backend.
- Sửa/xóa message: chỉ cập nhật dữ liệu demo/local state.

### Thực hiện ở giai đoạn hệ thống thật

- Backend NestJS.
- PostgreSQL + Prisma migration.
- Redis cho presence, rate limit, queue hoặc Socket.IO adapter.
- Auth thật với session/JWT và phân quyền rõ ràng.
- Socket.IO/WebSocket có auth, room, reconnect, presence.
- Message lưu database trước rồi mới emit realtime.
- Cursor pagination cho message history.
- S3-compatible storage cho file.
- Flow upload thật: request upload URL -> upload storage -> finalize metadata.
- LiveKit SFU cho audio/video call thật.
- Logging, validation, error handling, rate limit.
- Backup database.
- Load test cho chat realtime, upload file và call.

## Tiêu chí nghiệm thu demo

- Người dùng có thể bấm "Trải nghiệm demo" để vào app mà không cần backend.
- Có thể chọn hội thoại cá nhân và nhóm từ danh sách.
- Có thể gửi tin nhắn mock và thấy trạng thái gửi.
- Có thể reply, reaction, sửa và xóa tin nhắn của mình trong demo.
- Có thể tìm kiếm hội thoại, tin nhắn hoặc người dùng trên dữ liệu demo.
- Có thể mở danh bạ và bắt đầu chat cá nhân.
- Có thể tạo nhóm, thêm thành viên và xem thành viên nhóm.
- Có thể chọn file, xem preview và gửi file giả lập.
- Có thể mở call thoại/video giả lập, đi qua trạng thái ringing, active và ended.
- Có thể xem lịch sử cuộc gọi demo.
- Có thể mở hồ sơ và cài đặt cơ bản.
- UI hiển thị ổn trên desktop và mobile.
- Có loading, empty và error state ở các khu vực chính.
- Tài liệu ghi rõ phần mock, phần mô phỏng và phần dành cho hệ thống thật.
- Không có backend thật được triển khai trong bước này.
