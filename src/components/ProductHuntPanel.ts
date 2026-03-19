import { Panel } from './Panel';
import { fetchProductHuntFeed } from '@/services/producthunt';
import { timeAgo, escapeHtml } from '@/utils/format';

export class ProductHuntPanel extends Panel {
  constructor() {
    super({ id: 'producthunt', title: 'Product Hunt', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchProductHuntFeed(20);
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (it, i) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">producthunt.com</span>
              ${it.time ? `<span>${timeAgo(it.time)}</span>` : ''}
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Product Hunt: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
