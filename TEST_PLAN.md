# TEST_PLAN

## Frontend Demo

- Build TypeScript.
- Kiểm tra desktop và mobile responsive.
- Kiểm tra empty/loading/error state.
- Gửi text message.
- Gửi message có file preview.
- Retry message failed.
- Reaction và reply.
- Tạo nhóm.
- Mở profile modal.
- Mock audio/video call: ringing, active, mute, camera, end.

## Backend Production Sau Này

- Unit test service validation và permission.
- Integration test REST API với PostgreSQL test database.
- Socket.IO test: auth, join room, reconnect, presence, unauthorized event.
- File upload test: presigned URL, size limit 25MB, max 5 files, finalize metadata.
- Cursor pagination test: không load toàn bộ lịch sử.
- Security test: user ngoài conversation không đọc message/file và không nhận event.
- Backup/restore database rehearsal.

## Load Test Cần Có Trước Khi Claim

- 50 concurrent active users gửi/nhận chat realtime.
- Burst typing/presence event.
- Upload file song song, gồm file gần 25MB.
- Call nhóm tối đa 8 người qua LiveKit test room.
- Theo dõi latency, error rate, CPU/RAM, DB connection, Redis metrics.
