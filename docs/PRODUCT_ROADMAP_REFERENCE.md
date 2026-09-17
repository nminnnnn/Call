# Product Roadmap Reference

## Trạng thái tài liệu

Tài liệu này chắt lọc định hướng sản phẩm từ bản hội thoại tham khảo `prompt task.html`.
Nó không phải đặc tả thực thi cuối cùng và không ghi đè `PROJECT_BRIEF.md`,
`ROADMAP.md`, `API_CONTRACT.md` hoặc các quyết định kiến trúc đã được duyệt.

Nội dung trình duyệt, script, CSS, metadata tài khoản, cookie và token xác thực
không được đưa vào tài liệu này.

## Tầm nhìn sản phẩm

Xây dựng một nền tảng giao tiếp cho web, iOS và Android, lấy cảm hứng từ các
ứng dụng chat cá nhân và cộng tác công việc nhưng có phạm vi, giao diện và nhận
diện riêng.

Sản phẩm hướng tới:

- Chat trực tiếp và chat nhóm.
- Gửi tin nhắn, ảnh và file.
- Reply, reaction, sửa và xóa tin nhắn của chính mình.
- Presence, typing, unread và read state.
- Tìm kiếm hội thoại, người dùng và tin nhắn.
- Gọi thoại và video cá nhân; gọi nhóm ở giai đoạn sau.
- Web trước, ứng dụng React Native cho iOS và Android tiếp theo.
- Push notification, deep link và xử lý cuộc gọi khi ứng dụng ở foreground,
  background hoặc đã bị đóng.

## Giả định quy mô ban đầu

- Khoảng 1.000 tài khoản.
- Khoảng 50 người hoạt động đồng thời.
- Nhóm tối đa 100 thành viên.
- Phòng gọi nhóm tối đa 8 người trong giai đoạn đầu.
- File tối đa 25 MB và tối đa 5 file cho một tin nhắn.
- Tin nhắn tối đa 4.000 ký tự.
- Lịch sử tin nhắn dùng cursor pagination.

Các con số trên là giới hạn sản phẩm dự kiến, không phải năng lực đã được kiểm
chứng. Chỉ công bố khả năng chịu tải sau khi có load test trên cấu hình triển
khai thực tế.

## Phạm vi MVP đề xuất

MVP ưu tiên một hệ thống tài khoản chung với:

- Chat 1-1.
- Group chat.
- Danh bạ và bắt đầu hội thoại.
- Thành viên và role cơ bản trong nhóm.
- Tin nhắn, reply, reaction, attachment và unread.
- Audio/video call.
- Profile và cài đặt thông báo cơ bản.

Chưa đưa vào MVP nếu chưa có yêu cầu được duyệt:

- Nhiều workspace phức tạp.
- Marketplace, bot và integration platform.
- Microservices hoặc Kubernetes.
- Mã hóa đầu cuối.
- Multi-region active-active.
- Elasticsearch, Kafka, CQRS hoặc event sourcing.

Nếu channel kiểu Slack chắc chắn nằm trong tương lai, mô hình conversation có
thể dự phòng loại `direct`, `group` và `channel`, nhưng không cần xây toàn bộ
permission model của workspace trong MVP.

## Định hướng công nghệ

### Web

- React, Vite và TypeScript.
- React Router cho điều hướng.
- TanStack Query cho server state.
- React state cho state cục bộ; chỉ dùng Zustand khi có state dùng chung rõ ràng.
- UI responsive riêng cho desktop, tablet và mobile web.

### Mobile

- React Native và Expo development build.
- Expo Router hoặc một lớp navigation native tương đương.
- SecureStore/Keychain/Keystore cho credential.
- SQLite cho cache, draft và outbox nếu cần phục hồi qua app restart.
- UI React Native riêng; không cố tái sử dụng component DOM của web.

### Backend

- NestJS modular monolith.
- REST API có OpenAPI contract.
- Socket.IO cho chat realtime, typing, presence và call-state event.
- PostgreSQL là nguồn dữ liệu bền vững.
- Prisma cho schema, migration và database access.
- Redis cho presence TTL, rate limit, job queue và Socket.IO adapter khi cần.
- Object storage tương thích S3 cho file; MinIO chỉ dành cho local nếu phù hợp.
- LiveKit làm SFU cho audio/video; backend cấp token ngắn hạn.

