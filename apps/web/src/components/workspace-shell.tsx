import type { Attachment, ConversationSummary, Message, Person } from "@job-call/contracts";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatDataSources } from "../data/data-sources";
import { AppSidebar } from "./chat/app-sidebar";
import { ChatHeader } from "./chat/chat-header";
import { ConversationInfoContent, ConversationInfoPanel } from "./chat/conversation-info-panel";
import { ContactsPage } from "./chat/contacts-page";
import { ConversationSidebar } from "./chat/conversation-sidebar";
import { MessageComposer } from "./chat/message-composer";
import { MessageList } from "./chat/message-list";
import { Avatar, Button, Dialog, Drawer, EmptyState, ErrorState, Input, Skeleton, Toast } from "./ui";

type Section = "messages" | "contacts";

export function WorkspaceShell({ dataSources, section = "messages", onLogout }: { dataSources: ChatDataSources; section?: Section; onLogout: () => void }) {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Person>();
  const [people, setPeople] = useState<Person[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationSummary>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Map<string, Attachment>>(new Map());
  const [shellLoading, setShellLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [shellError, setShellError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [query, setQuery] = useState("");
  const [replyTo, setReplyTo] = useState<Message>();
  const [infoOpen, setInfoOpen] = useState(() => window.matchMedia("(min-width: 1101px)").matches);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>([]);
  const [groupSubmitting, setGroupSubmitting] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [toast, setToast] = useState("");
  const conversationRequestRef = useRef(0);
  const currentConversationIdRef = useRef(conversationId);
  const conversationErrorIdRef = useRef<string | undefined>(undefined);
  const groupCreateRequestRef = useRef(false);
  currentConversationIdRef.current = conversationId;

  const loadShell = useCallback(async () => {
    setShellError(false); setShellLoading(true);
    try {
      const [user, userList, conversationList] = await Promise.all([
        dataSources.users.getCurrent(), dataSources.users.list(), dataSources.conversations.list(),
      ]);
      setCurrentUser(user); setPeople(userList); setConversations(conversationList);
    } catch { setShellError(true); }
    finally { setShellLoading(false); }
  }, [dataSources]);

  useEffect(() => { void loadShell(); }, [loadShell]);

  const loadConversation = useCallback(async (id: string) => {
    const requestId = ++conversationRequestRef.current;
    const isCurrentRequest = () => requestId === conversationRequestRef.current && currentConversationIdRef.current === id;
    conversationErrorIdRef.current = undefined;
    setMessageError(false); setMessageLoading(true); setReplyTo(undefined);
    setActiveConversation(undefined); setMessages([]); setAttachments(new Map());
    try {
      const [conversation, page] = await Promise.all([
        dataSources.conversations.getById(id), dataSources.messages.list(id),
      ]);
      if (!conversation) throw new Error("Conversation not found");
      const attachmentIds = [...new Set(page.items.flatMap((message) => message.attachmentIds))];
      const attachmentList = await dataSources.attachments.getByIds(attachmentIds);
      if (!isCurrentRequest()) return;
      setActiveConversation(conversation);
      setMessages(page.items);
      setAttachments(new Map(attachmentList.map((item) => [item.id, item])));
      if (conversation.unreadCount) {
        if (!isCurrentRequest()) return;
        const updated = await dataSources.conversations.markAsRead(id);
        if (!isCurrentRequest()) return;
        setConversations((items) => items.map((item) => item.id === id ? updated : item));
      }
    } catch { if (isCurrentRequest()) { conversationErrorIdRef.current = id; setMessageError(true); } }
    finally { if (isCurrentRequest()) setMessageLoading(false); }
  }, [dataSources]);

  useEffect(() => {
    if (!conversationId) {
      conversationRequestRef.current += 1;
      conversationErrorIdRef.current = undefined;
      setActiveConversation(undefined); setMessages([]); setReplyTo(undefined); setMessageLoading(false); setMessageError(false);
      return;
    }
    void loadConversation(conversationId);
  }, [conversationId, loadConversation]);

  const peopleById = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const availableGroupMembers = useMemo(() => people.filter((person) => person.id !== currentUser?.id), [currentUser?.id, people]);
  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return conversations;
    return conversations.filter((item) => `${item.title} ${item.lastMessage}`.toLocaleLowerCase("vi").includes(normalized));
  }, [conversations, query]);
  const members = useMemo(() => activeConversation?.participantIds.map((id) => peopleById.get(id)).filter(Boolean) as Person[] ?? [], [activeConversation, peopleById]);
  const conversationAttachments = useMemo(() => [...attachments.values()], [attachments]);
  const typingUsers = useMemo(() => activeConversation?.typingUserIds.map((id) => peopleById.get(id)).filter(Boolean) as Person[] ?? [], [activeConversation, peopleById]);
  const conversationIsCurrent = Boolean(conversationId && activeConversation?.id === conversationId);
  const conversationErrorIsCurrent = Boolean(conversationId && messageError && conversationErrorIdRef.current === conversationId);

  async function sendMessage(body: string, replyToId: string | undefined, prepared: Attachment[]) {
    if (!activeConversation || !currentUser) return;
    const optimistic: Message = {
      id: `local-${crypto.randomUUID()}`, conversationId: activeConversation.id, authorId: currentUser.id,
      body, createdAt: new Date().toISOString(), status: "sending", replyToId,
      attachmentIds: prepared.map((item) => item.id), reactions: [],
    };
    setAttachments((items) => new Map([...items, ...prepared.map((item) => [item.id, item] as const)]));
    setMessages((items) => [...items, optimistic]);
    try {
      const sent = await dataSources.messages.send({ conversationId: activeConversation.id, body, replyToId, attachmentIds: optimistic.attachmentIds });
      setMessages((items) => items.map((item) => item.id === optimistic.id ? sent : item));
      const list = await dataSources.conversations.list();
      setConversations(list);
      setActiveConversation((item) => item ? { ...item, lastMessage: body || "Đã gửi một tệp đính kèm", updatedAt: sent.createdAt, unreadCount: 0 } : item);
      setToast("Tin nhắn đã được gửi");
    } catch {
      setMessages((items) => items.map((item) => item.id === optimistic.id ? { ...item, status: "failed" } : item));
      setToast("Không gửi được tin nhắn");
    }
  }

  async function toggleReaction(messageId: string, emoji: string) {
    try {
      const updated = await dataSources.messages.toggleReaction(messageId, emoji);
      setMessages((items) => items.map((item) => item.id === messageId ? updated : item));
    } catch { setToast("Không cập nhật được cảm xúc"); }
  }

  async function editMessage(messageId: string, body: string) {
    const previous = messages.find((item) => item.id === messageId);
    const latest = messages.filter((item) => item.conversationId === previous?.conversationId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const updated = await dataSources.messages.update({ messageId, body });
    setMessages((items) => items.map((item) => item.id === messageId ? updated : item));
    try {
      const list = await dataSources.conversations.list();
      setConversations(list);
      setActiveConversation((conversation) => list.find((item) => item.id === conversation?.id) ?? conversation);
    } catch {
      if (previous && latest?.id === messageId) {
        setConversations((items) => items.map((item) => item.id === updated.conversationId ? { ...item, lastMessage: updated.body, updatedAt: updated.createdAt } : item).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
        setActiveConversation((conversation) => conversation?.id === updated.conversationId ? { ...conversation, lastMessage: updated.body, updatedAt: updated.createdAt } : conversation);
      }
    }
    setToast("Tin nhắn đã được cập nhật");
  }

  async function deleteMessage(messageId: string) {
    const result = await dataSources.messages.deleteMessage(messageId);
    setMessages((items) => items.filter((item) => item.id !== messageId));
    if (result.conversation) {
      setConversations((items) => items.map((item) => item.id === result.conversationId ? result.conversation! : item).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      setActiveConversation((conversation) => conversation?.id === result.conversationId ? result.conversation : conversation);
    }
    setToast("Tin nhắn đã được xóa");
  }

  async function startCall(kind: "audio" | "video") {
    if (!activeConversation) return;
    await dataSources.calls.start(activeConversation.id, kind);
    setToast(`${kind === "video" ? "Video call" : "Cuộc gọi thoại"} đang đổ chuông (mô phỏng)`);
  }

  function openGroupDialog() {
    setGroupName("");
    setSelectedGroupMemberIds([]);
    setGroupError("");
    setGroupOpen(true);
  }

  function closeGroupDialog() {
    if (groupSubmitting) return false;
    setGroupOpen(false);
    window.setTimeout(() => document.querySelector<HTMLElement>("[data-dialog-return-focus='true']")?.focus());
    return true;
  }

  function toggleGroupMember(memberId: string) {
    setGroupError("");
    setSelectedGroupMemberIds((ids) => ids.includes(memberId) ? ids.filter((id) => id !== memberId) : [...ids, memberId]);
  }

  function abandonGroupCreate() {
    setGroupOpen(false);
    setGroupSubmitting(false);
  }

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (groupCreateRequestRef.current) return;

    const title = groupName.trim();
    if (!title) {
      setGroupError("Nhập tên nhóm để tiếp tục.");
      return;
    }
    if (!selectedGroupMemberIds.length) {
      setGroupError("Chọn ít nhất một thành viên cho nhóm.");
      return;
    }

    groupCreateRequestRef.current = true;
    setGroupError("");
    setGroupSubmitting(true);
    const createPath = window.location.pathname;
    try {
      const created = await dataSources.conversations.createGroup({ title, memberIds: selectedGroupMemberIds });
      if (window.location.pathname !== createPath) {
        abandonGroupCreate();
        return;
      }
      setConversations((items) => [created, ...items.filter((item) => item.id !== created.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      setQuery("");
      setGroupOpen(false);
      setToast(`Đã tạo nhóm ${created.title}`);
      navigate(`/messages/${created.id}`);
    } catch {
      if (window.location.pathname !== createPath) {
        abandonGroupCreate();
        return;
      }
      setGroupError("Không thể tạo nhóm lúc này. Kiểm tra lại thông tin và thử lại.");
    } finally {
      groupCreateRequestRef.current = false;
      if (window.location.pathname === createPath) setGroupSubmitting(false);
    }
  }

  return (
    <main className={`workspace ${conversationId ? "workspace--chat-open" : ""}`}>
      <AppSidebar currentUser={currentUser} onLogout={onLogout} />
      {section === "messages" && <ConversationSidebar conversations={filteredConversations} selectedId={conversationId} query={query} loading={shellLoading} onQuery={setQuery} onCreateGroup={openGroupDialog} onSelect={(id) => navigate(`/messages/${id}`)} />}
      <section className={`workspace__main ${section !== "messages" ? "workspace__main--wide" : ""}`}>
        {shellError ? <ErrorState title="Không thể tải dữ liệu" onRetry={loadShell} /> : section === "contacts" ? <ContactsPage people={people} conversations={conversations} currentUser={currentUser} loading={shellLoading} error={shellError} onRetry={loadShell} onSelect={(id) => navigate(`/messages/${id}`)} /> : !conversationId ? <WelcomePanel /> : messageLoading || (!conversationIsCurrent && !conversationErrorIsCurrent) ? <ConversationLoading /> : conversationErrorIsCurrent ? <ErrorState title="Không thể tải tin nhắn" onRetry={() => void loadConversation(conversationId)} /> : activeConversation ? (
          <div className="chat-screen">
            <ChatHeader conversation={activeConversation} infoOpen={infoOpen} onBack={() => navigate("/messages")} onToggleInfo={() => setInfoOpen((value) => !value)} onStartCall={(kind) => void startCall(kind)} />
            <MessageList conversation={activeConversation} messages={messages} attachments={attachments} people={peopleById} currentUserId={currentUser?.id ?? ""} loading={messageLoading} typingUsers={typingUsers} onReply={setReplyTo} onReaction={(id, emoji) => void toggleReaction(id, emoji)} onEdit={editMessage} onDelete={deleteMessage} />
            <MessageComposer replyTo={replyTo} replyAuthor={replyTo ? peopleById.get(replyTo.authorId) : undefined} onCancelReply={() => setReplyTo(undefined)} onPrepareAttachment={(file) => dataSources.attachments.prepare(file)} onSend={sendMessage} />
          </div>
        ) : <div className="chat-screen"><div className="message-feed"><EmptyState title="Không tìm thấy hội thoại" description="Hội thoại có thể đã bị xóa hoặc đường dẫn không còn hợp lệ." /></div></div>}
      </section>
      {section === "messages" && conversationIsCurrent && activeConversation && infoOpen && <ConversationInfoPanel conversation={activeConversation} members={members} attachments={conversationAttachments} onClose={() => setInfoOpen(false)} />}
      <Drawer open={Boolean(conversationIsCurrent && infoOpen)} title="Thông tin hội thoại" onClose={() => setInfoOpen(false)}>{conversationIsCurrent && activeConversation && <ConversationInfoContent conversation={activeConversation} members={members} attachments={conversationAttachments} />}</Drawer>
      <Dialog open={groupOpen} title="Tạo nhóm mới" onClose={closeGroupDialog}>
        <form className="group-dialog" onSubmit={createGroup}>
          <Input label="Tên nhóm" placeholder="Ví dụ: Ra mắt sản phẩm" value={groupName} onChange={(event) => { setGroupName(event.target.value); setGroupError(""); }} autoFocus disabled={groupSubmitting} aria-invalid={Boolean(groupError)} aria-describedby="group-creation-help group-creation-error" />
          <fieldset className="group-member-picker" disabled={groupSubmitting || shellLoading} aria-describedby="group-creation-help">
            <legend>Thành viên <span aria-live="polite">({selectedGroupMemberIds.length} đã chọn)</span></legend>
            {shellLoading ? <p className="group-member-picker__status" aria-live="polite">Đang tải danh bạ…</p> : availableGroupMembers.length ? <ul>
              {availableGroupMembers.map((person) => {
                const inputId = `group-member-${person.id}`;
                return <li key={person.id}><label htmlFor={inputId} className="group-member-option"><input id={inputId} type="checkbox" checked={selectedGroupMemberIds.includes(person.id)} onChange={() => toggleGroupMember(person.id)} /><Avatar initials={person.initials} src={person.avatarUrl} name={person.name} size="sm" /><span><strong>{person.name}</strong><small>{person.role}</small></span></label></li>;
              })}
            </ul> : <p className="group-member-picker__status">Chưa có thành viên để thêm vào nhóm.</p>}
          </fieldset>
          <p id="group-creation-help" className="dialog-note">Bạn sẽ được thêm vào nhóm cùng với các thành viên đã chọn.</p>
          {groupError && <p id="group-creation-error" className="group-dialog__error" role="alert">{groupError}</p>}
          <div className="dialog-actions"><Button type="button" variant="secondary" onClick={closeGroupDialog} disabled={groupSubmitting}>Hủy</Button><Button type="submit" disabled={groupSubmitting || shellLoading || !availableGroupMembers.length}>{groupSubmitting ? "Đang tạo…" : "Tạo nhóm"}</Button></div>
        </form>
      </Dialog>
      {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
    </main>
  );
}

function ConversationLoading() {
  return <div className="chat-screen"><div className="message-feed message-feed--loading" aria-label="Đang tải cuộc trò chuyện" aria-busy="true"><Skeleton width="220px" /><Skeleton width="340px" height={42} /><Skeleton width="280px" height={42} /></div></div>;
}

function WelcomePanel() {
  return <div className="welcome-panel"><div className="welcome-mark"><MessageCircle size={34} /></div><h2>Sẵn sàng trao đổi công việc</h2><p>Chọn một hội thoại để xem tin nhắn và tiếp tục trao đổi cùng đội ngũ.</p></div>;
}
