import { fetchJSON } from '../fetch.mjs';

export async function fetch_neo() {
  const data = await fetchJSON(
    'https://api.nasa.gov/neo/rest/v1/feed/today?api_key=DEMO_KEY'
  );

  const allNeos = Object.values(data.near_earth_objects ?? {}).flat();

  return allNeos
    .map(neo => {
      const approach = (neo.close_approach_data ?? [])[0] ?? {};
      const missMiles = parseFloat(
        approach.miss_distance?.miles ?? 'Infinity'
      );
      const diamKm =
        (neo.estimated_diameter?.kilometers?.estimated_diameter_max ?? 0).toFixed(3);
      const velocity =
        parseFloat(approach.relative_velocity?.kilometers_per_hour ?? 0).toFixed(0);
      const hazard = neo.is_potentially_hazardous_asteroid ? 'YES' : 'no';
      const name = (neo.name ?? '').replace(/[()]/g, '').trim().slice(0, 40);
      return { missMiles, row: [hazard, name, Math.round(missMiles).toLocaleString(), `${diamKm}km`, `${velocity}kph`] };
    })
    .sort((a, b) => a.missMiles - b.missMiles)
    .map(({ row }) => row);
}
