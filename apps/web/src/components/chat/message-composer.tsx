import type { Attachment, Message, Person } from "@job-call/contracts";
import { AlertTriangle, FileImage, Loader2, Paperclip, Send } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { IconButton, Textarea, Tooltip } from "../ui";
import { AttachmentPreview } from "./attachment-preview";
import { ReplyPreview } from "./reply-preview";

export function MessageComposer({ draft, replyTo, replyAuthor, onCancelReply, onDraftChange, onPrepareAttachment, onSend }: { draft: string; replyTo?: Message; replyAuthor?: Person; onCancelReply: () => void; onDraftChange: (value: string) => void; onPrepareAttachment: (file: File) => Promise<Attachment>; onSend: (body: string, replyToId: string | undefined, attachments: Attachment[], simulateFailure: boolean) => Promise<void> }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function chooseFiles(files: FileList | null) {
    if (!files?.length) return;
    setPreparing(true);
    try {
      const prepared = await Promise.all(Array.from(files).slice(0, 5).map(onPrepareAttachment));
      setAttachments((items) => [...items, ...prepared].slice(0, 5));
    } finally { setPreparing(false); if (fileInput.current) fileInput.current.value = ""; }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if ((!value && !attachments.length) || sending || preparing) return;
    setSending(true);
    try {
      await onSend(value, replyTo?.id, attachments, simulateFailure);
      onDraftChange(""); setAttachments([]); setSimulateFailure(false); onCancelReply();
    } finally { setSending(false); }
  }

  return (
    <form className="composer-wrap" onSubmit={submit}>
      {replyTo && <ReplyPreview message={replyTo} author={replyAuthor} onClose={onCancelReply} />}
      {attachments.length > 0 && <div className="composer-attachments">{attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} removable onRemove={() => setAttachments((items) => items.filter((item) => item.id !== attachment.id))} />)}</div>}
      <div className="composer">
        <div className="composer__tools">
          <Tooltip label="Đính kèm file"><IconButton type="button" label="Đính kèm file" onClick={() => fileInput.current?.click()}>{preparing ? <Loader2 className="spin" size={19} /> : <Paperclip size={19} />}</IconButton></Tooltip>
          <Tooltip label="Chọn ảnh"><IconButton type="button" label="Chọn ảnh" onClick={() => fileInput.current?.click()}><FileImage size={19} /></IconButton></Tooltip>
          <Tooltip label="Mô phỏng lỗi gửi lần kế tiếp"><IconButton type="button" label="Mô phỏng lỗi gửi lần kế tiếp" className={simulateFailure ? "is-active" : ""} aria-pressed={simulateFailure} onClick={() => setSimulateFailure((value) => !value)}><AlertTriangle size={18} /></IconButton></Tooltip>
          <input ref={fileInput} className="visually-hidden" type="file" multiple onChange={(event) => void chooseFiles(event.target.files)} />
        </div>
        <Textarea aria-label="Nội dung tin nhắn" placeholder="Nhập tin nhắn..." rows={1} value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
        <Tooltip label="Gửi tin nhắn"><IconButton type="submit" label="Gửi tin nhắn" className="composer__send" disabled={sending || preparing || (!draft.trim() && !attachments.length)}>{sending ? <Loader2 className="spin" size={19} /> : <Send size={19} />}</IconButton></Tooltip>
      </div>
    </form>
  );
}
