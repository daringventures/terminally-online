import { Panel } from './Panel';
import { fetchRecentBills } from '@/services/congress';
import { escapeHtml } from '@/utils/format';

export class CongressPanel extends Panel {
  constructor() {
    super({ id: 'congress', title: 'Congress — Most Viewed Bills', refreshMs: 1_800_000 });
  }

  async refresh(): Promise<void> {
    try {
      const bills = await fetchRecentBills(20);
      this.setBadge(String(bills.length));

      this.content.innerHTML = bills
        .map(
          (b) => `
        <a class="feed-item" href="${escapeHtml(b.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(b.title)}</div>
            <div class="feed-meta">
              ${b.number ? `<span class="feed-domain">${escapeHtml(b.number)}</span>` : ''}
              ${b.type ? `<span>${escapeHtml(b.type)}</span>` : ''}
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Congress: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
