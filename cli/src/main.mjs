#!/usr/bin/env node
import contrib from 'blessed-contrib';
import blessed from 'blessed';

import { fetch_hn } from './services/hacker-news.mjs';
import { fetch_reddit } from './services/reddit.mjs';
import { fetch_trending_coins } from './services/coingecko.mjs';
import { fetch_fear_greed } from './services/fear-greed.mjs';
import { fetch_dex_boosts } from './services/dexscreener.mjs';
import { fetch_polymarket } from './services/polymarket.mjs';
import { fetch_manifold } from './services/manifold.mjs';
import { fetch_lobsters } from './services/lobsters.mjs';
import { fetch_wiki_top } from './services/wikipedia.mjs';
import { fetch_github_trending } from './services/github-trending.mjs';
import { fetch_arxiv } from './services/arxiv.mjs';
import { fetch_npm } from './services/npm-stats.mjs';
import { fetch_earthquakes } from './services/usgs.mjs';
import { fetch_breaches } from './services/hibp.mjs';
import { fetch_insider_trades } from './services/sec-edgar.mjs';
import { fetch_congress } from './services/congress.mjs';
import { fetch_google_trends } from './services/google-trends.mjs';
import { fetch_crtsh } from './services/crtsh.mjs';
import { fetch_usaspending } from './services/usaspending.mjs';
import { fetch_wayback } from './services/wayback.mjs';
import { fetch_ooni } from './services/ooni.mjs';
import { fetch_s2_papers } from './services/semantic-scholar.mjs';
import { fetch_producthunt } from './services/producthunt.mjs';
import { fetch_pypi } from './services/pypi.mjs';

// ── Screen ──────────────────────────────────────────────
const screen = blessed.screen({
  smartCSR: true,
  title: 'terminally online',
  fullUnicode: true,
});

const PAGE_NAMES = ['MAIN', 'MARKETS', 'DEV', 'WEIRD', 'INTEL'];
let currentPage = 0;
let grid = null;
const W = {}; // current widgets

// ── Helpers ─────────────────────────────────────────────
function tbl(row, col, rowSpan, colSpan, label, widths) {
  return grid.set(row, col, rowSpan, colSpan, contrib.table, {
    label: ` ${label} `,
    keys: false,
    interactive: false,
    columnSpacing: 1,
    columnWidth: widths || [4, 50, 10, 10, 6],
    style: {
      header: { fg: 'cyan', bold: true },
      cell: { fg: 'white' },
      border: { fg: 'gray' },
      label: { fg: 'cyan', bold: true },
    },
    border: { type: 'line' },
  });
}

function gauge(row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.gauge, {
    label: ` ${label} `,
    stroke: 'cyan',
    fill: 'white',
    style: { border: { fg: 'gray' }, label: { fg: 'cyan', bold: true } },
    border: { type: 'line' },
  });
}

// ── Status bar ──────────────────────────────────────────
const statusBar = blessed.box({
  bottom: 0, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'white', bg: 'black' },
});

function updateStatus(msg) {
  const tabs = PAGE_NAMES.map((n, i) =>
    i === currentPage ? `{cyan-fg}{bold}${n}{/bold}{/}` : `{gray-fg}${n}{/}`
  ).join(' ');
  statusBar.setContent(` ${tabs}  {gray-fg}|{/}  ${msg}  {gray-fg}|{/}  {cyan-fg}[1-5]{/} pages  {cyan-fg}[r]{/} refresh  {cyan-fg}[q]{/} quit`);
  screen.render();
}

// ── Page builders ───────────────────────────────────────
function clearScreen() {
  // Remove everything except status bar
  const toRemove = screen.children.filter(c => c !== statusBar);
  toRemove.forEach(c => c.detach());
}

function buildMain() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen });
  W.hn = tbl(0, 0, 4, 4, 'Hacker News', [3, 48, 6, 5, 4]);
  W.reddit = tbl(0, 4, 4, 4, 'r/wallstreetbets', [3, 44, 6, 7, 4]);
  W.trends = tbl(0, 8, 4, 4, 'Google Trends', [3, 38, 12]);
  W.poly = tbl(4, 0, 4, 4, 'Polymarket', [3, 42, 5, 8]);
  W.manifold = tbl(4, 4, 4, 4, 'Manifold', [3, 42, 5, 8]);
  W.fg = gauge(4, 8, 2, 2, 'Fear & Greed');
  W.wiki = tbl(4, 10, 4, 2, 'Wiki Spikes', [3, 30, 7]);
  W.quakes = tbl(6, 8, 2, 2, 'Earthquakes', [4, 25, 4, 5]);
  W.lobsters = tbl(8, 0, 4, 4, 'Lobste.rs', [3, 44, 5, 7, 4]);
  W.ph = tbl(8, 4, 4, 4, 'Product Hunt', [3, 50]);
  W.congress = tbl(8, 8, 4, 4, 'Congress Bills', [10, 42, 8]);
}

