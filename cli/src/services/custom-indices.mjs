import { fetchJSON, fetchText, fmtNum } from '../fetch.mjs';

/**
 * CLOWN MARKET INDEX (0-100)
 * How absurd are the markets right now?
 * Memecoins pumping + prediction markets on stupid shit + reddit mania
 */
export async function computeClownIndex() {
  const signals = [];
  const breakdown = [];

  // 1. Memecoin velocity — how fast are shitcoins moving?
  try {
    const data = await fetchJSON('https://api.coingecko.com/api/v3/search/trending');
    const coins = data.coins || [];
    const avgRank = coins.reduce((s, c) => s + (c.item.market_cap_rank || 5000), 0) / (coins.length || 1);
    // Low avg rank = established coins trending = less clown
    // High avg rank = shitcoins trending = full clown
    const norm = Math.min(100, Math.max(0, (avgRank - 100) / 20));
    signals.push({ value: norm, weight: 2.0 });
    breakdown.push(`SHITCOIN RANK: avg #${Math.round(avgRank)}`);
  } catch { signals.push({ value: 40, weight: 2.0 }); }

  // 2. WSB mania — high upvote counts = euphoria
  try {
    const data = await fetchJSON('https://www.reddit.com/r/wallstreetbets/hot.json?limit=10&raw_json=1');
    const avgScore = data.data.children.reduce((s, p) => s + p.data.score, 0) / 10;
    const norm = Math.min(100, avgScore / 200);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`WSB AVG SCORE: ${fmtNum(Math.round(avgScore))}`);
  } catch { signals.push({ value: 30, weight: 1.5 }); }

  // 3. DEX boost spending — people paying to shill
  try {
    const tokens = await fetchJSON('https://api.dexscreener.com/token-boosts/latest/v1');
    const totalBoost = tokens.slice(0, 20).reduce((s, t) => s + (t.totalAmount || 0), 0);
    const norm = Math.min(100, totalBoost / 500);
    signals.push({ value: norm, weight: 2.0 });
    breakdown.push(`DEX SHILL $: $${fmtNum(totalBoost)}`);
  } catch { signals.push({ value: 30, weight: 2.0 }); }

  // 4. Fear & Greed extremes = clown (both directions)
  try {
    const data = await fetchJSON('https://api.alternative.me/fng/?limit=1');
    const v = parseInt(data.data[0].value);
    // Extreme fear OR extreme greed = clown. Middle = sane.
    const distFromCenter = Math.abs(v - 50);
    const norm = distFromCenter * 2; // 0 at center, 100 at extremes
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`F&G EXTREME: ${distFromCenter} from center`);
  } catch { signals.push({ value: 30, weight: 1.5 }); }

  const totalW = signals.reduce((s, x) => s + x.weight, 0);
  const index = Math.round(signals.reduce((s, x) => s + x.value * x.weight, 0) / totalW);

  let label;
  if (index <= 15) label = 'EFFICIENT MARKET';
  else if (index <= 30) label = 'MOSTLY SANE';
  else if (index <= 45) label = 'GETTING SILLY';
  else if (index <= 60) label = 'CLOWN SHOES';
  else if (index <= 75) label = 'FULL CIRCUS';
  else label = 'HONK HONK';

  return { index, label, breakdown };
}

/**
 * DOOM SCROLL INDEX (0-100)
 * How much bad shit is happening in the world right now?
 * Earthquakes + breaches + censorship + conflict signals
 */
export async function computeDoomIndex() {
  const signals = [];
  const breakdown = [];

  // 1. Seismic activity
  try {
    const data = await fetchJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson');
    const count = data.features.length;
    const big = data.features.filter(f => f.properties.mag >= 6.0).length;
    const norm = Math.min(100, count + big * 20);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`QUAKES: ${count} (${big} M6+)`);
  } catch { signals.push({ value: 30, weight: 1.5 }); }

  // 2. Data breaches
  try {
    const breaches = await fetchJSON('https://haveibeenpwned.com/api/v3/breaches');
    const recent = breaches.filter(b => {
      const d = new Date(b.AddedDate);
      return Date.now() - d.getTime() < 30 * 86400000; // last 30 days
    });
    const norm = Math.min(100, recent.length * 15);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`BREACHES (30d): ${recent.length}`);
  } catch { signals.push({ value: 20, weight: 1.5 }); }

  // 3. Internet censorship (OONI incidents)
  try {
    const data = await fetchJSON('https://api.ooni.io/api/v1/incidents/search?limit=50&only_mine=false');
    const count = (data.incidents || []).length;
    const norm = Math.min(100, count * 3);
    signals.push({ value: norm, weight: 2.0 });
    breakdown.push(`CENSORSHIP INCIDENTS: ${count}`);
  } catch { signals.push({ value: 30, weight: 2.0 }); }

  // 4. Fear index (inverted — high fear = high doom)
  try {
    const data = await fetchJSON('https://api.alternative.me/fng/?limit=1');
    const v = parseInt(data.data[0].value);
    const norm = 100 - v; // flip: fear = doom
    signals.push({ value: norm, weight: 2.0 });
    breakdown.push(`FEAR: ${100 - v}/100`);
  } catch { signals.push({ value: 50, weight: 2.0 }); }

  const totalW = signals.reduce((s, x) => s + x.weight, 0);
  const index = Math.round(signals.reduce((s, x) => s + x.value * x.weight, 0) / totalW);

  let label;
  if (index <= 15) label = 'TOUCHING GRASS';
  else if (index <= 30) label = 'MINOR CHAOS';
  else if (index <= 45) label = 'BAD VIBES';
  else if (index <= 60) label = 'DOOM SCROLLING';
  else if (index <= 75) label = 'THE END TIMES';
  else label = 'WE\'RE ALL GONNA DIE';

  return { index, label, breakdown };
}

