import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';

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
      trunc(String(s.product || ''), 30),
      trunc(String(s.issue || ''), 60),
      trunc(String(s.company || ''), 30),
      ago,
    ];
  });
}
