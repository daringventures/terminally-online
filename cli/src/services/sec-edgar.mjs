import { fetchText, trunc } from '../fetch.mjs';

export async function fetch_insider_trades(count = 20) {
  const xml = await fetchText(
    'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=40&output=atom'
  );
  const entries = xml.split('<entry>').slice(1);
  const rows = [];
  for (const entry of entries) {
    if (rows.length >= count) break;
    const title = entry.match(/<title[^>]*>(.*?)<\/title>/)?.[1] ?? '';
    const updated = entry.match(/<updated>(.*?)<\/updated>/)?.[1]?.split('T')[0] ?? '';
    const company = title.match(/^4\s*-\s*(.+?)(?:\s*\(|$)/)?.[1]?.trim() ?? trunc(title, 60);
    rows.push([String(rows.length + 1), trunc(company, 60), 'Form 4', updated]);
  }
  return rows;
}
