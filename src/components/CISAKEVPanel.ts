import { Panel } from './Panel';
import { fetchCISAKEV } from '@/services/cisa-kev';
import { escapeHtml, timeAgo } from '@/utils/format';

export class CISAKEVPanel extends Panel {
  constructor() {
    super({ id: 'cisa-kev', title: 'CISA KEV — Known Exploited', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchCISAKEV(30);
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (it) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.domain || 'cisa.gov')}</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`CISA KEV: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
