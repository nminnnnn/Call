import type { Message, UpdateMessageInput, SendMessageInput } from "@job-call/contracts";
import type { MessageRepository } from "../message-repository";
import { currentUserId } from "./seed-data";
import { delay, type MockStore } from "./mock-store";

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
    return delay(message, 420);
  }

  async update(input: UpdateMessageInput) {
    const message = this.requireOwnMessage(input.messageId);
    const body = input.body.trim();
    if (!body) throw new Error("Message body is required");
    message.body = body;
    message.editedAt = new Date().toISOString();
    this.refreshConversationPreview(message.conversationId);
    return delay(message, 220);
  }

  async deleteMessage(messageId: string) {
    const message = this.requireOwnMessage(messageId);
    this.store.messages = this.store.messages.filter((item) => item.id !== messageId);
    const conversation = this.refreshConversationPreview(message.conversationId);
    return delay({ messageId, conversationId: message.conversationId, conversation }, 220);
  }

  async toggleReaction(messageId: string, emoji: string) {
    const message = this.store.messages.find((item) => item.id === messageId);
    if (!message) throw new Error("Message not found");
    const reaction = message.reactions.find((item) => item.emoji === emoji);
    if (!reaction) message.reactions.push({ emoji, userIds: [currentUserId] });
    else if (reaction.userIds.includes(currentUserId)) reaction.userIds = reaction.userIds.filter((id) => id !== currentUserId);
    else reaction.userIds.push(currentUserId);
    return delay(message, 140);
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
}
