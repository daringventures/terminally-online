#!/usr/bin/env node
import contrib from 'blessed-contrib';
import blessed from 'blessed';

import { I } from './ui/theme.mjs';
import { createTickerBar, getTickerBar, setTicker, startTickerAnimation } from './ui/ticker.mjs';
import { createStatusBar, getStatusBar, updateStatus } from './ui/statusbar.mjs';
import { openDetail, closeDetail, isDetailOpen, buildDetailLines, openUrl } from './ui/detail.mjs';
import { cachedFetch, cacheStats, tsRecord, tsSince } from './cache.mjs';

// ── Page modules ────────────────────────────────────────
import * as pageMain from './pages/main-page.mjs';
import * as pageMarkets from './pages/markets.mjs';
import * as pageDev from './pages/dev.mjs';
import * as pageWeird from './pages/weird.mjs';
import * as pageIntel from './pages/intel.mjs';
import * as pageVibes from './pages/vibes.mjs';
import * as pageSignals from './pages/signals.mjs';
import * as pageThreat from './pages/threat.mjs';
import * as pageMemes from './pages/memes.mjs';
import * as pageGovNYC from './pages/gov-nyc.mjs';

// ── Page registry ───────────────────────────────────────
const PAGES = [
  { name: `${I.globe}MAIN`,    mod: pageMain,    cacheKeys: ['hn', 'reddit-wsb', 'g-trends', 'polymarket', 'manifold', 'wiki-top', 'lobsters', 'producthunt', 'congress'] },
  { name: `${I.coin}DEGEN`,   mod: pageMarkets,  cacheKeys: ['dex-boost', 'cg-trending', 'polymarket-20', 'manifold-20', 'sec-insider', 'hibp'] },
  { name: `${I.git}NERD`,     mod: pageDev,      cacheKeys: ['github-trend', 'arxiv-ai', 'npm-dl', 'pypi-dl', 's2-llm', 'hn', 'lobsters'] },
  { name: `${I.skull}CURSED`,  mod: pageWeird,    cacheKeys: ['wiki-top', 'crtsh-openai', 'usaspend', 'wayback-openai', 'ooni', 'quakes'] },
  { name: `${I.eye}GLOWIE`,   mod: pageIntel,    cacheKeys: ['sec-insider', 'congress', 'hibp', 'g-trends', 'reddit-tech', 'reddit-crypto'] },
  { name: `${I.chart}VIBES`,   mod: pageVibes,    cacheKeys: ['idx-vibes', 'idx-degen', 'idx-clown', 'idx-doom', 'idx-mainchar', 'idx-techpanic'] },
  { name: `${I.rocket}SIGNALS`, mod: pageSignals,  cacheKeys: ['iss', 'space-wx', 'nasa-neo', 'flights-nyc', 'caiso', 'airports', 'wx-alerts', 'quakes'] },
  { name: `${I.lock}THREAT`,  mod: pageThreat,   cacheKeys: ['cisa-kev', 'nvd-cve', 'feodo-c2', 'phishing', 'outages', 'hibp'] },
  { name: `${I.fire}MEMES`,   mod: pageMemes,    cacheKeys: ['reddit-memes', 'reddit-dankmemes', 'reddit-drama', 'reddit-aita', 'steam-top', 'imgflip', 'reddit-collapse'] },
  { name: `${I.money}GOV/NYC`, mod: pageGovNYC,   cacheKeys: ['fed-reg', 'fda-recalls', 'cfpb', 'treasury', 'citibike', 'btc-mempool', 'eth-gas', 'nyc-311'] },
];

// ── Screen ──────────────────────────────────────────────
const screen = blessed.screen({
  smartCSR: true,
  title: 'TERMINALLY ONLINE',
  fullUnicode: true,
  forceUnicode: true,
  terminal: 'xterm-256color',
  dockBorders: true,
});

// ── State ───────────────────────────────────────────────
let currentPage = 0;
let grid = null;
const W = {};

// ── Cached fetch helper ─────────────────────────────────
function cf(key, fn, ttl = 120) {
  return () => cachedFetch(key, fn, ttl);
}

