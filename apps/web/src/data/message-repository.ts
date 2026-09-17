import type { ConversationSummary, DeleteMessageResult, Message, MessagePage, SendMessageInput, SimulatedReplyResult, UpdateMessageInput } from "@job-call/contracts";

export interface MessageRepository {
  list(conversationId: string, cursor?: string): Promise<MessagePage>;
  send(input: SendMessageInput): Promise<Message>;
  update(input: UpdateMessageInput): Promise<Message>;
  deleteMessage(messageId: string): Promise<DeleteMessageResult>;
  toggleReaction(messageId: string, emoji: string): Promise<Message>;
  setSimulatedTyping(conversationId: string, active: boolean): Promise<ConversationSummary>;
  simulateReply(conversationId: string): Promise<SimulatedReplyResult>;
}
