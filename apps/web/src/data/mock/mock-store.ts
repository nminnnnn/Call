import type { Attachment, ConversationSummary, Message, Person } from "@job-call/contracts";
import { attachmentSeeds, conversationSeeds, messageSeeds, userSeeds } from "./seed-data";

export interface MockStore {
  users: Person[];
  conversations: ConversationSummary[];
  messages: Message[];
  attachments: Attachment[];
}

const DEMO_STORE_KEY = "mach.demo.store";
const DEMO_STORE_VERSION = 1;

export function createMockStore(): MockStore {
  const restored = readPersistedStore();
  return restored ?? structuredClone({ users: userSeeds, conversations: conversationSeeds, messages: messageSeeds, attachments: attachmentSeeds });
}

export function persistMockStore(store: MockStore) {
  const safeAttachments = store.attachments.filter((attachment) => !attachment.url.startsWith("blob:"));
  const payload = JSON.stringify({
    version: DEMO_STORE_VERSION,
    users: store.users,
    conversations: store.conversations,
    messages: store.messages,
    attachments: safeAttachments,
  });
  if (payload.length > 200_000) return;
  window.localStorage.setItem(DEMO_STORE_KEY, payload);
}

export function clearPersistedMockStore() {
  window.localStorage.removeItem(DEMO_STORE_KEY);
}

function readPersistedStore(): MockStore | null {
  try {
    const raw = window.localStorage.getItem(DEMO_STORE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<MockStore> & { version?: number };
    if (value.version !== DEMO_STORE_VERSION || !Array.isArray(value.users) || !Array.isArray(value.conversations) || !Array.isArray(value.messages) || !Array.isArray(value.attachments)) {
      clearPersistedMockStore();
      return null;
    }
    return structuredClone({ users: value.users, conversations: value.conversations, messages: value.messages, attachments: value.attachments });
  } catch {
    clearPersistedMockStore();
    return null;
  }
}

export function delay<T>(value: T, duration = 220): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), duration));
}
