import { Panel } from './Panel';
import { fetchAirportDelays } from '@/services/faa-delays';
import { escapeHtml } from '@/utils/format';

export class AirportDelaysPanel extends Panel {
  constructor() {
    super({ id: 'airport-delays', title: 'FAA Airport Delays', refreshMs: 120_000 });
  }

  async refresh(): Promise<void> {
    try {
      const delays = await fetchAirportDelays();
      this.setBadge(delays.length > 0 ? String(delays.length) : '');

      if (delays.length === 0) {
        this.content.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--green);font-weight:600;gap:8px;">
            <span style="font-size:18px;">✈</span>
            <span>No active delays or closures</span>
          </div>
        `;
        return;
      }

      this.content.innerHTML = delays
        .map((d) => {
          const typeColor = delayTypeColor(d.delayType);
          const meta: string[] = [];
          if (d.avgDelay) meta.push(`avg ${escapeHtml(d.avgDelay)}`);
          if (d.closureEnd) meta.push(`until ${escapeHtml(d.closureEnd)}`);
          return `
            <div class="feed-item" style="cursor:default;">
              <span class="feed-rank" style="color:${typeColor};font-weight:700;font-size:13px;min-width:36px;">${escapeHtml(d.airportCode)}</span>
              <div class="feed-body">
                <div class="feed-title">
                  <span style="color:${typeColor};font-weight:600;">${escapeHtml(d.delayType)}</span>
                  — ${escapeHtml(d.reason)}
                </div>
                ${meta.length > 0 ? `<div class="feed-meta">${meta.join(' · ')}</div>` : ''}
              </div>
            </div>`;
        })
        .join('');
    } catch (e) {
      this.setError(`FAA: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function delayTypeColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('closure') || t.includes('stop')) return 'var(--red)';
  if (t.includes('ground delay')) return 'var(--orange)';
  return 'var(--yellow)';
}
