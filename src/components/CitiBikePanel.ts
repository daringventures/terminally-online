import { Panel } from './Panel';
import { fetchCitiBikeStatus } from '@/services/citibike';
import { escapeHtml, timeAgo } from '@/utils/format';

export class CitiBikePanel extends Panel {
  constructor() {
    super({ id: 'citibike', title: 'Citi Bike — NYC', refreshMs: 60_000 });
  }

  async refresh(): Promise<void> {
    try {
      const summary = await fetchCitiBikeStatus();
      this.setBadge(`${summary.totalBikes.toLocaleString()} bikes`);

      const busyRows = summary.busiestStations
        .map(
          (s) => `
        <div class="feed-item">
          <span class="feed-rank" style="color:var(--green);font-weight:700;">${s.bikes_available}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(s.name)}</div>
            <div class="feed-meta">
              <span>${s.docks_available} docks free</span>
              <span>cap ${s.capacity}</span>
              <span>updated ${timeAgo(s.last_reported)}</span>
            </div>
          </div>
        </div>`
        )
        .join('');

      const emptyRows = summary.emptiestStations
        .map(
          (s) => `
        <div class="feed-item">
          <span class="feed-rank" style="color:var(--red);font-weight:700;">${s.bikes_available}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(s.name)}</div>
            <div class="feed-meta">
              <span>${s.docks_available} docks free</span>
              <span>cap ${s.capacity}</span>
            </div>
          </div>
        </div>`
        )
        .join('');

      this.content.innerHTML = `
        <div class="feed-section-header">Overview</div>
        <div class="feed-item">
          <div class="feed-body">
            <div class="feed-meta">
              <span><b>${summary.totalBikes.toLocaleString()}</b> bikes available</span>
              <span><b>${summary.totalDocks.toLocaleString()}</b> docks free</span>
              <span><b>${summary.totalStations.toLocaleString()}</b> active stations</span>
            </div>
          </div>
        </div>
        <div class="feed-section-header">Busiest Stations</div>
        ${busyRows}
        <div class="feed-section-header">Emptiest Stations</div>
        ${emptyRows}
      `;
    } catch (e) {
      this.setError(`CitiBike: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
