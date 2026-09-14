export type PresenceStatus = "online" | "away" | "offline";
export type ConversationKind = "direct" | "group";
export type MessageDeliveryStatus = "sending" | "sent" | "read" | "failed";
export type AttachmentKind = "file" | "image";

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  presence: PresenceStatus;
}

export interface ConversationSummary {
  id: string;
  kind: ConversationKind;
  title: string;
  initials: string;
  avatarUrl?: string;
  participantIds: string[];
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  lastReadMessageId?: string;
  typingUserIds: string[];
  isPinned?: boolean;
}

export interface CreateGroupInput {
  title: string;
  memberIds: string[];
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;
  editedAt?: string;
  status: MessageDeliveryStatus;
  replyToId?: string;
  attachmentIds: string[];
  reactions: MessageReaction[];
}

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
}

export interface MessagePage {
  items: Message[];
  nextCursor?: string;
}

export interface SendMessageInput {
  conversationId: string;
  body: string;
  replyToId?: string;
  attachmentIds?: string[];
}

export interface UpdateMessageInput {
  messageId: string;
  body: string;
}

export interface DeleteMessageResult {
  messageId: string;
  conversationId: string;
  conversation?: ConversationSummary;
}

export interface CallSession {
  id: string;
  conversationId: string;
  kind: "audio" | "video";
  state: "ringing" | "active" | "ended";
  startedAt: string;
}
