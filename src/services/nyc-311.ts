import type { FeedItem } from '@/types/feed';

const NYC_311_API =
  'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$order=created_date%20DESC&$limit=30';

interface NYC311Complaint {
  unique_key: string;
  complaint_type: string;
  descriptor?: string;
  created_date: string; // ISO 8601
  agency_name?: string;
  borough?: string;
  incident_address?: string;
  status?: string;
}

export async function fetchNYC311(): Promise<FeedItem[]> {
  const res = await fetch(NYC_311_API);
  if (!res.ok) throw new Error(`NYC 311: ${res.status}`);

  const data = await res.json() as NYC311Complaint[];

  return data.map((complaint) => {
    const created = new Date(complaint.created_date);
    const unixSeconds = Math.floor(created.getTime() / 1000);

    const parts: string[] = [complaint.complaint_type];
    if (complaint.descriptor) parts.push(complaint.descriptor);
    const title = parts.join(' — ');

    const meta: string[] = [];
    if (complaint.borough) meta.push(complaint.borough);
    if (complaint.incident_address) meta.push(complaint.incident_address);
    const subtitle = meta.join(', ');

    return {
      id: complaint.unique_key,
      title: subtitle ? `${title} · ${subtitle}` : title,
      url: `https://portal.311.nyc.gov/`,
      author: complaint.agency_name,
      time: unixSeconds,
      source: 'nyc-311',
    } satisfies FeedItem;
  });
}
