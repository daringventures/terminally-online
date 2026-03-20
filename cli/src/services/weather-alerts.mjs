import { fetchJSON, timeAgo } from '../fetch.mjs';

export async function fetch_weather_alerts() {
  const data = await fetchJSON(
    'https://api.weather.gov/alerts/active?status=actual&severity=Extreme,Severe&limit=15'
  );

  const features = Array.isArray(data.features) ? data.features : [];

  return features.map(f => {
    const p = f.properties ?? {};
    const severity = (p.severity ?? 'Unknown').slice(0, 10);
    const headline = (p.headline ?? p.event ?? 'N/A').slice(0, 50);
    const area = (p.areaDesc ?? '').slice(0, 20);
    const sent = p.sent
      ? timeAgo(Math.floor(new Date(p.sent).getTime() / 1000))
      : '?';
    return [severity, headline, area, sent];
  });
}
