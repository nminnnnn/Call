import type { ChatDataSources } from "./data-sources";
import { MockAttachmentService } from "./mock/mock-attachment-service";
import { MockCallService } from "./mock/mock-call-service";
import { MockConversationRepository } from "./mock/mock-conversation-repository";
import { MockMessageRepository } from "./mock/mock-message-repository";
import { createMockStore } from "./mock/mock-store";
import { MockUserRepository } from "./mock/mock-user-repository";

export function createDataSources(): ChatDataSources {
  const store = createMockStore();
  return {
    users: new MockUserRepository(store),
    conversations: new MockConversationRepository(store),
    messages: new MockMessageRepository(store),
    attachments: new MockAttachmentService(store),
    calls: new MockCallService(),
  };
}
