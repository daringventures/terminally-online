import type { FeedItem } from '@/types/feed';

const CISA_KEV_URL =
  'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

interface KEVEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  notes: string;
}

interface KEVResponse {
  title: string;
  catalogVersion: string;
  dateReleased: string;
  count: number;
  vulnerabilities: KEVEntry[];
}

function parseDate(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

export async function fetchCISAKEV(count = 30): Promise<FeedItem[]> {
  const res = await fetch(CISA_KEV_URL);
  if (!res.ok) throw new Error(`CISA KEV: ${res.status}`);

  const data = (await res.json()) as KEVResponse;

  // Entries are oldest-first; reverse to get newest first
  const recent = [...data.vulnerabilities].reverse().slice(0, count);

  return recent.map((entry) => ({
    id: entry.cveID,
    title: `${entry.cveID} — ${entry.vulnerabilityName}`,
    url: `https://nvd.nist.gov/vuln/detail/${entry.cveID}`,
    domain: 'cisa.gov',
    time: parseDate(entry.dateAdded),
    source: 'cisa-kev',
  }));
}
