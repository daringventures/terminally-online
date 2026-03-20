import { fetchJSON, timeAgo, trunc } from '../fetch.mjs';

export async function fetch_lobsters(count = 25) {
  const stories = await fetchJSON('https://lobste.rs/hottest.json');
  return stories.slice(0, count).map((s, i) => [
    String(i + 1),
    trunc(s.title, 80),
    `${s.score}`,
    `${s.comment_count} cmt`,
    timeAgo(Math.floor(new Date(s.created_at).getTime() / 1000)),
  ]);
}
