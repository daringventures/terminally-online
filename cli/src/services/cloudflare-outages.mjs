import { fetchJSON, timeAgo } from '../fetch.mjs';

// Cloudflare Radar internet outage annotations
export async function fetch_internet_outages() {
  try {
    const data = await fetchJSON(
      'https://radar.cloudflare.com/api/v1/annotations/outages?limit=10&dateRange=1d'
    );
    const annotations = Array.isArray(data.result?.annotations)
      ? data.result.annotations
      : Array.isArray(data.annotations)
      ? data.annotations
      : [];

    if (!annotations.length) {
      return [['—', 'No outages in last 24h', '', '']];
    }

    return annotations.map(a => {
      const eventType = String(a.eventType ?? a.type ?? 'outage');
      const desc = (a.description ?? a.title ?? a.label ?? '').slice(0, 45);
      const locations = Array.isArray(a.locations)
        ? a.locations.join(', ').slice(0, 20)
        : String(a.location ?? a.country ?? '');
      const ts = a.startDate ?? a.startTime ?? a.date ?? null;
      const ago = ts
        ? timeAgo(Math.floor(new Date(ts).getTime() / 1000))
        : '?';
      return [eventType, desc, locations, ago];
    });
  } catch {
    return [['—', 'Radar API unavailable', '', '']];
  }
}
