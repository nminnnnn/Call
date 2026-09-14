import type { Attachment, ConversationSummary, Message, Person } from "@job-call/contracts";
import { attachmentSeeds, conversationSeeds, messageSeeds, userSeeds } from "./seed-data";

export interface MockStore {
  users: Person[];
  conversations: ConversationSummary[];
  messages: Message[];
  attachments: Attachment[];
}

export function createMockStore(): MockStore {
  return structuredClone({ users: userSeeds, conversations: conversationSeeds, messages: messageSeeds, attachments: attachmentSeeds });
}

export function delay<T>(value: T, duration = 220): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), duration));
}
