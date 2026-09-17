import type { ConversationSummary, CreateGroupInput, UpdateGroupInput, UpdateGroupMembersInput } from "@job-call/contracts";

export interface ConversationRepository {
  list(): Promise<ConversationSummary[]>;
  getById(id: string): Promise<ConversationSummary | undefined>;
  getOrCreateDirect(userId: string): Promise<ConversationSummary>;
  createGroup(input: CreateGroupInput): Promise<ConversationSummary>;
  updateGroup(input: UpdateGroupInput): Promise<ConversationSummary>;
  updateGroupMembers(input: UpdateGroupMembersInput): Promise<ConversationSummary>;
  markAsRead(id: string): Promise<ConversationSummary>;
}
