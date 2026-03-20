import { tbl } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_insider_trades } from '../services/sec-edgar.mjs';
import { fetch_congress } from '../services/congress.mjs';
import { fetch_breaches } from '../services/hibp.mjs';
import { fetch_google_trends } from '../services/google-trends.mjs';
import { fetch_reddit } from '../services/reddit.mjs';

const COL = {
  feed5: { w: [3, 52, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed3: { w: [3, 58, 10],       h: ['#', 'TITLE', 'METRIC'] },
  feed4: { w: [3, 48, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  geo:   { w: [6, 46, 5, 8],     h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
};

export function build(grid, W) {
  W.insider2 = tbl(grid, 0, 0, 4, 6, `${I.money} SEC INSIDER`, COL.feed4, 'red');
  W.congress2 = tbl(grid, 0, 6, 4, 6, `${I.gov} CONGRESS`, COL.geo, 'yellow');
  W.breaches2 = tbl(grid, 4, 0, 4, 6, `${I.skull} BREACHES`, COL.feed4, 'red');
  W.trends2 = tbl(grid, 4, 6, 4, 6, `${I.search} GOOGLE TRENDS`, COL.feed3, 'cyan');
  W.reddit2 = tbl(grid, 8, 0, 4, 6, `${I.reddit} r/TECHNOLOGY`, COL.feed5, 'green');
  W.reddit3 = tbl(grid, 8, 6, 4, 6, `${I.reddit} r/CRYPTOCURRENCY`, COL.feed5, 'yellow');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

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
