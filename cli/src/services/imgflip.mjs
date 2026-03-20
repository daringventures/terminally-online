import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_meme_templates(count = 20) {
  const data = await fetchJSON('https://api.imgflip.com/get_memes');
  return data.data.memes
    .slice(0, count)
    .map((m, i) => [
      String(i + 1),
      trunc(m.name, 80),
      `${m.width}x${m.height}`,
      `${m.box_count} boxes`,
    ]);
}
