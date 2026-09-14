import type { CreateGroupInput } from "@job-call/contracts";
import type { ConversationRepository } from "../conversation-repository";
import { delay, type MockStore } from "./mock-store";
import { currentUserId } from "./seed-data";

export class MockConversationRepository implements ConversationRepository {
  constructor(private readonly store: MockStore) {}

  async list() {
    return delay([...this.store.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }

  async getById(id: string) {
    return delay(this.store.conversations.find((item) => item.id === id));
  }

  async createGroup(input: CreateGroupInput) {
    const title = input.title.trim();
    const memberIds = [...new Set(input.memberIds)].filter((id) => id !== currentUserId);
    if (!title) throw new Error("Group name is required");
    if (!memberIds.length) throw new Error("At least one member is required");
    if (memberIds.some((id) => !this.store.users.some((user) => user.id === id))) {
      throw new Error("One or more group members could not be found");
    }

    const now = new Date().toISOString();
    const conversation = {
      id: `group-${crypto.randomUUID()}`,
      kind: "group" as const,
      title,
      initials: groupInitials(title),
      participantIds: [currentUserId, ...memberIds],
      lastMessage: "Chưa có tin nhắn",
      updatedAt: now,
      unreadCount: 0,
      typingUserIds: [],
    };
    this.store.conversations.push(conversation);
    return delay(conversation, 360);
  }

  async markAsRead(id: string) {
    const conversation = this.require(id);
    conversation.unreadCount = 0;
    return delay(conversation, 100);
  }

  private require(id: string) {
    const conversation = this.store.conversations.find((item) => item.id === id);
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
  }
}

function groupInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase("vi"))
    .join("");
}
