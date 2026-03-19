import type { FeedItem } from '@/types/feed';

// Product Hunt doesn't have a simple REST API anymore (GraphQL + OAuth),
// but we can use their RSS feed
export async function fetchProductHuntFeed(count = 20): Promise<FeedItem[]> {
  const res = await fetch('https://www.producthunt.com/feed');
  if (!res.ok) throw new Error(`Product Hunt: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const items = doc.querySelectorAll('item');

  const results: FeedItem[] = [];
  items.forEach((item, i) => {
    if (i >= count) return;
    const title = item.querySelector('title')?.textContent?.trim();
    const link = item.querySelector('link')?.textContent?.trim();
    const pubDate = item.querySelector('pubDate')?.textContent?.trim();
    if (!title || !link) return;

    results.push({
      id: `ph-${i}-${link}`,
      title,
      url: link,
      domain: 'producthunt.com',
      time: pubDate ? Math.floor(new Date(pubDate).getTime() / 1000) : 0,
      source: 'producthunt',
    });
  });

  return results;
}
