# API CONTRACT — Định hướng Phase 2

Phase 1 chưa gọi các endpoint dưới đây. UI hiện đi qua repository/service interfaces và mock adapters; contract này là ranh giới định hướng cần được xác nhận lại sau phản hồi khách.

## Quy ước chung

- API production dùng HTTPS và auth bằng cookie HttpOnly hoặc cơ chế được duyệt sau threat model; không lưu token nhạy cảm trong local storage.
- Mọi thao tác dữ liệu riêng tư phải kiểm tra user là thành viên conversation ở backend.
- Lỗi trả mã ổn định, thông điệp an toàn và request/correlation ID khi phù hợp.
- Message được lưu bền vững trước khi phát realtime event.

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `POST /auth/refresh` chỉ thêm nếu kiến trúc phiên thực tế cần.

Login/logout hiện có trong web là demo-only và không triển khai các endpoint này.

## Profiles

- `GET /profiles`
- `GET /profiles/:userId`

## Conversations

- `GET /conversations?cursor=...`
- `GET /conversations/:conversationId`
- `POST /conversations/direct`
- `POST /conversations/groups`
- `PATCH /conversations/:conversationId`
- `PATCH /conversations/:conversationId/members`
- `POST /conversations/:conversationId/read`
- `GET /conversations/:conversationId/messages?cursor=...`
- `POST /conversations/:conversationId/messages`

## Messages

- `PATCH /messages/:messageId` — chỉ tác giả được sửa nội dung hợp lệ.
- `DELETE /messages/:messageId` — chỉ tác giả hoặc policy được duyệt.
- `POST /messages/:messageId/retry`
- `POST /messages/:messageId/reactions`
- `DELETE /messages/:messageId/reactions/:emoji`

Edit phải giữ metadata reply/attachment/reaction; delete cần quyết định tombstone hay xóa mềm trước khi triển khai.

## Files

- `POST /files/upload-url`
- Client upload trực tiếp lên S3-compatible storage bằng URL ngắn hạn.
- `POST /files/finalize`

Database chỉ lưu metadata như `fileName`, `mimeType`, `sizeBytes`, `storageKey`, `ownerId`, `conversationId` và `messageId`; không lưu base64 trong message.

## Calls

- `POST /calls`
- `POST /calls/:callId/accept`
- `POST /calls/:callId/end`
- `POST /calls/:callId/livekit-token`

Backend cấp LiveKit token ngắn hạn và không đưa LiveKit secret vào client.

## Socket.IO events dự kiến

- `conversation:join`, `conversation:leave`
- `message:created`, `message:updated`, `message:deleted`
- `typing:start`, `typing:stop`
- `presence:updated`
- `call:ringing`, `call:ended`

Socket phải xác thực, kiểm tra membership khi join/event và remove room khi user mất quyền.

## Database index tối thiểu dự kiến

- `conversations(updatedAt)`
- `conversation_members(userId, conversationId)`
- `conversation_members(conversationId, userId)`
- `messages(conversationId, createdAt, id)`
- `messages(senderId, createdAt)`
- `attachments(messageId)`
