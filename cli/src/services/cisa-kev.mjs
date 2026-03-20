import { fetchJSON, trunc } from '../fetch.mjs';

// CISA Known Exploited Vulnerabilities catalog
export async function fetch_cisa_kev(count = 15) {
  const data = await fetchJSON(
    'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
  );
  const vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];
  return [...vulns]
    .reverse()
    .slice(0, count)
    .map(v => [
      String(v.cveID ?? ''),
      trunc(v.vulnerabilityName ?? '', 80),
      String(v.vendorProject ?? ''),
      String(v.dateAdded ?? ''),
    ]);
}