## Cấu trúc monorepo mục tiêu

```text
apps/
  web/                 React + Vite
  mobile/              React Native + Expo
  api/                 NestJS
  worker/              chỉ thêm khi có job nền thật

packages/
  contracts/           API DTO, realtime event và error contracts
  api-client/          HTTP client dùng chung
  domain/              logic thuần không phụ thuộc DOM/native
  sync/                outbox, reconnect và message reconciliation
  design-tokens/       token dùng cho web và mobile
  config/              cấu hình TypeScript/ESLint dùng chung
```

Không tạo package chỉ để giữ cấu trúc. Mỗi package phải có ít nhất một consumer
thực tế.

## Nguyên tắc kiến trúc

1. UI không import trực tiếp mock seed data.
2. Mock adapter và API adapter triển khai cùng contract.
3. Không chia sẻ database entity trực tiếp với frontend.
4. TypeScript types phải được bổ sung bằng runtime validation hoặc API client
   sinh từ OpenAPI.
5. PostgreSQL lưu message trước; chỉ emit realtime sau khi transaction thành công.
6. Redis không phải nơi duy nhất lưu tin nhắn.
7. Client gửi `clientMessageId`; backend đảm bảo idempotency.
8. REST tải snapshot/page; Socket.IO chỉ truyền thay đổi mới và tín hiệu ngắn hạn.
9. File binary không được lưu base64 trong bản ghi message.
10. LiveKit secret, database credential và storage secret chỉ tồn tại ở backend.
11. Backend kiểm tra authorization trên mọi REST route và socket event.
12. Một tài khoản phải có thể dùng nhiều thiết bị và thu hồi từng session.
13. API phải tương thích với các phiên bản mobile chưa cập nhật ngay.
14. Security, logging, staging và test được thực hiện xuyên suốt, không đợi cuối.

## Dữ liệu dùng chung và UI riêng

Web và mobile nên dùng chung:

- API và Socket.IO contracts.
- API client.
- Error codes.
- Query keys.
- Runtime validation.
- Permission rules thuần.
- Date/message formatting thuần.
- Outbox, reconnect và reconciliation logic.
- Design tokens ở dạng TypeScript.

Web và mobile không nên cố dùng chung:

- DOM/React Native components.
- Navigation implementation.
- File picker.
- Local storage implementation.
- Notification lifecycle.
- Permission dialog.
- Call screen và native call integration.

## Roadmap tham khảo đã làm sạch

### Phần 1 — Web demo và xác nhận sản phẩm

#### Bước 1 — Chốt phạm vi demo

- Chốt màn hình, user flow và giới hạn demo.
- Phân loại rõ: hoạt động thật trong demo, mô phỏng và để dành cho production.
- Ghi tiêu chí nghiệm thu và tránh tự mở rộng thành toàn bộ Slack/Zalo.

#### Bước 2 — Khởi tạo nền web và design system

- Thiết lập React/Vite/TypeScript và workspace.
- Tạo design tokens và UI primitives có accessibility.
- Dựng app shell cho desktop, tablet và mobile web.

#### Bước 3 — Chat UI và mock data

- Tạo dữ liệu demo tiếng Việt có tính thực tế.
- Tách repository/service contract khỏi mock implementation.
- Hoàn thiện conversation list, message list, composer và info panel.
- Có loading, empty và error state.

#### Bước 4 — Tương tác chat, danh bạ và nhóm

- Gửi, reply, reaction, sửa và xóa tin nhắn mock.
- Tìm người, mở DM, tạo nhóm và xem thành viên.
- Xử lý IME tiếng Việt, optimistic state, retry và timer cleanup.

#### Bước 5 — File và call UX mô phỏng

- Chọn file, preview, progress, cancel và retry ở mức demo.
- Mô phỏng ringing, accepted, declined, reconnecting và ended.
- Gắn nhãn rõ phần chưa truyền media thật.

#### Bước 6 — Hoàn thiện và kiểm tra demo

