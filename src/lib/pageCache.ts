const TTL = 3 * 60 * 1000;

interface Entry<T> { data: T; ts: number }

const store = new Map<string, Entry<any>>();

export const pageCache = {
  get<T>(key: string): T | null {
    const e = store.get(key);
    if (!e) return null;
    if (Date.now() - e.ts > TTL) { store.delete(key); return null; }
    return e.data as T;
  },
  set<T>(key: string, data: T): void {
    store.set(key, { data, ts: Date.now() });
  },
  invalidate(key: string): void {
    store.delete(key);
  },
};
