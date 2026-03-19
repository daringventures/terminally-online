import { fetchText } from '../fetch.mjs';

export async function fetch_producthunt(count = 20) {
  const xml = await fetchText('https://www.producthunt.com/feed');
  const items = xml.split('<item>').slice(1);
  return items.slice(0, count).map((item, i) => {
    const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '';
    return [String(i + 1), title.slice(0, 55)];
  });
}
