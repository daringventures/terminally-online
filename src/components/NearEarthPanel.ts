import { Panel } from './Panel';
import { fetchNearEarthObjects } from '@/services/nasa-neo';
import { escapeHtml } from '@/utils/format';

export class NearEarthPanel extends Panel {
  constructor() {
    super({ id: 'near-earth', title: 'Near-Earth Objects — NASA NEO', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const neos = await fetchNearEarthObjects();
      const hazardous = neos.filter((n) => n.isPotentiallyHazardous);
      this.setBadge(hazardous.length > 0 ? `${hazardous.length} hazardous` : `${neos.length} today`);

      if (neos.length === 0) {
        this.content.innerHTML = '<div style="padding:10px;font-size:12px;color:var(--text-2);">No close approaches today</div>';
        return;
      }

      this.content.innerHTML = neos
        .map((neo) => {
          const color = neo.isPotentiallyHazardous ? 'var(--red)' : 'var(--text-1)';
          const distStr = formatDistance(neo.missDistanceKm);
          const sizeStr = formatSize(neo.diameterMinM, neo.diameterMaxM);
          const velStr = `${neo.velocityKmS.toFixed(1)} km/s`;

          return `
            <div class="feed-item" style="cursor:default;">
              <span class="feed-rank" style="color:${color};font-size:16px;">
                ${neo.isPotentiallyHazardous ? '!' : '·'}
              </span>
              <div class="feed-body">
                <div class="feed-title" style="color:${color};">${escapeHtml(neo.name)}</div>
                <div class="feed-meta">
                  <span title="Miss distance">${escapeHtml(distStr)}</span>
                  <span title="Estimated size">${escapeHtml(sizeStr)}</span>
                  <span title="Relative velocity">${escapeHtml(velStr)}</span>
                </div>
              </div>
            </div>`;
        })
        .join('');
    } catch (e) {
      this.setError(`NASA NEO: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatDistance(km: number): string {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(2)}M km`;
  if (km >= 1_000) return `${(km / 1_000).toFixed(0)}k km`;
  return `${km.toFixed(0)} km`;
}

function formatSize(minM: number, maxM: number): string {
  const avg = (minM + maxM) / 2;
  if (avg >= 1000) return `~${(avg / 1000).toFixed(1)} km`;
  return `~${avg.toFixed(0)} m`;
}
