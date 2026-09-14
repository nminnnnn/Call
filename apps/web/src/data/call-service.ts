import type { CallSession } from "@job-call/contracts";

export interface CallService {
  start(conversationId: string, kind: "audio" | "video"): Promise<CallSession>;
}
