import type { FeedItem } from '@/types/feed';

interface FDAEnforcementResult {
  recall_number: string;
  product_description: string;
  recalling_firm: string;
  reason_for_recall: string;
  report_date: string;
  classification: string;
  status: string;
}

interface FDAEnforcementResponse {
  results: FDAEnforcementResult[];
}

interface FDAAdverseEventResult {
  safetyreportid: string;
  receiptdate: string;
  patient?: {
    drug?: Array<{ medicinalproduct?: string }>;
    reaction?: Array<{ reactionmeddrapt?: string }>;
  };
}

interface FDAAdverseEventResponse {
  results: FDAAdverseEventResult[];
}

function parseFDADate(dateStr: string): number {
  // Format: YYYYMMDD
  if (dateStr && dateStr.length === 8) {
    const y = dateStr.slice(0, 4);
    const m = dateStr.slice(4, 6);
    const d = dateStr.slice(6, 8);
    const ts = Date.parse(`${y}-${m}-${d}T00:00:00Z`);
    if (!Number.isNaN(ts)) return Math.floor(ts / 1000);
  }
  return Math.floor(Date.now() / 1000);
}

export async function fetchFDARecalls(): Promise<FeedItem[]> {
  const res = await fetch(
    'https://api.fda.gov/food/enforcement.json?sort=report_date:desc&limit=15'
  );
  if (!res.ok) throw new Error(`FDA recalls: ${res.status}`);

  const data = (await res.json()) as FDAEnforcementResponse;

  return data.results.map((r) => ({
    id: r.recall_number,
    title: `${r.recalling_firm}: ${r.product_description}`.slice(0, 120),
    url: `https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts`,
    domain: 'fda.gov',
    author: r.classification,
    time: parseFDADate(r.report_date),
    source: 'fda-recalls',
  }));
}

export async function fetchFDAAdverseEvents(): Promise<FeedItem[]> {
  const res = await fetch(
    'https://api.fda.gov/drug/event.json?sort=receiptdate:desc&limit=15'
  );
  if (!res.ok) throw new Error(`FDA adverse events: ${res.status}`);

  const data = (await res.json()) as FDAAdverseEventResponse;

  return data.results.map((r) => {
    const drug = r.patient?.drug?.[0]?.medicinalproduct ?? 'Unknown drug';
    const reaction = r.patient?.reaction?.[0]?.reactionmeddrapt ?? 'Unknown reaction';

    return {
      id: r.safetyreportid,
      title: `${drug} — ${reaction}`,
      url: `https://www.accessdata.fda.gov/scripts/medwatch/index.cfm`,
      domain: 'fda.gov',
      time: parseFDADate(r.receiptdate),
      source: 'fda-adverse',
    };
  });
}
