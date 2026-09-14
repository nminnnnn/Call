import type { Attachment } from "@job-call/contracts";

export interface AttachmentService {
  getByIds(ids: string[]): Promise<Attachment[]>;
  prepare(file: File): Promise<Attachment>;
}
