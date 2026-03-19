import { fetchJSON } from '../fetch.mjs';

// Wayback Machine CDX — recent captures of a domain
export async function fetch_wayback(domain = 'openai.com', count = 20) {
  const data = await fetchJSON(
    `https://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&fl=timestamp,original,statuscode&limit=${count}&sort=reverse`
  );
  // First row is header
  return data.slice(1).map(([ts, url, status]) => {
    const date = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`;
    const path = url.replace(/^https?:\/\/[^/]+/, '').slice(0, 40) || '/';
    return [date, path, status];
  });
}