async function safe(fn) {
  try { return await fn(); }
  catch (e) { return [[`{red-fg}ERR{/} ${(e.message || '').slice(0, 50)}`]]; }
}

// ── Data setter — stores raw data + renders per-column colored rows ─
// Per-column color map (metric columns get distinct colors from titles)
const COL_COLORS = {
  '#': 'gray', 'PTS': 'yellow', 'CMTS': 'cyan', 'AGE': 'gray',
  'YES%': 'green', 'VOLUME': 'yellow', 'VALUE': 'yellow',
  'METRIC': 'cyan', 'MAG': 'red', 'DETAIL': 'gray',
};

function set(widget, data) {
  if (!widget || !data) return;
  widget._data = data;

  const headers = widget._colHeaders || [];
  const widths = widget._colWidths || [];
  const spacing = widget.options?.columnSpacing || 2;
  const cellColor = widget._cellColor || 'green';

  // If we have column metadata, build color-tagged rows ourselves
  if (headers.length > 0 && widths.length > 0) {
    const rows = data.map(row => {
      let str = '';
      for (let j = 0; j < Math.min(row.length, widths.length); j++) {
        const cell = String(row[j] ?? '');
        const w = widths[j] || 10;
        const truncated = cell.length > w ? cell.slice(0, w - 1) + '…' : cell;
        const padded = truncated + ' '.repeat(Math.max(0, w - truncated.length));
        const color = COL_COLORS[headers[j]] || cellColor;
        str += `{${color}-fg}${padded}{/}`;
        if (j < row.length - 1) str += ' '.repeat(spacing);
      }
      return str;
    });

    // Build header string
    let headerStr = '';
    for (let j = 0; j < headers.length; j++) {
      const w = widths[j] || 10;
      headerStr += headers[j] + ' '.repeat(Math.max(0, w - headers[j].length));
      if (j < headers.length - 1) headerStr += ' '.repeat(spacing);
    }

    try {
      widget.setContent(headerStr);
      widget.rows.setItems(rows);
    } catch {
      // Fallback to default
      try { widget.setData({ headers, data }); } catch {}
    }
  } else {
    try { widget.setData({ headers, data }); } catch {}
  }
}

// ── Page context (passed to every page's load function) ─
const ctx = { safe, cf, set, setTicker, tsRecord, tsSince, I, screen, openDetail, buildDetailLines, openUrl };

// ── Wire select events on all interactive tables ────────
function wireSelectHandlers() {
  for (const [key, widget] of Object.entries(W)) {
    if (!widget?.rows) continue;

    widget.rows.removeAllListeners('select');
    widget.rows.on('select', (_item, idx) => {
      const row = widget._data?.[idx];
      if (!row) return;

      const headers = widget._colHeaders || [];
      const cacheKey = PAGES[currentPage].cacheKeys?.[0]; // best guess
      const lines = buildDetailLines(headers, row, { cacheKey });

      const panel = openDetail(screen, widget._label || key, lines);

      // If there's a URL-like thing in the row data, stash it for 'o' key
      const urlCandidate = row.find?.(cell => typeof cell === 'string' && cell.startsWith('http'));
      if (urlCandidate && panel) {
        panel._url = urlCandidate;
      }
    });
  }
}

// ── Page lifecycle ──────────────────────────────────────
function clearScreen() {
  closeDetail(screen);
  while (screen.children.length) screen.children[0].detach();
}

function showPage(idx) {
  if (isDetailOpen()) { closeDetail(screen); return; } // close popup first
  currentPage = idx;
  clearScreen();
  for (const k of Object.keys(W)) delete W[k];

  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 2, bottom: 1 });
  PAGES[idx].mod.build(grid, W);

  screen.append(getTickerBar());
  screen.append(getStatusBar());
  screen.render();

  // Focus first interactive table
  const first = Object.values(W).find(w => w?.rows);
  if (first) first.focus();

  loadPageData();
}

