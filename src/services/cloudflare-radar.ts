import type { FeedItem } from '@/types/feed';

const CF_OUTAGES_URL =
  'https://radar.cloudflare.com/api/v1/annotations/outages?limit=10&dateRange=1d';

interface CFOutageAnnotation {
  id: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  locations?: string[];
  asns?: number[];
  linkedUrl?: string;
  description?: string;
}

interface CFOutagesResponse {
  result: {
    annotations: CFOutageAnnotation[];
  };
}

function parseISODate(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function buildTitle(annotation: CFOutageAnnotation): string {
  const type = annotation.eventType ?? 'Outage';
  const locs = annotation.locations?.join(', ') ?? '';
  const asns =
    annotation.asns && annotation.asns.length > 0
      ? ` ASN${annotation.asns.length > 1 ? 's' : ''}: ${annotation.asns.slice(0, 3).join(', ')}`
      : '';

  if (annotation.description) {
    return annotation.description.slice(0, 100);
  }

  return `${type}${locs ? ` — ${locs}` : ''}${asns}`;
}

export async function fetchInternetOutages(): Promise<FeedItem[]> {
  const res = await fetch(CF_OUTAGES_URL);
  if (!res.ok) throw new Error(`Cloudflare Radar: ${res.status}`);

  const data = (await res.json()) as CFOutagesResponse;
  const annotations = data?.result?.annotations ?? [];

  return annotations.map((ann) => ({
    id: ann.id ?? `cf-${ann.startDate}`,
    title: buildTitle(ann),
    url: ann.linkedUrl ?? 'https://radar.cloudflare.com/outage-center',
    domain: 'radar.cloudflare.com',
    time: parseISODate(ann.startDate),
    source: 'cloudflare-radar',
  }));
}
