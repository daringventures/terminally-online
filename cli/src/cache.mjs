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

  -- Timeseries: numerical data points for sparklines + trend analysis
  CREATE TABLE IF NOT EXISTS timeseries (
    key TEXT NOT NULL,
    value REAL NOT NULL,
    label TEXT,
    recorded_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ts_key_time ON timeseries(key, recorded_at DESC);
`);

const stmtGet = db.prepare('SELECT data, fetched_at, ttl_sec FROM cache WHERE key = ?');
const stmtSet = db.prepare('INSERT OR REPLACE INTO cache (key, data, fetched_at, ttl_sec) VALUES (?, ?, ?, ?)');
const stmtHistory = db.prepare('INSERT INTO history (key, data, fetched_at) VALUES (?, ?, ?)');
const stmtPruneHistory = db.prepare('DELETE FROM history WHERE key = ? AND fetched_at < ?');
const stmtTsInsert = db.prepare('INSERT INTO timeseries (key, value, label, recorded_at) VALUES (?, ?, ?, ?)');
const stmtTsGet = db.prepare('SELECT value, label, recorded_at FROM timeseries WHERE key = ? ORDER BY recorded_at DESC LIMIT ?');
const stmtTsRange = db.prepare('SELECT value, label, recorded_at FROM timeseries WHERE key = ? AND recorded_at >= ? ORDER BY recorded_at ASC');
const stmtTsPrune = db.prepare('DELETE FROM timeseries WHERE recorded_at < ?');

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
  // Prune history older than 30 days (was 24h — that was insane)
  stmtPruneHistory.run(key, now - 86400 * 30);
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

/**
 * Record a numerical data point for time-series tracking.
 * Use for indices, prices, counts — anything you want to chart over time.
 */
export function tsRecord(key, value, label = '') {
  const now = Math.floor(Date.now() / 1000);
  stmtTsInsert.run(key, value, label, now);
}

/**
 * Get recent time-series data points for a key.
 * Returns [{ value, label, recorded_at }] newest-first.
 */
export function tsRecent(key, limit = 60) {
  return stmtTsGet.all(key, limit);
}

/**
 * Get time-series data for a key within a time range.
 * Returns [{ value, label, recorded_at }] oldest-first (for sparklines).
 */
export function tsSince(key, sinceSec = 3600) {
  const since = Math.floor(Date.now() / 1000) - sinceSec;
  return stmtTsRange.all(key, since);
}

/**
 * Get history snapshots for a key (full JSON payloads).
 * Returns [{ data (parsed), fetched_at }] newest-first.
 */
export function historyGet(key, limit = 50) {
  const rows = db.prepare(
    'SELECT data, fetched_at FROM history WHERE key = ? ORDER BY fetched_at DESC LIMIT ?'
  ).all(key, limit);
  return rows.map(r => ({ data: JSON.parse(r.data), fetchedAt: r.fetched_at }));
}

/**
 * Prune old timeseries data (default: 90 days).
 */
export function tsPrune(maxAgeDays = 90) {
  const cutoff = Math.floor(Date.now() / 1000) - (86400 * maxAgeDays);
  stmtTsPrune.run(cutoff);
}

export function closeDb() {
  db.close();
}
