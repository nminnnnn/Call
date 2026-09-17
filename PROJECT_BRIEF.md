# PROJECT_BRIEF

## Mục tiêu hiện tại

Hoàn thiện **Mạch** thành web demo giao tiếp kiểu Zalo đủ rõ ràng để khách hàng trải nghiệm, góp ý và chốt phạm vi sản phẩm thật. `Job_Call` là repository chính; `chat-project` chỉ là nguồn tham khảo.

Phase 1 ưu tiên chất lượng luồng trình diễn, không cố sao chép toàn bộ Zalo và không tiếp tục thêm mock feature nếu tính năng đó không hỗ trợ kịch bản demo đã chốt.

## Phạm vi Phase 1

- Đăng nhập/đăng xuất demo cơ bản, có tài khoản mẫu và nút **Trải nghiệm demo**.
- Danh sách hội thoại, tìm kiếm hội thoại, chat cá nhân và chat nhóm.
- Danh bạ và mở hội thoại đã có.
- Tạo nhóm, chọn thành viên và xem thông tin thành viên.
- Gửi tin nhắn, reply, reaction, sửa/xóa tin nhắn của người dùng hiện tại.
- Chọn file/ảnh, xem preview cục bộ và mô phỏng gửi kèm tin nhắn.
- Gọi thoại/video ở mức phản hồi mô phỏng rõ ràng trong hội thoại.
- Loading, empty, error/retry và responsive desktop/tablet/mobile cho các luồng chính.
- Link HTTPS, hướng dẫn demo và mẫu ghi nhận phản hồi khách.

Các màn hình lịch sử cuộc gọi, hồ sơ chi tiết và cài đặt không nằm trong bản demo ứng viên hiện tại; navigation placeholder đã được loại bỏ.

## Ranh giới mô phỏng

- Phiên đăng nhập được lưu cục bộ theo version, không chứa password/token và không phải auth production.
- Dữ liệu người dùng, hội thoại, tin nhắn và nhóm nằm trong mock store bộ nhớ; tải lại trang khôi phục seed data.
- File chỉ dùng metadata và object URL cục bộ, không upload lên storage.
- Presence, typing, unread và trạng thái gửi là dữ liệu mô phỏng.
- Cuộc gọi chỉ trả trạng thái ringing/toast, không truy cập camera/microphone và không truyền media.

## Ngoài phạm vi Phase 1

- Đăng ký, quên mật khẩu, OTP, OAuth, xác minh email và auth production.
- NestJS, PostgreSQL, Prisma, Redis, Socket.IO và migration.
- Object storage, upload production, LiveKit/WebRTC thật.
- React Native, push notification và phát hành store.
- Cam kết tải 1.000 tài khoản/50 người hoạt động đồng thời trước khi có load test.

## Tiêu chí kết thúc Phase 1

1. Khách mở được link HTTPS, vào demo bằng tài khoản mẫu hoặc một click và đăng xuất được.
2. Người trình bày chạy được kịch bản 5–7 phút mà không gặp nút vô tác dụng.
3. Luồng hội thoại, danh bạ, tạo nhóm và thao tác tin nhắn chạy ổn trên desktop/mobile.
4. Lint, production build và các browser check trọng yếu đều pass.
5. Tài liệu mô tả đúng hành vi thực tế và phân biệt rõ demo với production.
6. Phản hồi khách được ghi trong `docs/CLIENT_FEEDBACK.md` trước khi mở Phase 2.
