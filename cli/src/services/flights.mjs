import { fetchJSON } from '../fetch.mjs';

export async function fetch_flights_nyc() {
  const data = await fetchJSON(
    'https://opensky-network.org/api/states/all?lamin=40.4&lomin=-74.3&lamax=40.9&lomax=-73.7'
  );

  const states = Array.isArray(data.states) ? data.states : [];

  // State vector indices (OpenSky API):
  // 0: icao24, 1: callsign, 2: origin_country, 7: geo_altitude (m),
  // 9: velocity (m/s), 10: true_track (heading)
  return states
    .filter(s => s[7] != null)
    .sort((a, b) => (b[7] ?? 0) - (a[7] ?? 0))
    .slice(0, 15)
    .map(s => {
      const callsign = (s[1] ?? '').trim() || (s[0] ?? '?');
      const country = (s[2] ?? 'Unknown').slice(0, 20);
      const altFt = s[7] != null ? Math.round(s[7] * 3.28084).toLocaleString() : '?';
      const knots = s[9] != null ? Math.round(s[9] * 1.94384).toString() : '?';
      const heading = s[10] != null ? `${Math.round(s[10])}°` : '?';
      return [callsign.slice(0, 10), country, altFt, knots, heading];
    });
}
