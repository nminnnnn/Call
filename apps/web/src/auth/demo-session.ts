export const DEMO_SESSION_KEY = "mach.demo.session";
export const DEMO_SESSION_VERSION = 1;

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface DemoSession {
  version: typeof DEMO_SESSION_VERSION;
  accountId: string;
  name: string;
  startedAt: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    id: "u-01",
    name: "Minh Anh",
    email: "minhanh@mach.demo",
    password: "Demo1234!",
  },
];

const allowedDemoDestinations = ["/messages", "/contacts"];

export function safeDemoDestination(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/messages";
  return allowedDemoDestinations.some((path) => value === path || value.startsWith(`${path}/`)) ? value : "/messages";
}

export function authenticateDemoAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLocaleLowerCase("vi");
  return demoAccounts.find(
    (account) => account.email.toLocaleLowerCase("vi") === normalizedEmail && account.password === password,
  );
}

export function createDemoSession(account = demoAccounts[0]): DemoSession {
  const session: DemoSession = {
    version: DEMO_SESSION_VERSION,
    accountId: account.id,
    name: account.name,
    startedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function readDemoSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<DemoSession>;
    const account = demoAccounts.find((candidate) => candidate.id === value.accountId);
    if (value.version !== DEMO_SESSION_VERSION || !account || typeof value.startedAt !== "string") {
      clearDemoSession();
      return null;
    }
    return {
      version: DEMO_SESSION_VERSION,
      accountId: account.id,
      name: account.name,
      startedAt: value.startedAt,
    };
  } catch {
    clearDemoSession();
    return null;
  }
}

export function clearDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
}
