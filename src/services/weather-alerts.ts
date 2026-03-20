import type { FeedItem } from '@/types/feed';

interface NWSAlertFeature {
  id: string;
  properties: {
    id: string;
    headline: string | null;
    event: string;
    severity: string;
    urgency: string;
    areaDesc: string;
    sent: string;       // ISO 8601
    effective: string;
    expires: string;
    description: string;
    instruction: string | null;
    url?: string;
  };
}

interface NWSAlertsResponse {
  features: NWSAlertFeature[];
}

export async function fetchWeatherAlerts(): Promise<FeedItem[]> {
  const res = await fetch(
    'https://api.weather.gov/alerts/active?status=actual&severity=Extreme,Severe',
    { headers: { Accept: 'application/geo+json', 'User-Agent': 'TerminallyOnline/0.1 dashboard@example.com' } }
  );
  if (!res.ok) throw new Error(`NWS Alerts: ${res.status}`);

  const data: NWSAlertsResponse = await res.json();

  return data.features.map((f) => {
    const p = f.properties;
    const title = p.headline ?? `${p.event} — ${p.areaDesc}`;
    const sentEpoch = Math.floor(new Date(p.sent).getTime() / 1000);

    return {
      id: p.id,
      title,
      url: p.url ?? `https://www.weather.gov/`,
      domain: 'weather.gov',
      author: p.severity,
      time: sentEpoch,
      source: 'nws-alerts',
    };
  });
}
