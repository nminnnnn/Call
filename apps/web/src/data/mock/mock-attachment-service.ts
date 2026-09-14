import type { Attachment } from "@job-call/contracts";
import type { AttachmentService } from "../attachment-service";
import { delay, type MockStore } from "./mock-store";

export class MockAttachmentService implements AttachmentService {
  constructor(private readonly store: MockStore) {}

  async getByIds(ids: string[]) {
    const idSet = new Set(ids);
    return delay(this.store.attachments.filter((item) => idSet.has(item.id)), 100);
  }

  async prepare(file: File) {
    const attachment: Attachment = {
      id: crypto.randomUUID(),
      kind: file.type.startsWith("image/") ? "image" : "file",
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    };
    this.store.attachments.push(attachment);
    return delay(attachment, 260);
  }
}
