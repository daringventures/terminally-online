import { fetchJSON } from '../fetch.mjs';

export async function fetch_meme_templates(count = 20) {
  const data = await fetchJSON('https://api.imgflip.com/get_memes');
  return data.data.memes
    .slice(0, count)
    .map((m, i) => [
      String(i + 1),
      m.name.slice(0, 50),
      `${m.width}x${m.height}`,
      `${m.box_count} boxes`,
    ]);
}
