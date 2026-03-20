import { Panel } from './Panel';
import { fetchSubredditDrama, fetchAITA } from '@/services/reddit-json';
import { timeAgo, escapeHtml } from '@/utils/format';
import type { FeedItem } from '@/types/feed';

export class InternetDramaPanel extends Panel {
  constructor() {
    super({ id: 'internet-drama', title: 'INTERNET DRAMA', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [drama, aita] = await Promise.all([fetchSubredditDrama(20), fetchAITA(20)]);

      const combined: FeedItem[] = [...drama, ...aita]
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 30);

      this.setBadge(String(combined.length));

      this.content.innerHTML = combined
        .map(
          (it, i) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.source)}</span>
              <span class="feed-score">${formatScore(it.score ?? 0)}</span>
              <span>${it.comments ?? 0} cmt</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Drama feed: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatScore(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
