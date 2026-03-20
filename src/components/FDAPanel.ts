import { Panel } from './Panel';
import { fetchFDARecalls, fetchFDAAdverseEvents } from '@/services/fda';
import { timeAgo, escapeHtml } from '@/utils/format';
import type { FeedItem } from '@/types/feed';

export class FDAPanel extends Panel {
  constructor() {
    super({ id: 'fda', title: 'FDA — Recalls & Adverse Events', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [recalls, adverse] = await Promise.all([
        fetchFDARecalls(),
        fetchFDAAdverseEvents(),
      ]);

      const all: FeedItem[] = [
        ...recalls.map((r) => ({ ...r, _tag: 'RECALL' as const })),
        ...adverse.map((a) => ({ ...a, _tag: 'ADR' as const })),
      ].sort((a, b) => b.time - a.time);

      this.setBadge(String(all.length));

      this.content.innerHTML = all
        .map(
          (item) => `
        <a class="feed-item" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(item.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml((item as { _tag?: string })._tag ?? item.source)}</span>
              ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ''}
              <span>${timeAgo(item.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`FDA: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
