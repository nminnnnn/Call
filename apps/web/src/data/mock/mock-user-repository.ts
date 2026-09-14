import type { UserRepository } from "../user-repository";
import { currentUserId } from "./seed-data";
import { delay, type MockStore } from "./mock-store";

export class MockUserRepository implements UserRepository {
  constructor(private readonly store: MockStore) {}

  async getCurrent() {
    const user = this.store.users.find((item) => item.id === currentUserId);
    if (!user) throw new Error("Current user not found");
    return delay(user);
  }

  async list() {
    return delay(this.store.users);
  }

  async getByIds(ids: string[]) {
    const idSet = new Set(ids);
    return delay(this.store.users.filter((item) => idSet.has(item.id)));
  }
}
