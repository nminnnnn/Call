# Mạch Web Demo

Web demo giao tiếp công việc bằng React, Vite và TypeScript. `Job_Call` là repository chính; runtime hiện dùng mock adapters và không có backend production.

## Chạy local

```bash
corepack pnpm install
corepack pnpm dev
```

Mở URL Vite hiển thị trong terminal, sau đó dùng:

- Email: `minhanh@mach.demo`
- Mật khẩu: `Demo1234!`
- Hoặc nút **Trải nghiệm demo**.

## Kiểm tra

```bash
corepack pnpm lint
corepack pnpm build
corepack pnpm --filter @job-call/web check:auth
corepack pnpm --filter @job-call/web check:visual
corepack pnpm --filter @job-call/web check:group
```

Các browser check cần dev server đang chạy và Microsoft Edge. Có thể đặt `BASE_URL`; mặc định script dùng URL ghi trong từng script.

## Cấu trúc

```text
apps/web/                 React/Vite client và mock adapters
packages/contracts/       Kiểu dữ liệu dùng chung qua data boundary
packages/design-tokens/   Token giao diện
docs/DESIGN_SYSTEM.md     Quy ước UI và responsive
docs/CLIENT_FEEDBACK.md   Mẫu thu phản hồi khách
```

Component không import seed data trực tiếp. `WorkspaceShell` phối hợp `UserRepository`, `ConversationRepository`, `MessageRepository`, `AttachmentService` và `CallService`; mock implementations nằm trong `apps/web/src/data/mock`.

## Tài liệu

- [Project brief](PROJECT_BRIEF.md)
- [Roadmap](ROADMAP.md)
- [Demo guide](DEMO_GUIDE.md)
- [Test plan](TEST_PLAN.md)
- [API contract định hướng](API_CONTRACT.md)
- [Client feedback](docs/CLIENT_FEEDBACK.md)

Phiên đăng nhập, chat, file, presence và call hiện đều là demo/mô phỏng. Chưa có auth production, backend, database, realtime, object storage hoặc WebRTC/LiveKit thật.