- Kiểm tra responsive, keyboard, focus, text/file name dài và dữ liệu rỗng.
- Chạy lint, typecheck, build và browser checks.
- Hoàn thiện profile, settings, search và call history cần thiết cho buổi demo.

#### Bước 7 — Đóng gói và lấy phản hồi

- Deploy demo HTTPS.
- Chuẩn bị demo guide và kịch bản trình bày.
- Ghi chức năng mô phỏng, hạn chế và phản hồi khách hàng.

#### Bước 8 — Chốt scope sản phẩm thật

- Chuyển phản hồi đã duyệt thành backlog.
- Chốt MVP, role, membership, privacy và giới hạn sản phẩm.
- Không mang mọi ý tưởng từ demo sang production nếu chưa được duyệt.

### Phần 2 — Hệ thống thật theo vertical slices

#### Bước 9 — Thiết kế dữ liệu và API

- Thiết kế user, session, device, conversation, member, message, reaction,
  attachment, read state, call và notification.
- Chốt REST DTO, Socket.IO events, error format, pagination và idempotency.

#### Bước 10 — Backend và môi trường local

- Khởi tạo NestJS, PostgreSQL, Prisma và migration.
- Thêm Redis và object storage local khi có consumer thực tế.
- Tạo `.env.example`, Docker Compose và health check.

#### Bước 11 — Auth và session đa thiết bị

- Register, login, logout, refresh/revoke và `GET /me`.
- Web dùng cookie HttpOnly phù hợp; mobile dùng rotating refresh token trong
  secure storage.
- Rate limit, password hashing, email verification/reset và audit cần thiết.

#### Bước 12 — Conversation và message API

- Conversation list, direct/group creation, membership và cursor pagination.
- Gửi/sửa/xóa/reaction với authorization ở backend.
- Tích hợp web qua API adapter thay vì thay đổi UI contract.

#### Bước 13 — Realtime và presence

- Socket authentication.
- Room theo user và conversation.
- Message/reaction/read/member events.
- Presence và typing có TTL/throttling.

#### Bước 14 — Reconnect, outbox và chống trùng

- `clientMessageId` và unique constraint.
- ACK, retry, reconnect cursor và fetch dữ liệu bị thiếu.
- Web dùng IndexedDB, mobile dùng SQLite khi cần giữ outbox qua restart.

#### Bước 15 — File thật

- Presigned upload, direct-to-storage và finalize metadata.
- Progress, cancel, retry, checksum và cleanup upload dở.
- Download authorization, quota và validation MIME/size.

#### Bước 16 — Search, notification và quản lý người dùng

- Search cơ bản bằng PostgreSQL trước.
- Notification settings, block/report và profile management.
- Chỉ thêm search engine riêng khi số liệu chứng minh PostgreSQL không đủ.

#### Bước 17 — WebRTC/LiveKit proof of concept

- Backend cấp token LiveKit ngắn hạn sau khi kiểm tra quyền.
- Thử web-web và web-mobile trên thiết bị thật.
- Kiểm tra camera/microphone permission, TURN và mạng khó.
- Tạo Expo development build spike trước khi hoàn thiện mobile UI.

#### Bước 18 — Call web và call state

- Direct/group call, participant state và call history.
- Xử lý webhook idempotent, timeout, decline, busy, reconnect và end reason.

#### Bước 19 — Staging

- Web, API, PostgreSQL, Redis, storage và LiveKit trên môi trường staging.
- HTTPS, secret management, migration, backup, metrics và alert cơ bản.
- Thực tế nên tạo staging tối thiểu sớm hơn, ngay khi vertical slice đầu tiên chạy.

#### Bước 20 — Mobile chat và file

- React Native + Expo development build.
- Login, conversation, message, file, SQLite cache và secure storage.
- Kết nối cùng API/Socket.IO và tài khoản với web.
- Không xem responsive web là ứng dụng mobile hoàn chỉnh.

#### Bước 21 — Push và mobile call lifecycle

- Push token registration, rotation, deep link và notification settings.
- LiveKit trên mobile.
- Incoming call ở foreground/background/terminated.
- Spike CallKit trên iOS và Telecom/foreground service trên Android.

