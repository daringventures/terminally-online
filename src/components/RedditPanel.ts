import { Panel } from './Panel';
import { fetchRedditHot } from '@/services/reddit';
import { timeAgo, escapeHtml } from '@/utils/format';

export class RedditPanel extends Panel {
  constructor(private readonly subreddit: string = 'all') {
    super({
      id: `reddit-${subreddit}`,
      title: `r/${subreddit}`,
      refreshMs: 120_000,
    });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchRedditHot(this.subreddit, 25);
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (it, i) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.domain || '')}</span>
              <span class="feed-score">${formatScore(it.score ?? 0)}</span>
              <span>${it.comments ?? 0} cmt</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Reddit r/${this.subreddit}: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatScore(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
