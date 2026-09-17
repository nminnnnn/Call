import { useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { clearDemoSession, readDemoSession, safeDemoDestination, type DemoSession } from "./auth/demo-session";
import { LoginPage } from "./components/auth/login-page";
import { WorkspaceShell } from "./components/workspace-shell";
import { createDataSources } from "./data/create-data-sources";

const dataSources = createDataSources();

export function App() {
  const [session, setSession] = useState<DemoSession | null>(() => readDemoSession());
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    clearDemoSession();
    flushSync(() => setSession(null));
    navigate("/login", { replace: true });
  }

  const protect = (content: ReactNode) => <ProtectedRoute session={session}>{content}</ProtectedRoute>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={session ? "/messages" : "/login"} replace />} />
      <Route path="/login" element={session ? <Navigate to={safeDemoDestination(new URLSearchParams(location.search).get("next"))} replace /> : <LoginPage onLogin={setSession} />} />
      <Route path="/messages" element={protect(<WorkspaceShell dataSources={dataSources} onLogout={logout} />)} />
      <Route path="/messages/:conversationId" element={protect(<WorkspaceShell dataSources={dataSources} onLogout={logout} />)} />
      <Route path="/contacts" element={protect(<WorkspaceShell dataSources={dataSources} section="contacts" onLogout={logout} />)} />
      <Route path="*" element={<Navigate to={session ? "/messages" : "/login"} replace />} />
    </Routes>
  );
}

function ProtectedRoute({ session, children }: { session: DemoSession | null; children: ReactNode }) {
  const location = useLocation();
  if (session) return children;
  const requestedPath = `${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={`/login?next=${encodeURIComponent(requestedPath)}`} replace />;
}
