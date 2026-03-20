import { Panel } from './Panel';
import { fetchCollapse, fetchUpliftingNews } from '@/services/reddit-json';
import { timeAgo, escapeHtml } from '@/utils/format';
import type { FeedItem } from '@/types/feed';

export class VibesPanel extends Panel {
  constructor() {
    super({ id: 'vibes', title: 'DOOMER vs HOPIUM', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [doom, hope] = await Promise.all([fetchCollapse(15), fetchUpliftingNews(15)]);

      this.setBadge(`${doom.length}/${hope.length}`);

      this.content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <div style="color:var(--red);font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">DOOMER (r/collapse)</div>
            ${renderColumn(doom)}
          </div>
          <div>
            <div style="color:var(--green);font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">HOPIUM (r/UpliftingNews)</div>
            ${renderColumn(hope)}
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`Vibes: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function renderColumn(items: FeedItem[]): string {
  return items
    .slice(0, 12)
    .map(
      (it) => `
    <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener" style="padding:4px 0;">
      <div class="feed-body">
        <div class="feed-title" style="font-size:10px;-webkit-line-clamp:2;">${escapeHtml(it.title)}</div>
        <div class="feed-meta">
          <span class="feed-score">${formatScore(it.score ?? 0)}</span>
          <span>${timeAgo(it.time)}</span>
        </div>
      </div>
    </a>`
    )
    .join('');
}

function formatScore(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
