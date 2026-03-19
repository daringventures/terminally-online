import { Panel } from './Panel';
import { fetchSignificantEarthquakes } from '@/services/usgs';
import { escapeHtml, timeAgo } from '@/utils/format';

export class EarthquakePanel extends Panel {
  constructor() {
    super({ id: 'earthquakes', title: 'Earthquakes — M4.5+ (7d)', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const quakes = await fetchSignificantEarthquakes();
      this.setBadge(String(quakes.length));

      this.content.innerHTML = quakes
        .map(
          (q) => `
        <a class="feed-item" href="${escapeHtml(q.url)}" target="_blank" rel="noopener">
          <span class="feed-rank" style="color:${magColor(q.magnitude)};font-weight:700;">${q.magnitude.toFixed(1)}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(q.place)}</div>
            <div class="feed-meta">
              <span>${timeAgo(Math.floor(q.time / 1000))}</span>
              <span>depth ${q.coordinates[2]?.toFixed(0) ?? '?'}km</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`USGS: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function magColor(mag: number): string {
  if (mag >= 7) return 'var(--red)';
  if (mag >= 6) return 'var(--orange)';
  if (mag >= 5) return 'var(--yellow)';
  return 'var(--text-1)';
}
