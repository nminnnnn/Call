# ROADMAP

## Phase 1 — Chốt sản phẩm và hoàn thiện demo

### Đã hoàn thành

- React/Vite workspace, design tokens và repository/service boundary.
- Danh sách hội thoại, chat cá nhân/nhóm và dữ liệu tiếng Việt.
- Danh bạ mở chat, tạo nhóm/chọn thành viên.
- Gửi, reply, reaction, sửa/xóa tin nhắn.
- Preview và gửi file/ảnh ở mức mô phỏng.
- Login/logout demo, tài khoản mẫu, route protection cục bộ.
- Responsive checks và Vercel SPA fallback.

### Đang hoàn thiện

- Loại bỏ hoặc ẩn control không phục vụ buổi demo.
- Chuẩn hóa brief, roadmap, demo guide, test plan và API contract.
- Tạo mẫu thu phản hồi khách và chạy kiểm tra release candidate.
- Xác minh lại deployment sau khi bản ứng viên được publish.

### Điều kiện chuyển Phase 2

- Kịch bản demo 5–7 phút chạy ổn trên link HTTPS.
- Không còn nút hoặc navigation vô tác dụng trong phạm vi trình diễn.
- Khách đã cung cấp phản hồi và các yêu cầu được phân loại ưu tiên.
- Phạm vi sản phẩm thật được duyệt; mock feature không có giá trị bị loại khỏi backlog.

## Phase 2 — Backend MVP sau khi khách duyệt

- Thiết kế schema và contract chi tiết.
- NestJS modular monolith, PostgreSQL và Prisma.
- Auth production, validation, logging và rate limit.
- Conversation/member/message API với cursor pagination và kiểm tra quyền.
- Socket.IO có auth, room, reconnect và presence.

## Phase 3 — File và realtime production

- Lưu message vào database trước khi emit realtime.
- S3-compatible storage với upload URL ngắn hạn và finalize metadata.
- Redis khi có nhu cầu đã đo được cho presence/rate limit/adapter.

## Phase 4 — Cuộc gọi thật

- LiveKit SFU và TURN phù hợp.
- Backend cấp token ngắn hạn; không đưa secret vào client.
- Kiểm thử các trạng thái kết nối và tải phòng gọi.

## Phase 5 — Mobile và phát hành

- React Native/Expo development build.
- Push notification và luồng cuộc gọi nền theo chính sách nền tảng.
- Pilot, hardening, App Store và Google Play.
