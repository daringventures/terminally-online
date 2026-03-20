import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

export async function fetch_dex_boosts(count = 20) {
  const data = await fetchJSON('https://api.dexscreener.com/token-boosts/latest/v1');
  return data.slice(0, count).map((t, i) => [
    String(i + 1),
    trunc(t.description || t.tokenAddress?.slice(0, 12) + '…', 60),
    t.chainId,
    `$${fmtNum(Math.round(parseFloat(t.totalAmount) || 0))}`,
  ]);
}
