import { tbl } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_github_trending } from '../services/github-trending.mjs';
import { fetch_arxiv } from '../services/arxiv.mjs';
import { fetch_npm } from '../services/npm-stats.mjs';
import { fetch_pypi } from '../services/pypi.mjs';
import { fetch_s2_papers } from '../services/semantic-scholar.mjs';
import { fetch_hn } from '../services/hacker-news.mjs';
import { fetch_lobsters } from '../services/lobsters.mjs';

const COL = {
  feed5: { w: [3, 52, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed4: { w: [3, 48, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  kv3:   { w: [3, 36, 14],       h: ['#', 'NAME', 'VALUE'] },
};

export function build(grid, W) {
  W.github = tbl(grid, 0, 0, 4, 6, `${I.git} GITHUB RISING`, COL.feed4, 'green');
  W.arxiv = tbl(grid, 0, 6, 4, 6, `${I.brain} ARXIV AI`, COL.feed4, 'cyan');
  W.npm = tbl(grid, 4, 0, 4, 4, `${I.pkg} NPM`, COL.kv3, 'yellow');
  W.pypi = tbl(grid, 4, 4, 4, 4, `${I.pkg} PYPI`, COL.kv3, 'blue');
  W.s2 = tbl(grid, 4, 8, 4, 4, `${I.brain} SEMANTIC SCHOLAR`, COL.feed4, 'magenta');
  W.hn2 = tbl(grid, 8, 0, 4, 6, `${I.hn} HACKER NEWS`, COL.feed5, 'green');
  W.lobsters2 = tbl(grid, 8, 6, 4, 6, `${I.trophy} LOBSTE.RS`, COL.feed5, 'green');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [gh, ax, nm, py, s2, hn, lo] = await Promise.allSettled([
    safe(cf('github-trend', () => fetch_github_trending(20), 600)),
    safe(cf('arxiv-ai', () => fetch_arxiv('cs.AI', 20), 900)),
    safe(cf('npm-dl', fetch_npm, 3600)),
    safe(cf('pypi-dl', fetch_pypi, 3600)),
    safe(cf('s2-llm', () => fetch_s2_papers('large language model', 15), 900)),
    safe(cf('hn', () => fetch_hn(20), 120)),
    safe(cf('lobsters', () => fetch_lobsters(20), 120)),
  ]);

  set(W.github, gh.value); set(W.arxiv, ax.value);
  set(W.npm, nm.value); set(W.pypi, py.value); set(W.s2, s2.value);
  set(W.hn2, hn.value); set(W.lobsters2, lo.value);

  const tickerItems = [];
  if (gh.value?.[0]) tickerItems.push(`${I.git}RISING: ${gh.value[0][1]} ${gh.value[0][3]}`);
  if (ax.value?.[0]) tickerItems.push(`${I.brain}ARXIV: ${ax.value[0][1]}`);
  if (nm.value?.[0]) tickerItems.push(`${I.pkg}NPM #1: ${nm.value[0][1]} ${nm.value[0][2]}`);
  setTicker(tickerItems);
}
