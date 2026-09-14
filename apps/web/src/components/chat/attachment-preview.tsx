import type { Attachment } from "@job-call/contracts";
import { FileSpreadsheet, FileText, X } from "lucide-react";
import { formatFileSize } from "../../lib/date";
import { IconButton } from "../ui";

export function AttachmentPreview({ attachment, removable = false, onRemove }: { attachment: Attachment; removable?: boolean; onRemove?: () => void }) {
  if (attachment.kind === "image") {
    return <figure className="attachment-image"><img src={attachment.thumbnailUrl ?? attachment.url} alt={attachment.fileName} /><figcaption>{attachment.fileName}</figcaption>{removable && <IconButton type="button" label={`Bỏ ${attachment.fileName}`} onClick={onRemove}><X size={15} /></IconButton>}</figure>;
  }
  const Icon = attachment.mimeType.includes("spreadsheet") ? FileSpreadsheet : FileText;
  return <div className="attachment-file"><Icon size={20} /><span><strong>{attachment.fileName}</strong><small>{formatFileSize(attachment.sizeBytes)}</small></span>{removable && <IconButton type="button" label={`Bỏ ${attachment.fileName}`} onClick={onRemove}><X size={15} /></IconButton>}</div>;
}
