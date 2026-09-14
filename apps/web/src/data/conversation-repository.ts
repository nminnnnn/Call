import type { ConversationSummary, CreateGroupInput } from "@job-call/contracts";

export interface ConversationRepository {
  list(): Promise<ConversationSummary[]>;
  getById(id: string): Promise<ConversationSummary | undefined>;
  createGroup(input: CreateGroupInput): Promise<ConversationSummary>;
  markAsRead(id: string): Promise<ConversationSummary>;
}
