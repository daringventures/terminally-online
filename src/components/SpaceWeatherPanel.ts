import { Panel } from './Panel';
import { fetchSpaceWeather } from '@/services/space-weather';
import { escapeHtml } from '@/utils/format';

export class SpaceWeatherPanel extends Panel {
  constructor() {
    super({ id: 'space-weather', title: 'Space Weather — NOAA SWPC', refreshMs: 60_000 });
  }

  async refresh(): Promise<void> {
    try {
      const sw = await fetchSpaceWeather();
      this.setBadge(sw.alerts.length > 0 ? `${sw.alerts.length} alert${sw.alerts.length !== 1 ? 's' : ''}` : '');

      const kpColor = kpIndexColor(sw.kpIndex);
      const xrayColor = xrayClassColor(sw.xrayClass);
      const windColor = solarWindColor(sw.solarWindSpeed);

      const statsHtml = `
        <div class="space-weather-stats" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:10px 10px 4px;border-bottom:1px solid var(--bg-3);">
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:700;color:${windColor};">
              ${sw.solarWindSpeed !== null ? `${sw.solarWindSpeed.toFixed(0)}` : '—'}
            </div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">Solar Wind km/s</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:700;color:${kpColor};">
              ${sw.kpIndex !== null ? sw.kpIndex.toFixed(1) : '—'}
            </div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">Kp Index</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:700;color:${xrayColor};">
              ${escapeHtml(sw.xrayClass)}
            </div>
            <div style="font-size:10px;color:var(--text-2);margin-top:2px;">X-ray Class</div>
          </div>
        </div>
      `;

      const alertsHtml = sw.alerts.length === 0
        ? '<div style="padding:10px;font-size:12px;color:var(--text-2);">No active alerts</div>'
        : sw.alerts.map((a) => {
            const summary = a.message.split('\n').find((l) => l.trim().length > 0) ?? a.productId;
            return `
              <div class="feed-item" style="cursor:default;">
                <div class="feed-body">
                  <div class="feed-title" style="font-size:12px;">${escapeHtml(summary.trim())}</div>
                  <div class="feed-meta">
                    <span style="color:var(--yellow);">${escapeHtml(a.productId)}</span>
                    <span>${escapeHtml(formatAlertTime(a.issueTime))}</span>
                  </div>
                </div>
              </div>`;
          }).join('');

      this.content.innerHTML = statsHtml + alertsHtml;
    } catch (e) {
      this.setError(`Space Weather: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function kpIndexColor(kp: number | null): string {
  if (kp === null) return 'var(--text-2)';
  if (kp >= 8) return 'var(--red)';
  if (kp >= 6) return 'var(--orange)';
  if (kp >= 4) return 'var(--yellow)';
  return 'var(--green)';
}

function xrayClassColor(cls: string): string {
  if (cls.startsWith('X')) return 'var(--red)';
  if (cls.startsWith('M')) return 'var(--orange)';
  if (cls.startsWith('C')) return 'var(--yellow)';
  return 'var(--text-1)';
}

function solarWindColor(speed: number | null): string {
  if (speed === null) return 'var(--text-2)';
  if (speed > 700) return 'var(--red)';
  if (speed > 500) return 'var(--orange)';
  if (speed > 350) return 'var(--yellow)';
  return 'var(--green)';
}

function formatAlertTime(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
