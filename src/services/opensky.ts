// OpenSky Network — aircraft over NYC metro area
// Bounding box: lat 40.4–40.9, lon -74.3–-73.7

export interface Aircraft {
  icao24: string;       // Unique ICAO 24-bit address (hex)
  callsign: string;     // Aircraft callsign
  originCountry: string;
  longitude: number | null;
  latitude: number | null;
  altitudeFt: number | null; // Geometric altitude in feet
  velocityKts: number | null; // Velocity in knots
  heading: number | null;    // True track in degrees
  onGround: boolean;
}

export interface NYCAircraftData {
  count: number;
  airborne: number;
  aircraft: Aircraft[];
  fetchedAt: number; // unix seconds
}

// OpenSky states/all column indices
const COL_ICAO24 = 0;
const COL_CALLSIGN = 1;
const COL_COUNTRY = 2;
const COL_LON = 5;
const COL_LAT = 6;
const COL_BARO_ALT = 7;
const COL_ON_GROUND = 8;
const COL_VELOCITY = 9;
const COL_HEADING = 10;
const COL_GEO_ALT = 13;

const METERS_TO_FEET = 3.28084;
const MPS_TO_KNOTS = 1.94384;

export async function fetchNYCAircraft(): Promise<NYCAircraftData> {
  const url =
    'https://opensky-network.org/api/states/all?lamin=40.4&lomin=-74.3&lamax=40.9&lomax=-73.7';

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenSky: ${res.status}`);

  const data = await res.json() as {
    time: number;
    states: Array<unknown[]> | null;
  };

  const rawStates = data.states ?? [];

  const aircraft: Aircraft[] = rawStates.map((s) => {
    const geoAlt = s[COL_GEO_ALT] as number | null;
    const baroAlt = s[COL_BARO_ALT] as number | null;
    const altM = geoAlt ?? baroAlt ?? null;
    const vel = s[COL_VELOCITY] as number | null;

    return {
      icao24: String(s[COL_ICAO24] ?? ''),
      callsign: String(s[COL_CALLSIGN] ?? '').trim(),
      originCountry: String(s[COL_COUNTRY] ?? ''),
      longitude: (s[COL_LON] as number | null) ?? null,
      latitude: (s[COL_LAT] as number | null) ?? null,
      altitudeFt: altM !== null ? Math.round(altM * METERS_TO_FEET) : null,
      velocityKts: vel !== null ? Math.round(vel * MPS_TO_KNOTS) : null,
      heading: (s[COL_HEADING] as number | null) ?? null,
      onGround: Boolean(s[COL_ON_GROUND]),
    };
  });

  const airborne = aircraft.filter((a) => !a.onGround).length;

  return {
    count: aircraft.length,
    airborne,
    aircraft,
    fetchedAt: data.time,
  };
}
