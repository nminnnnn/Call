# DEMO GUIDE - Bước 3

## Khởi động

```bash
corepack pnpm install
corepack pnpm dev
```

Mở URL Vite hiển thị trong terminal.

## Nội dung kiểm tra

1. Mở `/messages` để xem 10 hội thoại và kiểm tra tìm kiếm.
2. Mở `/messages/du-an-mach` để kiểm tra thread dài, cuộn, mốc ngày và 4 tin nhắn mới.
3. Quan sát tin đã đọc, reaction, reply, file Excel và ảnh dashboard trong hội thoại.
4. Rê chuột lên tin nhắn, bấm trả lời, nhập nội dung rồi gửi.
5. Chọn file hoặc ảnh ở composer, xem preview, bỏ file hoặc gửi giả lập.
6. Với tin nhắn của Minh Anh, chọn sửa, thử gửi nội dung rỗng, hủy, rồi lưu nội dung mới và kiểm tra nhãn “đã sửa”.
7. Với tin nhắn của Minh Anh, chọn xóa, hủy xác nhận, sau đó xác nhận xóa và kiểm tra preview hội thoại cập nhật.
8. Mở “Gia Bảo” để kiểm tra trạng thái chưa có tin nhắn.
9. Đổi giữa các hội thoại và kiểm tra header, message list, thành viên, tệp chia sẻ cùng cập nhật.
10. Bấm gọi thoại/video để kiểm tra `CallService` trả trạng thái ringing giả lập.
11. Trên desktop, bật/tắt panel thông tin bằng nút chữ `i`.
12. Trên tablet/mobile, nút chữ `i` mở thông tin bằng drawer; mobile có nút quay lại danh sách.

## Ranh giới bước 3

- User, conversation, message, attachment và call đều đi qua interface trả `Promise`.
- Mock implementation dùng store trong bộ nhớ; dữ liệu mất khi tải lại trang.
- Upload file chỉ tạo metadata và object URL tại trình duyệt, chưa gửi lên storage.
- Call chỉ trả trạng thái ringing và toast, chưa có màn hình cuộc gọi đầy đủ.
- Danh bạ, lịch sử gọi và cài đặt vẫn là màn hình nền hoặc placeholder.
- Chưa có auth, backend, database, Socket.IO, upload storage hay WebRTC/LiveKit thật.

## Kiểm tra kỹ thuật

```bash
corepack pnpm lint
corepack pnpm build
corepack pnpm --filter @job-call/web check:visual
```

Ảnh kiểm tra responsive được tạo trong `.qa/playwright`.
