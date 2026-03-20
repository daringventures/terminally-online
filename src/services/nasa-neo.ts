export interface NearEarthObject {
  id: string;
  name: string;
  /** Estimated diameter range in meters */
  diameterMinM: number;
  diameterMaxM: number;
  /** Closest approach distance in km */
  missDistanceKm: number;
  /** Relative velocity in km/s */
  velocityKmS: number;
  /** True if NASA classifies it as potentially hazardous */
  isPotentiallyHazardous: boolean;
  /** Close approach date string (YYYY-MM-DD) */
  closeApproachDate: string;
}

interface NasaNeoFeedResponse {
  near_earth_objects: Record<
    string,
    Array<{
      id: string;
      name: string;
      is_potentially_hazardous_asteroid: boolean;
      estimated_diameter: {
        meters: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
      };
      close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
          kilometers_per_second: string;
        };
        miss_distance: {
          kilometers: string;
        };
      }>;
    }>
  >;
}

export async function fetchNearEarthObjects(): Promise<NearEarthObject[]> {
  const res = await fetch(
    'https://api.nasa.gov/neo/rest/v1/feed/today?api_key=DEMO_KEY'
  );
  if (!res.ok) throw new Error(`NASA NEO: ${res.status}`);

  const data: NasaNeoFeedResponse = await res.json();

  const objects: NearEarthObject[] = [];

  for (const dateGroup of Object.values(data.near_earth_objects)) {
    for (const neo of dateGroup) {
      const approach = neo.close_approach_data[0];
      if (!approach) continue;

      objects.push({
        id: neo.id,
        name: neo.name.replace(/[()]/g, '').trim(),
        diameterMinM: neo.estimated_diameter.meters.estimated_diameter_min,
        diameterMaxM: neo.estimated_diameter.meters.estimated_diameter_max,
        missDistanceKm: parseFloat(approach.miss_distance.kilometers),
        velocityKmS: parseFloat(approach.relative_velocity.kilometers_per_second),
        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
        closeApproachDate: approach.close_approach_date,
      });
    }
  }

  // Sort by closest approach distance first
  objects.sort((a, b) => a.missDistanceKm - b.missDistanceKm);

  return objects;
}
