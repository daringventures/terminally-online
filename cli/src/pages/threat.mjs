import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_cisa_kev } from '../services/cisa-kev.mjs';
import { fetch_recent_cves } from '../services/nvd-cve.mjs';
import { fetch_feodo_c2, fetch_phishing } from '../services/abuse-ch.mjs';
import { fetch_internet_outages } from '../services/cloudflare-outages.mjs';
import { fetch_breaches } from '../services/hibp.mjs';

export function build(grid, W) {
  W.kev = tbl(grid, 0, 0, 4, 6, `${I.lock} CISA KNOWN EXPLOITED VULNS`, COL.feed4, 'red');
  W.cves = tbl(grid, 0, 6, 4, 6, `${I.lock} RECENT CVEs (NVD)`, COL.feed4, 'yellow');
  W.c2 = tbl(grid, 4, 0, 4, 6, `${I.skull} C2 SERVERS (FEODO)`, COL.feed4, 'red');
  W.phish = tbl(grid, 4, 6, 4, 6, `${I.lock} PHISHING URLs (OPENPHISH)`, COL.wide2, 'magenta');
  W.outages = tbl(grid, 8, 0, 4, 6, `${I.bolt} INTERNET OUTAGES`, COL.feed4, 'yellow');
  W.breaches3 = tbl(grid, 8, 6, 4, 6, `${I.skull} DATA BREACHES`, COL.feed4, 'red');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [kev, cve, c2, ph, out, br] = await Promise.allSettled([
    safe(cf('cisa-kev', () => fetch_cisa_kev(15), 3600)),
    safe(cf('nvd-cve', () => fetch_recent_cves(15), 1800)),
    safe(cf('feodo-c2', () => fetch_feodo_c2(15), 3600)),
    safe(cf('phishing', () => fetch_phishing(15), 3600)),
    safe(cf('outages', fetch_internet_outages, 300)),
    safe(cf('hibp', () => fetch_breaches(15), 3600)),
  ]);
  set(W.kev, kev.value); set(W.cves, cve.value);
  set(W.c2, c2.value); set(W.phish, ph.value);
  set(W.outages, out.value); set(W.breaches3, br.value);

  const tickerItems = [];
  if (kev.value?.[0]) tickerItems.push(`${I.lock}KEV: ${kev.value[0][0]} ${kev.value[0][1]}`);
  if (cve.value?.[0]) tickerItems.push(`${I.lock}CVE: ${cve.value[0][0]} ${cve.value[0][2]}`);
  if (c2.value) tickerItems.push(`${I.skull}${c2.value.length} ACTIVE C2 SERVERS`);
  if (out.value?.[0]) tickerItems.push(`${I.bolt}OUTAGE: ${out.value[0][1]}`);
  setTicker(tickerItems);
}
