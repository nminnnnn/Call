import type { Attachment, ConversationSummary, GroupMemberRole, Person, UpdateGroupMembersInput } from "@job-call/contracts";
import { ArrowLeft, UserMinus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Avatar, Badge, Button, IconButton, Input } from "../ui";
import { AttachmentPreview } from "./attachment-preview";

type GroupHandlers = {
  currentUserId: string;
  availableMembers: Person[];
  onRename: (title: string) => Promise<void>;
  onManageMembers: (input: Omit<UpdateGroupMembersInput, "conversationId">) => Promise<void>;
};

type InfoProps = { conversation: ConversationSummary; members: Person[]; attachments: Attachment[] } & GroupHandlers;

export function ConversationInfoPanel({ onClose, ...props }: InfoProps & { onClose: () => void }) {
  return <aside className="info-panel"><header><h2>Thông tin</h2><IconButton label="Đóng bảng thông tin" onClick={onClose}><ArrowLeft size={18} /></IconButton></header><ConversationInfoContent {...props} /></aside>;
}

export function ConversationInfoContent({ conversation, members, attachments, currentUserId, availableMembers, onRename, onManageMembers }: InfoProps) {
  const role = conversation.memberRoles?.[currentUserId] ?? (conversation.kind === "group" ? "owner" : "member");
  const canManage = conversation.kind === "group" && (role === "owner" || role === "admin");
  return (
    <div className="info-content">
      <div className="info-content__identity"><Avatar initials={conversation.initials} name={conversation.title} size="lg" /><h3>{conversation.title}</h3><Badge tone="success">{conversation.kind === "group" ? "Nhóm làm việc" : "Đang hoạt động"}</Badge></div>
      {conversation.kind === "group" && <GroupManagement conversation={conversation} availableMembers={availableMembers} canManage={canManage} onRename={onRename} onManageMembers={onManageMembers} />}
      <section className="info-block"><div className="info-block__heading"><h4>Thành viên</h4><span>{members.length}</span></div><MemberRoles conversation={conversation} members={members} currentUserId={currentUserId} canManage={canManage} onManageMembers={onManageMembers} /></section>
      <section className="info-block"><div className="info-block__heading"><h4>Tệp đã chia sẻ</h4><span>{attachments.length}</span></div>{attachments.length ? <div className="shared-attachments">{attachments.slice(0, 4).map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}</div> : <p className="info-empty">Chưa có tệp được chia sẻ.</p>}</section>
    </div>
  );
}

function GroupManagement({ conversation, availableMembers, canManage, onRename, onManageMembers }: { conversation: ConversationSummary; availableMembers: Person[]; canManage: boolean; onRename: (title: string) => Promise<void>; onManageMembers: (input: Omit<UpdateGroupMembersInput, "conversationId">) => Promise<void> }) {
  const [title, setTitle] = useState(conversation.title);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function rename(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) { setError("Tên nhóm không được để trống."); return; }
    setBusy(true); setError("");
    try { await onRename(title); } catch { setError("Không thể đổi tên nhóm. Thử lại sau."); } finally { setBusy(false); }
  }

  async function addMembers() {
    if (!selected.length) return;
    setBusy(true); setError("");
    try { await onManageMembers({ addUserIds: selected }); setSelected([]); } catch { setError("Không thể thêm thành viên. Thử lại sau."); } finally { setBusy(false); }
  }

  return <section className="info-block group-management">
    <div className="info-block__heading"><h4>Quản lý nhóm</h4><span>{canManage ? "Bạn có quyền quản lý" : "Chỉ xem"}</span></div>
    {canManage ? <>
      <form className="group-management__rename" onSubmit={rename}><Input label="Tên nhóm" value={title} onChange={(event) => setTitle(event.target.value)} disabled={busy} /><Button type="submit" variant="secondary" disabled={busy}>Lưu tên</Button></form>
      {availableMembers.length > 0 && <div className="group-management__add"><span>Thêm thành viên</span>{availableMembers.map((person) => <label key={person.id}><input type="checkbox" checked={selected.includes(person.id)} onChange={() => setSelected((ids) => ids.includes(person.id) ? ids.filter((id) => id !== person.id) : [...ids, person.id])} disabled={busy} />{person.name}</label>)}<Button type="button" variant="secondary" onClick={() => void addMembers()} disabled={busy || !selected.length}>Thêm đã chọn</Button></div>}
    </> : <p className="info-empty">Bạn có thể xem thành viên; chỉ owner hoặc admin mới đổi tên và quản lý nhóm.</p>}
    {error && <p className="group-dialog__error" role="alert">{error}</p>}
  </section>;
}

function MemberRoles({ conversation, members, currentUserId, canManage, onManageMembers }: { conversation: ConversationSummary; members: Person[]; currentUserId: string; canManage: boolean; onManageMembers: (input: Omit<UpdateGroupMembersInput, "conversationId">) => Promise<void> }) {
  const [busyId, setBusyId] = useState("");
  const roles = conversation.memberRoles ?? Object.fromEntries(members.map((member) => [member.id, member.id === currentUserId ? "owner" : "member"]));

  async function changeRole(memberId: string, role: GroupMemberRole) {
    setBusyId(memberId);
    try { await onManageMembers({ roles: { [memberId]: role } }); } finally { setBusyId(""); }
  }

  async function remove(memberId: string) {
    setBusyId(memberId);
    try { await onManageMembers({ removeUserIds: [memberId] }); } finally { setBusyId(""); }
  }

  return <div className="member-list">{members.map((member) => {
    const memberRole = roles[member.id] ?? "member";
    const editable = canManage && member.id !== currentUserId && memberRole !== "owner";
    return <div className="member-row" key={member.id}><Avatar initials={member.initials} name={member.name} size="sm" status={member.presence} /><span><strong>{member.name}</strong><small>{member.role}</small></span>{conversation.kind === "group" && (editable ? <span className="member-row__controls"><select aria-label={`Vai trò của ${member.name}`} value={memberRole} disabled={busyId === member.id} onChange={(event) => void changeRole(member.id, event.target.value as GroupMemberRole)}><option value="admin">Admin</option><option value="member">Thành viên</option></select><IconButton type="button" label={`Xóa ${member.name} khỏi nhóm`} disabled={busyId === member.id} onClick={() => void remove(member.id)}><UserMinus size={15} /></IconButton></span> : <small className="member-row__role">{memberRole === "owner" ? "Owner" : memberRole === "admin" ? "Admin" : "Thành viên"}</small>)}</div>;
  })}</div>;
}
