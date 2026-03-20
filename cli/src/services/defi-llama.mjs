import { fetchJSON, fmtNum } from '../fetch.mjs';

export async function fetch_defi_tvl(count = 15) {
  const chains = await fetchJSON('https://api.llama.fi/v2/chains');
  const sorted = chains
    .filter(c => c.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl);

  const top = sorted.slice(0, count);
  const total = sorted.reduce((sum, c) => sum + c.tvl, 0);

  return top.map((c, i) => {
    const pct = total > 0 ? `${((c.tvl / total) * 100).toFixed(1)}%` : '0%';
    return [
      String(i + 1),
      c.name.slice(0, 20),
      `$${fmtNum(c.tvl)}`,
      pct,
    ];
  });
}
