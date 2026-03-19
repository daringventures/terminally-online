import { fetchJSON } from '../fetch.mjs';

export async function fetch_dex_boosts(count = 20) {
  const data = await fetchJSON('https://api.dexscreener.com/token-boosts/latest/v1');
  return data.slice(0, count).map((t, i) => [
    String(i + 1),
    (t.description || t.tokenAddress?.slice(0, 12) + '…').slice(0, 40),
    t.chainId,
    `$${t.totalAmount}`,
  ]);
}
