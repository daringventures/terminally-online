import { Panel } from './Panel';
import { fetchNYCAircraft } from '@/services/opensky';
import { escapeHtml } from '@/utils/format';

export class FlightsOverheadPanel extends Panel {
  constructor() {
    super({ id: 'flights-overhead', title: 'Flights Over NYC', refreshMs: 30_000 });
  }

  async refresh(): Promise<void> {
    try {
      const data = await fetchNYCAircraft();
      this.setBadge(String(data.airborne));

      const topFlights = data.aircraft
        .filter((a) => !a.onGround && a.callsign)
        .sort((a, b) => (b.altitudeFt ?? 0) - (a.altitudeFt ?? 0))
        .slice(0, 12);

      this.content.innerHTML = `
        <div style="display:flex;gap:16px;padding:12px 0 8px;border-bottom:1px solid var(--bg-3);margin-bottom:8px;flex-wrap:wrap;">
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:32px;font-weight:800;color:var(--accent);line-height:1;">${data.airborne}</div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">AIRBORNE</div>
          </div>
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:32px;font-weight:800;color:var(--text-1);line-height:1;">${data.count}</div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">TOTAL</div>
          </div>
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:32px;font-weight:800;color:var(--text-1);line-height:1;">${data.count - data.airborne}</div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">ON GROUND</div>
          </div>
        </div>
        ${topFlights.map((a) => {
          const alt = a.altitudeFt != null ? `${(a.altitudeFt / 1000).toFixed(1)}k ft` : '—';
          const vel = a.velocityKts != null ? `${a.velocityKts} kts` : '—';
          const hdg = a.heading != null ? `${Math.round(a.heading)}°` : '';
          return `
            <div class="feed-item" style="cursor:default;">
              <span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--accent);min-width:64px;padding-right:6px;">
                ${escapeHtml(a.callsign || a.icao24)}
              </span>
              <div class="feed-body">
                <div class="feed-meta" style="gap:8px;">
                  <span style="color:var(--text-1);">${escapeHtml(alt)}</span>
                  <span>${escapeHtml(vel)}</span>
                  ${hdg ? `<span>${escapeHtml(hdg)}</span>` : ''}
                  <span style="color:var(--text-3);">${escapeHtml(a.originCountry)}</span>
                </div>
              </div>
            </div>`;
        }).join('')}
      `;
    } catch (e) {
      this.setError(`OpenSky: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
