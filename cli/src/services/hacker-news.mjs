import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';
const API = 'https://hacker-news.firebaseio.com/v0';

export async function fetch_hn(count = 30) {
  const ids = await fetchJSON(`${API}/topstories.json`);
  const items = await Promise.all(
    ids.slice(0, count).map(id =>
      fetchJSON(`${API}/item/${id}.json`).catch(() => null)
    )
  );
  return items
    .filter(it => it && it.type === 'story' && it.title)
    .map((it, i) => [
      String(i + 1),
      trunc(it.title, 80),
      `${it.score ?? 0}`,
      `${it.descendants ?? 0}`,
      timeAgo(it.time || 0),
    ]);
}
