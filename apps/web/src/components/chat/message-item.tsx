import type { Attachment, Message, Person } from "@job-call/contracts";
import { AlertCircle, Check, CheckCheck, CornerUpLeft, Loader2, Pencil, RotateCcw, SmilePlus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { formatTime } from "../../lib/date";
import { Avatar, Button, Textarea } from "../ui";
import { AttachmentPreview } from "./attachment-preview";
import { ReplyPreview } from "./reply-preview";

export function MessageItem({ message, author, currentUserId, replyMessage, replyAuthor, attachments, onReply, onReaction, onEdit, onDelete, onRetry }: { message: Message; author?: Person; currentUserId: string; replyMessage?: Message; replyAuthor?: Person; attachments: Attachment[]; onReply: (message: Message) => void; onReaction: (messageId: string, emoji: string) => void; onEdit: (messageId: string, body: string) => Promise<void>; onDelete: (messageId: string) => Promise<void>; onRetry: (messageId: string) => Promise<void> }) {
  const mine = message.authorId === currentUserId;
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(message.body);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) {
      setError("Tin nhắn không được để trống.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onEdit(message.id, value);
      setEditing(false);
    } catch {
      setError("Không thể sửa tin nhắn. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteMessage() {
    setSubmitting(true);
    setError("");
    try {
      await onDelete(message.id);
    } catch {
      setError("Không thể xóa tin nhắn. Thử lại sau.");
      setSubmitting(false);
    }
  }

  function cancelEdit() {
    setDraft(message.body);
    setError("");
    setEditing(false);
  }

  return (
    <article className={`message ${mine ? "message--mine" : ""}`}>
      {!mine && <Avatar initials={author?.initials ?? "?"} name={author?.name ?? "Người dùng"} size="sm" />}
      <div className="message__content">
        {!mine && <span className="message__author">{author?.name}</span>}
        <div className="message__bubble">
          {replyMessage && <ReplyPreview message={replyMessage} author={replyAuthor} compact />}
          {editing ? (
            <form className="message-edit" onSubmit={saveEdit}>
              <Textarea aria-label="Nội dung chỉnh sửa" value={draft} onChange={(event) => { setDraft(event.target.value); setError(""); }} rows={2} autoFocus disabled={submitting} />
              {error && <p className="message-action-error" role="alert">{error}</p>}
              <div className="message-edit__actions">
                <Button type="button" variant="secondary" onClick={cancelEdit} disabled={submitting}><X size={15} />Hủy</Button>
                <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="spin" size={15} /> : <Check size={15} />}Lưu</Button>
              </div>
            </form>
          ) : (
            <>
              {message.body && <p>{message.body}</p>}
              {attachments.length > 0 && <div className="message-attachments">{attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}</div>}
              <div className="message__quick-actions">
                <button type="button" title="Trả lời" aria-label="Trả lời" onClick={() => onReply(message)}><CornerUpLeft size={15} /></button>
                <button type="button" title="Thả cảm xúc" aria-label="Thả cảm xúc" onClick={() => onReaction(message.id, "👍")}><SmilePlus size={15} /></button>
                {mine && message.body && <button type="button" title="Sửa tin nhắn" aria-label="Sửa tin nhắn" onClick={() => { setDraft(message.body); setConfirmingDelete(false); setEditing(true); }}><Pencil size={15} /></button>}
                {mine && <button type="button" title="Xóa tin nhắn" aria-label="Xóa tin nhắn" onClick={() => { setError(""); setConfirmingDelete(true); }}><Trash2 size={15} /></button>}
                {mine && message.status === "failed" && <button type="button" title="Thử gửi lại" aria-label="Thử gửi lại" onClick={() => void onRetry(message.id)}><RotateCcw size={15} /></button>}
              </div>
            </>
          )}
        </div>
        {!editing && confirmingDelete && <div className="message-confirm" role="group" aria-label="Xác nhận xóa tin nhắn"><span>Xóa tin nhắn này?</span><Button type="button" variant="ghost" onClick={() => setConfirmingDelete(false)} disabled={submitting}>Hủy</Button><Button type="button" variant="danger" onClick={() => void deleteMessage()} disabled={submitting}>{submitting ? "Đang xóa..." : "Xóa"}</Button></div>}
        {!editing && error && <p className="message-action-error" role="alert">{error}</p>}
        <div className="message__meta"><time>{formatTime(message.createdAt)}</time>{message.editedAt && <span>đã sửa</span>}{mine && <DeliveryIcon status={message.status} />}{mine && message.status === "failed" && <button type="button" className="message-retry" onClick={() => void onRetry(message.id)}><RotateCcw size={13} />Thử gửi lại</button>}</div>
        {message.reactions.length > 0 && <div className="message-reactions">{message.reactions.filter((item) => item.userIds.length).map((reaction) => <button key={reaction.emoji} onClick={() => onReaction(message.id, reaction.emoji)}>{reaction.emoji} {reaction.userIds.length}</button>)}</div>}
      </div>
    </article>
  );
}

function DeliveryIcon({ status }: { status: Message["status"] }) {
  if (status === "sending") return <Loader2 className="spin" size={13} />;
  if (status === "failed") return <AlertCircle className="delivery-failed" size={14} />;
  if (status === "read") return <CheckCheck className="delivery-read" size={14} />;
  return <Check size={14} />;
}
