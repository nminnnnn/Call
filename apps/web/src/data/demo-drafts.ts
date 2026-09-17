const DRAFTS_KEY = "mach.demo.drafts";
const DRAFTS_VERSION = 1;

export function loadDemoDrafts() {
  try {
    const raw = window.localStorage.getItem(DRAFTS_KEY);
    if (!raw) return new Map<string, string>();
    const value = JSON.parse(raw) as { version?: number; drafts?: Record<string, unknown> };
    if (value.version !== DRAFTS_VERSION || !value.drafts || typeof value.drafts !== "object") throw new Error("Unsupported drafts");
    return new Map(Object.entries(value.drafts).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length <= 4_000));
  } catch {
    window.localStorage.removeItem(DRAFTS_KEY);
    return new Map<string, string>();
  }
}

export function persistDemoDrafts(drafts: Map<string, string>) {
  const values = Object.fromEntries([...drafts.entries()].filter(([, value]) => value.trim()));
  window.localStorage.setItem(DRAFTS_KEY, JSON.stringify({ version: DRAFTS_VERSION, drafts: values }));
}

export function clearDemoDrafts() {
  window.localStorage.removeItem(DRAFTS_KEY);
}
