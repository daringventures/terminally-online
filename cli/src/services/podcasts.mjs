import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_top_podcasts(count = 25) {
  const data = await fetchJSON(
    `https://rss.marketingtools.apple.com/api/v2/us/podcasts/top/${count}/podcasts.json`
  );
  const results = data.feed?.results || [];
  return results.map((r, i) => [
    String(i + 1),
    trunc(r.name, 80),
    trunc(r.artistName || '', 30),
    trunc(r.genres?.[0]?.name || '', 20),
  ]);
}
