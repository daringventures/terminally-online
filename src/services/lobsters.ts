import type { FeedItem } from '@/types/feed';

interface LobstersStory {
  short_id: string;
  title: string;
  url: string;
  score: number;
  comment_count: number;
  comments_url: string;
  submitter_user: { username: string };
  created_at: string;
  tags: string[];
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export async function fetchLobstersHot(count = 25): Promise<FeedItem[]> {
  const res = await fetch('https://lobste.rs/hottest.json');
  if (!res.ok) throw new Error(`Lobsters: ${res.status}`);
  const stories: LobstersStory[] = await res.json();

  return stories.slice(0, count).map((s) => ({
    id: s.short_id,
    title: s.title,
    url: s.url || s.comments_url,
    score: s.score,
    comments: s.comment_count,
    commentsUrl: s.comments_url,
    domain: s.url ? extractDomain(s.url) : 'lobste.rs',
    author: s.submitter_user.username,
    time: Math.floor(new Date(s.created_at).getTime() / 1000),
    source: 'lobsters',
  }));
}
