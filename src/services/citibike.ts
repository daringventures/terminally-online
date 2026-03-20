const GBFS_BASE = 'https://gbfs.citibikenyc.com/gbfs/en';

export interface CitiBikeStation {
  station_id: string;
  name: string;
  capacity: number;
  bikes_available: number;
  docks_available: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number; // unix seconds
}

export interface CitiBikeSummary {
  totalBikes: number;
  totalDocks: number;
  totalStations: number;
  busiestStations: CitiBikeStation[]; // most bikes available
  emptiestStations: CitiBikeStation[]; // fewest bikes available (active stations only)
  lastUpdated: number; // unix seconds
}

interface GBFSStationInfo {
  station_id: string;
  name: string;
  capacity: number;
}

interface GBFSStationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
}

export async function fetchCitiBikeStatus(): Promise<CitiBikeSummary> {
  const [infoRes, statusRes] = await Promise.all([
    fetch(`${GBFS_BASE}/station_information.json`),
    fetch(`${GBFS_BASE}/station_status.json`),
  ]);

  if (!infoRes.ok) throw new Error(`CitiBike info: ${infoRes.status}`);
  if (!statusRes.ok) throw new Error(`CitiBike status: ${statusRes.status}`);

  const infoData = await infoRes.json() as { data: { stations: GBFSStationInfo[] }; last_updated: number };
  const statusData = await statusRes.json() as { data: { stations: GBFSStationStatus[] }; last_updated: number };

  const infoMap = new Map<string, GBFSStationInfo>(
    infoData.data.stations.map((s) => [s.station_id, s])
  );

  const stations: CitiBikeStation[] = statusData.data.stations
    .map((s) => {
      const info = infoMap.get(s.station_id);
      return {
        station_id: s.station_id,
        name: info?.name ?? `Station ${s.station_id}`,
        capacity: info?.capacity ?? 0,
        bikes_available: s.num_bikes_available,
        docks_available: s.num_docks_available,
        is_installed: s.is_installed === 1,
        is_renting: s.is_renting === 1,
        is_returning: s.is_returning === 1,
        last_reported: s.last_reported,
      };
    })
    .filter((s) => s.is_installed && s.is_renting);

  const totalBikes = stations.reduce((sum, s) => sum + s.bikes_available, 0);
  const totalDocks = stations.reduce((sum, s) => sum + s.docks_available, 0);

  const sorted = [...stations].sort((a, b) => b.bikes_available - a.bikes_available);
  const busiestStations = sorted.slice(0, 5);
  const emptiestStations = sorted.slice(-5).reverse();

  return {
    totalBikes,
    totalDocks,
    totalStations: stations.length,
    busiestStations,
    emptiestStations,
    lastUpdated: statusData.last_updated,
  };
}
