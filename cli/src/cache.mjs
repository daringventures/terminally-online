import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';

// Store in ~/.terminally-online/cache.db
const DATA_DIR = join(homedir(), '.terminally-online');
mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = join(DATA_DIR, 'cache.db');

const db = new Database(DB_PATH);

// WAL mode for concurrent reads during background writes
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    fetched_at INTEGER NOT NULL,
    ttl_sec INTEGER NOT NULL DEFAULT 120
  );
  CREATE TABLE IF NOT EXISTS history (
    key TEXT NOT NULL,
    data TEXT NOT NULL,
    fetched_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_history_key_time ON history(key, fetched_at DESC);
`);

const stmtGet = db.prepare('SELECT data, fetched_at, ttl_sec FROM cache WHERE key = ?');
const stmtSet = db.prepare('INSERT OR REPLACE INTO cache (key, data, fetched_at, ttl_sec) VALUES (?, ?, ?, ?)');
const stmtHistory = db.prepare('INSERT INTO history (key, data, fetched_at) VALUES (?, ?, ?)');
const stmtPruneHistory = db.prepare('DELETE FROM history WHERE key = ? AND fetched_at < ?');

/**
 * Get cached data. Returns { data, age, stale } or null.
 */
export function cacheGet(key) {
  const row = stmtGet.get(key);
  if (!row) return null;
  const now = Math.floor(Date.now() / 1000);
  const age = now - row.fetched_at;
  return {
    data: JSON.parse(row.data),
    age,
    stale: age > row.ttl_sec,
    fetchedAt: row.fetched_at,
  };
}

/**
 * Store data in cache + history.
 */
export function cacheSet(key, data, ttlSec = 120) {
  const now = Math.floor(Date.now() / 1000);
  const json = JSON.stringify(data);
  stmtSet.run(key, json, now, ttlSec);
  stmtHistory.run(key, json, now);
  // Prune history older than 24h
  stmtPruneHistory.run(key, now - 86400);
}

/**
 * Cached fetch wrapper.
 * Returns cached data immediately if available (even if stale).
 * If stale, triggers background refresh and returns stale data.
 * If no cache, fetches synchronously.
 */
export async function cachedFetch(key, fetchFn, ttlSec = 120) {
  const cached = cacheGet(key);

  if (cached && !cached.stale) {
    // Fresh cache — return immediately
    return cached.data;
  }

  if (cached && cached.stale) {
    // Stale cache — return stale data, refresh in background
    fetchFn()
      .then(data => cacheSet(key, data, ttlSec))
      .catch(() => {}); // swallow background errors
    return cached.data;
  }

  // No cache — fetch synchronously
  const data = await fetchFn();
  cacheSet(key, data, ttlSec);
  return data;
}

/**
 * Get cache stats.
 */
export function cacheStats() {
  const count = db.prepare('SELECT COUNT(*) as c FROM cache').get();
  const histCount = db.prepare('SELECT COUNT(*) as c FROM history').get();
  const oldest = db.prepare('SELECT MIN(fetched_at) as t FROM cache').get();
  const newest = db.prepare('SELECT MAX(fetched_at) as t FROM cache').get();
  return {
    keys: count.c,
    historyRows: histCount.c,
    oldestSec: oldest.t ? Math.floor(Date.now() / 1000) - oldest.t : 0,
    newestSec: newest.t ? Math.floor(Date.now() / 1000) - newest.t : 0,
  };
}

export function closeDb() {
  db.close();
}
