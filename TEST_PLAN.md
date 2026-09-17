# TEST PLAN

## Release gate cho Phase 1 demo

### Kiểm tra tự động hiện có

- `corepack pnpm lint`
- `corepack pnpm build`
- `check:auth`: protected deep link, login sai, demo entry, giữ phiên khi refresh, logout và session hỏng.
- `check:visual`: desktop 1440 px, tablet 900 px, mobile 390 px; kiểm tra overflow, unread, reply/send, chuyển hội thoại và empty state.
- Focused group-create check: tạo nhóm desktop/mobile, focus dialog, thành viên và gửi tin.
- Focused message edit/delete smoke đã ghi trong task handoff: quyền control, validation, edited marker, confirmation và preview hội thoại.

### Smoke test thủ công trước khi gặp khách

- Login bằng tài khoản mẫu và bằng nút **Trải nghiệm demo**.
- Điều hướng bằng bàn phím qua login, navigation, composer và dialog tạo nhóm.
- Mở danh bạ, hội thoại cá nhân, hội thoại nhóm và hội thoại rỗng.
- Gửi text bằng Enter; Shift+Enter xuống dòng; IME không gửi khi đang composition.
- Reply, reaction, sửa/xóa tin của Minh Anh.
- Chọn tối đa 5 file/ảnh, xem và bỏ preview, gửi attachment mô phỏng.
- Bấm gọi thoại/video và xác nhận nhãn phản hồi cho biết đây là mô phỏng.
- Đăng xuất trên desktop và mobile.
- Reload trực tiếp `/login`, `/messages`, `/messages/du-an-mach` và `/contacts` trên deployment.

## Trạng thái kiểm tra gần nhất

Ngày 2026-09-17:

- Lint: PASS.
- Production build: PASS.
- Auth browser check: PASS.
- Responsive visual/browser check: PASS tại desktop, tablet và mobile.

## Coverage gap được chấp nhận trong Phase 1

- Không có test backend/auth/database/realtime vì các thành phần đó chưa tồn tại.
- Failure injection của mọi mock repository chưa được tự động hóa đầy đủ.
- File upload progress/cancel/retry và call active/mute/camera/history không thuộc demo ứng viên hiện tại.

## Kiểm tra bắt buộc cho Phase 2

- Unit/integration test validation và permission với PostgreSQL test database.
- Auth/session: hết hạn, logout/revoke, CSRF, brute-force/rate limit và multi-device.
- Socket.IO: auth, join room, reconnect, presence và unauthorized event.
- Upload: presigned URL, size/type limit, finalize và quyền tải file.
- Cursor pagination và idempotency/duplicate message.
- Load test riêng cho chat, upload và call trước mọi tuyên bố năng lực.
