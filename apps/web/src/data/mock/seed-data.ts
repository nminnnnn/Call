import type { Attachment, ConversationSummary, Message, Person } from "@job-call/contracts";

export const currentUserId = "u-01";

export const userSeeds: Person[] = [
  { id: "u-01", name: "Minh Anh", role: "Product Lead", initials: "MA", presence: "online" },
  { id: "u-02", name: "Quang Huy", role: "Backend Engineer", initials: "QH", presence: "online" },
  { id: "u-03", name: "Thanh Mai", role: "Customer Success", initials: "TM", presence: "away" },
  { id: "u-04", name: "Đức Long", role: "Mobile Engineer", initials: "ĐL", presence: "offline" },
  { id: "u-05", name: "Hà My", role: "Product Designer", initials: "HM", presence: "online" },
  { id: "u-06", name: "Thu Trang", role: "QA Engineer", initials: "TT", presence: "online" },
  { id: "u-07", name: "Gia Bảo", role: "Frontend Engineer", initials: "GB", presence: "away" },
  { id: "u-08", name: "Ngọc Linh", role: "Business Analyst", initials: "NL", presence: "online" },
  { id: "u-09", name: "Tuấn Kiệt", role: "DevOps Engineer", initials: "TK", presence: "offline" },
  { id: "u-10", name: "Phương Thảo", role: "HR Partner", initials: "PT", presence: "away" },
  { id: "u-11", name: "Hoàng Nam", role: "Sales Lead", initials: "HN", presence: "online" },
  { id: "u-12", name: "Khánh Vy", role: "Content Specialist", initials: "KV", presence: "offline" },
];

