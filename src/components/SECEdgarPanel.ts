import { Panel } from './Panel';
import { fetchInsiderTrading } from '@/services/sec-edgar';
import { escapeHtml } from '@/utils/format';

export class SECEdgarPanel extends Panel {
  constructor() {
    super({ id: 'sec-edgar', title: 'SEC — Insider Trades', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const filings = await fetchInsiderTrading(25);
      this.setBadge(String(filings.length));

      this.content.innerHTML = filings
        .map(
          (f) => `
        <a class="feed-item" href="${escapeHtml(f.link)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(f.company)}</div>
            <div class="feed-meta">
              <span class="feed-domain">Form 4</span>
              <span>${escapeHtml(f.pubDate.split('T')[0] ?? '')}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`SEC EDGAR: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
