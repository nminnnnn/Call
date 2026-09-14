import type { Person } from "@job-call/contracts";
import { Avatar } from "../ui";

export function TypingIndicator({ users }: { users: Person[] }) {
  if (!users.length) return null;
  const label = users.length === 1 ? `${users[0].name} đang nhập` : `${users.length} người đang nhập`;
  return <div className="typing-indicator"><Avatar initials={users[0].initials} name={users[0].name} size="sm" /><span className="typing-dots"><i /><i /><i /></span><small>{label}</small></div>;
}
