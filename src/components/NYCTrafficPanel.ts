import { Panel } from './Panel';
import { fetchNYCTraffic } from '@/services/nyc-traffic';
import type { TrafficReading } from '@/services/nyc-traffic';
import { escapeHtml, timeAgo } from '@/utils/format';

const STATUS_COLOR: Record<TrafficReading['status'], string> = {
  slow: 'var(--red)',
  moderate: 'var(--yellow)',
  fast: 'var(--green)',
};

const STATUS_LABEL: Record<TrafficReading['status'], string> = {
  slow: 'SLOW',
  moderate: 'MOD',
  fast: 'OK',
};

export class NYCTrafficPanel extends Panel {
  constructor() {
    super({ id: 'nyc-traffic', title: 'NYC Traffic Speeds', refreshMs: 120_000 });
  }

  async refresh(): Promise<void> {
    try {
      const readings = await fetchNYCTraffic();
      const slow = readings.filter((r) => r.status === 'slow').length;
      this.setBadge(slow > 0 ? `${slow} slow` : `${readings.length} links`);

      // Sort: slow first, then moderate, then fast
      const sorted = [...readings].sort((a, b) => {
        const order = { slow: 0, moderate: 1, fast: 2 };
        return order[a.status] - order[b.status];
      });

      this.content.innerHTML = sorted
        .map(
          (r) => `
        <div class="feed-item">
          <span class="feed-rank" style="color:${STATUS_COLOR[r.status]};font-weight:700;min-width:3ch;">
            ${STATUS_LABEL[r.status]}
          </span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(r.linkName)}</div>
            <div class="feed-meta">
              <span>${r.speed.toFixed(1)} mph</span>
              ${r.travelTime > 0 ? `<span>${Math.round(r.travelTime)}s travel</span>` : ''}
              ${r.dataAsOf > 0 ? `<span>${timeAgo(r.dataAsOf)}</span>` : ''}
            </div>
          </div>
        </div>`
        )
        .join('');
    } catch (e) {
      this.setError(`NYC Traffic: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
