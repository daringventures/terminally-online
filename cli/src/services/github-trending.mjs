import { fetchJSON, fmtNum } from '../fetch.mjs';

export async function fetch_github_trending(count = 20) {
  const since = new Date(); since.setDate(since.getDate() - 7);
  const sinceStr = since.toISOString().split('T')[0];
  const data = await fetchJSON(
    `https://api.github.com/search/repositories?q=created:>${sinceStr}&sort=stars&order=desc&per_page=${count}`
  );
  return data.items.map((r, i) => [
    String(i + 1),
    r.full_name.slice(0, 40),
    r.language || '-',
    `★${fmtNum(r.stargazers_count)}`,
  ]);
}
