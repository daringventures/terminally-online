import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_reddit } from '../services/reddit.mjs';
import { fetch_steam_top } from '../services/steam.mjs';
import { fetch_meme_templates } from '../services/imgflip.mjs';
import { fetch_top_podcasts } from '../services/podcasts.mjs';

const POD = { w: [3, 50, 25, 15], h: ['#', 'SHOW', 'ARTIST', 'GENRE'] };

export function build(grid, W) {
  // Row 0-3: Memes + Dank
  W.memes = tbl(grid, 0, 0, 4, 6, `${I.fire} r/MEMES`, COL.feed5, 'yellow');
  W.dankmemes = tbl(grid, 0, 6, 4, 6, `${I.fire} r/DANKMEMES`, COL.feed5, 'magenta');

  // Row 4-7: Drama + Culture
  W.drama = tbl(grid, 4, 0, 4, 6, `${I.skull} r/SUBREDDITDRAMA`, COL.feed5, 'red');
  W.aita = tbl(grid, 4, 6, 4, 6, `${I.eye} r/AMITHEASSHOLE`, COL.feed5, 'cyan');

  // Row 8-11: Podcasts + Steam + Collapse
  W.podcasts = tbl(grid, 8, 0, 4, 5, `${I.globe} TOP PODCASTS`, POD, 'white');
  W.steam = tbl(grid, 8, 5, 4, 4, `${I.trophy} STEAM TOP GAMES`, COL.feed4, 'green');
  W.collapse = tbl(grid, 8, 9, 4, 3, `${I.skull} r/COLLAPSE`, COL.feed5, 'red');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [me, dk, dr, ai, pod, st, cl] = await Promise.allSettled([
    safe(cf('reddit-memes', () => fetch_reddit('memes', 20), 300)),
    safe(cf('reddit-dankmemes', () => fetch_reddit('dankmemes', 20), 300)),
    safe(cf('reddit-drama', () => fetch_reddit('SubredditDrama', 20), 600)),
    safe(cf('reddit-aita', () => fetch_reddit('AmItheAsshole', 20), 600)),
    safe(cf('podcasts-top', () => fetch_top_podcasts(20), 3600)),
    safe(cf('steam-top', () => fetch_steam_top(12), 600)),
    safe(cf('reddit-collapse', () => fetch_reddit('collapse', 15), 600)),
  ]);

  set(W.memes, me.value, 'reddit-memes');
  set(W.dankmemes, dk.value, 'reddit-dankmemes');
  set(W.drama, dr.value, 'reddit-drama');
  set(W.aita, ai.value, 'reddit-aita');
  set(W.podcasts, pod.value, 'podcasts-top');
  set(W.steam, st.value, 'steam-top');
  set(W.collapse, cl.value, 'reddit-collapse');

  const tickerItems = [];
  if (me.value?.[0]) tickerItems.push(`${I.fire}MEME: ${me.value[0][1]} (${me.value[0][2]}pts)`);
  if (pod.value?.[0]) tickerItems.push(`${I.globe}PODCAST #1: ${pod.value[0][1]}`);
  if (dr.value?.[0]) tickerItems.push(`${I.skull}DRAMA: ${dr.value[0][1]}`);
  if (st.value?.[0]) tickerItems.push(`${I.trophy}STEAM #1: ${st.value[0][1]} ${st.value[0][2]} playing`);
  setTicker(tickerItems);
}
