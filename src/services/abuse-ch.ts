import type { FeedItem } from '@/types/feed';

const FEODO_URL =
  'https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json';
const OPENPHISH_URL = 'https://openphish.com/feed.txt';

interface FeodoEntry {
  ip_address: string;
  port: number;
  status: string;
  hostname: string | null;
  as_number: number | null;
  as_name: string | null;
  country: string | null;
  first_seen: string;
  last_online: string | null;
  malware: string;
}

function parseFeodoDate(dateStr: string): number {
  // Format: "2024-01-15 12:34:56"
  return Math.floor(new Date(dateStr.replace(' ', 'T') + 'Z').getTime() / 1000);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export async function fetchFeodoC2(count = 50): Promise<FeedItem[]> {
  const res = await fetch(FEODO_URL);
  if (!res.ok) throw new Error(`Feodo C2: ${res.status}`);

  const entries = (await res.json()) as FeodoEntry[];

  return entries.slice(0, count).map((entry) => {
    const label = entry.hostname ?? entry.ip_address;
    const asInfo = entry.as_name ? ` (${entry.as_name})` : '';
    const geo = entry.country ? ` [${entry.country}]` : '';

    return {
      id: `feodo-${entry.ip_address}-${entry.port}`,
      title: `${entry.malware} C2 — ${label}:${entry.port}${geo}${asInfo}`,
      url: `https://feodotracker.abuse.ch/browse/host/${entry.ip_address}/`,
      domain: 'feodotracker.abuse.ch',
      time: parseFeodoDate(entry.first_seen),
      source: 'abuse-ch-feodo',
    };
  });
}

export async function fetchOpenPhish(count = 50): Promise<FeedItem[]> {
  const res = await fetch(OPENPHISH_URL);
  if (!res.ok) throw new Error(`OpenPhish: ${res.status}`);

  const text = await res.text();
  const urls = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('http'));

  const now = Math.floor(Date.now() / 1000);

  return urls.slice(0, count).map((url, i) => ({
    id: `openphish-${i}-${encodeURIComponent(url).slice(0, 32)}`,
    title: `Phishing — ${extractDomain(url) || url.slice(0, 60)}`,
    url,
    domain: extractDomain(url),
    time: now,
    source: 'openphish',
  }));
}
