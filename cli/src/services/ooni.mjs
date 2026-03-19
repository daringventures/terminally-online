import { fetchJSON } from '../fetch.mjs';

// OONI — recent internet censorship incidents
export async function fetch_ooni(count = 15) {
  const data = await fetchJSON(
    `https://api.ooni.io/api/v1/incidents/search?limit=${count}&only_mine=false`
  );
  return (data.incidents || []).map((inc, i) => [
    String(i + 1),
    (inc.title || '').slice(0, 45),
    inc.CCs?.join(', ')?.slice(0, 10) || inc.probe_cc || '??',
    inc.start_time?.split('T')[0] ?? '',
  ]);
}
