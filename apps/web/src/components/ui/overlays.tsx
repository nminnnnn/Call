import { ChevronDown, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./primitives";

type CloseHandler = () => boolean | void;

export function Dialog({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: CloseHandler }) {
  const dialogRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const closeDialog = useCallback(() => {
    const fallbackTarget = document.querySelector<HTMLElement>("[data-dialog-return-focus='true']");
    const restoreTarget = restoreFocusRef.current && restoreFocusRef.current !== document.body ? restoreFocusRef.current : fallbackTarget;
    const closeResult = onClose();
    if (closeResult === false) {
      window.setTimeout(() => getFocusable(dialogRef.current)[0]?.focus());
      return;
    }
    window.setTimeout(() => restoreTarget?.focus());
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        const fallbackTarget = document.querySelector<HTMLElement>("[data-dialog-return-focus='true']");
        const restoreTarget = restoreFocusRef.current && restoreFocusRef.current !== document.body ? restoreFocusRef.current : fallbackTarget;
        window.setTimeout(() => restoreTarget?.focus());
      }
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.setTimeout(() => {
      if (!dialogRef.current?.contains(document.activeElement)) {
        getFocusable(dialogRef.current)[0]?.focus();
      }
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable(dialogRef.current);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeDialog]);

  if (!open) return null;
  return (
    <div className="ui-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeDialog()}>
      <section className="ui-dialog" role="dialog" aria-modal="true" aria-label={title} ref={dialogRef}>
        <header><h2>{title}</h2><IconButton label="Đóng" onClick={closeDialog}><X size={19} /></IconButton></header>
        {children}
      </section>
    </div>
  );
}

export function Drawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="ui-drawer-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="ui-drawer" aria-label={title}>
        <header><h2>{title}</h2><IconButton label="Đóng bảng thông tin" onClick={onClose}><X size={19} /></IconButton></header>
        {children}
      </aside>
    </div>
  );
}

export function Dropdown({ label, children }: { label: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => !rootRef.current?.contains(event.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="ui-dropdown" ref={rootRef}>
      <button className="ui-dropdown__trigger" onClick={() => setOpen((value) => !value)}>{label}<ChevronDown size={15} /></button>
      {open && <div className="ui-dropdown__menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="ui-tooltip" data-tooltip={label}>{children}</span>;
}

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2600);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);
  return <div className="ui-toast" role="status">{message}<IconButton label="Đóng thông báo" onClick={onDismiss}><X size={16} /></IconButton></div>;
}

function getFocusable(root: HTMLElement | null) {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
    .filter((element) => !element.hasAttribute("disabled") && !element.closest("fieldset[disabled]") && element.getAttribute("aria-hidden") !== "true");
}
