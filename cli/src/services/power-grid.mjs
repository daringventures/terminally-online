import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_caiso() {
  const data = await fetchJSON(
    'https://www.caiso.com/outlook/SP/renewables.json'
  );

  // Response is typically an array of { fuelsource, mw, pct } objects
  // or may be wrapped; handle both shapes
  const sources = Array.isArray(data) ? data : (data.renewables ?? data.data ?? []);

  const total = sources.reduce((sum, s) => sum + (Number(s.mw ?? s.value ?? 0)), 0);

  return sources.map(s => {
    const name = trunc(s.fuelsource ?? s.source ?? s.name ?? 'Unknown', 30);
    const mw = Number(s.mw ?? s.value ?? 0);
    const pct = total > 0
      ? `${((mw / total) * 100).toFixed(1)}%`
      : (s.pct != null ? `${Number(s.pct).toFixed(1)}%` : '?');
    return [name, Math.round(mw).toLocaleString(), pct];
  });
}
