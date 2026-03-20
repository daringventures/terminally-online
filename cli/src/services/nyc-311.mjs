import { fetchJSON, timeAgo } from '../fetch.mjs';

export async function fetch_nyc_311(count = 20) {
  const data = await fetchJSON(
    `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$order=created_date%20DESC&$limit=${count}`
  );
  return (data || []).map(item => {
    const dateStr = String(item.created_date || '');
    let ago = dateStr.slice(0, 10);
    if (dateStr) {
      const ts = Math.floor(new Date(dateStr).getTime() / 1000);
      if (!isNaN(ts)) ago = timeAgo(ts);
    }
    return [
      String(item.complaint_type || '').slice(0, 15),
      String(item.descriptor || '').slice(0, 35),
      String(item.borough || '').slice(0, 13),
      ago,
    ];
  });
}
