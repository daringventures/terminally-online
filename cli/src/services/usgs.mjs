import { fetchJSON, timeAgo } from '../fetch.mjs';

export async function fetch_earthquakes() {
  const data = await fetchJSON(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
  );
  return data.features.map(f => [
    f.properties.mag.toFixed(1),
    f.properties.place?.slice(0, 45) ?? '',
    timeAgo(Math.floor(f.properties.time / 1000)),
    `${f.geometry.coordinates[2]?.toFixed(0) ?? '?'}km`,
  ]);
}
