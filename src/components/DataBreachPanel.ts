import { Panel } from './Panel';
import { fetchRecentBreaches } from '@/services/hibp';
import { escapeHtml } from '@/utils/format';

export class DataBreachPanel extends Panel {
  constructor() {
    super({ id: 'data-breaches', title: 'Data Breaches — Latest', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const breaches = await fetchRecentBreaches(15);
      this.setBadge(String(breaches.length));

      this.content.innerHTML = breaches
        .map(
          (b) => `
        <div class="feed-item" style="cursor:default;">
          <div class="feed-body">
            <div class="feed-title">
              ${escapeHtml(b.title)}
              ${b.isVerified ? '<span style="color:var(--red);font-size:10px;margin-left:4px;">verified</span>' : ''}
            </div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(b.domain || 'unknown')}</span>
              <span class="feed-score">${formatPwned(b.pwnCount)} accounts</span>
              <span>${escapeHtml(b.breachDate)}</span>
            </div>
          </div>
        </div>`
        )
        .join('');
    } catch (e) {
      this.setError(`HIBP: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatPwned(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
