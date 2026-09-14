# ROADMAP

## Bước 1: Xác Định Phạm Vi Web Demo

Mục tiêu: chốt phạm vi màn hình, user flow, phân loại mock/mô phỏng/production và tiêu chí nghiệm thu demo.

Kết quả cần có:

- `docs/PROJECT_BRIEF.md`
- `docs/ROADMAP.md`
- `docs/TASKS.md`

Không làm ở bước này:

- Không triển khai backend.
- Không tạo database.
- Không tích hợp realtime thật.
- Không upload file thật.
- Không tích hợp WebRTC/LiveKit thật.

## Bước 2: Hoàn Thiện Khung UI Demo

Mục tiêu: dựng đầy đủ các màn hình và navigation chính.

Phạm vi:

- Trang đăng nhập demo.
- Shell app chính.
- Danh sách hội thoại.
- Chat cá nhân và chat nhóm.
- Danh bạ.
- Lịch sử cuộc gọi.
- Hồ sơ và cài đặt.
- Responsive desktop/mobile.

## Bước 3: Hoàn Thiện Interaction Demo

Mục tiêu: làm demo có thể thao tác như sản phẩm thật.

Phạm vi:

- Gửi tin nhắn giả lập.
- Reply, reaction, sửa, xóa tin nhắn của mình.
- Tạo nhóm, thêm thành viên, xem thành viên.
- Bắt đầu chat từ danh bạ.
- Chọn file, preview file, gửi file giả lập.
- Tìm kiếm trên dữ liệu demo.
- Loading, empty, error state.

## Bước 4: Hoàn Thiện Call Mock Và Demo Script

Mục tiêu: có luồng gọi thoại/video đủ để demo khách hàng.

Phạm vi:

- Bấm gọi từ hội thoại.
- Ringing state.
- Active call state.
- Mute, camera toggle, end call.
- Ghi lịch sử cuộc gọi mock.
- Demo guide cho người trình bày.

## Bước 5: Chuẩn Bị Backend Thật Sau Khi Demo Được Duyệt

Mục tiêu: thay mock service bằng backend production MVP.

Phạm vi dự kiến:

- NestJS + PostgreSQL + Prisma.
- Redis cho presence, rate limit và realtime adapter nếu cần.
- Socket.IO/WebSocket có auth, room, reconnect, presence.
- API validation, error format, logging.
- Conversation/member/message schema và index.
- Cursor pagination cho message.
- S3-compatible storage cho file.
- LiveKit SFU cho call thật.

## Bước 6: Kiểm Thử Tải Và Hardening

Mục tiêu: kiểm chứng giả định 1.000 user và khoảng 50 concurrent active users.

Phạm vi:

- Load test chat realtime.
- Load test upload file.
- Kịch bản kiểm tra call nhóm.
- Kiểm tra phân quyền conversation/message/file/socket event.
- Backup/restore database.
- Monitoring/logging/rate limit.

Lưu ý: chỉ được công bố năng lực chịu tải sau khi có kết quả test thực tế.
