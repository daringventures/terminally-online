import { fetchJSON, timeAgo } from '../fetch.mjs';

function severityLabel(score) {
  if (score === null || score === undefined) return 'N/A';
  const n = parseFloat(score);
  if (n >= 9.0) return `CRIT ${score}`;
  if (n >= 7.0) return `HIGH ${score}`;
  if (n >= 4.0) return ` MED ${score}`;
  return `  LOW ${score}`;
}

// NVD recent CVEs
export async function fetch_recent_cves(count = 15) {
  const data = await fetchJSON(
    `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=${count}`
  );
  const vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];
  return vulns.map(item => {
    const cve = item.cve ?? {};
    const id = String(cve.id ?? '');

    // Pick first English description
    const descs = Array.isArray(cve.descriptions) ? cve.descriptions : [];
    const eng = descs.find(d => d.lang === 'en');
    const desc = (eng?.value ?? '').slice(0, 45);

    // Extract CVSS score — prefer v3.1, fall back to v3.0 then v2
    const metrics = cve.metrics ?? {};
    let score = null;
    if (metrics.cvssMetricV31?.length) {
      score = metrics.cvssMetricV31[0].cvssData?.baseScore ?? null;
    } else if (metrics.cvssMetricV30?.length) {
      score = metrics.cvssMetricV30[0].cvssData?.baseScore ?? null;
    } else if (metrics.cvssMetricV2?.length) {
      score = metrics.cvssMetricV2[0].cvssData?.baseScore ?? null;
    }

    const severity = severityLabel(score !== null ? String(score) : null);

    const published = cve.published ?? null;
    const ago = published
      ? timeAgo(Math.floor(new Date(published).getTime() / 1000))
      : '?';

    return [id, desc, severity, ago];
  });
}