function buildMarkets() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen });
  W.dex = tbl(0, 0, 4, 6, 'DEX Boosted Tokens', [3, 38, 10, 8]);
  W.coins = tbl(0, 6, 4, 6, 'Trending Coins', [3, 22, 8, 6, 8]);
  W.poly2 = tbl(4, 0, 4, 6, 'Polymarket', [3, 46, 5, 8]);
  W.manifold2 = tbl(4, 6, 4, 6, 'Manifold', [3, 46, 5, 8]);
  W.insider = tbl(8, 0, 4, 6, 'SEC Insider Trades', [3, 40, 8, 10]);
  W.breaches = tbl(8, 6, 4, 6, 'Data Breaches', [3, 30, 10, 10]);
}

function buildDev() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen });
  W.github = tbl(0, 0, 4, 6, 'GitHub Rising', [3, 36, 10, 8]);
  W.arxiv = tbl(0, 6, 4, 6, 'arXiv AI', [3, 44, 22, 10]);
  W.npm = tbl(4, 0, 4, 4, 'npm Downloads', [3, 22, 10]);
  W.pypi = tbl(4, 4, 4, 4, 'PyPI Downloads', [3, 22, 10]);
  W.s2 = tbl(4, 8, 4, 4, 'Semantic Scholar', [3, 40, 8, 5]);
  W.hn2 = tbl(8, 0, 4, 6, 'Hacker News', [3, 48, 6, 5, 4]);
  W.lobsters2 = tbl(8, 6, 4, 6, 'Lobste.rs', [3, 48, 5, 7, 4]);
}

function buildWeird() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen });
  W.wiki2 = tbl(0, 0, 4, 6, 'Wikipedia Top Pages', [3, 40, 8]);
  W.crtsh = tbl(0, 6, 4, 6, 'Cert Transparency (openai.com)', [40, 18, 10]);
  W.usa = tbl(4, 0, 4, 6, 'Federal Contracts (30d)', [3, 28, 10, 22]);
  W.wayback = tbl(4, 6, 4, 6, 'Wayback (openai.com)', [10, 36, 4]);
  W.ooni = tbl(8, 0, 4, 6, 'OONI Censorship', [3, 40, 8, 10]);
  W.quakes2 = tbl(8, 6, 4, 6, 'Earthquakes M4.5+', [4, 36, 4, 5]);
}

function buildIntel() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen });
  W.insider2 = tbl(0, 0, 4, 6, 'SEC Insider Trades', [3, 40, 8, 10]);
  W.congress2 = tbl(0, 6, 4, 6, 'Congress Bills', [10, 42, 8]);
  W.breaches2 = tbl(4, 0, 4, 6, 'Data Breaches', [3, 30, 10, 10]);
  W.trends2 = tbl(4, 6, 4, 6, 'Google Trends US', [3, 38, 12]);
  W.reddit2 = tbl(8, 0, 4, 6, 'r/technology', [3, 44, 6, 7, 4]);
  W.reddit3 = tbl(8, 6, 4, 6, 'r/cryptocurrency', [3, 44, 6, 7, 4]);
}

const builders = [buildMain, buildMarkets, buildDev, buildWeird, buildIntel];

// ── Page switch ─────────────────────────────────────────
function showPage(idx) {
  currentPage = idx;
  clearScreen();
  // Clear widget refs
  for (const k of Object.keys(W)) delete W[k];
  builders[idx]();
  screen.append(statusBar);
  screen.render();
  loadPageData();
}

// ── Data loading ────────────────────────────────────────
async function safe(fn) {
  try { return await fn(); }
  catch (e) { return [[`err: ${(e.message || '').slice(0, 60)}`]]; }
}

function set(widget, data) {
  if (!widget || !data) return;
  try { widget.setData({ headers: [], data }); } catch {}
}

