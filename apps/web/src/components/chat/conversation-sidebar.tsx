import type { ConversationSummary } from "@job-call/contracts";
import { Plus } from "lucide-react";
import { IconButton, Tooltip } from "../ui";
import { ConversationList } from "./conversation-list";
import { ConversationSearch } from "./conversation-search";

export function ConversationSidebar({ conversations, selectedId, query, loading, onQuery, onSelect, onCreateGroup }: { conversations: ConversationSummary[]; selectedId?: string; query: string; loading: boolean; onQuery: (value: string) => void; onSelect: (id: string) => void; onCreateGroup: () => void }) {
  return (
    <aside className="conversation-sidebar">
      <header className="sidebar-header"><div><span className="section-kicker">Không gian làm việc</span><h1>Tin nhắn</h1></div><Tooltip label="Tạo nhóm"><IconButton label="Tạo nhóm" data-dialog-return-focus="true" onClick={(event) => { event.currentTarget.focus(); onCreateGroup(); }}><Plus size={20} /></IconButton></Tooltip></header>
      <ConversationSearch value={query} onChange={onQuery} />
      <ConversationList conversations={conversations} selectedId={selectedId} loading={loading} hasQuery={Boolean(query.trim())} onSelect={onSelect} />
    </aside>
  );
}
