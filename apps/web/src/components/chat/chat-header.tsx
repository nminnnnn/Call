import type { ConversationSummary } from "@job-call/contracts";
import { ArrowLeft, Info, Phone, Video } from "lucide-react";
import { Avatar, IconButton, Tooltip } from "../ui";

export function ChatHeader({ conversation, infoOpen, onBack, onToggleInfo, onStartCall }: { conversation: ConversationSummary; infoOpen: boolean; onBack: () => void; onToggleInfo: () => void; onStartCall: (kind: "audio" | "video") => void }) {
  return (
    <header className="chat-header">
      <IconButton label="Quay lại danh sách" className="mobile-back" onClick={onBack}><ArrowLeft size={20} /></IconButton>
      <Avatar initials={conversation.initials} name={conversation.title} status={conversation.kind === "direct" ? "online" : undefined} />
      <div className="chat-header__title"><h2>{conversation.title}</h2><p>{conversation.kind === "group" ? `${conversation.participantIds.length} thành viên` : "Đang hoạt động"}</p></div>
      <div className="chat-header__actions">
        <Tooltip label="Gọi thoại"><IconButton label="Gọi thoại" onClick={() => onStartCall("audio")}><Phone size={19} /></IconButton></Tooltip>
        <Tooltip label="Gọi video"><IconButton label="Gọi video" onClick={() => onStartCall("video")}><Video size={19} /></IconButton></Tooltip>
        <Tooltip label={infoOpen ? "Ẩn thông tin" : "Hiện thông tin"}><IconButton label="Thông tin hội thoại" className={infoOpen ? "is-active" : ""} onClick={onToggleInfo}><Info size={19} /></IconButton></Tooltip>
      </div>
    </header>
  );
}
