import type { FeedItem } from '@/types/feed';

interface CFPBHit {
  _source: {
    complaint_id: string;
    product: string;
    sub_product?: string;
    issue: string;
    company: string;
    date_received: string;
    state?: string;
    consumer_disputed?: string;
  };
}

interface CFPBResponse {
  hits: {
    hits: CFPBHit[];
    total: { value: number };
  };
}

export async function fetchCFPBComplaints(): Promise<FeedItem[]> {
  const res = await fetch(
    'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?field=all&sort=created_date_desc&size=20'
  );
  if (!res.ok) throw new Error(`CFPB: ${res.status}`);

  const data = (await res.json()) as CFPBResponse;
  const hits = data.hits?.hits ?? [];

  return hits.map((hit) => {
    const s = hit._source;
    const product = s.sub_product ? `${s.product} / ${s.sub_product}` : s.product;
    const time = s.date_received
      ? Math.floor(Date.parse(s.date_received) / 1000)
      : Math.floor(Date.now() / 1000);

    return {
      id: s.complaint_id,
      title: `${s.company}: ${s.issue}`,
      url: `https://www.consumerfinance.gov/data-research/consumer-complaints/search/?complaint_id=${s.complaint_id}`,
      domain: 'consumerfinance.gov',
      author: product,
      time,
      source: 'cfpb',
    };
  });
}
