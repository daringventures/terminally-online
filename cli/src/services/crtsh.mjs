import { fetchJSON } from '../fetch.mjs';

// Certificate Transparency — new certs for a domain
export async function fetch_crtsh(domain = 'openai.com', count = 20) {
  const certs = await fetchJSON(
    `https://crt.sh/?q=%.${domain}&output=json&exclude=expired`
  );
  // Dedupe by common name, most recent first
  const seen = new Set();
  const rows = [];
  for (const c of certs) {
    const cn = c.common_name || c.name_value;
    if (seen.has(cn)) continue;
    seen.add(cn);
    rows.push([
      cn?.slice(0, 45) ?? '',
      c.issuer_name?.split(',')[0]?.replace('O=', '').slice(0, 20) ?? '',
      c.entry_timestamp?.split('T')[0] ?? '',
    ]);
    if (rows.length >= count) break;
  }
  return rows;
}
