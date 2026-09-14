# Mạch Web Demo

Web demo cho ứng dụng giao tiếp công việc, được tổ chức dưới dạng pnpm workspace. Bước 3 hiện có màn hình chat đầy đủ, dữ liệu công việc tiếng Việt, UI primitives và lớp repository/service giả lập tách khỏi component.

## Cách chạy

Máy đã có lệnh `pnpm`:

```bash
pnpm install
pnpm dev
```

Nếu Windows chưa bật pnpm shim nhưng có Node.js/Corepack:

```bash
corepack pnpm install
corepack pnpm dev
```

Mở địa chỉ Vite hiển thị trong terminal. Các lệnh kiểm tra:

```bash
corepack pnpm lint
corepack pnpm build
corepack pnpm --filter @job-call/web check:visual
```

`check:visual` cần dev server đang chạy và dùng Edge đã cài trên máy. Có thể truyền `BASE_URL` nếu server không ở `http://localhost:5175`.

## Cấu trúc

```text
apps/
  web/                    React, Vite, TypeScript, Tailwind, React Router
packages/
  contracts/              Kiểu dữ liệu dùng chung giữa UI và adapter
  design-tokens/          Màu, typography, spacing và focus tokens
docs/
  DESIGN_SYSTEM.md        Quy ước giao diện và responsive
```

Component không import mock data. `WorkspaceShell` chỉ phối hợp `UserRepository`, `ConversationRepository`, `MessageRepository`, `AttachmentService` và `CallService`; dữ liệu demo nằm trong mock implementation để có thể thay bằng API adapter ở giai đoạn backend.

Chưa có backend, database, realtime, file storage hoặc WebRTC thật. Không có tuyên bố chịu tải 1.000 user/50 concurrent trước khi load test.
