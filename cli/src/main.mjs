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
import { getTimeString } from './vibes.mjs';

// no performative shit — just data

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
// Standard column layouts (blessed-contrib columnWidth is in chars)
const COL = {
  feed5: [3, 45, 6, 6, 3],    // #, title, pts, cmt, age
  feed3: [3, 50, 8],           // #, title, metric
  feed4: [3, 42, 6, 8],       // #, title, pct, volume
  pred:  [3, 40, 5, 9],       // #, question, yes%, volume
  wide2: [3, 55],              // #, title only
  kv3:   [3, 30, 10],          // #, name, value
  geo:   [5, 40, 4, 5],        // mag/bill, location/title, age, extra
};

function tbl(row, col, rowSpan, colSpan, label, widths) {
  return grid.set(row, col, rowSpan, colSpan, contrib.table, {
    label: ` ${label} `,
    keys: false,
    interactive: false,
    columnSpacing: 2,
    columnWidth: widths,
    style: {
      header: { fg: 'cyan', bold: true },
      cell: { fg: 'green' },
      border: { fg: 'gray' },
      label: { fg: 'yellow', bold: true },
    },
    border: { type: 'line', fg: 'gray' },
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

// ── Ticker bar at TOP ───────────────────────────────────
const tickerBar = blessed.box({
  top: 0, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'yellow', bg: 'black' },
});

let tickerText = '';
let tickerOffset = 0;

function setTicker(items) {
  tickerText = items.map(t => `  ◆ ${t}  `).join('{gray-fg}│{/}');
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
      ? `{yellow-fg}{bold}${n}{/bold}{/}`
      : `{gray-fg}${n}{/}`
  ).join('{gray-fg}│{/}');
  const time = getTimeString();
  statusBar.setContent(
    ` ${tabs} {gray-fg}│{/} ${msg} {gray-fg}│{/} {white-fg}${time}{/} {gray-fg}│{/} {cyan-fg}[1-6]{/} {cyan-fg}[r]{/} {cyan-fg}[q]{/}`
  );
  screen.render();
}

// ── Page builders ───────────────────────────────────────
function clearScreen() {
  // Detach everything, we'll re-append what we need
  while (screen.children.length) {
    screen.children[0].detach();
  }
}

function buildMain() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  W.hn = tbl(0, 0, 4, 4, `${I.hn}HACKER NEWS`, COL.feed5);
  W.reddit = tbl(0, 4, 4, 4, `${I.reddit}r/WALLSTREETBETS`, COL.feed5);
  W.trends = tbl(0, 8, 4, 4, `${I.search}GOOGLE TRENDS`, COL.feed3);

  W.poly = tbl(4, 0, 4, 4, `${I.chart}POLYMARKET`, COL.pred);
  W.manifold = tbl(4, 4, 4, 4, `${I.brain}MANIFOLD`, COL.pred);
  W.vibes = gaugeWidget(4, 8, 2, 2, `${I.fire}COOKED/BACK`, 'yellow');
  W.degen = gaugeWidget(6, 8, 2, 2, `${I.bolt}DEGEN`, 'magenta');
  W.wiki = tbl(4, 10, 4, 2, `${I.wiki}WIKI SPIKES`, COL.kv3);

  W.lobsters = tbl(8, 0, 4, 4, `${I.trophy}LOBSTE.RS`, COL.feed5);
  W.ph = tbl(8, 4, 4, 4, `${I.rocket}PRODUCT HUNT`, COL.wide2);
  W.congress = tbl(8, 8, 4, 4, `${I.gov}CONGRESS`, COL.geo);
}

function buildMarkets() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  W.dex = tbl(0, 0, 4, 6, `${I.bolt}DEX BOOSTED`, COL.feed4);
  W.coins = tbl(0, 6, 4, 6, `${I.coin}TRENDING COINS`, COL.feed5);
  W.poly2 = tbl(4, 0, 4, 6, `${I.chart}POLYMARKET`, COL.pred);
  W.manifold2 = tbl(4, 6, 4, 6, `${I.brain}MANIFOLD`, COL.pred);
  W.insider = tbl(8, 0, 4, 6, `${I.money}SEC INSIDER`, COL.feed4);
  W.breaches = tbl(8, 6, 4, 6, `${I.skull}DATA BREACHES`, COL.feed4);
}

function buildDev() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  W.github = tbl(0, 0, 4, 6, `${I.git}GITHUB RISING`, COL.feed4);
  W.arxiv = tbl(0, 6, 4, 6, `${I.brain}ARXIV AI`, COL.feed4);
  W.npm = tbl(4, 0, 4, 4, `${I.pkg}NPM`, COL.kv3);
  W.pypi = tbl(4, 4, 4, 4, `${I.pkg}PYPI`, COL.kv3);
  W.s2 = tbl(4, 8, 4, 4, `${I.brain}SEMANTIC SCHOLAR`, COL.feed4);
  W.hn2 = tbl(8, 0, 4, 6, `${I.hn}HACKER NEWS`, COL.feed5);
  W.lobsters2 = tbl(8, 6, 4, 6, `${I.trophy}LOBSTE.RS`, COL.feed5);
}

function buildWeird() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  W.wiki2 = tbl(0, 0, 4, 6, `${I.wiki}WIKIPEDIA TOP`, COL.feed3);
  W.crtsh = tbl(0, 6, 4, 6, `${I.cert}CERT TRANSPARENCY`, COL.feed3);
  W.usa = tbl(4, 0, 4, 6, `${I.money}FED CONTRACTS`, COL.feed4);
  W.wayback = tbl(4, 6, 4, 6, `${I.clock}WAYBACK MACHINE`, COL.feed3);
  W.ooni = tbl(8, 0, 4, 6, `${I.lock}CENSORSHIP`, COL.feed4);
  W.quakes2 = tbl(8, 6, 4, 6, `${I.quake}EARTHQUAKES`, COL.geo);
}

function buildIntel() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
  W.insider2 = tbl(0, 0, 4, 6, `${I.money}SEC INSIDER`, COL.feed4);
  W.congress2 = tbl(0, 6, 4, 6, `${I.gov}CONGRESS`, COL.geo);
  W.breaches2 = tbl(4, 0, 4, 6, `${I.skull}BREACHES`, COL.feed4);
  W.trends2 = tbl(4, 6, 4, 6, `${I.search}GOOGLE TRENDS`, COL.feed3);
  W.reddit2 = tbl(8, 0, 4, 6, `${I.reddit}r/TECHNOLOGY`, COL.feed5);
  W.reddit3 = tbl(8, 6, 4, 6, `${I.reddit}r/CRYPTOCURRENCY`, COL.feed5);
}

function buildVibes() {
  grid = new contrib.grid({ rows: 12, cols: 12, screen, top: 1, bottom: 1 });
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

// ── Boot ────────────────────────────────────────────────
showPage(0);
