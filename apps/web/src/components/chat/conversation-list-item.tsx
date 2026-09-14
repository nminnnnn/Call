import type { ConversationSummary } from "@job-call/contracts";
import { Pin } from "lucide-react";
import { formatConversationTime } from "../../lib/date";
import { Avatar, Badge } from "../ui";

export function ConversationListItem({ conversation, selected, onSelect }: { conversation: ConversationSummary; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`conversation-item ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      <Avatar initials={conversation.initials} name={conversation.title} />
      <span className="conversation-item__body">
        <span className="conversation-item__top"><strong>{conversation.title}</strong><time>{formatConversationTime(conversation.updatedAt)}</time></span>
        <span className="conversation-item__bottom"><span>{conversation.typingUserIds.length ? <i className="typing-preview">đang nhập...</i> : conversation.lastMessage}</span><span className="conversation-item__markers">{conversation.isPinned && <Pin size={12} />}{conversation.unreadCount > 0 && <Badge tone="brand">{conversation.unreadCount}</Badge>}</span></span>
      </span>
    </button>
  );
}
