import { fetchJSON, timeAgo } from '../fetch.mjs';

export async function fetch_space_weather() {
  const [alerts, wind] = await Promise.all([
    fetchJSON('https://services.swpc.noaa.gov/products/alerts.json'),
    fetchJSON('https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'),
  ]);

  const windSpeed = wind?.WindSpeed ?? wind?.speed ?? '?';
  const rows = [['Solar Wind', `Speed: ${windSpeed} km/s`, 'now']];

  const recent = (Array.isArray(alerts) ? alerts : [])
    .slice(0, 10)
    .map(a => {
      // message field is a long string; first line is usually the type
      const msg = (a.message ?? '').replace(/\r?\n/g, ' ').trim();
      const type = (a.product ?? a.type ?? 'ALERT').slice(0, 20);
      const desc = msg.slice(0, 55);
      const issued = a.issue_datetime
        ? timeAgo(Math.floor(new Date(a.issue_datetime).getTime() / 1000))
        : '?';
      return [type, desc, issued];
    });

  return [...rows, ...recent];
}
