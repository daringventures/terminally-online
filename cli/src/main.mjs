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
import { computeVibesIndex, computeDegenIndex } from './services/vibes-index.mjs';
import { computeClownIndex, computeDoomIndex, computeMainCharIndex, computeTechPanicIndex } from './services/custom-indices.mjs';
import { cachedFetch, cacheStats } from './cache.mjs';
import { getTagline, rotateTagline, getBootMessages, getScanFrame, getGlitchText, getSignalBar, generateAlerts, getTimeString, getUptimeString } from './vibes.mjs';

const START_TIME = Date.now();

// Wrap fetch fn with local SQLite cache. Stale data served instantly, refresh in background.
function cf(key, fn, ttl = 120) {
  return () => cachedFetch(key, fn, ttl);
}

// ── Nerd Font Icons ─────────────────────────────────────
const I = {
  hn:      '󰊤 ',   // hacker news
  reddit:  '󰑍 ',   // reddit
  coin:    '󰆚 ',   // coin
  chart:   '󰄪 ',   // chart
  fire:    ' ',   // fire
  globe:   '󰖟 ',   // globe
  git:     ' ',   // git
  brain:   '󰧑 ',   // brain
  pkg:     '󰏗 ',   // package
  quake:   '󱐋 ',   // earthquake
  lock:    '󰌾 ',   // lock
  gov:     '󰛓 ',   // government
  search:  ' ',   // search
  wiki:    '󰖬 ',   // wikipedia
  cert:    '󰄤 ',   // certificate
  money:   '󰄴 ',   // money
  clock:   '󰥔 ',   // clock
  rocket:  '󰑣 ',   // rocket
  eye:     '󰈈 ',   // eye
  bolt:    '󱐌 ',   // bolt
  skull:   '󰚌 ',   // skull
  trophy:  '󰆥 ',   // trophy
  up:      '',   // up arrow
  down:    '',   // down arrow
  dot:     '',   // dot
  bar:     '█',
  barh:    '▓',
  barm:    '▒',
  barl:    '░',
};

// ── Bloomberg-style color palette (named colors only — blessed limitation) ──
const C = {
  orange: 'yellow',
  amber: 'yellow',
  green: 'green',
  red: 'red',
  cyan: 'cyan',
  blue: 'blue',
  purple: 'magenta',
  white: 'white',
  dim: 'gray',
  bg: 'black',
  panelBg: 'black',
  border: 'gray',
  header: 'cyan',
};

// ── Screen ──────────────────────────────────────────────
const screen = blessed.screen({
  smartCSR: true,
  title: 'TERMINALLY ONLINE',
  fullUnicode: true,
  forceUnicode: true,
  terminal: 'xterm-256color',
  dockBorders: true,
});

const PAGE_NAMES = [
  `${I.globe}MAIN`,
  `${I.coin}DEGEN`,
  `${I.git}NERD`,
  `${I.skull}CURSED`,
  `${I.eye}GLOWIE`,
  `${I.chart}VIBES`,
];
let currentPage = 0;
let grid = null;
const W = {};

// ── Widget factories ────────────────────────────────────
function tbl(row, col, rowSpan, colSpan, label, widths) {
  return grid.set(row, col, rowSpan, colSpan, contrib.table, {
    label: ` ${label} `,
    keys: false,
    interactive: false,
    columnSpacing: 1,
    columnWidth: widths || [4, 50, 10, 10, 6],
    style: {
      header: { fg: C.cyan, bold: true },
      cell: { fg: C.white },
      border: { fg: C.border },
      label: { fg: C.amber, bold: true },
    },
    border: { type: 'line', fg: C.border },
  });
}

function logWidget(row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.log, {
    label: ` ${label} `,
    style: {
      border: { fg: C.border },
      label: { fg: C.amber, bold: true },
      text: { fg: C.green },
    },
    border: { type: 'line', fg: C.border },
    bufferLength: 80,
    tags: true,
  });
}

