import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_federal_register } from '../services/federal-register.mjs';
import { fetch_fda_recalls } from '../services/fda.mjs';
import { fetch_cfpb } from '../services/cfpb.mjs';
import { fetch_treasury } from '../services/treasury.mjs';
import { fetch_citibike } from '../services/citibike.mjs';
import { fetch_mempool } from '../services/bitcoin-mempool.mjs';
import { fetch_eth_gas } from '../services/eth-gas.mjs';
import { fetch_nyc_311 } from '../services/nyc-311.mjs';

export function build(grid, W) {
  W.fedReg = tbl(grid, 0, 0, 4, 6, `${I.gov} FEDERAL REGISTER (TODAY)`, COL.feed3, 'yellow');
  W.fda = tbl(grid, 0, 6, 4, 6, `${I.lock} FDA RECALLS + ADVERSE`, COL.feed4, 'red');
  W.cfpb = tbl(grid, 4, 0, 4, 4, `${I.money} CFPB COMPLAINTS`, COL.feed4, 'magenta');
  W.treasury = tbl(grid, 4, 4, 4, 4, `${I.money} TREASURY RATES`, COL.kv3, 'cyan');
  W.citi = tbl(grid, 4, 8, 4, 4, `${I.globe} CITI BIKE LIVE`, COL.kv3, 'green');
  W.mempool = tbl(grid, 8, 0, 4, 4, `${I.coin} BTC MEMPOOL`, COL.kv3, 'yellow');
  W.gas = tbl(grid, 8, 4, 4, 4, `${I.coin} ETH GAS (GWEI)`, COL.kv3, 'cyan');
  W.nyc311 = tbl(grid, 8, 8, 4, 4, `${I.globe} NYC 311 COMPLAINTS`, COL.feed4, 'white');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker, tsRecord } = ctx;

  const [fr, fda, cfp, tr, cb, mp, gas, n3] = await Promise.allSettled([
    safe(cf('fed-reg', () => fetch_federal_register(15), 3600)),
    safe(cf('fda-recalls', () => fetch_fda_recalls(12), 3600)),
    safe(cf('cfpb', () => fetch_cfpb(12), 3600)),
    safe(cf('treasury', fetch_treasury, 3600)),
    safe(cf('citibike', fetch_citibike, 60)),
    safe(cf('btc-mempool', fetch_mempool, 30)),
    safe(cf('eth-gas', fetch_eth_gas, 30)),
    safe(cf('nyc-311', () => fetch_nyc_311(15), 300)),
  ]);
  set(W.fedReg, fr.value); set(W.fda, fda.value);
  set(W.cfpb, cfp.value); set(W.treasury, tr.value);
  set(W.citi, cb.value); set(W.mempool, mp.value);
  set(W.gas, gas.value); set(W.nyc311, n3.value);

  // Record timeseries for graphable data
  if (gas.value?.[1]) { const gwei = parseFloat(gas.value[1]?.[1]); if (!isNaN(gwei)) tsRecord('eth:gas-avg', gwei, 'gwei'); }
  if (mp.value?.[0]) { const txs = parseInt(String(mp.value[0]?.[1]).replace(/,/g, '')); if (!isNaN(txs)) tsRecord('btc:mempool-txs', txs, 'unconfirmed'); }
  if (cb.value?.[0]) { const bikes = parseInt(String(cb.value[0]?.[1]).replace(/,/g, '')); if (!isNaN(bikes)) tsRecord('nyc:citibike-avail', bikes, 'bikes'); }

  const tickerItems = [];
  if (fr.value?.[0]) tickerItems.push(`${I.gov}REG: ${fr.value[0][1]}`);
  if (cb.value?.[0]) tickerItems.push(`${I.globe}CITI: ${cb.value[0][1]} ${cb.value[0][2]}`);
  if (mp.value?.[0]) tickerItems.push(`${I.coin}BTC: ${mp.value[0][1]} ${mp.value[0][2]}`);
  if (n3.value?.[0]) tickerItems.push(`${I.globe}311: ${n3.value[0][0]} — ${n3.value[0][1]}`);
  setTicker(tickerItems);
}
