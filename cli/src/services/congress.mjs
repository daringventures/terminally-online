import { fetchText } from '../fetch.mjs';

export async function fetch_congress(count = 20) {
  const xml = await fetchText('https://www.congress.gov/rss/most-viewed-bills.xml');
  const items = xml.split('<item>').slice(1);
  const rows = [];
  for (const item of items) {
    if (rows.length >= count) break;
    const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '';
    const match = title.match(/^((?:H\.R\.|S\.|H\.Res\.|S\.Res\.)\d+)\s*-\s*(.*)/);
    rows.push([
      match?.[1] ?? '',
      (match?.[2] ?? title).slice(0, 55),
      match?.[1]?.startsWith('S') ? 'Senate' : 'House',
    ]);
  }
  return rows;
}
