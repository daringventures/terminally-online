import { tbl } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_dex_boosts } from '../services/dexscreener.mjs';
import { fetch_trending_coins } from '../services/coingecko.mjs';
import { fetch_polymarket } from '../services/polymarket.mjs';
import { fetch_manifold } from '../services/manifold.mjs';
import { fetch_insider_trades } from '../services/sec-edgar.mjs';
import { fetch_breaches } from '../services/hibp.mjs';

const COL = {
  feed5: { w: [3, 52, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed4: { w: [3, 48, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  pred:  { w: [3, 46, 6, 12],    h: ['#', 'QUESTION', 'YES%', 'VOLUME'] },
};

export function build(grid, W) {
  W.dex = tbl(grid, 0, 0, 4, 6, `${I.bolt} DEX BOOSTED`, COL.feed4, 'yellow');
  W.coins = tbl(grid, 0, 6, 4, 6, `${I.coin} TRENDING COINS`, COL.feed5, 'green');
  W.poly2 = tbl(grid, 4, 0, 4, 6, `${I.chart} POLYMARKET`, COL.pred, 'cyan');
  W.manifold2 = tbl(grid, 4, 6, 4, 6, `${I.brain} MANIFOLD`, COL.pred, 'magenta');
  W.insider = tbl(grid, 8, 0, 4, 6, `${I.money} SEC INSIDER`, COL.feed4, 'red');
  W.breaches = tbl(grid, 8, 6, 4, 6, `${I.skull} DATA BREACHES`, COL.feed4, 'red');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

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
