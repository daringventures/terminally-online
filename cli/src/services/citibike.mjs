import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

export async function fetch_citibike() {
  const [statusData, infoData] = await Promise.all([
    fetchJSON('https://gbfs.citibikenyc.com/gbfs/en/station_status.json'),
    fetchJSON('https://gbfs.citibikenyc.com/gbfs/en/station_information.json'),
  ]);

  const statusMap = new Map(
    (statusData.data?.stations || []).map(s => [s.station_id, s])
  );
  const infoMap = new Map(
    (infoData.data?.stations || []).map(s => [s.station_id, s])
  );

  let totalBikes = 0;
  let emptyCount = 0;
  const stations = [];

  for (const [id, status] of statusMap) {
    const bikes = (status.num_bikes_available || 0) + (status.num_ebikes_available || 0);
    const docks = status.num_docks_available || 0;
    const info = infoMap.get(id);
    const name = info ? String(info.name || id) : String(id);
    totalBikes += bikes;
    if (bikes === 0) emptyCount++;
    stations.push({ name, bikes, docks, capacity: bikes + docks });
  }

  stations.sort((a, b) => b.bikes - a.bikes);
  const busiest = stations.slice(0, 5);

  stations.sort((a, b) => a.bikes - b.bikes);
  const emptiest = stations.slice(0, 5);

  const rows = [
    ['TOTAL BIKES', fmtNum(totalBikes), 'available'],
    ['TOTAL STATIONS', fmtNum(statusMap.size), 'in network'],
    ['EMPTY STATIONS', fmtNum(emptyCount), '0 bikes'],
    ['--- BUSIEST ---', '', ''],
  ];

  for (const s of busiest) {
    rows.push([trunc(s.name, 30), fmtNum(s.bikes), `${s.bikes} bikes`]);
  }

  rows.push(['--- EMPTIEST ---', '', '']);

  for (const s of emptiest) {
    rows.push([trunc(s.name, 30), fmtNum(s.bikes), `${s.docks} docks free`]);
  }

  return rows;
}
