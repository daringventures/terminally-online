export interface FeedItem {
  id: string;
  title: string;
  url: string;
  score?: number;
  comments?: number;
  commentsUrl?: string;
  domain?: string;
  author?: string;
  time: number; // unix seconds
  source: string;
}
