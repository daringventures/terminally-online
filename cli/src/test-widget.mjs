#!/usr/bin/env node
/**
 * Widget testbench — render ONE widget at a time to get it right.
 * Usage: node src/test-widget.mjs [widget-name]
 *
 * Available: table, gauge, sparkline, donut, log, bar, lcd
 */
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { cachedFetch, tsRecord, tsSince, cacheAge } from './cache.mjs';
import { fetch_hn } from './services/hacker-news.mjs';
import { fetch_reddit } from './services/reddit.mjs';
import { computeVibesIndex, computeDegenIndex } from './services/vibes-index.mjs';

// ── Same per-column color rendering as main.mjs ──
const COL_COLORS = {
  '#': 'gray', 'PTS': 'yellow', 'CMTS': 'cyan', 'AGE': 'gray',
  'YES%': 'green', 'VOLUME': 'yellow', 'VALUE': 'yellow',
  'METRIC': 'cyan', 'MAG': 'red', 'DETAIL': 'gray',
};

function colorSet(widget, data, headers, widths, cellColor = 'green') {
  if (!widget || !data) return;
  const spacing = 2;
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

  let headerStr = '';
  for (let j = 0; j < headers.length; j++) {
    const w = widths[j] || 10;
    headerStr += headers[j] + ' '.repeat(Math.max(0, w - headers[j].length));
    if (j < headers.length - 1) headerStr += ' '.repeat(spacing);
  }

  widget.setContent(headerStr);
  widget.rows.setItems(rows);
}

const widgetName = process.argv[2] || 'table';

const screen = blessed.screen({
  smartCSR: true,
  title: `Widget Test: ${widgetName}`,
  fullUnicode: true,
  terminal: 'xterm-256color',
});

screen.key(['q', 'C-c', 'escape'], () => process.exit(0));

// Status line at bottom
const status = blessed.box({
  bottom: 0, left: 0, width: '100%', height: 1,
  tags: true,
  content: ` {cyan-fg}Testing: ${widgetName}{/} | {gray-fg}[q] quit [r] reload{/}`,
  style: { fg: 'white', bg: 'black' },
});

