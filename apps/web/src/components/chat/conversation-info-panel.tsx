import type { Attachment, ConversationSummary, Person } from "@job-call/contracts";
import { ArrowLeft } from "lucide-react";
import { Avatar, Badge, IconButton } from "../ui";
import { AttachmentPreview } from "./attachment-preview";
import { MemberList } from "./member-list";

export function ConversationInfoPanel({ conversation, members, attachments, onClose }: { conversation: ConversationSummary; members: Person[]; attachments: Attachment[]; onClose: () => void }) {
  return <aside className="info-panel"><header><h2>Thông tin</h2><IconButton label="Đóng bảng thông tin" onClick={onClose}><ArrowLeft size={18} /></IconButton></header><ConversationInfoContent conversation={conversation} members={members} attachments={attachments} /></aside>;
}

export function ConversationInfoContent({ conversation, members, attachments }: { conversation: ConversationSummary; members: Person[]; attachments: Attachment[] }) {
  return (
    <div className="info-content">
      <div className="info-content__identity"><Avatar initials={conversation.initials} name={conversation.title} size="lg" /><h3>{conversation.title}</h3><Badge tone="success">{conversation.kind === "group" ? "Nhóm làm việc" : "Đang hoạt động"}</Badge></div>
      <section className="info-block"><div className="info-block__heading"><h4>Thành viên</h4><span>{members.length}</span></div><MemberList members={members} /></section>
      <section className="info-block"><div className="info-block__heading"><h4>Tệp đã chia sẻ</h4><span>{attachments.length}</span></div>{attachments.length ? <div className="shared-attachments">{attachments.slice(0, 4).map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}</div> : <p className="info-empty">Chưa có tệp được chia sẻ.</p>}</section>
    </div>
  );
}
