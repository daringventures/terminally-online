import { fetchJSON, fmtNum } from '../fetch.mjs';

export async function fetch_polymarket(count = 20) {
  const events = await fetchJSON(
    `https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=${count}`
  );
  return events
    .filter(e => e.markets?.length)
    .map((e, i) => {
      const m = e.markets[0];
      let pct = 0;
      try { pct = JSON.parse(m.outcomePrices)[0] ?? 0; } catch {}
      return [
        String(i + 1),
        (e.title || m.question).slice(0, 50),
        `${(pct * 100).toFixed(0)}%`,
        `$${fmtNum(m.volume)}`,
      ];
    });
}
