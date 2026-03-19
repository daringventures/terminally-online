export interface FeedSource {
  url: string;
  source: string;
  category: 'vc' | 'tech' | 'crypto' | 'culture' | 'security';
}

export const VC_FEEDS: FeedSource[] = [
  { url: 'https://a16z.com/feed/', source: 'a16z', category: 'vc' },
  { url: 'https://www.sequoiacap.com/feed/', source: 'Sequoia', category: 'vc' },
  { url: 'https://review.firstround.com/feed.xml', source: 'First Round', category: 'vc' },
  { url: 'https://www.ycombinator.com/blog/rss/', source: 'YC Blog', category: 'vc' },
  { url: 'https://www.cbinsights.com/research/feed/', source: 'CB Insights', category: 'vc' },
  { url: 'https://techcrunch.com/category/venture/feed/', source: 'TC Venture', category: 'vc' },
  { url: 'https://techcrunch.com/category/startups/feed/', source: 'TC Startups', category: 'vc' },
];

export const TECH_FEEDS: FeedSource[] = [
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'tech' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'tech' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'tech' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review', category: 'tech' },
  { url: 'https://www.platformer.news/rss/', source: 'Platformer', category: 'tech' },
  { url: 'https://www.404media.co/rss/', source: '404 Media', category: 'tech' },
  { url: 'https://restofworld.org/feed/', source: 'Rest of World', category: 'tech' },
];

export const CRYPTO_FEEDS: FeedSource[] = [
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block', category: 'crypto' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt', category: 'crypto' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk', category: 'crypto' },
  { url: 'https://rekt.news/feed.xml', source: 'Rekt News', category: 'crypto' },
];

export const SECURITY_FEEDS: FeedSource[] = [
  { url: 'https://krebsonsecurity.com/feed/', source: 'Krebs', category: 'security' },
];

export const CULTURE_FEEDS: FeedSource[] = [
  { url: 'https://www.garbageday.email/feed', source: 'Garbage Day', category: 'culture' },
  { url: 'https://defector.com/rss', source: 'Defector', category: 'culture' },
  { url: 'https://aftermath.site/rss', source: 'Aftermath', category: 'culture' },
];

export const ALL_FEEDS: FeedSource[] = [
  ...VC_FEEDS,
  ...TECH_FEEDS,
  ...CRYPTO_FEEDS,
  ...SECURITY_FEEDS,
  ...CULTURE_FEEDS,
];
