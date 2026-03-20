import { fetchText, trunc } from '../fetch.mjs';

export async function fetch_google_trends() {
  const xml = await fetchText('https://trends.google.com/trending/rss?geo=US');
  const items = xml.split('<item>').slice(1);
  return items.map((item, i) => {
    const title = item.match(/<title>(.*?)<\/title>/)?.[1]?.trim() ?? '';
    const traffic = item.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] ?? '';
    return [String(i + 1), trunc(title, 80), traffic ? traffic + '+' : ''];
  });
}
