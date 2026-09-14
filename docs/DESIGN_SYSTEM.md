# Design System - Mạch Web

## Mục tiêu

Mạch là ứng dụng giao tiếp phục vụ công việc. Giao diện ưu tiên khả năng đọc, mật độ thông tin vừa phải và thao tác lặp lại nhanh. Bản hiện tại dùng giao diện sáng; dark mode chưa thuộc phạm vi bước 2.

## Nguyên tắc hình ảnh

- Xanh dương biểu thị hành động chính, trạng thái chọn và điểm nhấn.
- Nền trắng và xám trung tính giữ vùng nội dung yên tĩnh, dễ quét.
- Thanh điều hướng xanh đen tạo mốc nhận diện riêng nhưng không sao chép bố cục hay thương hiệu của sản phẩm khác.
- Bán kính góc tối đa phổ biến là `7px`; hạn chế chi tiết trang trí không phục vụ tác vụ.
- Icon dùng Lucide và luôn có nhãn truy cập hoặc tooltip khi ý nghĩa chưa rõ.

## Design tokens

Nguồn chuẩn nằm tại `packages/design-tokens/tokens.css` và được `apps/web` import trực tiếp.

### Màu

| Token | Giá trị | Mục đích |
| --- | --- | --- |
| `--color-brand-600` | `#1764d7` | Nút chính, unread, hành động quan trọng |
| `--color-brand-50` | `#eff6ff` | Trạng thái chọn, hover nhẹ |
| `--color-ink` | `#172033` | Nội dung chính |
| `--color-muted` | `#667085` | Nội dung phụ |
| `--color-canvas` | `#f4f6f9` | Nền ứng dụng |
| `--color-surface` | `#ffffff` | Panel và vùng nội dung |
| `--color-border` | `#e4e9f0` | Đường phân cách |
| `--color-success` | `#168a5b` | Online, hoàn tất |
| `--color-danger` | `#d92d20` | Lỗi, hành động nguy hiểm |

Các cặp chữ/nền chính được chọn để có độ tương phản rõ trên giao diện sáng. Trước production cần chạy kiểm tra accessibility tự động và kiểm tra thủ công theo WCAG.

### Kiểu chữ và khoảng cách

- Font system sans-serif qua `--font-sans`, không phụ thuộc tải font ngoài.
- Cỡ chữ: `12px`, `14px`, `16px`, `18px`, `22px` qua nhóm token `--text-*`.
- Khoảng cách: thang `4`, `8`, `12`, `16`, `20`, `24`, `32px` qua nhóm `--space-*`.
- Focus: `--focus-ring` dùng cho bàn phím và trạng thái focus rõ ràng.

## Component nền

- `Button`: primary, secondary, ghost, danger.
- `IconButton`: nút vuông ổn định, bắt buộc có `label`.
- `Input`, `Textarea`: label tùy chọn, focus rõ, kích thước tối thiểu 40px.
- `Avatar`, `Badge`: nhận diện người dùng, presence và trạng thái ngắn.
- `Dialog`: tác vụ cần tập trung như tạo nhóm.
- `Drawer`: thông tin hội thoại trên tablet/mobile.
- `Dropdown`: nhóm lựa chọn liên quan đến một đối tượng.
- `Tooltip`: giải thích icon trên thiết bị có hover.
- `Toast`: phản hồi ngắn sau thao tác.
- `Skeleton`, `EmptyState`, `ErrorState`: trạng thái tải, rỗng và lỗi.

Các component nằm tại `apps/web/src/components/ui` và đã được dùng trong app shell hoặc màn hình chat mẫu.

## Responsive

| Mức | Bố cục |
| --- | --- |
| Desktop `> 1100px` | Điều hướng, danh sách hội thoại, chat và panel thông tin |
| Tablet `761-1100px` | Điều hướng, danh sách, chat; thông tin mở bằng drawer |
| Mobile `<= 760px` | Danh sách và chat là hai màn hình; chat có nút quay lại |

Không thu nhỏ toàn bộ layout desktop xuống mobile. Thanh điều hướng chuyển xuống đáy ở màn hình danh sách và được ẩn trong màn hình chat để ưu tiên nội dung.

## Quy ước mở rộng

- Component không import mock data.
- Dữ liệu miền dùng kiểu từ `@job-call/contracts`.
- Màu, spacing và focus mới phải bổ sung ở package token trước khi dùng lặp lại.
- Không hardcode trạng thái demo vào UI; interaction đi qua service hoặc state của luồng màn hình.
