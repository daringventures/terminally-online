import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

export async function fetch_breaches(count = 15) {
  const breaches = await fetchJSON('https://haveibeenpwned.com/api/v3/breaches');
  breaches.sort((a, b) => new Date(b.AddedDate).getTime() - new Date(a.AddedDate).getTime());
  return breaches.slice(0, count).map((b, i) => [
    String(i + 1),
    trunc(b.Title, 80),
    fmtNum(b.PwnCount),
    b.BreachDate,
  ]);
}
