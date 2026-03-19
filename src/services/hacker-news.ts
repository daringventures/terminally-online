import type { FeedItem } from '@/types/feed';

const HN_API = 'https://hacker-news.firebaseio.com/v0';

interface HNItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  descendants?: number;
  by?: string;
  time?: number;
  type?: string;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export async function fetchHNTopStories(count = 30): Promise<FeedItem[]> {
  const res = await fetch(`${HN_API}/topstories.json`);
  if (!res.ok) throw new Error(`HN topstories: ${res.status}`);
  const ids: number[] = await res.json();

  const items = await Promise.all(
    ids.slice(0, count).map(async (id): Promise<HNItem | null> => {
      try {
        const r = await fetch(`${HN_API}/item/${id}.json`);
        return r.ok ? await r.json() : null;
      } catch {
        return null;
      }
    })
  );

  return items
    .filter((it): it is HNItem => it !== null && it.type === 'story' && !!it.title)
    .map((it) => ({
      id: String(it.id),
      title: it.title!,
      url: it.url || `https://news.ycombinator.com/item?id=${it.id}`,
      score: it.score,
      comments: it.descendants,
      commentsUrl: `https://news.ycombinator.com/item?id=${it.id}`,
      domain: it.url ? extractDomain(it.url) : 'news.ycombinator.com',
      author: it.by,
      time: it.time || 0,
      source: 'hackernews',
    }));
}
