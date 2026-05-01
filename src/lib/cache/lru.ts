/**
 * Tiny LRU cache with TTL. Process-local, good enough for MVP.
 * Keyed by string, stores any JSON-serializable value.
 */

type Entry<V> = { value: V; expiresAt: number };

export class LruCache<V> {
  private map = new Map<string, Entry<V>>();
  private readonly max: number;
  private readonly ttlMs: number;

  constructor(opts: { max: number; ttlMs: number }) {
    this.max = Math.max(opts.max, 1);
    this.ttlMs = Math.max(opts.ttlMs, 1_000);
  }

  get(key: string): V | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    // refresh recency
    this.map.delete(key);
    this.map.set(key, e);
    return e.value;
  }

  set(key: string, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    while (this.map.size > this.max) {
      const firstKey = this.map.keys().next().value;
      if (firstKey === undefined) break;
      this.map.delete(firstKey);
    }
  }
}
