import { fetchJSON } from '../fetch.mjs';

export async function fetch_trending_coins() {
  const data = await fetchJSON('https://api.coingecko.com/api/v3/search/trending');
  return data.coins.map((c, i) => {
    const it = c.item;
    const pct = it.data?.price_change_percentage_24h?.usd;
    return [
      String(i + 1),
      it.name,
      it.symbol.toUpperCase(),
      it.market_cap_rank ? `#${it.market_cap_rank}` : '-',
      pct != null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%` : '-',
    ];
  });
}
