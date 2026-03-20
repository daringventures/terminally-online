import { fetchText, trunc } from '../fetch.mjs';

export async function fetch_producthunt(count = 20) {
  const xml = await fetchText('https://www.producthunt.com/feed');
  // PH uses Atom format: <entry> not <item>
  const items = xml.split('<entry>').slice(1);
  return items.slice(0, count).map((item, i) => {
    const title = item.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '';
    return [String(i + 1), trunc(title, 80)];
  });
}