function gaugeWidget(row, col, rowSpan, colSpan, label, color = 'yellow') {
  return grid.set(row, col, rowSpan, colSpan, contrib.gauge, {
    label: ` ${label} `,
    stroke: color,
    fill: 'white',
    style: {
      border: { fg: 'gray' },
      label: { fg: 'yellow', bold: true },
    },
    border: { type: 'line', fg: 'gray' },
  });
}

function sparkline(row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.sparkline, {
    label: ` ${label} `,
    tags: true,
    style: {
      fg: C.cyan,
      border: { fg: C.border },
      label: { fg: C.amber, bold: true },
    },
    border: { type: 'line', fg: C.border },
  });
}

function lcdWidget(row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.lcd, {
    label: ` ${label} `,
    segmentWidth: 0.06,
    segmentInterval: 0.11,
    strokeWidth: 0.11,
    elements: 4,
    display: '----',
    elementSpacing: 4,
    elementPadding: 2,
    color: C.amber,
    style: {
      border: { fg: C.border },
      label: { fg: C.amber, bold: true },
    },
    border: { type: 'line', fg: C.border },
  });
}

function donutWidget(row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.donut, {
    label: ` ${label} `,
    radius: 14,
    arcWidth: 4,
    yPadding: 2,
    remainColor: C.dim,
    style: {
      border: { fg: C.border },
      label: { fg: C.amber, bold: true },
    },
    border: { type: 'line', fg: C.border },
  });
}

// ── Ticker bar at bottom ────────────────────────────────
const tickerBar = blessed.box({
  bottom: 1, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'yellow', bg: 'black' },
});

let tickerText = '';
let tickerOffset = 0;

function setTicker(items) {
  tickerText = items.map(t => `  ${I.dot} ${t}  `).join('');
  tickerOffset = 0;
}

function animateTicker() {
  if (!tickerText) return;
  const w = screen.width || 120;
  const padded = tickerText + '    ' + tickerText;
  const slice = padded.slice(tickerOffset % padded.length, (tickerOffset % padded.length) + w);
  tickerBar.setContent(slice);
  tickerOffset++;
}

setInterval(animateTicker, 150);

// ── Status bar ──────────────────────────────────────────
const statusBar = blessed.box({
  bottom: 0, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'white', bg: 'black' },
});

function updateStatus(msg) {
  const tabs = PAGE_NAMES.map((n, i) =>
    i === currentPage
      ? `{yellow-fg}{bold} ${n} {/bold}{/}`
      : `{gray-fg} ${n} {/}`
  ).join('{gray-fg}│{/}');
  statusBar.setContent(
    ` ${tabs} {gray-fg}│{/} ${msg} {gray-fg}│{/} {cyan-fg}[1-6]{/} pages {cyan-fg}[r]{/} refresh {cyan-fg}[q]{/} quit`
  );
  screen.render();
}

// ── Header ──────────────────────────────────────────────
const headerBox = blessed.box({
  top: 0, left: 0, width: '100%', height: 3,
  tags: true,
  style: { fg: 'cyan', bg: 'black' },
});

function updateHeader() {
  const time = getTimeString();
  const uptime = getUptimeString(START_TIME);
  const scan = getScanFrame();
  const tagline = getTagline();
  const signal = getSignalBar();
  const stats = cacheStats();
  headerBox.setContent(
    `{yellow-fg}${scan}{/} {bold}{cyan-fg}TERMINALLY ONLINE{/bold}{/} {gray-fg}━{/} {green-fg}${tagline}{/} {gray-fg}━{/} {red-fg}${I.fire}LIVE{/} {gray-fg}${scan}{/}\n` +
    `{gray-fg}${I.clock}{/}{white-fg}${time}{/} {gray-fg}│{/} {gray-fg}UP:{/}{cyan-fg}${uptime}{/} {gray-fg}│{/} {gray-fg}SIG:{/}{green-fg}${signal}{/} {gray-fg}│{/} {gray-fg}CACHE:{/}{cyan-fg}${stats.keys}{/} {gray-fg}│{/} {gray-fg}FEEDS:{/}{yellow-fg}24{/} {gray-fg}│{/} {gray-fg}IDX:{/}{magenta-fg}6{/}`
  );
}

