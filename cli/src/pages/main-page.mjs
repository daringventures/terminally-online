import { tbl, gaugeWidget, logWidget } from '../ui/widgets.mjs';
import { I, C } from '../ui/theme.mjs';
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

const COL = {
  feed5: { w: [3, 52, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed3: { w: [3, 58, 10],       h: ['#', 'TITLE', 'METRIC'] },
  pred:  { w: [3, 46, 6, 12],    h: ['#', 'QUESTION', 'YES%', 'VOLUME'] },
  wide2: { w: [3, 65],           h: ['#', 'TITLE'] },
  kv3:   { w: [3, 36, 14],       h: ['#', 'NAME', 'VALUE'] },
  geo:   { w: [6, 46, 5, 8],     h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
};

export function build(grid, W) {
  // Row 0-2: Gauges across the top — BIG and visible
  W.vibes = gaugeWidget(grid, 0, 0, 3, 3, `${I.fire} SO COOKED / SO BACK`, 'yellow');
  W.degen = gaugeWidget(grid, 0, 3, 3, 3, `${I.bolt} DEGEN INDEX`, 'magenta');
  W.hn = tbl(grid, 0, 6, 3, 6, `${I.hn} HACKER NEWS`, COL.feed5, 'green');

  // Row 3-6: Main feeds
  W.reddit = tbl(grid, 3, 0, 3, 4, `${I.reddit} r/WALLSTREETBETS`, COL.feed5, 'yellow');
  W.trends = tbl(grid, 3, 4, 3, 4, `${I.search} GOOGLE TRENDS`, COL.feed3, 'cyan');
  W.wiki = tbl(grid, 3, 8, 3, 4, `${I.wiki} WIKI SPIKES`, COL.kv3, 'white');

  // Row 6-9: Prediction markets + Lobsters
  W.poly = tbl(grid, 6, 0, 3, 4, `${I.chart} POLYMARKET`, COL.pred, 'cyan');
  W.manifold = tbl(grid, 6, 4, 3, 4, `${I.brain} MANIFOLD`, COL.pred, 'magenta');
  W.lobsters = tbl(grid, 6, 8, 3, 4, `${I.trophy} LOBSTE.RS`, COL.feed5, 'green');

  // Row 9-12: Bottom row
  W.ph = tbl(grid, 9, 0, 3, 4, `${I.rocket} PRODUCT HUNT`, COL.wide2, 'yellow');
  W.congress = tbl(grid, 9, 4, 3, 4, `${I.gov} CONGRESS`, COL.geo, 'red');
  W.breakdownLog = logWidget(grid, 9, 8, 3, 4, `${I.chart} SIGNAL BREAKDOWN`);
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker, tsRecord } = ctx;

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
    W.vibes?.setLabel(` ${I.fire} ${v.label}: ${v.index}/100 `);
    tsRecord('idx:vibes', v.index, v.label);
  }
  // Degen index gauge
  if (degen.value?.index != null) {
    const d = degen.value;
    W.degen?.setPercent(d.index);
    W.degen?.setLabel(` ${I.bolt} ${d.label}: ${d.index}/100 `);
    tsRecord('idx:degen', d.index, d.label);
  }

  // Push breakdowns into log widget
  const log = W.breakdownLog;
  if (vibes.value) {
    log?.log(`{bold}{yellow-fg}${I.fire}VIBES: ${vibes.value.index}/100 — ${vibes.value.label}{/}`);
    vibes.value.breakdown?.forEach(b => log?.log(`  ${b}`));
  }
  if (degen.value) {
    log?.log(`{bold}{magenta-fg}${I.bolt}DEGEN: ${degen.value.index}/100 — ${degen.value.label}{/}`);
    degen.value.breakdown?.forEach(b => log?.log(`  ${b}`));
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
