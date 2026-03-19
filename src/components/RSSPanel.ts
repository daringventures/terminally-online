import { Panel } from './Panel';
import { fetchMultipleRSS } from '@/services/rss';
import { timeAgo, escapeHtml } from '@/utils/format';
import type { FeedSource } from '@/config/feeds';

export class RSSPanel extends Panel {
  constructor(
    id: string,
    title: string,
    private readonly feeds: FeedSource[],
    private readonly countPerFeed = 8
  ) {
    super({ id, title, refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchMultipleRSS(this.feeds, this.countPerFeed);
      this.setBadge(String(items.length));

      if (items.length === 0) {
        this.content.innerHTML = '<div class="panel-loading">no items</div>';
        return;
      }

      this.content.innerHTML = items
        .map(
          (it) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.source)}</span>
              ${it.time ? `<span>${timeAgo(it.time)}</span>` : ''}
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`RSS: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
