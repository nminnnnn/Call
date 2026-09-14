# ROADMAP

## Phase 1: Web Demo

- Hoàn thiện UI app chat tiếng Việt, responsive desktop/mobile.
- Dùng mock service nhưng giữ flow giống production.
- Ghi rõ mock/production-ready trong tài liệu.

## Phase 2: Backend MVP

- NestJS + PostgreSQL + Prisma.
- Auth, validation, error format, logging, rate limit.
- Conversation/member/message schema với index theo conversation, member, createdAt/cursor.
- Socket.IO auth, room, reconnect, presence.
- File upload flow: request upload URL -> upload storage -> finalize metadata.

## Phase 3: Realtime Và File Production

- Message lưu DB trước rồi emit realtime.
- Kiểm tra quyền conversation ở REST và socket event.
- Redis cho presence, rate limit, pub/sub hoặc adapter.
- S3-compatible storage: AWS S3, Cloudflare R2 hoặc MinIO.

## Phase 4: Call Thật

- LiveKit SFU.
- Backend cấp token ngắn hạn.
- Không để LiveKit secret ở client.
- Load test/kịch bản kiểm tra call nhóm tối đa 8 người.

## Phase 5: Mobile

- React Native, ưu tiên Expo dev build nếu tương thích LiveKit/WebRTC.
- Không dùng Expo Go cho phần native WebRTC nếu SDK không hỗ trợ.
