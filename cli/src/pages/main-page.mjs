import contrib from 'blessed-contrib';
import { tbl, logWidget, gaugeWidget, sparkWidget, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_hn } from '../services/hacker-news.mjs';
import { fetch_reddit } from '../services/reddit.mjs';
import { fetch_google_trends } from '../services/google-trends.mjs';
import { fetch_polymarket } from '../services/polymarket.mjs';
import { fetch_wiki_top } from '../services/wikipedia.mjs';
import { fetch_lobsters } from '../services/lobsters.mjs';
import { computeVibesIndex, computeDegenIndex } from '../services/vibes-index.mjs';

// Narrower columns for 4-col-span panels (still wide enough to read)
const NARROW = {
  feed: { w: [3, 50, 6, 6, 3], h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  pred: { w: [3, 45, 5, 10],   h: ['#', 'QUESTION', 'ODDS', 'VOLUME'] },
  kv:   { w: [3, 38, 14],      h: ['#', 'NAME', 'VALUE'] },
};

export function build(grid, W) {
  // ═══════════════════════════════════════════════════════════
  // Row 0-3: VIBES GAUGES + SPARKLINES (the hero section)
  // Two big gauges flanked by sparklines showing trends
  // ═══════════════════════════════════════════════════════════
  W.vibesGauge  = gaugeWidget(grid, 0, 0, 4, 3, `VIBES: SO COOKED/SO BACK`, 'yellow');
  W.vibesSpark  = sparkWidget(grid, 0, 3, 2, 3, `VIBES TREND (6h)`, 'yellow');
  W.degenGauge  = gaugeWidget(grid, 0, 6, 4, 3, `DEGEN INDEX`, 'magenta');
  W.degenSpark  = sparkWidget(grid, 0, 9, 2, 3, `DEGEN TREND (6h)`, 'magenta');
  // Donut for market sentiment composition
  W.donut = grid.set(2, 3, 2, 3, contrib.donut, {
    label: ` MARKET SENTIMENT `,
    radius: 8,
    arcWidth: 3,
    yPadding: 1,
    remainColor: 'black',
    style: { border: { fg: 'cyan' }, label: { fg: 'white', bold: true } },
    border: { type: 'line', fg: 'cyan' },
  });
  // Signal breakdown log
  W.signalLog = logWidget(grid, 2, 9, 2, 3, `SIGNALS`);

  // ═══════════════════════════════════════════════════════════
  // Row 4-7: MAIN FEEDS (the data section)
  // HN gets 8 cols (hero), trends sidebar 4 cols
  // ═══════════════════════════════════════════════════════════
  W.hn = tbl(grid, 4, 0, 4, 8, `HACKER NEWS`, COL.feed5, 'green');
  W.trends = tbl(grid, 4, 8, 4, 4, `GOOGLE TRENDS`, NARROW.kv, 'cyan');

  // ═══════════════════════════════════════════════════════════
  // Row 8-11: SECONDARY FEEDS
  // WSB, Polymarket, Lobsters
  // ═══════════════════════════════════════════════════════════
  W.reddit = tbl(grid, 8, 0, 4, 4, `r/WALLSTREETBETS`, NARROW.feed, 'yellow');
  W.poly   = tbl(grid, 8, 4, 4, 4, `POLYMARKET`, NARROW.pred, 'cyan');
  W.lobsters = tbl(grid, 8, 8, 4, 4, `LOBSTE.RS`, NARROW.feed, 'green');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker, tsRecord, tsSince } = ctx;

  const [hn, rd, tr, po, wk, lo, vibes, degen] = await Promise.allSettled([
    safe(cf('hn', () => fetch_hn(25), 120)),
    safe(cf('reddit-wsb', () => fetch_reddit('wallstreetbets', 20), 120)),
    safe(cf('g-trends', fetch_google_trends, 300)),
    safe(cf('polymarket', () => fetch_polymarket(15), 120)),
    safe(cf('wiki-top', fetch_wiki_top, 600)),
    safe(cf('lobsters', () => fetch_lobsters(20), 120)),
    safe(cf('idx-vibes', computeVibesIndex, 120)),
    safe(cf('idx-degen', computeDegenIndex, 120)),
  ]);

  // ── Tables (3rd arg = cache key for "updated X ago" label) ──
  set(W.hn, hn.value, 'hn');
  set(W.reddit, rd.value, 'reddit-wsb');
  set(W.trends, tr.value, 'g-trends');
  set(W.poly, po.value, 'polymarket');
  set(W.lobsters, lo.value, 'lobsters');

  // ── Vibes gauge + sparkline ──
  const log = W.signalLog;
  if (vibes.value?.index != null) {
    const v = vibes.value;
    W.vibesGauge?.setPercent(v.index);
    tsRecord('idx:vibes', v.index, v.label);
    log?.log(`{yellow-fg}{bold}VIBES: ${v.index}/100 — ${v.label}{/}`);
    v.breakdown?.forEach(b => log?.log(`{gray-fg}  ${b}{/}`));

    // Sparkline from timeseries
    try {
      const hist = tsSince('idx:vibes', 6 * 3600);
      if (hist.length > 1) {
        W.vibesSpark?.setData(['VIBES'], [hist.map(h => h.value)]);
      }
    } catch {}
  }

  // ── Degen gauge + sparkline ──
  if (degen.value?.index != null) {
    const d = degen.value;
    W.degenGauge?.setPercent(d.index);
    tsRecord('idx:degen', d.index, d.label);
    log?.log(`{magenta-fg}{bold}DEGEN: ${d.index}/100 — ${d.label}{/}`);
    d.breakdown?.forEach(b => log?.log(`{gray-fg}  ${b}{/}`));

    try {
      const hist = tsSince('idx:degen', 6 * 3600);
      if (hist.length > 1) {
        W.degenSpark?.setData(['DEGEN'], [hist.map(h => h.value)]);
      }
    } catch {}
  }

  // ── Donut: market sentiment composition ──
  if (vibes.value && degen.value) {
    const fear = 100 - (vibes.value.index || 50);
    const greed = degen.value.index || 50;
    const neutral = Math.max(0, 100 - fear - greed);
    try {
      W.donut?.setData([
        { percent: Math.round(fear), label: 'FEAR', color: 'red' },
        { percent: Math.round(greed), label: 'GREED', color: 'green' },
        { percent: Math.round(neutral), label: 'NEUTRAL', color: 'cyan' },
      ]);
    } catch {}
  }

  // ── Ticker ──
  const tickerItems = [];
  if (vibes.value) tickerItems.push(`VIBES: ${vibes.value.index}/100 ${vibes.value.label}`);
  if (degen.value) tickerItems.push(`DEGEN: ${degen.value.index}/100 ${degen.value.label}`);
  if (vibes.value?.breakdown) vibes.value.breakdown.forEach(b => tickerItems.push(b));
  if (hn.value?.[0]) tickerItems.push(`HN #1: ${hn.value[0][1]}`);
  if (tr.value?.[0]) tickerItems.push(`TRENDING: ${tr.value[0][1]}`);
  if (po.value?.[0]) tickerItems.push(`POLY: ${po.value[0][1]} ${po.value[0][2]}`);
  setTicker(tickerItems);
}
