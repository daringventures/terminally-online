import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';

export async function fetch_earthquakes() {
  const data = await fetchJSON(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
  );
  return data.features.map(f => [
    f.properties.mag.toFixed(1),
    trunc(f.properties.place ?? '', 60),
    timeAgo(Math.floor(f.properties.time / 1000)),
    `${f.geometry.coordinates[2]?.toFixed(0) ?? '?'}km`,
  ]);
}
