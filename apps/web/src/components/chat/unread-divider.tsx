import { forwardRef } from "react";

export const UnreadDivider = forwardRef<HTMLDivElement, { count: number }>(function UnreadDivider({ count }, ref) {
  return <div className="unread-divider" ref={ref}><span>{count} tin nhắn mới</span></div>;
});
