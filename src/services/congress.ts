export interface CongressBill {
  number: string;
  title: string;
  type: string;
  url: string;
  latestActionDate: string;
  latestActionText: string;
}

// Congress.gov has a free API but requires a key.
// We'll use their RSS feed instead (no key needed).
export async function fetchRecentBills(count = 20): Promise<CongressBill[]> {
  // Congress.gov provides RSS for recently active bills
  const res = await fetch(
    'https://www.congress.gov/rss/most-viewed-bills.xml'
  );
  if (!res.ok) throw new Error(`Congress.gov: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const items = doc.querySelectorAll('item');

  const bills: CongressBill[] = [];
  items.forEach((item, i) => {
    if (i >= count) return;
    const title = item.querySelector('title')?.textContent?.trim() ?? '';
    const link = item.querySelector('link')?.textContent?.trim() ?? '';
    const description = item.querySelector('description')?.textContent?.trim() ?? '';

    // Extract bill number from title (e.g., "H.R.1234 - Bill Title")
    const match = title.match(/^((?:H\.R\.|S\.|H\.Res\.|S\.Res\.)\d+)\s*-\s*(.*)/);

    bills.push({
      number: match?.[1] ?? '',
      title: match?.[2] ?? title,
      type: match?.[1]?.startsWith('S') ? 'Senate' : 'House',
      url: link,
      latestActionDate: '',
      latestActionText: description,
    });
  });

  return bills;
}
