import type { FeedItem } from '@/types/feed';

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    permalink: string;
    score: number;
    num_comments: number;
    subreddit: string;
    author: string;
    created_utc: number;
    domain: string;
    is_self: boolean;
  };
}

interface RedditListing {
  data: {
    children: RedditPost[];
  };
}

export async function fetchSubredditHot(subreddit: string, limit = 25): Promise<FeedItem[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}&raw_json=1`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`Reddit r/${subreddit}: ${res.status}`);
  const listing: RedditListing = await res.json();

  return listing.data.children.map((p) => ({
    id: p.data.id,
    title: p.data.title,
    url: p.data.is_self
      ? `https://reddit.com${p.data.permalink}`
      : p.data.url,
    score: p.data.score,
    comments: p.data.num_comments,
    commentsUrl: `https://reddit.com${p.data.permalink}`,
    domain: p.data.is_self ? `r/${p.data.subreddit}` : p.data.domain,
    author: p.data.author,
    time: Math.floor(p.data.created_utc),
    source: `r/${p.data.subreddit}`,
  }));
}

export function fetchMemes(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('memes', limit);
}

export function fetchDankMemes(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('dankmemes', limit);
}

export function fetchShitposting(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('shitposting', limit);
}

export function fetchSubredditDrama(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('SubredditDrama', limit);
}

export function fetchAITA(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('AmItheAsshole', limit);
}

export function fetchCollapse(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('collapse', limit);
}

export function fetchUpliftingNews(limit = 25): Promise<FeedItem[]> {
  return fetchSubredditHot('UpliftingNews', limit);
}
