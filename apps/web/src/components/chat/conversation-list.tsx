import type { ConversationSummary } from "@job-call/contracts";
import { EmptyState, Skeleton } from "../ui";
import { ConversationListItem } from "./conversation-list-item";

export function ConversationList({ conversations, selectedId, loading, hasQuery, onSelect }: { conversations: ConversationSummary[]; selectedId?: string; loading: boolean; hasQuery: boolean; onSelect: (id: string) => void }) {
  if (loading) return <div className="conversation-list">{Array.from({ length: 7 }).map((_, index) => <div className="conversation-skeleton" key={index}><Skeleton width="44px" height={44} /><span><Skeleton width="58%" /><Skeleton width="88%" height={12} /></span></div>)}</div>;
  if (!conversations.length) return <div className="conversation-list"><EmptyState title={hasQuery ? "Không tìm thấy" : "Chưa có hội thoại"} description={hasQuery ? "Thử tên hoặc nội dung khác." : "Hội thoại mới sẽ xuất hiện tại đây."} /></div>;
  return <div className="conversation-list">{conversations.map((conversation) => <ConversationListItem key={conversation.id} conversation={conversation} selected={conversation.id === selectedId} onSelect={() => onSelect(conversation.id)} />)}</div>;
}
