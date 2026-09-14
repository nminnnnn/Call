import type { CallService } from "../call-service";
import { delay } from "./mock-store";

export class MockCallService implements CallService {
  async start(conversationId: string, kind: "audio" | "video") {
    return delay({
      id: crypto.randomUUID(), conversationId, kind,
      state: "ringing" as const, startedAt: new Date().toISOString(),
    }, 300);
  }
}
