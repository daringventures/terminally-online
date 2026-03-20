import { fetchJSON } from '../fetch.mjs';

export async function fetch_eth_gas() {
  const data = await fetchJSON(
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle'
  );
  const r = data.result;
  return [
    ['SAFE',      String(r.SafeGasPrice),                          'gwei'],
    ['STANDARD',  String(r.ProposeGasPrice),                       'gwei'],
    ['FAST',      String(r.FastGasPrice),                          'gwei'],
    ['BASE FEE',  String(parseFloat(r.suggestBaseFee).toFixed(2)), 'gwei'],
  ];
}
