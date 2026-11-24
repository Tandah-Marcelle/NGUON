// A random ID for this browser, used to allow one vote per device. Kept in
// localStorage and in a cookie so clearing either one alone doesn't reset it.
const KEY = "nguon_device_id";
const ONE_YEAR = 60 * 60 * 24 * 365;
const VALID = /^[A-Za-z0-9-]{16,64}$/;

function readCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readStorage(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function persist(id: string) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* storage blocked: the cookie still holds it */
  }
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${KEY}=${encodeURIComponent(id)}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
}

export function getDeviceId(): string {
  const existing = [readStorage(), readCookie()].find((v): v is string => !!v && VALID.test(v));
  const id = existing ?? crypto.randomUUID();
  persist(id);
  return id;
}
