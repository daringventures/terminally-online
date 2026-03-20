import { fmtNum, trunc } from '../fetch.mjs';

// USAspending — recent federal awards
export async function fetch_usaspending(count = 15) {
  const res = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'TerminallyOnline/0.1' },
    body: JSON.stringify({
      filters: {
        time_period: [{ start_date: daysAgo(30), end_date: today() }],
        award_type_codes: ['A', 'B', 'C', 'D'],
      },
      fields: ['Award ID', 'Recipient Name', 'Award Amount', 'Awarding Agency', 'Start Date'],
      limit: count,
      sort: 'Award Amount',
      order: 'desc',
      subawards: false,
    }),
  });
  if (!res.ok) throw new Error(`USAspending: ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((r, i) => [
    String(i + 1),
    trunc(r['Recipient Name'] || '', 30),
    '$' + fmtNum(Math.abs(r['Award Amount'] || 0)),
    trunc(r['Awarding Agency'] || '', 30),
  ]);
}

function today() {
  return new Date().toISOString().split('T')[0];
}
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
