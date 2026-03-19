import type { FeedItem } from '@/types/feed';

interface RSSChannel {
  title: string;
  items: RSSItem[];
}

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  creator?: string;
}

function parseRSS(xml: string): RSSChannel {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const channel = doc.querySelector('channel');
  const title = channel?.querySelector('title')?.textContent?.trim() ?? 'RSS Feed';

  const items: RSSItem[] = [];
  doc.querySelectorAll('item').forEach((el) => {
    const itemTitle = el.querySelector('title')?.textContent?.trim();
    const link = el.querySelector('link')?.textContent?.trim();
    if (!itemTitle || !link) return;
    items.push({
      title: itemTitle,
      link,
      pubDate: el.querySelector('pubDate')?.textContent?.trim() ?? '',
      description: el.querySelector('description')?.textContent?.trim(),
      creator: el.getElementsByTagName('dc:creator')[0]?.textContent?.trim(),
    });
  });

  return { title, items };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export async function fetchRSSFeed(
  url: string,
  source: string,
  count = 25
): Promise<FeedItem[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS ${source}: ${res.status}`);
  const text = await res.text();
  const channel = parseRSS(text);

  return channel.items.slice(0, count).map((item, i) => ({
    id: `${source}-${i}-${item.link}`,
    title: item.title,
    url: item.link,
    domain: extractDomain(item.link),
    author: item.creator,
    time: item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : 0,
    source,
  }));
}

export async function fetchMultipleRSS(
  feeds: Array<{ url: string; source: string }>,
  countPerFeed = 10
): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    feeds.map((f) => fetchRSSFeed(f.url, f.source, countPerFeed))
  );

  const items: FeedItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') items.push(...r.value);
  }

  // Sort by time descending
  items.sort((a, b) => b.time - a.time);
  return items;
}