// Live clock — tick every second
setInterval(() => {
  updateHeader();
  screen.render();
}, 1000);

// Rotate tagline every 15 seconds
setInterval(() => rotateTagline(), 15_000);

// ── Page builders ───────────────────────────────────────
function clearScreen() {
  // Detach everything, we'll re-append what we need
  while (screen.children.length) {
    screen.children[0].detach();
  }
}

function buildMain() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.hn = tbl(0, 0, 4, 4, `${I.hn}ORANGE SITE`, [3, 44, 5, 5, 3]);
  W.reddit = tbl(0, 4, 4, 4, `${I.reddit}REGARDED FINANCE`, [3, 40, 6, 7, 3]);
  W.trends = tbl(0, 8, 4, 4, `${I.search}NORMIE RADAR`, [3, 35, 12]);

  W.poly = tbl(4, 0, 4, 4, `${I.chart}BETTING ON REALITY`, [3, 38, 5, 8]);
  W.manifold = tbl(4, 4, 4, 4, `${I.brain}NERD BETS`, [3, 38, 5, 8]);
  W.vibes = gaugeWidget(4, 8, 2, 2, `${I.fire}SO COOKED / SO BACK`, 'yellow');
  W.degen = gaugeWidget(6, 8, 2, 2, `${I.bolt}DEGEN INDEX`, 'magenta');
  W.wiki = tbl(4, 10, 4, 2, `${I.wiki}WHO DIED?`, [3, 18, 6]);

  W.lobsters = tbl(8, 0, 4, 4, `${I.trophy}CRUSTACEAN NEWS`, [3, 40, 4, 6, 3]);
  W.ph = tbl(8, 4, 4, 4, `${I.rocket}SHIPS THAT SINK`, [3, 48]);
  W.congress = tbl(8, 8, 4, 4, `${I.gov}YOUR TAX DOLLARS`, [8, 38, 7]);
}

function buildMarkets() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.dex = tbl(0, 0, 4, 6, `${I.bolt}PAID SHILLS (DEX BOOST)`, [3, 36, 8, 8]);
  W.coins = tbl(0, 6, 4, 6, `${I.coin}CT IS WATCHING`, [3, 20, 8, 5, 8]);
  W.poly2 = tbl(4, 0, 4, 6, `${I.chart}BETTING ON REALITY`, [3, 42, 5, 8]);
  W.manifold2 = tbl(4, 6, 4, 6, `${I.brain}GALAXY BRAIN BETS`, [3, 42, 5, 8]);
  W.insider = tbl(8, 0, 4, 6, `${I.money}CONGRESS BUYING CALLS`, [3, 38, 8, 10]);
  W.breaches = tbl(8, 6, 4, 6, `${I.skull}YOUR PASSWORD LEAKED`, [3, 28, 10, 10]);
}

function buildDev() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.github = tbl(0, 0, 4, 6, `${I.git}FRESH REPOS (7d)`, [3, 34, 8, 8]);
  W.arxiv = tbl(0, 6, 4, 6, `${I.brain}PAPERS NO ONE READS`, [3, 40, 20, 10]);
  W.npm = tbl(4, 0, 4, 4, `${I.pkg}NPM INSTALL REGRET`, [3, 20, 10]);
  W.pypi = tbl(4, 4, 4, 4, `${I.pkg}PIP INSTALL COPE`, [3, 20, 10]);
  W.s2 = tbl(4, 8, 4, 4, `${I.brain}CITATION FARMING`, [3, 36, 8, 5]);
  W.hn2 = tbl(8, 0, 4, 6, `${I.hn}ORANGE SITE`, [3, 44, 5, 5, 3]);
  W.lobsters2 = tbl(8, 6, 4, 6, `${I.trophy}CRUSTACEAN NEWS`, [3, 44, 4, 6, 3]);
}

