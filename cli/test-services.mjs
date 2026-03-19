// Headless test — verify all services can fetch without crashing
import { fetch_hn } from './src/services/hacker-news.mjs';
import { fetch_reddit } from './src/services/reddit.mjs';
import { fetch_trending_coins } from './src/services/coingecko.mjs';
import { fetch_fear_greed } from './src/services/fear-greed.mjs';
import { fetch_dex_boosts } from './src/services/dexscreener.mjs';
import { fetch_polymarket } from './src/services/polymarket.mjs';
import { fetch_manifold } from './src/services/manifold.mjs';
import { fetch_lobsters } from './src/services/lobsters.mjs';
import { fetch_wiki_top } from './src/services/wikipedia.mjs';
import { fetch_github_trending } from './src/services/github-trending.mjs';
import { fetch_arxiv } from './src/services/arxiv.mjs';
import { fetch_npm } from './src/services/npm-stats.mjs';
import { fetch_earthquakes } from './src/services/usgs.mjs';
import { fetch_breaches } from './src/services/hibp.mjs';
import { fetch_insider_trades } from './src/services/sec-edgar.mjs';
import { fetch_congress } from './src/services/congress.mjs';
import { fetch_google_trends } from './src/services/google-trends.mjs';
import { fetch_crtsh } from './src/services/crtsh.mjs';
import { fetch_usaspending } from './src/services/usaspending.mjs';
import { fetch_wayback } from './src/services/wayback.mjs';
import { fetch_ooni } from './src/services/ooni.mjs';
import { fetch_s2_papers } from './src/services/semantic-scholar.mjs';
import { fetch_producthunt } from './src/services/producthunt.mjs';
import { fetch_pypi } from './src/services/pypi.mjs';

const tests = [
  ['Hacker News',     () => fetch_hn(5)],
  ['Reddit WSB',      () => fetch_reddit('wallstreetbets', 5)],
  ['CoinGecko',       () => fetch_trending_coins()],
  ['Fear & Greed',    () => fetch_fear_greed()],
  ['DexScreener',     () => fetch_dex_boosts(5)],
  ['Polymarket',      () => fetch_polymarket(5)],
  ['Manifold',        () => fetch_manifold(5)],
  ['Lobsters',        () => fetch_lobsters(5)],
  ['Wikipedia',       () => fetch_wiki_top()],
  ['GitHub Trending', () => fetch_github_trending(5)],
  ['arXiv',           () => fetch_arxiv('cs.AI', 5)],
  ['npm Stats',       () => fetch_npm()],
  ['USGS Earthquakes',() => fetch_earthquakes()],
  ['HIBP Breaches',   () => fetch_breaches(5)],
  ['SEC Insider',     () => fetch_insider_trades(5)],
  ['Congress',        () => fetch_congress(5)],
  ['Google Trends',   () => fetch_google_trends()],
  ['crt.sh',          () => fetch_crtsh('openai.com', 5)],
  ['USAspending',     () => fetch_usaspending(5)],
  ['Wayback Machine', () => fetch_wayback('openai.com', 5)],
  ['OONI',            () => fetch_ooni(5)],
  ['Semantic Scholar', () => fetch_s2_papers('LLM', 5)],
  ['Product Hunt',    () => fetch_producthunt(5)],
  ['PyPI',            () => fetch_pypi()],
];

let pass = 0, fail = 0;
for (const [name, fn] of tests) {
  try {
    const result = await fn();
    const count = Array.isArray(result) ? result.length : (result ? 1 : 0);
    console.log(`  ✓ ${name.padEnd(20)} ${count} items`);
    pass++;
  } catch (e) {
    console.log(`  ✗ ${name.padEnd(20)} ${e.message?.slice(0, 60)}`);
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed out of ${tests.length}`);
process.exit(fail > 5 ? 1 : 0); // allow some API failures (rate limits)
