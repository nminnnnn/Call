import type { Person } from "@job-call/contracts";
import { Avatar } from "../ui";

export function MemberList({ members }: { members: Person[] }) {
  return <div className="member-list">{members.map((member) => <div className="member-row" key={member.id}><Avatar initials={member.initials} name={member.name} size="sm" status={member.presence} /><span><strong>{member.name}</strong><small>{member.role}</small></span></div>)}</div>;
}