function buildWeird() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.wiki2 = tbl(0, 0, 4, 6, `${I.wiki}WHAT NORMIES GOOGLED`, [3, 38, 8]);
  W.crtsh = tbl(0, 6, 4, 6, `${I.cert}SSL STALKING (openai)`, [38, 16, 10]);
  W.usa = tbl(4, 0, 4, 6, `${I.money}WHO'S EATING GOV MONEY`, [3, 26, 10, 20]);
  W.wayback = tbl(4, 6, 4, 6, `${I.clock}RECEIPTS (openai.com)`, [10, 34, 4]);
  W.ooni = tbl(8, 0, 4, 6, `${I.lock}WHO GOT CENSORED`, [3, 38, 8, 10]);
  W.quakes2 = tbl(8, 6, 4, 6, `${I.quake}EARTH IS SHAKING`, [4, 34, 4, 5]);
}

function buildIntel() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.insider2 = tbl(0, 0, 4, 6, `${I.money}PELOSI'S PORTFOLIO`, [3, 38, 8, 10]);
  W.congress2 = tbl(0, 6, 4, 6, `${I.gov}LAWS THEY'RE COOKING`, [8, 40, 7]);
  W.breaches2 = tbl(4, 0, 4, 6, `${I.skull}YOUR DATA (LEAKED)`, [3, 28, 10, 10]);
  W.trends2 = tbl(4, 6, 4, 6, `${I.search}NORMIE RADAR`, [3, 35, 12]);
  W.reddit2 = tbl(8, 0, 4, 6, `${I.reddit}r/TECHNOLOGY`, [3, 40, 6, 7, 3]);
  W.reddit3 = tbl(8, 6, 4, 6, `${I.reddit}r/COPIUM`, [3, 40, 6, 7, 3]);
}

function buildVibes() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 3, bottom: 2 });
  W.vibesG = gaugeWidget(0, 0, 3, 4, `${I.fire}SO COOKED / SO BACK`, 'yellow');
  W.degenG = gaugeWidget(0, 4, 3, 4, `${I.bolt}DEGEN INDEX`, 'magenta');
  W.clownG = gaugeWidget(0, 8, 3, 4, `${I.rocket}CLOWN MARKET`, 'cyan');
  W.doomG = gaugeWidget(3, 0, 3, 4, `${I.skull}DOOM SCROLL`, 'red');
  W.maincharG = gaugeWidget(3, 4, 3, 4, `${I.eye}MAIN CHARACTER`, 'green');
  W.techpanicG = gaugeWidget(3, 8, 3, 4, `${I.brain}TECH BRO PANIC`, 'blue');
  W.breakdownLog = logWidget(6, 0, 6, 12, `${I.chart}SIGNAL BREAKDOWN`);
}

const builders = [buildMain, buildMarkets, buildDev, buildWeird, buildIntel, buildVibes];

// ── Page switch ─────────────────────────────────────────
function showPage(idx) {
  currentPage = idx;
  clearScreen();
  for (const k of Object.keys(W)) delete W[k];
  builders[idx]();
  screen.append(headerBox);
  screen.append(tickerBar);
  screen.append(statusBar);
  screen.render();
  loadPageData();
}

// ── Data loading ────────────────────────────────────────
async function safe(fn) {
  try { return await fn(); }
  catch (e) { return [[`{red-fg}ERR{/} ${(e.message || '').slice(0, 50)}`]]; }
}

function set(widget, data) {
  if (!widget || !data) return;
  try { widget.setData({ headers: [], data }); } catch {}
}

