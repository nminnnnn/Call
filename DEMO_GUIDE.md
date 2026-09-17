# DEMO GUIDE — Phase 1

## Chạy local

```bash
corepack pnpm install
corepack pnpm dev
```

Mở URL Vite hiển thị trong terminal. Khi dùng port mặc định, URL thường là `http://localhost:5173`.

## Tài khoản demo

- Email: `minhanh@mach.demo`
- Mật khẩu: `Demo1234!`

Có thể bỏ qua nhập tài khoản bằng nút **Trải nghiệm demo**. Đây là phiên demo lưu trong trình duyệt, không phải auth production.

## Kịch bản trình diễn 5–7 phút

1. Mở `/login`, giới thiệu nhãn “Web demo · Dữ liệu mô phỏng”, sau đó chọn **Trải nghiệm demo**.
2. Mở hội thoại **Dự án Mạch**, giới thiệu unread divider, reply, reaction, ảnh và file mẫu.
3. Gửi một tin nhắn; sửa rồi xóa một tin nhắn của Minh Anh.
4. Mở **Danh bạ**, chọn Quang Huy và xác nhận đúng header/nội dung hội thoại.
5. Quay lại **Tin nhắn**, tạo nhóm mới, chọn thành viên và gửi tin đầu tiên.
6. Chọn một ảnh/file ở composer, xem preview, bỏ hoặc gửi file mô phỏng.
7. Bấm gọi thoại/video và giải thích trạng thái ringing/toast là mô phỏng, chưa truyền media thật.
8. Thu nhỏ về mobile để cho thấy danh sách, chat, drawer thông tin và nút đăng xuất responsive.
9. Đăng xuất để kết thúc phiên demo.

## Trạng thái mô phỏng và giới hạn

- Session demo chỉ lưu `version`, định danh tài khoản mẫu, tên và thời điểm bắt đầu; không lưu password/token.
- Dữ liệu chat nằm trong bộ nhớ và trở về seed data sau khi tải lại toàn bộ trang.
- File/ảnh dùng preview cục bộ, không upload và không có đường dẫn tải production.
- Gọi thoại/video chỉ mô phỏng trạng thái ringing bằng toast.
- Không có backend, database, realtime, auth production, object storage hoặc WebRTC/LiveKit.
- Calls history, profile chi tiết và settings không thuộc demo ứng viên hiện tại nên không xuất hiện trong navigation.

## Khôi phục demo trước buổi trình bày

1. Tải lại toàn bộ trang để khôi phục mock store về seed data.
2. Nếu cần xóa phiên đăng nhập, bấm **Đăng xuất** hoặc xóa key `mach.demo.session` trong local storage.
3. Đăng nhập lại bằng nút **Trải nghiệm demo**.

## Build, kiểm tra và deploy

```bash
corepack pnpm lint
corepack pnpm build
BASE_URL=http://localhost:5173 corepack pnpm --filter @job-call/web check:auth
BASE_URL=http://localhost:5173 corepack pnpm --filter @job-call/web check:visual
BASE_URL=http://localhost:5173 corepack pnpm --filter @job-call/web check:group
```

Trên PowerShell, đặt biến bằng `$env:BASE_URL='http://localhost:5173'` trước khi chạy lệnh check. Vercel phải dùng rewrite về `index.html`; cấu hình đã có ở root và `apps/web` để hỗ trợ cả hai lựa chọn Root Directory.

## Ghi nhận phản hồi

Dùng [`docs/CLIENT_FEEDBACK.md`](docs/CLIENT_FEEDBACK.md). Mỗi phản hồi cần có màn hình, bằng chứng, mức ưu tiên, quyết định và trạng thái trước khi đưa vào Phase 2.
