import type { CreateGroupInput, UpdateGroupInput, UpdateGroupMembersInput } from "@job-call/contracts";
import type { ConversationRepository } from "../conversation-repository";
import { delay, persistMockStore, type MockStore } from "./mock-store";
import { currentUserId } from "./seed-data";

export class MockConversationRepository implements ConversationRepository {
  constructor(private readonly store: MockStore) {}

  async list() {
    return delay([...this.store.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }

  async getById(id: string) {
    return delay(this.store.conversations.find((item) => item.id === id));
  }

  async getOrCreateDirect(userId: string) {
    if (userId === currentUserId) throw new Error("Cannot start a direct conversation with yourself");
    const user = this.store.users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");
    const existing = this.store.conversations.find((item) => item.kind === "direct" && item.participantIds.includes(currentUserId) && item.participantIds.includes(userId));
    if (existing) return delay(existing, 180);
    const conversation = {
      id: `direct-${crypto.randomUUID()}`,
      kind: "direct" as const,
      title: user.name,
      initials: user.initials,
      avatarUrl: user.avatarUrl,
      participantIds: [currentUserId, userId],
      lastMessage: "Chưa có tin nhắn",
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
      typingUserIds: [],
    };
    this.store.conversations.push(conversation);
    persistMockStore(this.store);
    return delay(conversation, 240);
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
      memberRoles: { [currentUserId]: "owner" as const, ...Object.fromEntries(memberIds.map((id) => [id, "member" as const])) },
    };
    this.store.conversations.push(conversation);
    persistMockStore(this.store);
    return delay(conversation, 360);
  }

  async updateGroup(input: UpdateGroupInput) {
    const conversation = this.requireManagedGroup(input.conversationId);
    const title = input.title.trim();
    if (!title) throw new Error("Group name is required");
    conversation.title = title;
    conversation.initials = groupInitials(title);
    persistMockStore(this.store);
    return delay(conversation, 220);
  }

  async updateGroupMembers(input: UpdateGroupMembersInput) {
    const conversation = this.requireManagedGroup(input.conversationId);
    const additions = [...new Set(input.addUserIds ?? [])].filter((id) => id !== currentUserId && !conversation.participantIds.includes(id));
    const removals = [...new Set(input.removeUserIds ?? [])].filter((id) => id !== currentUserId);
    if (additions.some((id) => !this.store.users.some((user) => user.id === id))) throw new Error("One or more group members could not be found");
    const remaining = conversation.participantIds.filter((id) => !removals.includes(id));
    if (remaining.length < 2) throw new Error("A group needs at least two members");
    conversation.participantIds = [...remaining, ...additions];
    const roles = { ...this.memberRoles(conversation) };
    removals.forEach((id) => delete roles[id]);
    additions.forEach((id) => { roles[id] = "member"; });
    Object.entries(input.roles ?? {}).forEach(([id, role]) => {
      if (id !== currentUserId && conversation.participantIds.includes(id) && role !== "owner") roles[id] = role;
    });
    roles[currentUserId] = "owner";
    conversation.memberRoles = roles;
    persistMockStore(this.store);
    return delay(conversation, 240);
  }

  async markAsRead(id: string) {
    const conversation = this.require(id);
    conversation.unreadCount = 0;
    persistMockStore(this.store);
    return delay(conversation, 100);
  }

  private requireManagedGroup(id: string) {
    const conversation = this.require(id);
    if (conversation.kind !== "group") throw new Error("Only groups can be managed");
    const role = this.memberRoles(conversation)[currentUserId];
    if (role !== "owner" && role !== "admin") throw new Error("You do not have permission to manage this group");
    return conversation;
  }

  private memberRoles(conversation: MockStore["conversations"][number]) {
    return conversation.memberRoles ?? Object.fromEntries(conversation.participantIds.map((id) => [id, id === currentUserId ? "owner" : "member"]));
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
