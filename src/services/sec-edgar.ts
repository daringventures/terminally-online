export interface InsiderFiling {
  title: string;
  link: string;
  pubDate: string;
  company: string;
}

export async function fetchInsiderTrading(count = 25): Promise<InsiderFiling[]> {
  // SEC EDGAR RSS for latest Form 4 filings (insider trades)
  const res = await fetch(
    'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=40&output=atom',
    { headers: { 'User-Agent': 'TerminallyOnline/0.1 dashboard@example.com' } }
  );
  if (!res.ok) throw new Error(`SEC EDGAR: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const entries = doc.querySelectorAll('entry');

  const filings: InsiderFiling[] = [];
  entries.forEach((entry) => {
    const title = entry.querySelector('title')?.textContent?.trim() ?? '';
    const link = entry.querySelector('link')?.getAttribute('href') ?? '';
    const updated = entry.querySelector('updated')?.textContent?.trim() ?? '';
    const company = entry.querySelector('company-name')?.textContent?.trim() ??
      extractCompany(title);

    filings.push({ title, link, pubDate: updated, company });
  });

  return filings.slice(0, count);
}

function extractCompany(title: string): string {
  // Form 4 titles look like: "4 - Company Name (0001234567) (Filer)"
  const match = title.match(/^4\s*-\s*(.+?)(?:\s*\(|$)/);
  return match?.[1]?.trim() ?? title;
}