async function loadPageData() {
  updateStatus(`{yellow-fg}${I.bolt}FETCHING…{/}`);
  const p = currentPage;

  if (p === 0) {
    const [hn, rd, tr, po, ma, wk, lo, ph, co, vibes, degen] = await Promise.allSettled([
      safe(cf('hn', () => fetch_hn(25), 120)),
      safe(cf('reddit-wsb', () => fetch_reddit('wallstreetbets', 20), 120)),
      safe(cf('g-trends', fetch_google_trends, 300)),
      safe(cf('polymarket', () => fetch_polymarket(15), 120)),
      safe(cf('manifold', () => fetch_manifold(15), 300)),
      safe(cf('wiki-top', fetch_wiki_top, 600)),
      safe(cf('lobsters', () => fetch_lobsters(20), 120)),
      safe(cf('producthunt', () => fetch_producthunt(15), 600)),
      safe(cf('congress', () => fetch_congress(15), 1800)),
      safe(cf('idx-vibes', computeVibesIndex, 120)),
      safe(cf('idx-degen', computeDegenIndex, 120)),
    ]);
    set(W.hn, hn.value); set(W.reddit, rd.value); set(W.trends, tr.value);
    set(W.poly, po.value); set(W.manifold, ma.value);
    set(W.wiki, wk.value);
    set(W.lobsters, lo.value); set(W.ph, ph.value); set(W.congress, co.value);
    // Vibes index gauge
    if (vibes.value?.index != null) {
      const v = vibes.value;
      W.vibes?.setPercent(v.index);
      W.vibes?.setLabel(` ${I.fire}${v.label}: ${v.index}/100 `);
    }
    // Degen index gauge
    if (degen.value?.index != null) {
      const d = degen.value;
      W.degen?.setPercent(d.index);
      W.degen?.setLabel(` ${I.bolt}${d.label}: ${d.index}/100 `);
    }
    // Update ticker with live data
    const tickerItems = [];
    if (vibes.value) tickerItems.push(`${I.fire}VIBES: ${vibes.value.index}/100 ${vibes.value.label}`);
    if (degen.value) tickerItems.push(`${I.bolt}DEGEN: ${degen.value.index}/100 ${degen.value.label}`);
    if (vibes.value?.breakdown) vibes.value.breakdown.forEach(b => tickerItems.push(b));
    if (hn.value?.[0]) tickerItems.push(`${I.hn}HN #1: ${hn.value[0][1]}`);
    if (tr.value?.[0]) tickerItems.push(`${I.search}TRENDING: ${tr.value[0][1]}`);
    if (po.value?.[0]) tickerItems.push(`${I.chart}POLY: ${po.value[0][1]} ${po.value[0][2]}`);
    if (wk.value?.[0]) tickerItems.push(`${I.wiki}WIKI: ${wk.value[0][1]} (${wk.value[0][2]})`);
    setTicker(tickerItems);
  }
  else if (p === 1) {
    const [dx, co, po, ma, ins, br] = await Promise.allSettled([
      safe(cf('dex-boost', () => fetch_dex_boosts(20), 60)),
      safe(cf('cg-trending', fetch_trending_coins, 300)),
      safe(cf('polymarket-20', () => fetch_polymarket(20), 120)),
      safe(cf('manifold-20', () => fetch_manifold(20), 300)),
      safe(cf('sec-insider', () => fetch_insider_trades(20), 600)),
      safe(cf('hibp', () => fetch_breaches(15), 3600)),
    ]);
    set(W.dex, dx.value); set(W.coins, co.value);
    set(W.poly2, po.value); set(W.manifold2, ma.value);
    set(W.insider, ins.value); set(W.breaches, br.value);
    const tickerItems = [];
    if (co.value?.[0]) tickerItems.push(`${I.coin}#1 COIN: ${co.value[0][1]} ${co.value[0][4]}`);
    if (dx.value?.[0]) tickerItems.push(`${I.bolt}DEX BOOST: ${dx.value[0][1]}`);
    if (ins.value?.[0]) tickerItems.push(`${I.money}INSIDER: ${ins.value[0][1]}`);
    setTicker(tickerItems);
  }
  else if (p === 2) {
    const [gh, ax, nm, py, s2, hn, lo] = await Promise.allSettled([
      safe(cf('github-trend', () => fetch_github_trending(20), 600)),
      safe(cf('arxiv-ai', () => fetch_arxiv('cs.AI', 20), 900)),
      safe(cf('npm-dl', fetch_npm, 3600)),
      safe(cf('pypi-dl', fetch_pypi, 3600)),
      safe(cf('s2-llm', () => fetch_s2_papers('large language model', 15), 900)),
      safe(cf('hn', () => fetch_hn(20), 120)),
      safe(cf('lobsters', () => fetch_lobsters(20), 120)),
    ]);
    set(W.github, gh.value); set(W.arxiv, ax.value);
    set(W.npm, nm.value); set(W.pypi, py.value); set(W.s2, s2.value);
    set(W.hn2, hn.value); set(W.lobsters2, lo.value);
    const tickerItems = [];
    if (gh.value?.[0]) tickerItems.push(`${I.git}RISING: ${gh.value[0][1]} ${gh.value[0][3]}`);
    if (ax.value?.[0]) tickerItems.push(`${I.brain}ARXIV: ${ax.value[0][1]}`);
    if (nm.value?.[0]) tickerItems.push(`${I.pkg}NPM #1: ${nm.value[0][1]} ${nm.value[0][2]}`);
    setTicker(tickerItems);
  }
  else if (p === 3) {
    const [wk, ct, us, wb, oo, eq] = await Promise.allSettled([
      safe(cf('wiki-top', fetch_wiki_top, 600)),
      safe(cf('crtsh-openai', () => fetch_crtsh('openai.com', 20), 3600)),
      safe(cf('usaspend', () => fetch_usaspending(15), 3600)),
      safe(cf('wayback-openai', () => fetch_wayback('openai.com', 20), 3600)),
      safe(cf('ooni', () => fetch_ooni(15), 1800)),
      safe(cf('quakes', fetch_earthquakes, 300)),
    ]);
    set(W.wiki2, wk.value); set(W.crtsh, ct.value);
    set(W.usa, us.value); set(W.wayback, wb.value);
    set(W.ooni, oo.value); set(W.quakes2, eq.value);
    const tickerItems = [];
    if (wk.value?.[0]) tickerItems.push(`${I.wiki}WIKI #1: ${wk.value[0][1]} ${wk.value[0][2]} views`);
    if (oo.value?.[0]) tickerItems.push(`${I.lock}CENSORSHIP: ${oo.value[0][1]}`);
    if (eq.value?.[0]) tickerItems.push(`${I.quake}QUAKE: M${eq.value[0][0]} ${eq.value[0][1]}`);
    setTicker(tickerItems);
  }
  else if (p === 4) {
    const [ins, co, br, tr, r1, r2] = await Promise.allSettled([
      safe(cf('sec-insider', () => fetch_insider_trades(20), 600)),
      safe(cf('congress', () => fetch_congress(15), 1800)),
      safe(cf('hibp', () => fetch_breaches(15), 3600)),
      safe(cf('g-trends', fetch_google_trends, 300)),
      safe(cf('reddit-tech', () => fetch_reddit('technology', 20), 120)),
      safe(cf('reddit-crypto', () => fetch_reddit('cryptocurrency', 20), 120)),
    ]);
    set(W.insider2, ins.value); set(W.congress2, co.value);
    set(W.breaches2, br.value); set(W.trends2, tr.value);
    set(W.reddit2, r1.value); set(W.reddit3, r2.value);
    const tickerItems = [];
    if (ins.value?.[0]) tickerItems.push(`${I.money}INSIDER: ${ins.value[0][1]}`);
    if (co.value?.[0]) tickerItems.push(`${I.gov}BILL: ${co.value[0][1]}`);
    if (tr.value?.[0]) tickerItems.push(`${I.search}TRENDING: ${tr.value[0][1]}`);
    setTicker(tickerItems);
  }
  else if (p === 5) {
    updateStatus(`{yellow-fg}${I.bolt}COMPUTING ALL INDICES…{/}`);
    screen.render();
    const [vb, dg, cl, dm, mc, tp] = await Promise.allSettled([
      safe(cf('idx-vibes', computeVibesIndex, 120)),
      safe(cf('idx-degen', computeDegenIndex, 120)),
      safe(cf('idx-clown', computeClownIndex, 120)),
      safe(cf('idx-doom', computeDoomIndex, 120)),
      safe(cf('idx-mainchar', computeMainCharIndex, 120)),
      safe(cf('idx-techpanic', computeTechPanicIndex, 120)),
    ]);

    const log = W.breakdownLog;
    const indices = [
      { r: vb, w: W.vibesG, icon: I.fire, color: 'yellow', name: 'SO COOKED/SO BACK' },
      { r: dg, w: W.degenG, icon: I.bolt, color: 'magenta', name: 'DEGEN INDEX' },
      { r: cl, w: W.clownG, icon: I.rocket, color: 'cyan', name: 'CLOWN MARKET' },
      { r: dm, w: W.doomG, icon: I.skull, color: 'red', name: 'DOOM SCROLL' },
      { r: mc, w: W.maincharG, icon: I.eye, color: 'green', name: 'MAIN CHARACTER' },
      { r: tp, w: W.techpanicG, icon: I.brain, color: 'blue', name: 'TECH BRO PANIC' },
    ];

    const tickerItems = [];
    for (const { r, w, icon, name } of indices) {
      if (r.value?.index != null) {
        w?.setPercent(r.value.index);
        w?.setLabel(` ${icon}${r.value.label}: ${r.value.index}/100 `);
        log?.log(`{bold}${icon}${name}{/bold}: ${r.value.index}/100 — ${r.value.label}`);
        r.value.breakdown?.forEach(b => log?.log(`  ${b}`));
        log?.log('');
        tickerItems.push(`${icon}${name}: ${r.value.index} ${r.value.label}`);
      }
    }
    setTicker(tickerItems);
  }

  const stats = cacheStats();
  updateStatus(`{green-fg}${I.dot} LIVE{/} {gray-fg}${new Date().toLocaleTimeString()}{/} {gray-fg}│{/} {cyan-fg}cache: ${stats.keys} keys{/}`);
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
screen.key(['1'], () => showPage(0));
screen.key(['2'], () => showPage(1));
screen.key(['3'], () => showPage(2));
screen.key(['4'], () => showPage(3));
screen.key(['5'], () => showPage(4));
screen.key(['6'], () => showPage(5));
screen.key(['tab'], () => showPage((currentPage + 1) % PAGE_NAMES.length));
screen.key(['S-tab'], () => showPage((currentPage - 1 + PAGE_NAMES.length) % PAGE_NAMES.length));

// ── Auto-refresh ────────────────────────────────────────
setInterval(() => loadPageData(), 120_000);

// ── Boot sequence ───────────────────────────────────────
async function bootSequence() {
  const bootScreen = blessed.box({
    top: 'center', left: 'center',
    width: '80%', height: '80%',
    tags: true,
    style: { fg: 'green', bg: 'black', border: { fg: 'yellow' } },
    border: { type: 'line' },
    label: ' {yellow-fg}SYSTEM BOOT{/} ',
  });
  screen.append(bootScreen);

  const msgs = getBootMessages(12);
  let content = '\n{bold}{cyan-fg}  ████████╗ ██████╗\n  ╚══██╔══╝██╔═══██╗\n     ██║   ██║   ██║\n     ██║   ██║   ██║\n     ██║   ╚██████╔╝\n     ╚═╝    ╚═════╝{/bold}{/}\n\n';

  for (const msg of msgs) {
    content += `  ${msg}\n`;
    bootScreen.setContent(content);
    screen.render();
    await new Promise(r => setTimeout(r, 120 + Math.random() * 180));
  }

  content += `\n  {bold}{yellow-fg}> TERMINAL IS LIVE. STAY FROSTY.{/bold}{/}\n`;
  bootScreen.setContent(content);
  screen.render();
  await new Promise(r => setTimeout(r, 800));

  bootScreen.detach();
  showPage(0);
}

bootSequence();
