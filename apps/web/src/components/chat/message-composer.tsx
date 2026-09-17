import type { Attachment, Message, Person } from "@job-call/contracts";
import { FileImage, Loader2, Paperclip, Send } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { IconButton, Textarea, Tooltip } from "../ui";
import { AttachmentPreview } from "./attachment-preview";
import { ReplyPreview } from "./reply-preview";

export function MessageComposer({ replyTo, replyAuthor, onCancelReply, onPrepareAttachment, onSend }: { replyTo?: Message; replyAuthor?: Person; onCancelReply: () => void; onPrepareAttachment: (file: File) => Promise<Attachment>; onSend: (body: string, replyToId: string | undefined, attachments: Attachment[]) => Promise<void> }) {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
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
    const value = body.trim();
    if ((!value && !attachments.length) || sending || preparing) return;
    setSending(true);
    try {
      await onSend(value, replyTo?.id, attachments);
      setBody(""); setAttachments([]); onCancelReply();
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
          <input ref={fileInput} className="visually-hidden" type="file" multiple onChange={(event) => void chooseFiles(event.target.files)} />
        </div>
        <Textarea aria-label="Nội dung tin nhắn" placeholder="Nhập tin nhắn..." rows={1} value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
        <Tooltip label="Gửi tin nhắn"><IconButton type="submit" label="Gửi tin nhắn" className="composer__send" disabled={sending || preparing || (!body.trim() && !attachments.length)}>{sending ? <Loader2 className="spin" size={19} /> : <Send size={19} />}</IconButton></Tooltip>
      </div>
    </form>
  );
}
