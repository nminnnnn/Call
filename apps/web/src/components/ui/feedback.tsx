import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./primitives";

export function Skeleton({ width = "100%", height = 16 }: { width?: string; height?: number }) {
  return <span className="ui-skeleton" style={{ width, height }} />;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="ui-state"><Inbox size={30} /><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function ErrorState({ title = "Không thể tải dữ liệu", onRetry }: { title?: string; onRetry?: () => void }) {
  return <div className="ui-state ui-state--error"><AlertCircle size={30} /><h3>{title}</h3><p>Vui lòng thử lại sau ít phút.</p>{onRetry && <Button variant="secondary" onClick={onRetry}><RefreshCw size={16} />Thử lại</Button>}</div>;
}
