import type { DeleteMessageResult, Message, MessagePage, SendMessageInput, UpdateMessageInput } from "@job-call/contracts";

export interface MessageRepository {
  list(conversationId: string, cursor?: string): Promise<MessagePage>;
  send(input: SendMessageInput): Promise<Message>;
  update(input: UpdateMessageInput): Promise<Message>;
  deleteMessage(messageId: string): Promise<DeleteMessageResult>;
  toggleReaction(messageId: string, emoji: string): Promise<Message>;
}
