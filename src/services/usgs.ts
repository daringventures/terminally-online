export interface Earthquake {
  id: string;
  title: string;
  magnitude: number;
  place: string;
  time: number; // unix ms
  url: string;
  coordinates: [number, number, number]; // lng, lat, depth
}

export async function fetchSignificantEarthquakes(): Promise<Earthquake[]> {
  const res = await fetch(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
  );
  if (!res.ok) throw new Error(`USGS: ${res.status}`);

  const data = await res.json() as {
    features: Array<{
      id: string;
      properties: {
        title: string;
        mag: number;
        place: string;
        time: number;
        url: string;
      };
      geometry: {
        coordinates: [number, number, number];
      };
    }>;
  };

  return data.features.map((f) => ({
    id: f.id,
    title: f.properties.title,
    magnitude: f.properties.mag,
    place: f.properties.place,
    time: f.properties.time,
    url: f.properties.url,
    coordinates: f.geometry.coordinates,
  }));
}
