import { fetch_fear_greed } from './fear-greed.mjs';
import { fetch_trending_coins } from './coingecko.mjs';
import { fetch_earthquakes } from './usgs.mjs';
import { fetch_breaches } from './hibp.mjs';
import { fetchJSON } from '../fetch.mjs';

/**
 * SO COOKED / SO BACK INDEX
 *
 * Composite vibes index from 0 (SO COOKED) to 100 (SO BACK).
 * Aggregates signals that indicate whether the world/internet/markets
 * are in a state of chaos (cooked) or recovery (back).
 *
 * Signals (each normalized 0-100):
 * - Fear & Greed Index (direct: 0=fear/cooked, 100=greed/back)
 * - Crypto momentum (trending coins avg % change)
 * - Seismic chaos (more big quakes = more cooked)
 * - Breach chaos (recent major breaches = cooked)
 * - Reddit sentiment (WSB mood proxy)
 * - BTC dominance trend (high = flight to safety = cooked)
 */
export async function computeVibesIndex() {
  const signals = [];
  const breakdown = [];

  // 1. Fear & Greed (0-100 direct)
  try {
    const fg = await fetch_fear_greed();
    signals.push({ name: 'FEAR/GREED', value: fg.value, weight: 2.5 });
    breakdown.push(`F&G: ${fg.value} ${fg.label}`);
  } catch { signals.push({ name: 'FEAR/GREED', value: 50, weight: 2.5 }); }

  // 2. Crypto momentum (avg 24h change of trending coins)
  try {
    const coins = await fetch_trending_coins();
    const changes = coins
      .map(c => c[4]) // the Δ24h column
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
    const avg = changes.length ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
    // Map -20..+20% to 0..100
    const norm = Math.max(0, Math.min(100, (avg + 20) * 2.5));
    signals.push({ name: 'CRYPTO MOMENTUM', value: norm, weight: 2.0 });
    breakdown.push(`CRYPTO: ${avg >= 0 ? '+' : ''}${avg.toFixed(1)}% avg`);
  } catch { signals.push({ name: 'CRYPTO MOMENTUM', value: 50, weight: 2.0 }); }

  // 3. Seismic chaos (inverted: more quakes = lower score)
  try {
    const quakes = await fetch_earthquakes();
    const big = quakes.filter(q => parseFloat(q[0]) >= 6.0).length;
    const total = quakes.length;
    // 0 quakes = 100 (so back), 100+ quakes = 0 (so cooked)
    const norm = Math.max(0, 100 - total - (big * 15));
    signals.push({ name: 'SEISMIC CHAOS', value: norm, weight: 1.0 });
    breakdown.push(`QUAKES: ${total} events, ${big} M6+`);
  } catch { signals.push({ name: 'SEISMIC CHAOS', value: 70, weight: 1.0 }); }

  // 4. Breach chaos (inverted: recent big breaches = cooked)
  try {
    const breaches = await fetch_breaches(5);
    const recentBig = breaches.filter(b => {
      const count = parseInt(b[2]?.replace(/[^0-9]/g, '') || '0');
      return count > 1000000;
    }).length;
    const norm = Math.max(0, 100 - (recentBig * 25));
    signals.push({ name: 'BREACH CHAOS', value: norm, weight: 1.0 });
    breakdown.push(`BREACHES: ${recentBig} major recent`);
  } catch { signals.push({ name: 'BREACH CHAOS', value: 80, weight: 1.0 }); }

  // 5. BTC global market sentiment
  try {
    const data = await fetchJSON('https://api.coingecko.com/api/v3/global');
    const btcDom = data.data?.market_cap_percentage?.btc ?? 50;
    const totalChange = data.data?.market_cap_change_percentage_24h_usd ?? 0;
    // High BTC dominance + negative total market = cooked
    // Low BTC dominance + positive market = back
    const domScore = Math.max(0, Math.min(100, (70 - btcDom) * 3)); // high dom = low score
    const changeScore = Math.max(0, Math.min(100, (totalChange + 5) * 10));
    const norm = (domScore + changeScore) / 2;
    signals.push({ name: 'MARKET VIBES', value: norm, weight: 1.5 });
    breakdown.push(`BTC DOM: ${btcDom.toFixed(1)}%, MKT: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)}%`);
  } catch { signals.push({ name: 'MARKET VIBES', value: 50, weight: 1.5 }); }

  // Weighted average
  const totalWeight = signals.reduce((s, x) => s + x.weight, 0);
  const index = signals.reduce((s, x) => s + x.value * x.weight, 0) / totalWeight;
  const rounded = Math.round(index);

  // Classification
  let label;
  if (rounded <= 15) label = 'ABSOLUTELY COOKED';
  else if (rounded <= 30) label = 'SO COOKED';
  else if (rounded <= 40) label = 'KINDA COOKED';
  else if (rounded <= 50) label = 'MID';
  else if (rounded <= 60) label = 'RECOVERING';
  else if (rounded <= 70) label = 'KINDA BACK';
  else if (rounded <= 85) label = 'SO BACK';
  else label = 'WE ARE SO FUCKING BACK';

  return { index: rounded, label, signals, breakdown };
}

/**
 * DEGEN INDEX
 *
 * How degen is the internet right now? 0 (normie) to 100 (full send).
 * Measures memecoin activity, social velocity, and gambling volume.
 */
export async function computeDegenIndex() {
  const signals = [];
  const breakdown = [];

  // 1. Fear & Greed (inverted: extreme greed = full degen)
  try {
    const fg = await fetch_fear_greed();
    signals.push({ name: 'GREED LEVEL', value: fg.value, weight: 2.0 });
    breakdown.push(`GREED: ${fg.value}`);
  } catch { signals.push({ name: 'GREED LEVEL', value: 50, weight: 2.0 }); }

  // 2. Trending coin volatility (big moves = degen)
  try {
    const coins = await fetch_trending_coins();
    const changes = coins
      .map(c => c[4])
      .map(s => Math.abs(parseFloat(s)))
      .filter(n => !isNaN(n));
    const avgAbs = changes.length ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
    // 0% avg move = 0 degen, 50%+ = 100 degen
    const norm = Math.min(100, avgAbs * 2);
    signals.push({ name: 'COIN VOLATILITY', value: norm, weight: 2.5 });
    breakdown.push(`VOL: ${avgAbs.toFixed(1)}% avg`);
  } catch { signals.push({ name: 'COIN VOLATILITY', value: 30, weight: 2.5 }); }

  // 3. Prediction market activity (high volume = degen)
  try {
    const data = await fetchJSON(
      'https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=5'
    );
    const topVol = data[0]?.markets?.[0]?.volume ?? 0;
    const norm = Math.min(100, topVol / 100000);
    signals.push({ name: 'BETTING VOLUME', value: norm, weight: 1.5 });
    breakdown.push(`POLY VOL: $${(topVol / 1000).toFixed(0)}K`);
  } catch { signals.push({ name: 'BETTING VOLUME', value: 40, weight: 1.5 }); }

  const totalWeight = signals.reduce((s, x) => s + x.weight, 0);
  const index = signals.reduce((s, x) => s + x.value * x.weight, 0) / totalWeight;
  const rounded = Math.round(index);

  let label;
  if (rounded <= 15) label = 'NORMIE HOURS';
  else if (rounded <= 30) label = 'CASUAL';
  else if (rounded <= 50) label = 'GETTING SPICY';
  else if (rounded <= 65) label = 'DEGEN MODE';
  else if (rounded <= 80) label = 'FULL SEND';
  else label = 'YOLO\'D THE 401K';

  return { index: rounded, label, signals, breakdown };
}