export const attachmentSeeds: Attachment[] = [
  { id: "att-roadmap", kind: "file", fileName: "ke-hoach-phat-hanh-q4.pdf", mimeType: "application/pdf", sizeBytes: 842_000, url: "#ke-hoach-phat-hanh-q4" },
  { id: "att-report", kind: "file", fileName: "bao-cao-kiem-thu.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sizeBytes: 1_280_000, url: "#bao-cao-kiem-thu" },
  { id: "att-dashboard", kind: "image", fileName: "dashboard-tong-quan.jpg", mimeType: "image/jpeg", sizeBytes: 486_000, url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80" },
  { id: "att-workshop", kind: "image", fileName: "workshop-khach-hang.jpg", mimeType: "image/jpeg", sizeBytes: 624_000, url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=640&q=80" },
  { id: "att-api", kind: "file", fileName: "message-api-contract.yaml", mimeType: "application/yaml", sizeBytes: 38_400, url: "#message-api-contract" },
];

const workMessages = [
  "Mình đã cập nhật tiến độ vào bảng công việc, mọi người kiểm tra giúp nhé.",
  "Phần này cần chốt trước buổi review để đội kỹ thuật còn thời gian xử lý.",
  "Mình vừa rà lại yêu cầu, luồng chính đã khớp với biên bản họp hôm qua.",
  "Có hai trường hợp biên cần bổ sung vào checklist kiểm thử.",
  "Bản thiết kế mới đã dùng token chung và tăng độ tương phản cho nội dung phụ.",
  "API này sẽ dùng cursor pagination, không tải toàn bộ lịch sử tin nhắn.",
  "Môi trường staging đã ổn định, mọi người có thể bắt đầu kiểm tra.",
  "Mình sẽ tổng hợp phản hồi của khách hàng và gửi lại trước 15 giờ.",
  "Ước lượng hiện tại vẫn nằm trong kế hoạch, chưa thấy rủi ro ảnh hưởng mốc bàn giao.",
  "Nhờ mọi người ghi rõ người phụ trách ở từng hạng mục để dễ theo dõi.",
  "Phần nội dung tiếng Việt đã được rà chính tả và thống nhất cách xưng hô.",
  "Sau khi merge, mình sẽ chạy lại build và kiểm tra responsive trên ba viewport.",
];

function makeThread(conversationId: string, authors: string[], count: number, start: string): Message[] {
  const startTime = new Date(start).getTime();
  return Array.from({ length: count }, (_, index) => ({
    id: `${conversationId}-m${String(index + 1).padStart(2, "0")}`,
    conversationId,
    authorId: authors[index % authors.length],
    body: workMessages[index % workMessages.length],
    createdAt: new Date(startTime + index * 47 * 60_000).toISOString(),
    status: index < count - 5 ? "read" : "sent",
    attachmentIds: [],
    reactions: index % 7 === 2 ? [{ emoji: "👍", userIds: ["u-01", "u-05"] }] : [],
  }));
}

const projectThread = makeThread("du-an-mach", ["u-02", "u-05", "u-01", "u-03", "u-07"], 34, "2026-09-12T01:10:00.000Z");
projectThread[9].attachmentIds = ["att-roadmap"];
projectThread[9].body = "Mình gửi kế hoạch phát hành đã cập nhật theo góp ý sáng nay.";
projectThread[15].attachmentIds = ["att-dashboard"];
projectThread[15].body = "Đây là ảnh dashboard ở bản staging, nhờ team xem lại cách hiển thị số liệu.";
projectThread[18].replyToId = projectThread[15].id;
projectThread[18].body = "Mình đã xem ảnh, phần biểu đồ rõ hơn nhiều rồi.";
projectThread[28].attachmentIds = ["att-report"];
projectThread[28].body = "Kết quả kiểm thử mới nhất ở đây, còn hai lỗi mức trung bình.";
projectThread[31].replyToId = projectThread[28].id;
projectThread[31].body = "Hai lỗi này mình nhận xử lý trong chiều nay.";

const engineeringThread = makeThread("engineering", ["u-02", "u-04", "u-07", "u-09", "u-01"], 24, "2026-09-13T02:20:00.000Z");
engineeringThread[6].attachmentIds = ["att-api"];
engineeringThread[6].body = "Mình gửi contract API message để frontend tích hợp mock adapter trước.";
engineeringThread[17].replyToId = engineeringThread[6].id;
engineeringThread[17].body = "Contract ổn, mình đã map xong các trạng thái gửi.";

const shortMessages: Message[] = [
  ["quang-huy-m1", "quang-huy", "u-02", "API contract đã bổ sung cursor và error code như mình thống nhất.", "2026-09-14T08:12:00.000Z"],
  ["thanh-mai-m1", "thanh-mai", "u-03", "Chiều nay mình cùng rà lại kịch bản demo với khách hàng nhé.", "2026-09-14T07:40:00.000Z"],
  ["ha-my-m1", "ha-my", "u-05", "Mình đã cập nhật khoảng cách và trạng thái hover của danh sách.", "2026-09-13T10:25:00.000Z"],
  ["duc-long-m1", "duc-long", "u-04", "Mobile web đã tách danh sách và màn hình chat riêng rồi nhé.", "2026-09-13T08:45:00.000Z"],
  ["thu-trang-m1", "thu-trang", "u-06", "Mình đang bổ sung test cho trường hợp gửi file lỗi.", "2026-09-12T09:15:00.000Z"],
  ["gia-bao-m1", "gia-bao", "u-07", "Build mới đã qua lint, mình sẽ xem tiếp bundle size.", "2026-09-12T06:30:00.000Z"],
  ["san-pham-q4-m1", "san-pham-q4", "u-08", "Phạm vi quý IV đã chốt, tuần này ưu tiên luồng chat nhóm.", "2026-09-14T06:05:00.000Z"],
  ["van-hanh-m1", "van-hanh-khach-hang", "u-03", "Mình gửi ảnh buổi workshop để đội nội dung chọn tư liệu.", "2026-09-13T04:50:00.000Z"],
].map(([id, conversationId, authorId, body, createdAt], index) => ({
  id, conversationId, authorId, body, createdAt,
  status: index < 4 ? "read" : "sent",
  attachmentIds: id === "van-hanh-m1" ? ["att-workshop"] : [],
  reactions: index === 1 ? [{ emoji: "✅", userIds: ["u-01"] }] : [],
}));

export const messageSeeds: Message[] = [...projectThread, ...engineeringThread, ...shortMessages.filter((message) => message.conversationId !== "gia-bao")];

export const conversationSeeds: ConversationSummary[] = [
  { id: "du-an-mach", kind: "group", title: "Dự án Mạch", initials: "DM", participantIds: ["u-01", "u-02", "u-03", "u-05", "u-07"], lastMessage: "Hai lỗi này mình nhận xử lý trong chiều nay.", updatedAt: projectThread.at(-1)!.createdAt, unreadCount: 4, lastReadMessageId: projectThread[29].id, typingUserIds: ["u-05"], isPinned: true },
  { id: "quang-huy", kind: "direct", title: "Quang Huy", initials: "QH", participantIds: ["u-01", "u-02"], lastMessage: shortMessages[0].body, updatedAt: shortMessages[0].createdAt, unreadCount: 0, typingUserIds: [] },
  { id: "thanh-mai", kind: "direct", title: "Thanh Mai", initials: "TM", participantIds: ["u-01", "u-03"], lastMessage: shortMessages[1].body, updatedAt: shortMessages[1].createdAt, unreadCount: 1, typingUserIds: [], lastReadMessageId: undefined },
  { id: "ha-my", kind: "direct", title: "Hà My", initials: "HM", participantIds: ["u-01", "u-05"], lastMessage: shortMessages[2].body, updatedAt: shortMessages[2].createdAt, unreadCount: 0, typingUserIds: [] },
  { id: "duc-long", kind: "direct", title: "Đức Long", initials: "ĐL", participantIds: ["u-01", "u-04"], lastMessage: shortMessages[3].body, updatedAt: shortMessages[3].createdAt, unreadCount: 0, typingUserIds: [] },
  { id: "thu-trang", kind: "direct", title: "Thu Trang", initials: "TT", participantIds: ["u-01", "u-06"], lastMessage: shortMessages[4].body, updatedAt: shortMessages[4].createdAt, unreadCount: 2, typingUserIds: [] },
  { id: "gia-bao", kind: "direct", title: "Gia Bảo", initials: "GB", participantIds: ["u-01", "u-07"], lastMessage: "Chưa có tin nhắn", updatedAt: shortMessages[5].createdAt, unreadCount: 0, typingUserIds: [] },
  { id: "san-pham-q4", kind: "group", title: "Sản phẩm Q4", initials: "Q4", participantIds: ["u-01", "u-05", "u-08", "u-11", "u-12"], lastMessage: shortMessages[6].body, updatedAt: shortMessages[6].createdAt, unreadCount: 2, typingUserIds: ["u-08"] },
  { id: "van-hanh-khach-hang", kind: "group", title: "Vận hành khách hàng", initials: "VH", participantIds: ["u-01", "u-03", "u-08", "u-10", "u-11"], lastMessage: shortMessages[7].body, updatedAt: shortMessages[7].createdAt, unreadCount: 0, typingUserIds: [] },
  { id: "engineering", kind: "group", title: "Engineering", initials: "EN", participantIds: ["u-01", "u-02", "u-04", "u-06", "u-07", "u-09"], lastMessage: engineeringThread.at(-1)!.body, updatedAt: engineeringThread.at(-1)!.createdAt, unreadCount: 3, lastReadMessageId: engineeringThread[20].id, typingUserIds: [], isPinned: true },
];
