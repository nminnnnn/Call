import type { Message, UpdateMessageInput, SendMessageInput } from "@job-call/contracts";
import type { MessageRepository } from "../message-repository";
import { currentUserId } from "./seed-data";
import { delay, persistMockStore, type MockStore } from "./mock-store";

const PAGE_SIZE = 50;

export class MockMessageRepository implements MessageRepository {
  constructor(private readonly store: MockStore) {}

  async list(conversationId: string, cursor?: string) {
    const all = this.store.messages
      .filter((item) => item.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const end = cursor ? Math.max(0, all.findIndex((item) => item.id === cursor)) : all.length;
    const start = Math.max(0, end - PAGE_SIZE);
    return delay({ items: all.slice(start, end), nextCursor: start > 0 ? all[start].id : undefined });
  }

  async send(input: SendMessageInput) {
    if (input.simulateFailure) {
      await delay(undefined, 420);
      throw new Error("Simulated send failure");
    }
    const message: Message = {
      id: crypto.randomUUID(),
      conversationId: input.conversationId,
      authorId: currentUserId,
      body: input.body,
      createdAt: new Date().toISOString(),
      status: "sent",
      replyToId: input.replyToId,
      attachmentIds: input.attachmentIds ?? [],
      reactions: [],
    };
    this.store.messages.push(message);
    const conversation = this.store.conversations.find((item) => item.id === input.conversationId);
    if (conversation) {
      conversation.lastMessage = input.body || (message.attachmentIds.length ? "Đã gửi một tệp đính kèm" : "Tin nhắn mới");
      conversation.updatedAt = message.createdAt;
      conversation.unreadCount = 0;
    }
    persistMockStore(this.store);
    return delay(message, 420);
  }

  async update(input: UpdateMessageInput) {
    const message = this.requireOwnMessage(input.messageId);
    const body = input.body.trim();
    if (!body) throw new Error("Message body is required");
    message.body = body;
    message.editedAt = new Date().toISOString();
    this.refreshConversationPreview(message.conversationId);
    persistMockStore(this.store);
    return delay(message, 220);
  }

  async deleteMessage(messageId: string) {
    const message = this.requireOwnMessage(messageId);
    this.store.messages = this.store.messages.filter((item) => item.id !== messageId);
    const conversation = this.refreshConversationPreview(message.conversationId);
    persistMockStore(this.store);
    return delay({ messageId, conversationId: message.conversationId, conversation }, 220);
  }

  async toggleReaction(messageId: string, emoji: string) {
    const message = this.store.messages.find((item) => item.id === messageId);
    if (!message) throw new Error("Message not found");
    const reaction = message.reactions.find((item) => item.emoji === emoji);
    if (!reaction) message.reactions.push({ emoji, userIds: [currentUserId] });
    else if (reaction.userIds.includes(currentUserId)) reaction.userIds = reaction.userIds.filter((id) => id !== currentUserId);
    else reaction.userIds.push(currentUserId);
    persistMockStore(this.store);
    return delay(message, 140);
  }

  async setSimulatedTyping(conversationId: string, active: boolean) {
    const conversation = this.requireConversation(conversationId);
    const responderId = this.responderId(conversationId);
    conversation.typingUserIds = active && responderId ? [responderId] : [];
    persistMockStore(this.store);
    return delay(conversation, 100);
  }

  async simulateReply(conversationId: string) {
    const conversation = this.requireConversation(conversationId);
    const responderId = this.responderId(conversationId);
    if (!responderId) throw new Error("No simulated responder is available");
    const replies = [
      "Mình đã nhận được, mình sẽ cập nhật lại trong ít phút.",
      "Cảm ơn, phần này đã rõ. Mình sẽ kiểm tra và phản hồi tiếp.",
      "Đã ghi nhận. Mình đồng ý với hướng xử lý này.",
    ];
    const priorReplyCount = this.store.messages.filter((message) => message.conversationId === conversationId && message.authorId === responderId && message.id.startsWith("sim-" )).length;
    const message: Message = {
      id: `sim-${crypto.randomUUID()}`,
      conversationId,
      authorId: responderId,
      body: replies[priorReplyCount % replies.length],
      createdAt: new Date().toISOString(),
      status: "sent",
      attachmentIds: [],
      reactions: [],
    };
    this.store.messages.push(message);
    conversation.typingUserIds = [];
    conversation.lastMessage = message.body;
    conversation.updatedAt = message.createdAt;
    conversation.unreadCount += 1;
    persistMockStore(this.store);
    return delay({ message, conversation }, 260);
  }

  private requireOwnMessage(messageId: string) {
    const message = this.store.messages.find((item) => item.id === messageId);
    if (!message) throw new Error("Message not found");
    if (message.authorId !== currentUserId) throw new Error("Cannot change another user's message");
    return message;
  }

  private refreshConversationPreview(conversationId: string) {
    const conversation = this.store.conversations.find((item) => item.id === conversationId);
    if (!conversation) return undefined;
    const latest = this.store.messages
      .filter((item) => item.conversationId === conversationId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    conversation.lastMessage = latest ? latest.body || (latest.attachmentIds.length ? "Đã gửi một tệp đính kèm" : "Tin nhắn mới") : "Chưa có tin nhắn";
    conversation.updatedAt = latest?.createdAt ?? new Date().toISOString();
    return conversation;
  }

  private requireConversation(conversationId: string) {
    const conversation = this.store.conversations.find((item) => item.id === conversationId);
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
  }

  private responderId(conversationId: string) {
    return this.requireConversation(conversationId).participantIds.find((id) => id !== currentUserId);
  }
}
