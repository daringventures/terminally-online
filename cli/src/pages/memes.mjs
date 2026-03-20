import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_reddit } from '../services/reddit.mjs';
import { fetch_steam_top } from '../services/steam.mjs';
import { fetch_meme_templates } from '../services/imgflip.mjs';

export function build(grid, W) {
  W.memes = tbl(grid, 0, 0, 4, 6, `${I.fire} r/MEMES`, COL.feed5, 'yellow');
  W.dankmemes = tbl(grid, 0, 6, 4, 6, `${I.fire} r/DANKMEMES`, COL.feed5, 'magenta');
  W.drama = tbl(grid, 4, 0, 4, 6, `${I.skull} r/SUBREDDITDRAMA`, COL.feed5, 'red');
  W.aita = tbl(grid, 4, 6, 4, 6, `${I.eye} r/AMITHEASSHOLE`, COL.feed5, 'cyan');
  W.steam = tbl(grid, 8, 0, 4, 4, `${I.trophy} STEAM TOP GAMES`, COL.feed4, 'green');
  W.templates = tbl(grid, 8, 4, 4, 4, `${I.fire} MEME TEMPLATES`, COL.feed3, 'yellow');
  W.collapse = tbl(grid, 8, 8, 4, 4, `${I.skull} r/COLLAPSE`, COL.feed5, 'red');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [me, dk, dr, ai, st, tpl, cl] = await Promise.allSettled([
    safe(cf('reddit-memes', () => fetch_reddit('memes', 20), 300)),
    safe(cf('reddit-dankmemes', () => fetch_reddit('dankmemes', 20), 300)),
    safe(cf('reddit-drama', () => fetch_reddit('SubredditDrama', 20), 600)),
    safe(cf('reddit-aita', () => fetch_reddit('AmItheAsshole', 20), 600)),
    safe(cf('steam-top', () => fetch_steam_top(12), 600)),
    safe(cf('imgflip', () => fetch_meme_templates(15), 3600)),
    safe(cf('reddit-collapse', () => fetch_reddit('collapse', 15), 600)),
  ]);
  set(W.memes, me.value, 'reddit-memes'); set(W.dankmemes, dk.value, 'reddit-dankmemes');
  set(W.drama, dr.value, 'reddit-drama'); set(W.aita, ai.value, 'reddit-aita');
  set(W.steam, st.value, 'steam-top'); set(W.templates, tpl.value, 'imgflip'); set(W.collapse, cl.value, 'reddit-collapse');

  const tickerItems = [];
  if (me.value?.[0]) tickerItems.push(`${I.fire}MEME: ${me.value[0][1]} (${me.value[0][2]}pts)`);
  if (dr.value?.[0]) tickerItems.push(`${I.skull}DRAMA: ${dr.value[0][1]}`);
  if (st.value?.[0]) tickerItems.push(`${I.trophy}STEAM #1: ${st.value[0][1]} ${st.value[0][2]} playing`);
  setTicker(tickerItems);
}
