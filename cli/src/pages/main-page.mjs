import { tbl, logWidget, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_hn } from '../services/hacker-news.mjs';
import { fetch_reddit } from '../services/reddit.mjs';
import { fetch_google_trends } from '../services/google-trends.mjs';
import { fetch_polymarket } from '../services/polymarket.mjs';
import { fetch_manifold } from '../services/manifold.mjs';
import { fetch_wiki_top } from '../services/wikipedia.mjs';
import { fetch_lobsters } from '../services/lobsters.mjs';
import { fetch_producthunt } from '../services/producthunt.mjs';
import { fetch_congress } from '../services/congress.mjs';
import { computeVibesIndex, computeDegenIndex } from '../services/vibes-index.mjs';

// Narrow column defs for 4-col-span panels (~60 chars wide)
const NARROW = {
  feed:  { w: [3, 38, 6, 6, 3], h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  pred:  { w: [3, 34, 5, 10],   h: ['#', 'QUESTION', 'YES%', 'VOLUME'] },
  kv:    { w: [3, 28, 12],      h: ['#', 'NAME', 'VALUE'] },
  geo:   { w: [5, 34, 4, 6],    h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
  wide:  { w: [3, 50],          h: ['#', 'TITLE'] },
};

export function build(grid, W) {
  // Row 0-3: Top signals — full width HN + trends sidebar
  W.hn       = tbl(grid, 0, 0, 4, 8, `${I.hn} HACKER NEWS`, COL.feed5, 'green');
  W.trends   = tbl(grid, 0, 8, 4, 4, `${I.search} GOOGLE TRENDS`, NARROW.kv, 'cyan');

  // Row 4-7: Markets + culture
  W.reddit   = tbl(grid, 4, 0, 4, 4, `${I.reddit} r/WALLSTREETBETS`, NARROW.feed, 'yellow');
  W.poly     = tbl(grid, 4, 4, 4, 4, `${I.chart} POLYMARKET`, NARROW.pred, 'cyan');
  W.wiki     = tbl(grid, 4, 8, 4, 4, `${I.wiki} WIKI SPIKES`, NARROW.kv, 'white');

  // Row 8-11: Dev + gov + vibes breakdown
  W.lobsters = tbl(grid, 8, 0, 4, 4, `${I.trophy} LOBSTE.RS`, NARROW.feed, 'green');
  W.ph       = tbl(grid, 8, 4, 4, 4, `${I.rocket} PRODUCT HUNT`, NARROW.wide, 'yellow');
  W.vibesLog = logWidget(grid, 8, 8, 4, 4, `${I.chart} VIBES INDEX`);
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker, tsRecord } = ctx;

  const [hn, rd, tr, po, wk, lo, ph, vibes, degen] = await Promise.allSettled([
    safe(cf('hn', () => fetch_hn(25), 120)),
    safe(cf('reddit-wsb', () => fetch_reddit('wallstreetbets', 20), 120)),
    safe(cf('g-trends', fetch_google_trends, 300)),
    safe(cf('polymarket', () => fetch_polymarket(15), 120)),
    safe(cf('wiki-top', fetch_wiki_top, 600)),
    safe(cf('lobsters', () => fetch_lobsters(20), 120)),
    safe(cf('producthunt', () => fetch_producthunt(15), 600)),
    safe(cf('idx-vibes', computeVibesIndex, 120)),
    safe(cf('idx-degen', computeDegenIndex, 120)),
  ]);

  set(W.hn, hn.value);
  set(W.reddit, rd.value);
  set(W.trends, tr.value);
  set(W.poly, po.value);
  set(W.wiki, wk.value);
  set(W.lobsters, lo.value);
  set(W.ph, ph.value);

  // Vibes log — show index values as styled text (way more readable than gauges)
  const log = W.vibesLog;
  if (vibes.value?.index != null) {
    const v = vibes.value;
    const bar = '█'.repeat(Math.floor(v.index / 5)) + '░'.repeat(20 - Math.floor(v.index / 5));
    const color = v.index <= 30 ? 'red' : v.index <= 60 ? 'yellow' : 'green';
    log?.log(`{${color}-fg}{bold}VIBES ${v.index}/100{/bold}{/}`);
    log?.log(`{${color}-fg}${bar}{/}`);
    log?.log(`{white-fg}${v.label}{/}`);
    v.breakdown?.forEach(b => log?.log(`{gray-fg}  ${b}{/}`));
    tsRecord('idx:vibes', v.index, v.label);
  }
  if (degen.value?.index != null) {
    const d = degen.value;
    const bar = '█'.repeat(Math.floor(d.index / 5)) + '░'.repeat(20 - Math.floor(d.index / 5));
    const color = d.index >= 70 ? 'magenta' : d.index >= 40 ? 'yellow' : 'green';
    log?.log(`{${color}-fg}{bold}DEGEN ${d.index}/100{/bold}{/}`);
    log?.log(`{${color}-fg}${bar}{/}`);
    log?.log(`{white-fg}${d.label}{/}`);
    d.breakdown?.forEach(b => log?.log(`{gray-fg}  ${b}{/}`));
    tsRecord('idx:degen', d.index, d.label);
  }

  // Ticker
  const tickerItems = [];
  if (vibes.value) tickerItems.push(`VIBES: ${vibes.value.index}/100 ${vibes.value.label}`);
  if (degen.value) tickerItems.push(`DEGEN: ${degen.value.index}/100 ${degen.value.label}`);
  if (vibes.value?.breakdown) vibes.value.breakdown.forEach(b => tickerItems.push(b));
  if (hn.value?.[0]) tickerItems.push(`HN #1: ${hn.value[0][1]}`);
  if (tr.value?.[0]) tickerItems.push(`TRENDING: ${tr.value[0][1]}`);
  if (po.value?.[0]) tickerItems.push(`POLY: ${po.value[0][1]} ${po.value[0][2]}`);
  setTicker(tickerItems);
}
