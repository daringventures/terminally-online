import { fetchJSON, fmtNum, timeAgo } from '../fetch.mjs';

export async function fetch_reddit(sub = 'wallstreetbets', count = 20) {
  const data = await fetchJSON(
    `https://www.reddit.com/r/${sub}/hot.json?limit=${count}&raw_json=1`
  );
  return data.data.children
    .filter(p => p.data.title)
    .map((p, i) => [
      String(i + 1),
      p.data.title.slice(0, 55),
      fmtNum(p.data.score),
      `${p.data.num_comments} cmt`,
      timeAgo(Math.floor(p.data.created_utc)),
    ]);
}
