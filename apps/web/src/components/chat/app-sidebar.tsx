import type { Person } from "@job-call/contracts";
import { LogOut, MessageCircle, RotateCcw, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, Tooltip } from "../ui";

const navigation = [
  { to: "/messages", label: "Tin nhắn", icon: MessageCircle },
  { to: "/contacts", label: "Danh bạ", icon: Users },
];

export function AppSidebar({ currentUser, onLogout, onResetDemo }: { currentUser?: Person; onLogout: () => void; onResetDemo: () => void }) {
  return (
    <nav className="app-nav" aria-label="Điều hướng ứng dụng">
      <div className="app-brand" aria-label="Mạch"><span>M</span><strong>Mạch</strong></div>
      <div className="app-nav__links">{navigation.map(({ to, label, icon: Icon }) => (
        <Tooltip key={to} label={label}><NavLink to={to} className={({ isActive }) => `app-nav__item ${isActive ? "is-active" : ""}`}><Icon size={21} /><span>{label}</span></NavLink></Tooltip>
      ))}<Tooltip label="Khôi phục dữ liệu demo"><button className="app-nav__item" type="button" onClick={onResetDemo}><RotateCcw size={21} /><span>Khôi phục</span></button></Tooltip><Tooltip label="Đăng xuất"><button className="app-nav__item" type="button" onClick={onLogout}><LogOut size={21} /><span>Đăng xuất</span></button></Tooltip></div>
      <div className="app-nav__bottom">
        <div className="app-nav__profile"><Avatar initials={currentUser?.initials ?? "MA"} name={currentUser?.name ?? "Hồ sơ"} size="sm" status={currentUser?.presence ?? "online"} /><span>{currentUser?.name ?? "Minh Anh"}</span></div>
      </div>
    </nav>
  );
}
