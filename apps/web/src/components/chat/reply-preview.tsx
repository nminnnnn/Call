import type { Message, Person } from "@job-call/contracts";
import { X } from "lucide-react";
import { IconButton } from "../ui";

export function ReplyPreview({ message, author, compact = false, onClose }: { message: Message; author?: Person; compact?: boolean; onClose?: () => void }) {
  return (
    <div className={`reply-preview ${compact ? "reply-preview--compact" : ""}`}>
      <span><strong>{author?.name ?? "Tin nhắn"}</strong><small>{message.body || "Tệp đính kèm"}</small></span>
      {onClose && <IconButton type="button" label="Hủy trả lời" onClick={onClose}><X size={16} /></IconButton>}
    </div>
  );
}
