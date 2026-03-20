import type { FeedItem } from '@/types/feed';

const NVD_API_URL =
  'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=20';

interface CVSSMetricV31 {
  cvssData: {
    baseScore: number;
    baseSeverity: string;
  };
}

interface NVDCVEItem {
  id: string;
  published: string;
  lastModified: string;
  descriptions: Array<{ lang: string; value: string }>;
  metrics?: {
    cvssMetricV31?: CVSSMetricV31[];
    cvssMetricV30?: CVSSMetricV31[];
  };
  references?: Array<{ url: string }>;
}

interface NVDResponse {
  totalResults: number;
  vulnerabilities: Array<{ cve: NVDCVEItem }>;
}

function parseCVEDate(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function getBaseScore(item: NVDCVEItem): number | undefined {
  const v31 = item.metrics?.cvssMetricV31?.[0]?.cvssData.baseScore;
  if (v31 !== undefined) return v31;
  const v30 = item.metrics?.cvssMetricV30?.[0]?.cvssData.baseScore;
  return v30;
}

function getEnDescription(item: NVDCVEItem): string {
  return (
    item.descriptions.find((d) => d.lang === 'en')?.value ??
    'No description available.'
  );
}

export async function fetchRecentCVEs(): Promise<FeedItem[]> {
  const res = await fetch(NVD_API_URL);
  if (!res.ok) throw new Error(`NVD CVE: ${res.status}`);

  const data = (await res.json()) as NVDResponse;

  return data.vulnerabilities.map(({ cve }) => {
    const score = getBaseScore(cve);
    const desc = getEnDescription(cve);
    const refUrl = cve.references?.[0]?.url;

    return {
      id: cve.id,
      title: `${cve.id} — ${desc.slice(0, 120)}${desc.length > 120 ? '…' : ''}`,
      url: refUrl ?? `https://nvd.nist.gov/vuln/detail/${cve.id}`,
      domain: 'nvd.nist.gov',
      score: score !== undefined ? Math.round(score * 10) : undefined,
      time: parseCVEDate(cve.published),
      source: 'nvd-cve',
    };
  });
}
