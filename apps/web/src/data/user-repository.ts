import type { Person } from "@job-call/contracts";

export interface UserRepository {
  getCurrent(): Promise<Person>;
  list(): Promise<Person[]>;
  getByIds(ids: string[]): Promise<Person[]>;
}
