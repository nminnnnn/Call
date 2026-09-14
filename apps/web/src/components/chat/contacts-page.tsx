import type { ConversationSummary, Person } from "@job-call/contracts";
import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, EmptyState, ErrorState, Skeleton } from "../ui";

type ContactWithConversation = { person: Person; conversation?: ConversationSummary };

export function ContactsPage({ people, conversations, currentUser, loading, error, onRetry, onSelect }: {
  people: Person[];
  conversations: ConversationSummary[];
  currentUser?: Person;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelect: (conversationId: string) => void;
}) {
  if (error) return <ContactsLayout><ErrorState title="Không thể tải danh bạ" onRetry={onRetry} /></ContactsLayout>;
  if (loading) return <ContactsLayout><ContactsLoading /></ContactsLayout>;

  const contacts = people
    .filter((person) => person.id !== currentUser?.id)
    .map((person): ContactWithConversation => ({
      person,
      conversation: conversations.find((item) => item.kind === "direct" && item.participantIds.includes(person.id) && item.participantIds.includes(currentUser?.id ?? "")),
    }));

  return <ContactsLayout>{!contacts.length ? <EmptyState title="Chưa có liên hệ" description="Danh bạ hiện chưa có đồng nghiệp nào để bắt đầu trò chuyện." /> : <div className="contacts-list" aria-label="Danh sách liên hệ">
    {contacts.map(({ person, conversation }) => <button className="contact-item" key={person.id} type="button" disabled={!conversation} onClick={() => conversation && onSelect(conversation.id)} aria-label={conversation ? `Mở cuộc trò chuyện với ${person.name}` : `${person.name} chưa có cuộc trò chuyện`}>
      <Avatar initials={person.initials} name={person.name} status={person.presence} />
      <span className="contact-item__body"><strong>{person.name}</strong><span>{person.role}</span></span>
      <span className="contact-item__action" aria-hidden="true">{conversation ? <MessageCircle size={18} /> : "Chưa có chat"}</span>
    </button>)}
  </div>}</ContactsLayout>;
}

function ContactsLayout({ children }: { children: ReactNode }) {
  return <div className="section-page"><header><span className="section-kicker">Mạch workspace</span><h1>Danh bạ</h1><p className="section-page__description">Chọn một đồng nghiệp để mở cuộc trò chuyện.</p></header>{children}</div>;
}

function ContactsLoading() {
  return <div className="contacts-list" aria-label="Đang tải danh bạ" aria-busy="true">{Array.from({ length: 6 }).map((_, index) => <div className="contact-skeleton" key={index}><Skeleton width="44px" height={44} /><span><Skeleton width="132px" /><Skeleton width="92px" height={12} /></span></div>)}</div>;
}