async function loadPageData() {
  const names = PAGES.map(p => p.name);
  updateStatus(screen, `{yellow-fg}${I.bolt}FETCHING…{/}`, names, currentPage);

  await PAGES[currentPage].mod.load(W, ctx);

  // Wire Enter→detail on all table widgets after data is loaded
  wireSelectHandlers();

  const stats = cacheStats();
  updateStatus(
    screen,
    `{green-fg}${I.dot} LIVE{/} {gray-fg}${new Date().toLocaleTimeString()}{/} {gray-fg}│{/} {cyan-fg}cache: ${stats.keys} keys, ${stats.historyRows} hist{/}`,
    names,
    currentPage
  );
  screen.render();
}

// ── Resize ──────────────────────────────────────────────
screen.on('resize', () => {
  for (const w of Object.values(W)) {
    if (w && typeof w.emit === 'function') w.emit('attach');
  }
  screen.render();
});

// ── Keys ────────────────────────────────────────────────
screen.key(['q', 'C-c'], () => {
  if (isDetailOpen()) { closeDetail(screen); return; }
  process.exit(0);
});
screen.key(['escape'], () => {
  if (isDetailOpen()) closeDetail(screen);
});
screen.key(['r'], () => {
  if (!isDetailOpen()) loadPageData();
});

// Number keys 1-9,0 switch pages
for (let i = 0; i < Math.min(PAGES.length, 9); i++) {
  screen.key([String(i + 1)], () => { if (!isDetailOpen()) showPage(i); });
}
screen.key(['0'], () => { if (!isDetailOpen()) showPage(9); });

// Tab = focus next widget within page, ]/[ = next/prev page
screen.key(['tab'], () => {
  if (isDetailOpen()) return;
  screen.focusNext();
  screen.render();
});
screen.key(['S-tab'], () => {
  if (isDetailOpen()) return;
  screen.focusPrev();
  screen.render();
});
screen.key([']'], () => { if (!isDetailOpen()) showPage((currentPage + 1) % PAGES.length); });
screen.key(['['], () => { if (!isDetailOpen()) showPage((currentPage - 1 + PAGES.length) % PAGES.length); });

// 'o' opens URL when in detail view (handled by detail.mjs)
// 'h' shows help
screen.key(['h', '?'], () => {
  if (isDetailOpen()) return;
  openDetail(screen, 'KEYBOARD SHORTCUTS', [
    '{bold}{white-fg}TERMINALLY ONLINE — KEYBOARD REFERENCE{/}',
    '',
    '{cyan-fg}NAVIGATION{/}',
    '  {yellow-fg}1-0{/}     Switch pages (1=MAIN, 2=DEGEN, ... 0=GOV/NYC)',
    '  {yellow-fg}]{/}/{yellow-fg}[{/}     Next/prev page',
    '  {yellow-fg}Tab{/}     Focus next panel',
    '  {yellow-fg}S-Tab{/}   Focus prev panel',
    '',
    '{cyan-fg}WITHIN A PANEL{/}',
    '  {yellow-fg}↑↓{/} / {yellow-fg}j/k{/}  Navigate rows',
    '  {yellow-fg}Enter{/}   Open detail view for selected row',
    '  {yellow-fg}g{/}/{yellow-fg}G{/}     Jump to top/bottom',
    '',
    '{cyan-fg}DETAIL VIEW{/}',
    '  {yellow-fg}o{/}       Open URL in browser',
    '  {yellow-fg}↑↓{/}     Scroll detail content',
    '  {yellow-fg}q{/}/{yellow-fg}Esc{/}   Close detail view',
    '',
    '{cyan-fg}GLOBAL{/}',
    '  {yellow-fg}r{/}       Refresh current page data',
    '  {yellow-fg}h{/}/{yellow-fg}?{/}     Show this help',
    '  {yellow-fg}q{/}       Quit',
    '',
    `{gray-fg}Cache: ~/.terminally-online/cache.db{/}`,
    `{gray-fg}History: 30 days | Timeseries: 90 days{/}`,
  ]);
});

// ── Auto-refresh ────────────────────────────────────────
setInterval(() => { if (!isDetailOpen()) loadPageData(); }, 120_000);

// ── Boot ────────────────────────────────────────────────
createTickerBar();
createStatusBar();
startTickerAnimation(screen);
showPage(0);
