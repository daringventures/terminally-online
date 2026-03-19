import { Panel } from './Panel';
import { fetchGoogleTrends } from '@/services/google-trends';
import { escapeHtml } from '@/utils/format';

export class GoogleTrendsPanel extends Panel {
  constructor() {
    super({ id: 'google-trends', title: 'Google Trends — US', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const trends = await fetchGoogleTrends();
      this.setBadge(String(trends.length));

      this.content.innerHTML = trends
        .map(
          (t, i) => `
        <a class="feed-item" href="${escapeHtml(t.link)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(t.title)}</div>
            <div class="feed-meta">
              ${t.trafficVolume ? `<span class="feed-score">${escapeHtml(t.trafficVolume)}+ searches</span>` : ''}
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Google Trends: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
