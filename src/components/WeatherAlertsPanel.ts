import { Panel } from './Panel';
import { fetchWeatherAlerts } from '@/services/weather-alerts';
import { escapeHtml, timeAgo } from '@/utils/format';

export class WeatherAlertsPanel extends Panel {
  constructor() {
    super({ id: 'weather-alerts', title: 'Severe Weather Alerts — NWS', refreshMs: 120_000 });
  }

  async refresh(): Promise<void> {
    try {
      const alerts = await fetchWeatherAlerts();
      this.setBadge(alerts.length > 0 ? String(alerts.length) : '');

      if (alerts.length === 0) {
        this.content.innerHTML = '<div style="padding:10px;font-size:12px;color:var(--green);">No active severe or extreme alerts</div>';
        return;
      }

      this.content.innerHTML = alerts
        .map((alert) => {
          const severityColor = alert.author === 'Extreme' ? 'var(--red)' : 'var(--orange)';

          return `
            <a class="feed-item" href="${escapeHtml(alert.url)}" target="_blank" rel="noopener">
              <div class="feed-body">
                <div class="feed-title">${escapeHtml(alert.title)}</div>
                <div class="feed-meta">
                  <span style="color:${severityColor};font-weight:600;">${escapeHtml(alert.author ?? 'Severe')}</span>
                  <span class="feed-domain">${escapeHtml(alert.domain ?? 'weather.gov')}</span>
                  <span>${timeAgo(alert.time)}</span>
                </div>
              </div>
            </a>`;
        })
        .join('');
    } catch (e) {
      this.setError(`NWS Alerts: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