async function loadPageData() {
  updateStatus('fetching…');
  const p = currentPage;

  if (p === 0) {
    const [hn, rd, tr, po, ma, fg, wk, eq, lo, ph, co] = await Promise.allSettled([
      safe(() => fetch_hn(25)),
      safe(() => fetch_reddit('wallstreetbets', 20)),
      safe(fetch_google_trends),
      safe(() => fetch_polymarket(15)),
      safe(() => fetch_manifold(15)),
      safe(fetch_fear_greed),
      safe(fetch_wiki_top),
      safe(fetch_earthquakes),
      safe(() => fetch_lobsters(20)),
      safe(() => fetch_producthunt(15)),
      safe(() => fetch_congress(15)),
    ]);
    set(W.hn, hn.value); set(W.reddit, rd.value); set(W.trends, tr.value);
    set(W.poly, po.value); set(W.manifold, ma.value);
    set(W.wiki, wk.value); set(W.quakes, eq.value);
    set(W.lobsters, lo.value); set(W.ph, ph.value); set(W.congress, co.value);
    if (fg.value?.value != null) {
      W.fg?.setPercent(fg.value.value);
      W.fg?.setLabel(` Fear & Greed: ${fg.value.value} — ${fg.value.label} `);
    }
  }
  else if (p === 1) {
    const [dx, co, po, ma, ins, br] = await Promise.allSettled([
      safe(() => fetch_dex_boosts(20)), safe(fetch_trending_coins),
      safe(() => fetch_polymarket(20)), safe(() => fetch_manifold(20)),
      safe(() => fetch_insider_trades(20)), safe(() => fetch_breaches(15)),
    ]);
    set(W.dex, dx.value); set(W.coins, co.value);
    set(W.poly2, po.value); set(W.manifold2, ma.value);
    set(W.insider, ins.value); set(W.breaches, br.value);
  }
  else if (p === 2) {
    const [gh, ax, nm, py, s2, hn, lo] = await Promise.allSettled([
      safe(() => fetch_github_trending(20)), safe(() => fetch_arxiv('cs.AI', 20)),
      safe(fetch_npm), safe(fetch_pypi),
      safe(() => fetch_s2_papers('large language model', 15)),
      safe(() => fetch_hn(20)), safe(() => fetch_lobsters(20)),
    ]);
    set(W.github, gh.value); set(W.arxiv, ax.value);
    set(W.npm, nm.value); set(W.pypi, py.value); set(W.s2, s2.value);
    set(W.hn2, hn.value); set(W.lobsters2, lo.value);
  }
  else if (p === 3) {
    const [wk, ct, us, wb, oo, eq] = await Promise.allSettled([
      safe(fetch_wiki_top), safe(() => fetch_crtsh('openai.com', 20)),
      safe(() => fetch_usaspending(15)), safe(() => fetch_wayback('openai.com', 20)),
      safe(() => fetch_ooni(15)), safe(fetch_earthquakes),
    ]);
    set(W.wiki2, wk.value); set(W.crtsh, ct.value);
    set(W.usa, us.value); set(W.wayback, wb.value);
    set(W.ooni, oo.value); set(W.quakes2, eq.value);
  }
  else if (p === 4) {
    const [ins, co, br, tr, r1, r2] = await Promise.allSettled([
      safe(() => fetch_insider_trades(20)), safe(() => fetch_congress(15)),
      safe(() => fetch_breaches(15)), safe(fetch_google_trends),
      safe(() => fetch_reddit('technology', 20)),
      safe(() => fetch_reddit('cryptocurrency', 20)),
    ]);
    set(W.insider2, ins.value); set(W.congress2, co.value);
    set(W.breaches2, br.value); set(W.trends2, tr.value);
    set(W.reddit2, r1.value); set(W.reddit3, r2.value);
  }

  updateStatus(`loaded · ${new Date().toLocaleTimeString()}`);
  screen.render();
}

// ── Keys ────────────────────────────────────────────────
screen.key(['q', 'C-c'], () => process.exit(0));
screen.key(['r'], () => loadPageData());
screen.key(['1'], () => showPage(0));
screen.key(['2'], () => showPage(1));
screen.key(['3'], () => showPage(2));
screen.key(['4'], () => showPage(3));
screen.key(['5'], () => showPage(4));
screen.key(['tab'], () => showPage((currentPage + 1) % PAGE_NAMES.length));

// ── Auto-refresh every 2 min ────────────────────────────
setInterval(() => loadPageData(), 120_000);

// ── Boot ────────────────────────────────────────────────
showPage(0);