async function testTable() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const table = grid.set(0, 0, 12, 12, contrib.table, {
    label: ' HACKER NEWS ',
    keys: true,
    vi: true,
    interactive: true,
    mouse: true,
    tags: true,
    selectedFg: 'black',
    selectedBg: 'cyan',
    columnSpacing: 2,
    columnWidth: [3, 80, 8, 10, 5],
    style: {
      header: { fg: 'white', bold: true },
      cell: { fg: 'green' },
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });

  table.focus();
  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Fetching HN...{/}`);
  screen.render();

  const headers = ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'];
  const widths = [3, 80, 8, 10, 5];
  const data = await fetch_hn(25);
  colorSet(table, data, headers, widths, 'green');
  status.setContent(` {green-fg}Loaded ${data.length} items{/} | {gray-fg}[q] quit [↑↓] navigate [Enter] select{/}`);

  table.rows.on('select', (_item, idx) => {
    status.setContent(` {cyan-fg}Selected row ${idx}: ${data[idx]?.[1] || '?'}{/}`);
    screen.render();
  });

  screen.render();
}

async function testGauge() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  // Test different gauge sizes to find what looks good
  const g1 = grid.set(0, 0, 6, 6, contrib.gauge, {
    label: ' VIBES: SO COOKED / SO BACK ',
    stroke: 'yellow',
    fill: 'white',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const g2 = grid.set(0, 6, 6, 6, contrib.gauge, {
    label: ' DEGEN INDEX ',
    stroke: 'magenta',
    fill: 'white',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const g3 = grid.set(6, 0, 3, 4, contrib.gauge, {
    label: ' SMALL (3x4) ',
    stroke: 'green',
    fill: 'white',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const g4 = grid.set(6, 4, 3, 4, contrib.gauge, {
    label: ' SMALL (3x4) ',
    stroke: 'red',
    fill: 'white',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const g5 = grid.set(6, 8, 3, 4, contrib.gauge, {
    label: ' SMALL (3x4) ',
    stroke: 'cyan',
    fill: 'white',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const log = grid.set(9, 0, 3, 12, contrib.log, {
    label: ' GAUGE SIZE COMPARISON ',
    tags: true,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true }, text: { fg: 'green' } },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 20,
  });

  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Computing indices...{/}`);
  screen.render();

  const vibes = await computeVibesIndex();
  const degen = await computeDegenIndex();

  g1.setPercent(vibes.index);
  g2.setPercent(degen.index);
  g3.setPercent(42);
  g4.setPercent(78);
  g5.setPercent(15);

  log.log(`{yellow-fg}{bold}VIBES: ${vibes.index}/100 — ${vibes.label}{/}`);
  vibes.breakdown?.forEach(b => log.log(`  {gray-fg}${b}{/}`));
  log.log(`{magenta-fg}{bold}DEGEN: ${degen.index}/100 — ${degen.label}{/}`);
  degen.breakdown?.forEach(b => log.log(`  {gray-fg}${b}{/}`));
  log.log('');
  log.log('{white-fg}Top row: 6x6 (half screen). Bottom row: 3x4 (quarter screen).{/}');
  log.log('{white-fg}Which size looks best for gauges?{/}');

  status.setContent(` {green-fg}VIBES: ${vibes.index} | DEGEN: ${degen.index}{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

async function testSparkline() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const s1 = grid.set(0, 0, 4, 6, contrib.sparkline, {
    label: ' SPARKLINE (4x6) — RANDOM DATA ',
    tags: true,
    style: { fg: 'cyan', border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const s2 = grid.set(0, 6, 4, 6, contrib.sparkline, {
    label: ' SPARKLINE (4x6) — TWO SERIES ',
    tags: true,
    style: { fg: 'yellow', border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const s3 = grid.set(4, 0, 3, 4, contrib.sparkline, {
    label: ' SMALL (3x4) ',
    tags: true,
    style: { fg: 'green', border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const s4 = grid.set(4, 4, 3, 4, contrib.sparkline, {
    label: ' SMALL (3x4) ',
    tags: true,
    style: { fg: 'red', border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const s5 = grid.set(4, 8, 3, 4, contrib.sparkline, {
    label: ' SMALL (3x4) ',
    tags: true,
    style: { fg: 'magenta', border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  // DB sparkline
  const s6 = grid.set(7, 0, 5, 12, contrib.sparkline, {
    label: ' FROM DB: idx:vibes (last 6h) ',
    tags: true,
    style: { fg: 'yellow', border: { fg: 'yellow' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'yellow' },
  });

  screen.append(status);

  // Random data
  const rand = () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
  s1.setData(['Random'], [rand()]);
  s2.setData(['Series A', 'Series B'], [rand(), rand()]);
  s3.setData(['Small'], [rand().slice(0, 15)]);
  s4.setData(['Small'], [rand().slice(0, 15)]);
  s5.setData(['Small'], [rand().slice(0, 15)]);

  // DB data
  try {
    const hist = tsSince('idx:vibes', 6 * 3600);
    if (hist.length > 1) {
      s6.setData(['VIBES INDEX'], [hist.map(h => h.value)]);
      status.setContent(` {green-fg}DB: ${hist.length} data points{/} | {gray-fg}[q] quit{/}`);
    } else {
      s6.setData(['NO DATA YET'], [[0]]);
      status.setContent(` {yellow-fg}No timeseries data yet — run the dashboard to collect{/} | {gray-fg}[q] quit{/}`);
    }
  } catch {
    s6.setData(['DB ERROR'], [[0]]);
    status.setContent(` {red-fg}Could not read timeseries DB{/} | {gray-fg}[q] quit{/}`);
  }

  screen.render();
}

async function testDonut() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const d1 = grid.set(0, 0, 6, 4, contrib.donut, {
    label: ' MARKET SENTIMENT ',
    radius: 16,
    arcWidth: 4,
    yPadding: 2,
    remainColor: 'black',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const d2 = grid.set(0, 4, 6, 4, contrib.donut, {
    label: ' BTC DOMINANCE ',
    radius: 16,
    arcWidth: 4,
    yPadding: 2,
    remainColor: 'black',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const d3 = grid.set(0, 8, 6, 4, contrib.donut, {
    label: ' ENERGY MIX ',
    radius: 16,
    arcWidth: 4,
    yPadding: 2,
    remainColor: 'black',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  // Small donuts
  const d4 = grid.set(6, 0, 6, 4, contrib.donut, {
    label: ' SMALL (6x4) ',
    radius: 8,
    arcWidth: 3,
    yPadding: 1,
    remainColor: 'black',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const log = grid.set(6, 4, 6, 8, contrib.log, {
    label: ' DONUT SIZE COMPARISON ',
    tags: true,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true }, text: { fg: 'green' } },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 20,
  });

  screen.append(status);

  d1.setData([
    { percent: 35, label: 'FEAR', color: 'red' },
    { percent: 45, label: 'GREED', color: 'green' },
    { percent: 20, label: 'NEUTRAL', color: 'cyan' },
  ]);

  d2.setData([
    { percent: 56, label: 'BTC', color: 'yellow' },
    { percent: 18, label: 'ETH', color: 'cyan' },
    { percent: 26, label: 'ALTS', color: 'magenta' },
  ]);

  d3.setData([
    { percent: 40, label: 'SOLAR', color: 'yellow' },
    { percent: 30, label: 'WIND', color: 'cyan' },
    { percent: 15, label: 'HYDRO', color: 'blue' },
    { percent: 15, label: 'OTHER', color: 'green' },
  ]);

  d4.setData([
    { percent: 80, label: 'USED', color: 'red' },
    { percent: 20, label: 'FREE', color: 'green' },
  ]);

  log.log('{white-fg}{bold}DONUT SIZING GUIDE:{/}');
  log.log('  Top row: 6x4 grid units, radius: 16, arcWidth: 4');
  log.log('  Bottom-left: 6x4, radius: 8, arcWidth: 3');
  log.log('');
  log.log('{white-fg}Donuts need at least 6 rows of height to render the arc.');
  log.log('Width of 4 cols is the minimum for legibility.');
  log.log('radius 8 is compact, 16 is full-size.{/}');

  status.setContent(` {green-fg}Donuts rendered{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

async function testLog() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const log = grid.set(0, 0, 12, 12, contrib.log, {
    label: ' SIGNAL FEED ',
    tags: true,
    keys: true,
    mouse: true,
    scrollable: true,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true }, text: { fg: 'green' } },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 100,
  });

  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Computing indices...{/}`);
  screen.render();

  const vibes = await computeVibesIndex();
  const degen = await computeDegenIndex();

  // Header
  log.log('{white-fg}{bold}╔══════════════════════════════════════════════════╗{/}');
  log.log('{white-fg}{bold}║            TERMINALLY ONLINE — SIGNALS           ║{/}');
  log.log('{white-fg}{bold}╚══════════════════════════════════════════════════╝{/}');
  log.log('');

  // Vibes bar
  const vBar = '█'.repeat(Math.floor(vibes.index / 5)) + '░'.repeat(20 - Math.floor(vibes.index / 5));
  const vColor = vibes.index <= 30 ? 'red' : vibes.index <= 60 ? 'yellow' : 'green';
  log.log(`{${vColor}-fg}{bold}  VIBES   ${vBar}  ${vibes.index}/100  ${vibes.label}{/}`);
  vibes.breakdown?.forEach(b => log.log(`{gray-fg}           ${b}{/}`));
  log.log('');

  // Degen bar
  const dBar = '█'.repeat(Math.floor(degen.index / 5)) + '░'.repeat(20 - Math.floor(degen.index / 5));
  const dColor = degen.index >= 70 ? 'magenta' : degen.index >= 40 ? 'yellow' : 'green';
  log.log(`{${dColor}-fg}{bold}  DEGEN   ${dBar}  ${degen.index}/100  ${degen.label}{/}`);
  degen.breakdown?.forEach(b => log.log(`{gray-fg}           ${b}{/}`));
  log.log('');

  log.log('{white-fg}{bold}──────────────────────────────────────────────────{/}');
  log.log('{gray-fg}  The log widget is good for real-time event streams,{/}');
  log.log('{gray-fg}  index breakdowns, and any multi-line formatted text.{/}');
  log.log('{gray-fg}  It supports blessed tags for colors and bold.{/}');
  log.log('{gray-fg}  It scrolls automatically as new content is added.{/}');

  status.setContent(` {green-fg}Log rendered{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

async function testBar() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const bar = grid.set(0, 0, 6, 6, contrib.bar, {
    label: ' HN TOP STORIES — POINTS ',
    barWidth: 6,
    barSpacing: 2,
    xOffset: 0,
    maxHeight: 9,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const bar2 = grid.set(0, 6, 6, 6, contrib.bar, {
    label: ' HN TOP — COMMENTS ',
    barWidth: 6,
    barSpacing: 2,
    xOffset: 0,
    maxHeight: 9,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const table = grid.set(6, 0, 6, 12, contrib.table, {
    label: ' SOURCE DATA ',
    keys: true,
    interactive: true,
    columnSpacing: 2,
    columnWidth: [3, 80, 8, 10, 5],
    style: {
      header: { fg: 'white', bold: true },
      cell: { fg: 'green' },
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });

  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Fetching HN...{/}`);
  screen.render();

  const data = await fetch_hn(10);

  // Bar charts from feed data
  const titles = data.map(r => r[1]?.slice(0, 8) || '?');
  const points = data.map(r => parseInt(r[2]) || 0);
  const comments = data.map(r => parseInt(r[3]) || 0);

  bar.setData({ titles, data: points });
  bar2.setData({ titles, data: comments });
  table.setData({ headers: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'], data });

  table.focus();
  status.setContent(` {green-fg}Bar charts + table from HN data{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

async function testLcd() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  const lcd1 = grid.set(0, 0, 4, 6, contrib.lcd, {
    label: ' VIBES INDEX ',
    segmentWidth: 0.06,
    segmentInterval: 0.11,
    strokeWidth: 0.11,
    elements: 3,
    display: '---',
    elementSpacing: 4,
    elementPadding: 2,
    color: 'yellow',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const lcd2 = grid.set(0, 6, 4, 6, contrib.lcd, {
    label: ' DEGEN INDEX ',
    segmentWidth: 0.06,
    segmentInterval: 0.11,
    strokeWidth: 0.11,
    elements: 3,
    display: '---',
    elementSpacing: 4,
    elementPadding: 2,
    color: 'magenta',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const log = grid.set(4, 0, 8, 12, contrib.log, {
    label: ' LCD NOTES ',
    tags: true,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true }, text: { fg: 'green' } },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 20,
  });

  screen.append(status);
  screen.render();

  const vibes = await computeVibesIndex();
  const degen = await computeDegenIndex();

  lcd1.setDisplay(String(vibes.index).padStart(3, ' '));
  lcd2.setDisplay(String(degen.index).padStart(3, ' '));

  log.log('{white-fg}{bold}LCD DISPLAY{/}');
  log.log('{gray-fg}Good for showing a single BIG number — like an index value.{/}');
  log.log('{gray-fg}Needs 4 rows minimum. elements = number of digits.{/}');
  log.log('{gray-fg}Best for: index scores, gas prices, countdown timers.{/}');
  log.log('');
  log.log(`{yellow-fg}VIBES: ${vibes.index} — ${vibes.label}{/}`);
  log.log(`{magenta-fg}DEGEN: ${degen.index} — ${degen.label}{/}`);

  status.setContent(` {green-fg}LCD rendered{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

async function testOdds() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  // Odds board — uses a log widget with manually rendered probability bars
  const odds = grid.set(0, 0, 12, 12, contrib.log, {
    label: ' POLYMARKET — PREDICTION ODDS ',
    tags: true,
    keys: true,
    mouse: true,
    scrollable: true,
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
      text: { fg: 'white' },
    },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 100,
  });

  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Fetching Polymarket...{/}`);
  screen.render();

  const { fetch_polymarket } = await import('./services/polymarket.mjs');
  const data = await fetch_polymarket(15);

  // Render each prediction as a visual odds bar
  const barWidth = 40;
  odds.log('{white-fg}{bold} QUESTION                                        YES%     VOLUME{/}');
  odds.log('{gray-fg}' + '─'.repeat(80) + '{/}');

  for (const row of data) {
    const title = String(row[1] || '').padEnd(48).slice(0, 48);
    const pctStr = String(row[2] || '0%').replace('%', '');
    const pct = parseInt(pctStr) || 0;
    const vol = String(row[3] || '');

    // Build the probability bar
    const filled = Math.round((pct / 100) * barWidth);
    const empty = barWidth - filled;

    // Color based on probability
    let barColor;
    if (pct >= 70) barColor = 'green';
    else if (pct >= 40) barColor = 'yellow';
    else if (pct >= 20) barColor = 'cyan';
    else barColor = 'red';

    const bar = `{${barColor}-fg}${'█'.repeat(filled)}{/}{gray-fg}${'░'.repeat(empty)}{/}`;

    odds.log(`{white-fg}${title}{/} {${barColor}-fg}{bold}${pctStr.padStart(3)}%{/} ${bar} {gray-fg}${vol}{/}`);
  }

  odds.log('');
  odds.log('{gray-fg}' + '─'.repeat(80) + '{/}');
  odds.log('{gray-fg}  Bars show probability. Green ≥70%, Yellow ≥40%, Cyan ≥20%, Red <20%{/}');

  status.setContent(` {green-fg}${data.length} markets loaded{/} | {gray-fg}[q] quit [↑↓] scroll{/}`);
  screen.render();
}

async function testWiki() {
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, bottom: 1 });

  // Wiki spikes as horizontal bar chart
  const { fetch_wiki_top } = await import('./services/wikipedia.mjs');

  const bar = grid.set(0, 0, 6, 12, contrib.bar, {
    label: ' WIKIPEDIA — TOP VIEWED (views) ',
    barWidth: 8,
    barSpacing: 2,
    xOffset: 0,
    maxHeight: 9,
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });

  const table = grid.set(6, 0, 6, 12, contrib.table, {
    label: ' SOURCE DATA ',
    keys: true,
    interactive: true,
    tags: true,
    columnSpacing: 2,
    columnWidth: [3, 50, 14],
    style: {
      header: { fg: 'white', bold: true },
      cell: { fg: 'white' },
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });

  screen.append(status);
  screen.render();

  status.setContent(` {yellow-fg}Fetching Wikipedia...{/}`);
  screen.render();

  const data = await fetch_wiki_top();
  const top10 = data.slice(0, 10);

  const titles = top10.map(r => (r[1] || '?').slice(0, 8));
  const views = top10.map(r => parseInt(String(r[2] || '0').replace(/[^0-9]/g, '')) || 0);

  bar.setData({ titles, data: views });
  table.setData({ headers: ['#', 'ARTICLE', 'VIEWS'], data: top10 });
  table.focus();

  status.setContent(` {green-fg}Wiki bar chart + table{/} | {gray-fg}[q] quit{/}`);
  screen.render();
}

// ── Run selected test ──
const tests = { table: testTable, gauge: testGauge, sparkline: testSparkline, donut: testDonut, log: testLog, bar: testBar, lcd: testLcd, odds: testOdds, wiki: testWiki };
const fn = tests[widgetName];
if (!fn) {
  console.error(`Unknown widget: ${widgetName}. Available: ${Object.keys(tests).join(', ')}`);
  process.exit(1);
}
fn().catch(e => { console.error(e); process.exit(1); });
