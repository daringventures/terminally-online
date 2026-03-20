const NYC_TRAFFIC_API = 'https://data.cityofnewyork.us/resource/i4gi-tjb9.json';

export interface TrafficReading {
  id: string;
  linkName: string;
  speed: number; // mph
  travelTime: number; // seconds
  status: 'slow' | 'moderate' | 'fast';
  dataAsOf: number; // unix seconds
}

interface SocrataTrafficRow {
  id?: string;
  link_id?: string;
  link_name?: string;
  speed?: string | number;
  travel_time?: string | number;
  data_as_of?: string;
}

function speedStatus(mph: number): TrafficReading['status'] {
  if (mph < 10) return 'slow';
  if (mph < 25) return 'moderate';
  return 'fast';
}

export async function fetchNYCTraffic(): Promise<TrafficReading[]> {
  const res = await fetch(`${NYC_TRAFFIC_API}?$limit=50&$order=data_as_of DESC`);
  if (!res.ok) throw new Error(`NYC Traffic: ${res.status}`);

  const data = await res.json() as SocrataTrafficRow[];

  return data
    .map((row): TrafficReading | null => {
      const speed = parseFloat(String(row.speed ?? '0'));
      const travelTime = parseFloat(String(row.travel_time ?? '0'));
      if (!row.link_name || isNaN(speed)) return null;

      const rawDate = row.data_as_of ?? '';
      const dataAsOf = rawDate ? Math.floor(new Date(rawDate).getTime() / 1000) : 0;

      return {
        id: String(row.id ?? row.link_id ?? row.link_name),
        linkName: row.link_name,
        speed,
        travelTime,
        status: speedStatus(speed),
        dataAsOf,
      };
    })
    .filter((r): r is TrafficReading => r !== null);
}
