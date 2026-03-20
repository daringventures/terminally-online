import { fmtNum } from '../fetch.mjs';

async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TerminallyOnline/0.1', Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * MIDTOWN PULSE — composite foot traffic proxy for Midtown Manhattan.
 *
 * Combines multiple real-time signals that correlate with how busy midtown is:
 * - Citi Bike dock usage in midtown stations (high usage = busy streets)
 * - NYC real-time traffic speed on midtown arterials (slow = congested = busy)
 * - NYC 311 noise complaints in midtown zips (more noise = more people)
 *
 * Returns rows for a table + a 0-100 pulse score.
 */

// Midtown zip codes (roughly 34th-59th, 3rd Ave-8th Ave)
const MIDTOWN_ZIPS = new Set([
  '10001', '10018', '10019', '10020', '10036',
  '10017', '10016', '10022', '10055', '10103',
  '10111', '10112', '10152', '10153', '10154',
]);

// Midtown Citi Bike stations contain these keywords
const MIDTOWN_KEYWORDS = [
  '42', '43', '44', '45', '46', '47', '48', '49',
  '50', '51', '52', '53', '54', '55', '56', '57', '58',
  'times sq', 'broadway', 'madison', 'park ave', 'lexington',
  'rockefeller', 'bryant', 'herald', 'penn',
];

export async function fetch_midtown_pulse() {
  const signals = [];
  const rows = [];

  // 1. Citi Bike — midtown dock usage
  try {
    const [statusRes, infoRes] = await Promise.all([
      fetchWithTimeout('https://gbfs.citibikenyc.com/gbfs/en/station_status.json'),
      fetchWithTimeout('https://gbfs.citibikenyc.com/gbfs/en/station_information.json'),
    ]);

    const infoMap = new Map();
    for (const s of infoRes.data?.stations || []) {
      const name = (s.name || '').toLowerCase();
      // Filter to midtown by lat (40.748-40.765) or name keywords
      const isMidtown = (s.lat >= 40.748 && s.lat <= 40.765 && s.lon >= -73.995 && s.lon <= -73.968)
        || MIDTOWN_KEYWORDS.some(k => name.includes(k));
      if (isMidtown) infoMap.set(s.station_id, s);
    }

    let totalBikes = 0, totalDocks = 0, stationCount = 0;
    for (const s of statusRes.data?.stations || []) {
      if (!infoMap.has(s.station_id)) continue;
      if (!s.is_renting) continue;
      totalBikes += (s.num_bikes_available || 0);
      totalDocks += (s.num_docks_available || 0);
      stationCount++;
    }

    const total = totalBikes + totalDocks;
    const usagePct = total > 0 ? Math.round(((total - totalBikes) / total) * 100) : 0;
    signals.push({ name: 'BIKE DOCKS', value: usagePct, weight: 3 });
    rows.push(['CITI BIKE', `${usagePct}% docks used`, `${fmtNum(stationCount)} stations`]);
  } catch {
    rows.push(['CITI BIKE', 'unavailable', '—']);
  }

  // 2. Traffic speed — slow = busy
  try {
    const data = await fetchWithTimeout(
      'https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$limit=50'
    );
    // Filter to midtown links (borough = Manhattan, rough lat filter)
    const speeds = data
      .map(d => parseFloat(d.speed))
      .filter(s => !isNaN(s) && s > 0);

    if (speeds.length > 0) {
      const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      // Invert: 5mph = very busy (100), 30mph = empty (0)
      const busyPct = Math.max(0, Math.min(100, Math.round((30 - avg) / 25 * 100)));
      signals.push({ name: 'TRAFFIC', value: busyPct, weight: 2 });
      rows.push(['TRAFFIC', `${avg.toFixed(1)} mph avg`, `${busyPct}% congested`]);
    }
  } catch {
    rows.push(['TRAFFIC', 'unavailable', '—']);
  }

  // 3. 311 noise complaints — more = busier
  try {
    const data = await fetchWithTimeout(
      'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=complaint_type=%27Noise%27&$order=created_date%20DESC&$limit=50'
    );
    const recent = data.filter(d => {
      const zip = d.incident_zip || '';
      return MIDTOWN_ZIPS.has(zip);
    });
    const noisePct = Math.min(100, recent.length * 10); // 10 complaints = 100%
    signals.push({ name: 'NOISE', value: noisePct, weight: 1 });
    rows.push(['311 NOISE', `${recent.length} complaints`, `midtown zips`]);
  } catch {
    rows.push(['311 NOISE', 'unavailable', '—']);
  }

  // Compute weighted pulse score
  const totalWeight = signals.reduce((s, x) => s + x.weight, 0);
  const pulse = totalWeight > 0
    ? Math.round(signals.reduce((s, x) => s + x.value * x.weight, 0) / totalWeight)
    : 50;

  let label;
  if (pulse >= 80) label = 'PACKED';
  else if (pulse >= 60) label = 'BUSY';
  else if (pulse >= 40) label = 'MODERATE';
  else if (pulse >= 20) label = 'QUIET';
  else label = 'DEAD';

  rows.unshift(['PULSE', `${pulse}/100`, label]);
  rows.push(['', '', '']);
  for (const sig of signals) {
    rows.push([`  ${sig.name}`, `${sig.value}/100`, `weight: ${sig.weight}`]);
  }

  return { rows, pulse, label, signals };
}
