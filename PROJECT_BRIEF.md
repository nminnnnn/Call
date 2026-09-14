# PROJECT_BRIEF

## Mục tiêu

Xây dựng MVP chat/call/send file cho web demo khách hàng, có hướng nâng cấp production sau demo mà không viết lại toàn bộ UI.

## Phạm vi MVP

- Đăng nhập/đăng ký cơ bản ở backend thật.
- Danh sách hội thoại, chat 1-1, chat nhóm.
- Gửi text, file, ảnh, reaction, reply.
- Online/offline, typing indicator, unread count.
- Tìm kiếm hội thoại/tin nhắn cơ bản.
- Profile user.
- Mock call audio/video trên web demo; call thật dùng LiveKit/WebRTC sau.

## Giới hạn ban đầu

- 1.000 tài khoản người dùng mục tiêu.
- Khoảng 50 người hoạt động đồng thời dự kiến.
- Nhóm tối đa 100 thành viên.
- Group call tối đa 8 người giai đoạn đầu.
- File upload tối đa 25MB, tối đa 5 file mỗi tin nhắn.
- Tin nhắn tối đa 4.000 ký tự.
- Message history dùng cursor pagination.

## Lưu ý production

Không tự nhận hệ thống chịu tải được nếu chưa có load test. Khi làm backend thật cần test hoặc kịch bản kiểm tra tải cho chat realtime, upload file và call.
