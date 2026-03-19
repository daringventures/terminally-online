import { fetchText } from '../fetch.mjs';

export async function fetch_congress(count = 20) {
  const xml = await fetchText('https://www.congress.gov/rss/most-viewed-bills.xml');
  // Congress RSS has ONE <item> with an HTML <ol> inside CDATA
  const desc = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ?? '';
  // Parse <li><a href='...'>H.R.1234</a> [119th] - Bill Title</li>
  const lis = [...desc.matchAll(/<li><a[^>]*>([^<]+)<\/a>\s*\[[\d]+(?:th|st|nd|rd)\]\s*-\s*([^<]+)<\/li>/g)];
  return lis.slice(0, count).map(m => {
    const bill = m[1].trim();
    const title = m[2].trim();
    return [
      bill,
      title.slice(0, 50),
      bill.startsWith('S') ? 'Senate' : 'House',
    ];
  });
}
