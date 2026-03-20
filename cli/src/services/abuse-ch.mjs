import { fetchJSON, fetchText, timeAgo, trunc } from '../fetch.mjs';

// Feodo Tracker C2 IP blocklist (abuse.ch)
export async function fetch_feodo_c2(count = 15) {
  const data = await fetchJSON(
    'https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json'
  );
  const entries = Array.isArray(data) ? data : [];
  return entries.slice(0, count).map(e => {
    const firstSeen = e.first_seen_utc ?? e.first_seen ?? null;
    const ago = firstSeen
      ? timeAgo(Math.floor(new Date(firstSeen).getTime() / 1000))
      : '?';
    return [
      String(e.ip_address ?? ''),
      String(e.port ?? ''),
      String(e.malware ?? e.malware_family ?? ''),
      String(e.country ?? ''),
      ago,
    ];
  });
}

// OpenPhish phishing feed (plain text, one URL per line)
export async function fetch_phishing(count = 15) {
  const text = await fetchText('https://openphish.com/feed.txt');
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, count)
    .map((url, i) => {
      let domain = '';
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = url.split('/')[0] ?? '';
      }
      return [String(i + 1), trunc(url, 80), domain];
    });
}
