import { ArrowRight, LockKeyhole, MessageCircleMore, ShieldCheck, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authenticateDemoAccount, createDemoSession, demoAccounts, safeDemoDestination, type DemoSession } from "../../auth/demo-session";
import { Button, Input } from "../ui";

export function LoginPage({ onLogin }: { onLogin: (session: DemoSession) => void }) {
  const account = demoAccounts[0];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState(account.password);
  const [error, setError] = useState("");
  const destination = safeDemoDestination(searchParams.get("next"));

  function enter(accountOverride = account) {
    const session = createDemoSession(accountOverride);
    onLogin(session);
    navigate(destination, { replace: true });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const matched = authenticateDemoAccount(email, password);
    if (!matched) {
      setError("Email hoặc mật khẩu demo chưa đúng. Hãy dùng tài khoản mẫu bên dưới.");
      return;
    }
    setError("");
    enter(matched);
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-labelledby="login-title">
        <div className="login-brand"><span>M</span><strong>Mạch</strong><small>Bản trải nghiệm khách hàng</small></div>
        <div>
          <p className="login-eyebrow">Web demo · Dữ liệu mô phỏng</p>
          <h1 id="login-title">Trao đổi công việc rõ ràng trong một không gian chung.</h1>
          <p className="login-lead">Khám phá luồng chat cá nhân, chat nhóm, danh bạ và các thao tác tin nhắn bằng dữ liệu mẫu an toàn.</p>
        </div>
        <ul className="login-benefits">
          <li><MessageCircleMore aria-hidden="true" /><span><strong>Hội thoại thực tế</strong><small>Dữ liệu tiếng Việt dành cho buổi trình diễn.</small></span></li>
          <li><Users aria-hidden="true" /><span><strong>Nhóm và danh bạ</strong><small>Tạo nhóm, chọn thành viên và bắt đầu trao đổi.</small></span></li>
          <li><ShieldCheck aria-hidden="true" /><span><strong>Không dùng dữ liệu thật</strong><small>Phiên đăng nhập này chỉ tồn tại trên trình duyệt.</small></span></li>
        </ul>
        <p className="login-disclaimer">Đây là bản demo giao diện, chưa phải hệ thống xác thực production.</p>
      </section>

      <section className="login-panel" aria-labelledby="login-form-title">
        <div className="login-card">
          <span className="login-card__icon"><LockKeyhole aria-hidden="true" /></span>
          <p className="login-eyebrow">Chào mừng trở lại</p>
          <h2 id="login-form-title">Đăng nhập bản demo</h2>
          <p className="login-card__intro">Thông tin mẫu đã được điền sẵn để bạn có thể bắt đầu ngay.</p>
          <form className="login-form" onSubmit={submit} noValidate>
            <Input label="Email demo" type="email" autoComplete="username" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} required aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : "sample-account"} />
            <Input label="Mật khẩu demo" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} required aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : "sample-account"} />
            {error && <p id="login-error" className="login-error" role="alert">{error}</p>}
            <Button type="submit" className="login-submit">Đăng nhập <ArrowRight size={17} /></Button>
          </form>
          <div className="login-divider"><span>hoặc</span></div>
          <Button type="button" variant="secondary" className="login-demo-button" onClick={() => enter()}>Trải nghiệm demo</Button>
          <div id="sample-account" className="sample-account">
            <span>Tài khoản mẫu</span>
            <strong>{account.email}</strong>
            <code>{account.password}</code>
          </div>
        </div>
      </section>
    </main>
  );
}
