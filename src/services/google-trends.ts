export interface TrendingSearch {
  title: string;
  pubDate: string;
  link: string;
  trafficVolume?: string;
}

export async function fetchGoogleTrends(): Promise<TrendingSearch[]> {
  // Google Trends RSS — no auth, no scraping
  const res = await fetch('https://trends.google.com/trending/rss?geo=US');
  if (!res.ok) throw new Error(`Google Trends RSS: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const items = doc.querySelectorAll('item');

  const results: TrendingSearch[] = [];
  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent?.trim();
    if (!title) return;
    results.push({
      title,
      pubDate: item.querySelector('pubDate')?.textContent?.trim() ?? '',
      link: item.querySelector('link')?.textContent?.trim() ?? '',
      trafficVolume: item.getElementsByTagName('ht:approx_traffic')[0]?.textContent?.trim() ?? undefined,
    });
  });

  return results;
}
