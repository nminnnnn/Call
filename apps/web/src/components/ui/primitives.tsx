import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`ui-button ui-button--${variant} ${className}`} {...props} />;
}

export function IconButton({ label, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button aria-label={label} title={label} className={`ui-icon-button ${className}`} {...props} />;
}

export function Input({ label, icon, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: ReactNode }) {
  return (
    <label className={`ui-field ${className}`}>
      {label && <span className="ui-field__label">{label}</span>}
      <span className="ui-input-wrap">{icon}<input className="ui-input" {...props} /></span>
    </label>
  );
}

export function Textarea({ label, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className={`ui-field ${className}`}>
      {label && <span className="ui-field__label">{label}</span>}
      <textarea className="ui-textarea" {...props} />
    </label>
  );
}

export function Avatar({ initials, src, name, size = "md", status }: { initials: string; src?: string; name: string; size?: "sm" | "md" | "lg"; status?: "online" | "away" | "offline" }) {
  return (
    <span className={`ui-avatar ui-avatar--${size}`} aria-label={name}>
      {src ? <img src={src} alt="" /> : <span>{initials}</span>}
      {status && <i className={`ui-avatar__status is-${status}`} />}
    </span>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "success" | "warning" }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}
