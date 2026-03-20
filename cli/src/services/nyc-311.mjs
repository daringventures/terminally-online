import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';

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
      trunc(String(item.complaint_type || ''), 30),
      trunc(String(item.descriptor || ''), 60),
      trunc(String(item.borough || ''), 30),
      ago,
    ];
  });
}
