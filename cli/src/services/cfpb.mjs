import { fetchJSON, timeAgo } from '../fetch.mjs';

export async function fetch_cfpb(count = 15) {
  const data = await fetchJSON(
    `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?field=all&sort=created_date_desc&size=${count}`
  );
  const hits = data?.hits?.hits || [];
  return hits.map(hit => {
    const s = hit._source || {};
    const dateStr = String(s.date_received || '');
    let ago = dateStr;
    if (dateStr) {
      const ts = Math.floor(new Date(dateStr).getTime() / 1000);
      if (!isNaN(ts)) ago = timeAgo(ts);
    }
    return [
      String(s.product || '').slice(0, 15),
      String(s.issue || '').slice(0, 35),
      String(s.company || '').slice(0, 15),
      ago,
    ];
  });
}