#### Bước 22 — Privacy, moderation và account lifecycle

- Account deletion, retention, data export và file cleanup.
- Block/report, audit và privacy policy.
- Quyết định tác động của xóa tài khoản lên message và backup.

#### Bước 23 — Security, sync và performance verification

- Security review và dependency audit.
- Authorization tests cho REST, socket và file.
- Test 50 concurrent active users, reconnect burst, upload song song và call nhóm.
- Theo dõi latency, error rate, CPU/RAM, DB pool, Redis và media metrics.

#### Bước 24 — Store readiness

- Bundle/application IDs, signing, icons, screenshots và store metadata.
- Permission descriptions, privacy disclosure và account deletion flow.
- TestFlight và Android internal testing.

#### Bước 25 — Pilot và vận hành

- Pilot với nhóm người dùng giới hạn.
- Theo dõi error, latency, push, upload và call join failures.
- Duy trì API compatibility với mobile app cũ.
- Có rollback, incident response và bàn giao vận hành.

## Điều chỉnh bắt buộc so với thứ tự gốc

Roadmap trên không nên được thực hiện như một chuỗi cứng 1–25. Các thay đổi sau
được xem là định hướng ưu tiên:

1. Tạo mobile skeleton ngay sau khi auth và conversation API đầu tiên hoạt động.
2. Tạo staging tối thiểu sau vertical slice đầu tiên, không chờ hoàn thiện call.
3. Thực hiện security baseline từ khi bắt đầu backend.
4. Chạy load test tăng dần sau API, realtime, upload và call.
5. Thử LiveKit web-mobile và push/call lifecycle trước khi đầu tư toàn bộ call UI.
6. Triển khai từng vertical slice chạy xuyên từ client đến database.

Vertical slices ưu tiên:

```text
1. Register/login web + mobile
2. Conversation list + message pagination
3. Send message + Socket.IO + reconnect
4. Group creation + membership
5. Attachment upload
6. Push notification
7. Audio/video call
```

## Các yêu cầu phi chức năng cần duy trì

### Security

- Không commit secret hoặc credential.
- Không log password, token, cookie hoặc nội dung nhạy cảm.
- Rate limit auth và endpoint tốn tài nguyên.
- Kiểm tra membership ở REST, socket, file và call token endpoint.
- Có session revocation và secret rotation.

### Observability

- Structured logging và correlation ID.
- API latency, error rate và DB pool metrics.
- Socket connection, reconnect và delivery latency.
- Queue depth, upload failure, push failure và call join failure.

### Backup và phục hồi

- PostgreSQL backup tự động.
- Restore rehearsal.
- Object storage lifecycle/versioning phù hợp.
- Migration và rollback/forward-fix procedure.
- RPO/RTO được định nghĩa trước pilot.

### Mục tiêu kiểm chứng ban đầu

- 50 Socket.IO connections đồng thời.
- Burst gửi/nhận tin nhắn có kiểm soát.
- Message không mất và không trùng khi retry/reconnect.
- API p95 và realtime delivery p95 được đo trên staging.
- Upload song song, gồm file gần giới hạn.
- Call web-mobile trên thiết bị và mạng thật.
- Group call tối đa 8 người trong test room.

## Tiêu chí chọn công nghệ mới

Chỉ thêm một công nghệ khi:

1. Có vấn đề cụ thể cần giải quyết.
2. Đã xác định consumer và owner.
3. Có cách kiểm thử và vận hành.
4. Chi phí phức tạp thấp hơn lợi ích nhận được.

Không thêm microservices, Kubernetes, Kafka, Elasticsearch, sharding hoặc
multi-region chỉ để chuẩn bị cho quy mô chưa tồn tại.

## Ghi chú sử dụng

Khi tạo task từ tài liệu này:

- Chọn một vertical slice nhỏ.
- Ghi acceptance criteria trước khi sửa code.
- Phân biệt rõ mock, staging-ready và production-ready.
- Chạy kiểm tra phù hợp và ghi kết quả thực tế.
- Không tuyên bố năng lực tải, bảo mật hoặc độ tin cậy khi chưa kiểm chứng.
