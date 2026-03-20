import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';

export async function fetch_weather_alerts() {
  const data = await fetchJSON(
    'https://api.weather.gov/alerts/active?status=actual&severity=Extreme,Severe&limit=15'
  );

  const features = Array.isArray(data.features) ? data.features : [];

  return features.map(f => {
    const p = f.properties ?? {};
    const severity = trunc(p.severity ?? 'Unknown', 30);
    const headline = trunc(p.headline ?? p.event ?? 'N/A', 80);
    const area = trunc(p.areaDesc ?? '', 30);
    const sent = p.sent
      ? timeAgo(Math.floor(new Date(p.sent).getTime() / 1000))
      : '?';
    return [severity, headline, area, sent];
  });
}
