import { fetchJSON, fmtNum } from '../fetch.mjs';

export async function fetch_manifold(count = 20) {
  const markets = await fetchJSON(
    `https://api.manifold.markets/v0/search-markets?sort=score&limit=${count}&filter=open`
  );
  return markets.map((m, i) => [
    String(i + 1),
    m.question.slice(0, 50),
    `${((m.probability ?? 0) * 100).toFixed(0)}%`,
    `$${fmtNum(m.volume)}`,
  ]);
}
