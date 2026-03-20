import { tbl } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_wiki_top } from '../services/wikipedia.mjs';
import { fetch_crtsh } from '../services/crtsh.mjs';
import { fetch_usaspending } from '../services/usaspending.mjs';
import { fetch_wayback } from '../services/wayback.mjs';
import { fetch_ooni } from '../services/ooni.mjs';
import { fetch_earthquakes } from '../services/usgs.mjs';

const COL = {
  feed3: { w: [3, 58, 10],       h: ['#', 'TITLE', 'METRIC'] },
  feed4: { w: [3, 48, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  geo:   { w: [6, 46, 5, 8],     h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
};

export function build(grid, W) {
  W.wiki2 = tbl(grid, 0, 0, 4, 6, `${I.wiki} WIKIPEDIA TOP`, COL.feed3, 'white');
  W.crtsh = tbl(grid, 0, 6, 4, 6, `${I.cert} CERT TRANSPARENCY`, COL.feed3, 'red');
  W.usa = tbl(grid, 4, 0, 4, 6, `${I.money} FED CONTRACTS`, COL.feed4, 'yellow');
  W.wayback = tbl(grid, 4, 6, 4, 6, `${I.clock} WAYBACK MACHINE`, COL.feed3, 'cyan');
  W.ooni = tbl(grid, 8, 0, 4, 6, `${I.lock} CENSORSHIP`, COL.feed4, 'red');
  W.quakes2 = tbl(grid, 8, 6, 4, 6, `${I.quake} EARTHQUAKES`, COL.geo, 'yellow');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [wk, ct, us, wb, oo, eq] = await Promise.allSettled([
    safe(cf('wiki-top', fetch_wiki_top, 600)),
    safe(cf('crtsh-openai', () => fetch_crtsh('openai.com', 20), 3600)),
    safe(cf('usaspend', () => fetch_usaspending(15), 3600)),
    safe(cf('wayback-openai', () => fetch_wayback('openai.com', 20), 3600)),
    safe(cf('ooni', () => fetch_ooni(15), 1800)),
    safe(cf('quakes', fetch_earthquakes, 300)),
  ]);

  set(W.wiki2, wk.value, 'wiki-top'); set(W.crtsh, ct.value, 'crtsh-openai');
  set(W.usa, us.value, 'usaspend'); set(W.wayback, wb.value, 'wayback-openai');
  set(W.ooni, oo.value, 'ooni'); set(W.quakes2, eq.value, 'quakes');

  const tickerItems = [];
  if (wk.value?.[0]) tickerItems.push(`${I.wiki}WIKI #1: ${wk.value[0][1]} ${wk.value[0][2]} views`);
  if (oo.value?.[0]) tickerItems.push(`${I.lock}CENSORSHIP: ${oo.value[0][1]}`);
  if (eq.value?.[0]) tickerItems.push(`${I.quake}QUAKE: M${eq.value[0][0]} ${eq.value[0][1]}`);
  setTicker(tickerItems);
}
