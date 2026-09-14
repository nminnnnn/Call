import { Search } from "lucide-react";
import { Input } from "../ui";

export function ConversationSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input className="conversation-search" aria-label="Tìm hội thoại" placeholder="Tìm theo tên hoặc nội dung" value={value} onChange={(event) => onChange(event.target.value)} icon={<Search size={17} />} />;
}
