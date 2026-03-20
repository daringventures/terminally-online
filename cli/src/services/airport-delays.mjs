import { fetchJSON } from '../fetch.mjs';

export async function fetch_airport_delays() {
  const data = await fetchJSON(
    'https://nasstatus.faa.gov/api/airport-status-information'
  );

  // Response shape: { AirportStatusInformation: { Delay: [...] } }
  // Each Delay item: { ARPT, Reason, GroundDelays, ArriveDepartDelay, ... }
  const delays = data?.AirportStatusInformation?.Delay ?? [];
  const items = Array.isArray(delays) ? delays : [delays];

  const rows = [];

  for (const item of items) {
    const airport = (item.ARPT ?? item.airport ?? '???').slice(0, 5);

    // Ground delays
    const gd = item.GroundDelays?.GroundDelay;
    if (gd) {
      const gdItems = Array.isArray(gd) ? gd : [gd];
      for (const g of gdItems) {
        const avg = g.Avg ?? g.avg ?? '?';
        const reason = (g.Reason ?? g.reason ?? '').slice(0, 40);
        rows.push([airport, 'Ground Delay', reason, String(avg)]);
      }
    }

    // Arrival/departure delays
    const ad = item.ArriveDepartDelay;
    if (ad) {
      const adItems = Array.isArray(ad) ? ad : [ad];
      for (const a of adItems) {
        const avg = a.Min ?? a.min ?? '?';
        const reason = (a.Reason ?? a.reason ?? '').slice(0, 40);
        const type = a.Type ?? a.type ?? 'Delay';
        rows.push([airport, String(type).slice(0, 15), reason, String(avg)]);
      }
    }

    // Closures
    const cl = item.Closure;
    if (cl) {
      const reason = (cl.Reason ?? cl.reason ?? '').slice(0, 40);
      rows.push([airport, 'Closure', reason, '-']);
    }
  }

  return rows.length > 0 ? rows : [['FAA', 'No active delays', '', '-']];
}
