# API_CONTRACT

API dưới đây là contract định hướng cho backend NestJS.

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`

## Profiles

- `GET /profiles`
- `GET /profiles/:userId`

## Conversations

- `GET /conversations`
- `POST /conversations/groups`
- `GET /conversations/:conversationId/messages?cursor=...`
- `POST /conversations/:conversationId/messages`

Quyền: user phải là member của conversation.

## Messages

- `POST /messages/:messageId/retry`
- `POST /messages/:messageId/reactions`

Backend production phải lưu message vào PostgreSQL trước rồi mới emit socket event.

## Files

- `POST /files/upload-url`
- Client upload trực tiếp lên S3-compatible storage bằng URL ngắn hạn.
- `POST /files/finalize`

Database chỉ lưu metadata: fileName, mimeType, sizeBytes, storageKey, ownerId, conversationId, messageId.

## Calls

- `POST /calls`
- `POST /calls/:callId/accept`
- `POST /calls/:callId/end`
- `POST /calls/:callId/livekit-token`

Backend cấp LiveKit token ngắn hạn. Client không có LiveKit secret.

## Socket.IO Events

- `conversation:join`
- `conversation:leave`
- `message:created`
- `message:updated`
- `typing:start`
- `typing:stop`
- `presence:updated`
- `call:ringing`
- `call:ended`

Socket phải auth, join room theo conversation, kiểm tra membership và remove room khi user bị xóa khỏi nhóm.

## Database Index Tối Thiểu

- `conversations(updatedAt)`
- `conversation_members(userId, conversationId)`
- `conversation_members(conversationId, userId)`
- `messages(conversationId, createdAt, id)`
- `messages(senderId, createdAt)`
- `attachments(messageId)`
