import type { Person } from "@job-call/contracts";
import { Bell, MessageCircle, Phone, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, Tooltip } from "../ui";

const navigation = [
  { to: "/messages", label: "Tin nhắn", icon: MessageCircle },
  { to: "/contacts", label: "Danh bạ", icon: Users },
  { to: "/calls", label: "Cuộc gọi", icon: Phone },
];

export function AppSidebar({ currentUser }: { currentUser?: Person }) {
  return (
    <nav className="app-nav" aria-label="Điều hướng ứng dụng">
      <div className="app-brand" aria-label="Mạch"><span>M</span><strong>Mạch</strong></div>
      <div className="app-nav__links">{navigation.map(({ to, label, icon: Icon }) => (
        <Tooltip key={to} label={label}><NavLink to={to} className={({ isActive }) => `app-nav__item ${isActive ? "is-active" : ""}`}><Icon size={21} /><span>{label}</span></NavLink></Tooltip>
      ))}</div>
      <div className="app-nav__bottom">
        <Tooltip label="Thông báo"><button className="app-nav__item"><Bell size={21} /><span>Thông báo</span></button></Tooltip>
        <NavLink to="/settings" className="app-nav__profile"><Avatar initials={currentUser?.initials ?? "MA"} name={currentUser?.name ?? "Hồ sơ"} size="sm" status={currentUser?.presence ?? "online"} /><span>{currentUser?.name ?? "Minh Anh"}</span></NavLink>
      </div>
    </nav>
  );
}
