import type { Attachment, ConversationSummary, Message, Person } from "@job-call/contracts";
import { useEffect, useMemo, useRef, useState } from "react";
import { dateKey, formatDateDivider } from "../../lib/date";
import { EmptyState, Skeleton } from "../ui";
import { DateDivider } from "./date-divider";
import { MessageItem } from "./message-item";
import { TypingIndicator } from "./typing-indicator";
import { UnreadDivider } from "./unread-divider";

export function MessageList({ conversation, messages, attachments, people, currentUserId, loading, typingUsers, onReply, onReaction, onEdit, onDelete, onRetry }: { conversation: ConversationSummary; messages: Message[]; attachments: Map<string, Attachment>; people: Map<string, Person>; currentUserId: string; loading: boolean; typingUsers: Person[]; onReply: (message: Message) => void; onReaction: (messageId: string, emoji: string) => void; onEdit: (messageId: string, body: string) => Promise<void>; onDelete: (messageId: string) => Promise<void>; onRetry: (messageId: string) => Promise<void> }) {
  const unreadRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const previousConversationIdRef = useRef(conversation.id);
  const previousMessageCountRef = useRef(messages.length);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const messagesById = useMemo(() => new Map(messages.map((message) => [message.id, message])), [messages]);
  const unreadStart = useMemo(() => {
    if (!conversation.unreadCount) return -1;
    if (conversation.lastReadMessageId) {
      const readIndex = messages.findIndex((message) => message.id === conversation.lastReadMessageId);
      if (readIndex >= 0) return readIndex + 1;
    }
    return Math.max(0, messages.length - conversation.unreadCount);
  }, [conversation.lastReadMessageId, conversation.unreadCount, messages]);

  useEffect(() => {
    const timer = window.setTimeout(() => (unreadRef.current ?? bottomRef.current)?.scrollIntoView({ block: unreadRef.current ? "center" : "end" }), 40);
    previousConversationIdRef.current = conversation.id;
    previousMessageCountRef.current = messages.length;
    setNewMessageCount(0);
    return () => window.clearTimeout(timer);
  }, [conversation.id, loading]);

  useEffect(() => {
    if (previousConversationIdRef.current !== conversation.id) return;
    const added = messages.length - previousMessageCountRef.current;
    previousMessageCountRef.current = messages.length;
    if (added <= 0) return;
    const feed = feedRef.current;
    const nearBottom = !feed || feed.scrollHeight - feed.scrollTop - feed.clientHeight < 96;
    if (nearBottom) bottomRef.current?.scrollIntoView({ block: "end" });
    else setNewMessageCount((count) => count + added);
  }, [conversation.id, messages.length]);

  function handleScroll() {
    const feed = feedRef.current;
    if (feed && feed.scrollHeight - feed.scrollTop - feed.clientHeight < 96) setNewMessageCount(0);
  }

  function jumpToNewMessages() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setNewMessageCount(0);
  }

  if (loading) return <div className="message-feed"><div className="message-skeletons"><Skeleton width="42%" height={58} /><Skeleton width="54%" height={70} /><Skeleton width="36%" height={58} /></div></div>;
  if (!messages.length) return <div className="message-feed"><EmptyState title="Chưa có tin nhắn" description="Hãy gửi lời chào hoặc chia sẻ cập nhật đầu tiên." /></div>;

  return (
    <div className="message-feed" ref={feedRef} onScroll={handleScroll}>
      {messages.map((message, index) => {
        const reply = message.replyToId ? messagesById.get(message.replyToId) : undefined;
        const showDate = index === 0 || dateKey(messages[index - 1].createdAt) !== dateKey(message.createdAt);
        const messageAttachments = message.attachmentIds.map((id) => attachments.get(id)).filter(Boolean) as Attachment[];
        return <div key={message.id}>{showDate && <DateDivider label={formatDateDivider(message.createdAt)} />}{index === unreadStart && <UnreadDivider ref={unreadRef} count={conversation.unreadCount} />}<MessageItem message={message} author={people.get(message.authorId)} currentUserId={currentUserId} replyMessage={reply} replyAuthor={reply ? people.get(reply.authorId) : undefined} attachments={messageAttachments} onReply={onReply} onReaction={onReaction} onEdit={onEdit} onDelete={onDelete} onRetry={onRetry} /></div>;
      })}
      <TypingIndicator users={typingUsers} />
      {newMessageCount > 0 && <button type="button" className="new-message-button" onClick={jumpToNewMessages}>{newMessageCount} tin nhắn mới</button>}
      <div ref={bottomRef} />
    </div>
  );
}
