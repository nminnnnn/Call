import type { AttachmentService } from "./attachment-service";
import type { CallService } from "./call-service";
import type { ConversationRepository } from "./conversation-repository";
import type { MessageRepository } from "./message-repository";
import type { UserRepository } from "./user-repository";

export interface ChatDataSources {
  users: UserRepository;
  conversations: ConversationRepository;
  messages: MessageRepository;
  attachments: AttachmentService;
  calls: CallService;
}
