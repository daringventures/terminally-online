#!/usr/bin/env node
import contrib from 'blessed-contrib';
import blessed from 'blessed';

import { I } from './ui/theme.mjs';
import { tickerBar, setTicker, startTickerAnimation } from './ui/ticker.mjs';
import { statusBar, updateStatus } from './ui/statusbar.mjs';
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
  { name: `${I.globe}MAIN`,    mod: pageMain },
  { name: `${I.coin}DEGEN`,   mod: pageMarkets },
  { name: `${I.git}NERD`,     mod: pageDev },
  { name: `${I.skull}CURSED`,  mod: pageWeird },
  { name: `${I.eye}GLOWIE`,   mod: pageIntel },
  { name: `${I.chart}VIBES`,   mod: pageVibes },
  { name: `${I.rocket}SIGNALS`, mod: pageSignals },
  { name: `${I.lock}THREAT`,  mod: pageThreat },
  { name: `${I.fire}MEMES`,   mod: pageMemes },
  { name: `${I.money}GOV/NYC`, mod: pageGovNYC },
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

function set(widget, data) {
  if (!widget || !data) return;
  try { widget.setData({ headers: widget._colHeaders || [], data }); } catch {}
}

// ── Page context (passed to every page's load function) ─
const ctx = { safe, cf, set, setTicker, tsRecord, tsSince, I };

// ── Page lifecycle ──────────────────────────────────────
function clearScreen() {
  while (screen.children.length) screen.children[0].detach();
}

function showPage(idx) {
  currentPage = idx;
  clearScreen();
  for (const k of Object.keys(W)) delete W[k];

  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  PAGES[idx].mod.build(grid, W);

  screen.append(tickerBar);
  screen.append(statusBar);
  screen.render();
  loadPageData();
}

async function loadPageData() {
  const names = PAGES.map(p => p.name);
  updateStatus(screen, `{yellow-fg}${I.bolt}FETCHING…{/}`, names, currentPage);

  await PAGES[currentPage].mod.load(W, ctx);

  const stats = cacheStats();
  updateStatus(
    screen,
    `{green-fg}${I.dot} LIVE{/} {gray-fg}${new Date().toLocaleTimeString()}{/} {gray-fg}│{/} {cyan-fg}cache: ${stats.keys} keys{/}`,
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
screen.key(['q', 'C-c'], () => process.exit(0));
screen.key(['r'], () => loadPageData());
for (let i = 0; i < Math.min(PAGES.length, 9); i++) {
  screen.key([String(i + 1)], () => showPage(i));
}
screen.key(['0'], () => showPage(9));
screen.key(['tab'], () => showPage((currentPage + 1) % PAGES.length));
screen.key(['S-tab'], () => showPage((currentPage - 1 + PAGES.length) % PAGES.length));

// ── Auto-refresh ────────────────────────────────────────
setInterval(() => loadPageData(), 120_000);

// ── Boot ────────────────────────────────────────────────
startTickerAnimation(screen);
showPage(0);