/**
 * MAIN CHARACTER INDEX (0-100)
 * Is anything having a "main character moment" on the internet?
 * Wikipedia spikes + Google trends velocity + Reddit heat
 */
export async function computeMainCharIndex() {
  const signals = [];
  const breakdown = [];

  // 1. Wikipedia spike magnitude
  try {
    const d = new Date(); d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const data = await fetchJSON(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`
    );
    const articles = (data.items?.[0]?.articles ?? [])
      .filter(a => !a.article.startsWith('Special:') && a.article !== 'Main_Page');
    const topViews = articles[0]?.views ?? 0;
    // > 10M views on #1 = something insane is happening
    const norm = Math.min(100, topViews / 100000);
    signals.push({ value: norm, weight: 2.0 });
    const topName = articles[0]?.article?.replace(/_/g, ' ') ?? '?';
    breakdown.push(`WIKI #1: ${topName} (${fmtNum(topViews)})`);
  } catch { signals.push({ value: 30, weight: 2.0 }); }

  // 2. Google Trends velocity — how many trending searches?
  try {
    const xml = await fetchText('https://trends.google.com/trending/rss?geo=US');
    const count = (xml.match(/<item>/g) || []).length;
    const norm = Math.min(100, count * 5);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`TRENDS: ${count} trending`);
  } catch { signals.push({ value: 40, weight: 1.5 }); }

  // 3. Reddit r/all heat
  try {
    const data = await fetchJSON('https://www.reddit.com/r/all/top.json?t=hour&limit=5&raw_json=1');
    const topScore = data.data.children[0]?.data?.score ?? 0;
    const norm = Math.min(100, topScore / 500);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`r/ALL TOP: ${fmtNum(topScore)} pts`);
  } catch { signals.push({ value: 30, weight: 1.5 }); }

  const totalW = signals.reduce((s, x) => s + x.weight, 0);
  const index = Math.round(signals.reduce((s, x) => s + x.value * x.weight, 0) / totalW);

  let label;
  if (index <= 15) label = 'NPC ENERGY';
  else if (index <= 30) label = 'SIDE CHARACTER';
  else if (index <= 50) label = 'SUPPORTING ROLE';
  else if (index <= 65) label = 'MAIN CHARACTER';
  else if (index <= 80) label = 'PROTAGONIST ARC';
  else label = 'ANIME FINAL BOSS';

  return { index, label, breakdown };
}

/**
 * TECH BRO PANIC INDEX (0-100)
 * How freaked out is the tech industry?
 * HN negativity + GitHub stars on "alternative to" repos + npm new framework churn
 */
export async function computeTechPanicIndex() {
  const signals = [];
  const breakdown = [];

  // 1. HN top story sentiment (rough: score-to-comments ratio)
  try {
    const ids = await fetchJSON('https://hacker-news.firebaseio.com/v0/topstories.json');
    const items = await Promise.all(
      ids.slice(0, 10).map(id => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch(() => null))
    );
    const valid = items.filter(Boolean);
    // High comment-to-score ratio = controversial = panicking
    const avgRatio = valid.reduce((s, it) => s + ((it.descendants || 0) / Math.max(it.score || 1, 1)), 0) / valid.length;
    const norm = Math.min(100, avgRatio * 50);
    signals.push({ value: norm, weight: 2.0 });
    breakdown.push(`HN RATIO: ${avgRatio.toFixed(2)} cmt/pt`);
  } catch { signals.push({ value: 30, weight: 2.0 }); }

  // 2. GitHub "alternative" repos trending
  try {
    const since = new Date(); since.setDate(since.getDate() - 7);
    const data = await fetchJSON(
      `https://api.github.com/search/repositories?q=alternative+created:>${since.toISOString().split('T')[0]}&sort=stars&per_page=5`
    );
    const altCount = data.total_count || 0;
    const norm = Math.min(100, altCount / 10);
    signals.push({ value: norm, weight: 1.0 });
    breakdown.push(`"ALTERNATIVE" REPOS: ${altCount}`);
  } catch { signals.push({ value: 30, weight: 1.0 }); }

  // 3. Layoffs signal — r/cscareerquestions heat
  try {
    const data = await fetchJSON('https://www.reddit.com/r/cscareerquestions/hot.json?limit=5&raw_json=1');
    const avgScore = data.data.children.reduce((s, p) => s + p.data.score, 0) / 5;
    const norm = Math.min(100, avgScore / 100);
    signals.push({ value: norm, weight: 1.5 });
    breakdown.push(`r/CSCQ HEAT: ${fmtNum(Math.round(avgScore))} avg`);
  } catch { signals.push({ value: 30, weight: 1.5 }); }

  const totalW = signals.reduce((s, x) => s + x.weight, 0);
  const index = Math.round(signals.reduce((s, x) => s + x.value * x.weight, 0) / totalW);

  let label;
  if (index <= 15) label = 'VIBING';
  else if (index <= 30) label = 'MILD CONCERN';
  else if (index <= 45) label = 'UPDATING LINKEDIN';
  else if (index <= 60) label = 'LEARNING RUST';
  else if (index <= 75) label = 'FULL PANIC';
  else label = 'PIVOTING TO AI';

  return { index, label, breakdown };
}
