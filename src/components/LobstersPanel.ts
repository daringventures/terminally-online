import { Panel } from './Panel';
import { fetchLobstersHot } from '@/services/lobsters';
import { timeAgo, escapeHtml } from '@/utils/format';

export class LobstersPanel extends Panel {
  constructor() {
    super({ id: 'lobsters', title: 'Lobste.rs', refreshMs: 120_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchLobstersHot(25);
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
              <span class="feed-score">${it.score} pts</span>
              <span>${it.comments ?? 0} cmt</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Lobsters: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
