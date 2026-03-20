// ============================================================================
// CURSED INDICES — composite vibe scores computed from multiple live APIs
// Each index returns { value: 0–100, label: string, breakdown: string[] }
// ============================================================================

export interface IndexResult {
  value: number;
  label: string;
  breakdown: string[];
}

// ---------------------------------------------------------------------------
// DEGEN INDEX
// Formula: fear-greed score (0-100) weighted 60%, crypto trending coin count
// weighted 40% (max 15 coins = full score). Higher = more degen energy.
// ---------------------------------------------------------------------------
export async function computeDegenIndex(): Promise<IndexResult> {
  const [fgRes, cgRes] = await Promise.allSettled([
    fetch('https://api.alternative.me/fng/?limit=1').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ data: Array<{ value: string; value_classification: string }> }>;
    }),
    fetch('https://api.coingecko.com/api/v3/search/trending').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ coins: unknown[] }>;
    }),
  ]);

  const breakdown: string[] = [];
  let fgScore = 50;
  let coinCount = 7;

  if (fgRes.status === 'fulfilled') {
    const entry = fgRes.value.data[0];
    if (entry) {
      fgScore = parseInt(entry.value, 10);
      breakdown.push(`Fear/Greed: ${fgScore} (${entry.value_classification})`);
    }
  } else {
    breakdown.push('Fear/Greed: unavailable');
  }

  if (cgRes.status === 'fulfilled') {
    coinCount = cgRes.value.coins.length;
    breakdown.push(`Trending coins: ${coinCount}`);
  } else {
    breakdown.push('Trending coins: unavailable');
  }

  // Boost if fear_greed > 70 (greed zone)
  const fgBoost = fgScore > 70 ? (fgScore - 70) * 0.5 : 0;
  const coinComponent = Math.min(coinCount / 15, 1) * 40;
  const fgComponent = (fgScore / 100) * 60 + fgBoost;
  const raw = Math.min(fgComponent + coinComponent, 100);
  const value = Math.round(raw);

  const label =
    value >= 80
      ? 'FULL DEGEN'
      : value >= 60
        ? 'DEGEN MODE'
        : value >= 40
          ? 'NGMI VIBES'
          : value >= 20
            ? 'PAPER HANDS'
            : 'NGMI';

  breakdown.push(`Composite score: ${value}/100`);

  return { value, label, breakdown };
}

// ---------------------------------------------------------------------------
// DOOMER INDEX
// Formula: USGS M4.5+ quakes this week + NWS active weather alerts.
// More seismic activity + more severe weather = higher doom.
// ---------------------------------------------------------------------------
export async function computeDoomerIndex(): Promise<IndexResult> {
  const [quakeRes, weatherRes] = await Promise.allSettled([
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson').then(
      (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ features: unknown[] }>;
      }
    ),
    fetch('https://api.weather.gov/alerts/active?status=actual&message_type=alert').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ features: unknown[] }>;
    }),
  ]);

  const breakdown: string[] = [];
  let quakeCount = 0;
  let alertCount = 0;

  if (quakeRes.status === 'fulfilled') {
    quakeCount = quakeRes.value.features.length;
    breakdown.push(`M4.5+ quakes (7d): ${quakeCount}`);
  } else {
    breakdown.push('Earthquake data: unavailable');
  }

  if (weatherRes.status === 'fulfilled') {
    alertCount = weatherRes.value.features.length;
    breakdown.push(`Active weather alerts: ${alertCount}`);
  } else {
    breakdown.push('Weather alerts: unavailable');
  }

  // Typical weekly M4.5+ count is ~30-60; alerts can be 100-500+
  const quakeComponent = Math.min(quakeCount / 80, 1) * 50;
  const alertComponent = Math.min(alertCount / 300, 1) * 50;
  const value = Math.round(quakeComponent + alertComponent);

  const label =
    value >= 80
      ? 'LITERALLY DOOMED'
      : value >= 60
        ? 'DOOM ESCALATING'
        : value >= 40
          ? 'CONCERNING SIGNS'
          : value >= 20
            ? 'MILD UNEASE'
            : 'WE ARE FINE';

  breakdown.push(`Doom composite: ${value}/100`);

  return { value, label, breakdown };
}

// ---------------------------------------------------------------------------
// COSMIC VIBES INDEX
// Formula: NOAA DSCOVR solar wind speed + planetary K-index.
// Higher solar wind + higher Kp = more cosmic chaos.
// ---------------------------------------------------------------------------
export async function computeCosmicVibes(): Promise<IndexResult> {
  const [windRes, kpRes] = await Promise.allSettled([
    fetch('https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<Array<{ proton_speed: number | null }>>;
    }),
    fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<Array<{ kp_index: number | null }>>;
    }),
  ]);

  const breakdown: string[] = [];
  let solarWindKmps = 400; // typical solar wind ~400 km/s
  let kpIndex = 1;

  if (windRes.status === 'fulfilled') {
    const arr = windRes.value;
    const latest = arr[arr.length - 1];
    if (latest?.proton_speed != null) {
      solarWindKmps = latest.proton_speed;
      breakdown.push(`Solar wind: ${Math.round(solarWindKmps)} km/s`);
    } else {
      breakdown.push('Solar wind: no data');
    }
  } else {
    breakdown.push('Solar wind: unavailable');
  }

  if (kpRes.status === 'fulfilled') {
    const arr = kpRes.value;
    const latest = arr[arr.length - 1];
    if (latest?.kp_index != null) {
      kpIndex = latest.kp_index;
      breakdown.push(`Kp index: ${kpIndex.toFixed(1)}`);
    } else {
      breakdown.push('Kp index: no data');
    }
  } else {
    breakdown.push('Kp index: unavailable');
  }

  // Solar wind: typical 300-800 km/s; storm = 800+
  // Kp: 0-9; geomagnetic storm >= 5
  const windComponent = Math.min(Math.max(solarWindKmps - 250, 0) / 550, 1) * 60;
  const kpComponent = Math.min(kpIndex / 9, 1) * 40;
  const value = Math.round(windComponent + kpComponent);

  const label =
    value >= 80
      ? 'SOLAR STORM INCOMING'
      : value >= 60
        ? 'STRONG COSMIC ENERGY'
        : value >= 40
          ? 'ELEVATED VIBES'
          : value >= 20
            ? 'MILD COSMIC STATIC'
            : 'QUIET SUN';

  breakdown.push(`Cosmic composite: ${value}/100`);

  return { value, label, breakdown };
}

// ---------------------------------------------------------------------------
// MEME VELOCITY INDEX
// Formula: total karma from top posts in r/memes + r/dankmemes.
// Higher combined engagement = memes moving faster.
// ---------------------------------------------------------------------------
export async function computeMemeVelocity(): Promise<IndexResult> {
  const [memesRes, dankRes] = await Promise.allSettled([
    fetch('https://www.reddit.com/r/memes/hot.json?limit=25&raw_json=1', {
      headers: { Accept: 'application/json' },
    }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ data: { children: Array<{ data: { score: number } }> } }>;
    }),
    fetch('https://www.reddit.com/r/dankmemes/hot.json?limit=25&raw_json=1', {
      headers: { Accept: 'application/json' },
    }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ data: { children: Array<{ data: { score: number } }> } }>;
    }),
  ]);

  const breakdown: string[] = [];
  let memesTotal = 0;
  let dankTotal = 0;

  if (memesRes.status === 'fulfilled') {
    memesTotal = memesRes.value.data.children.reduce((sum, p) => sum + (p.data.score ?? 0), 0);
    const topScore = memesRes.value.data.children[0]?.data.score ?? 0;
    breakdown.push(`r/memes karma: ${memesTotal.toLocaleString()} (top: ${topScore.toLocaleString()})`);
  } else {
    breakdown.push('r/memes: unavailable');
  }

  if (dankRes.status === 'fulfilled') {
    dankTotal = dankRes.value.data.children.reduce((sum, p) => sum + (p.data.score ?? 0), 0);
    const topScore = dankRes.value.data.children[0]?.data.score ?? 0;
    breakdown.push(`r/dankmemes karma: ${dankTotal.toLocaleString()} (top: ${topScore.toLocaleString()})`);
  } else {
    breakdown.push('r/dankmemes: unavailable');
  }

  const combined = memesTotal + dankTotal;
  // Combined top-25 karma: typical ~150k-600k combined; full velocity = 1M+
  const value = Math.round(Math.min(combined / 1_000_000, 1) * 100);

  const label =
    value >= 80
      ? 'MEME SINGULARITY'
      : value >= 60
        ? 'HYPERSPEED MEMES'
        : value >= 40
          ? 'MEMES ARE COOKING'
          : value >= 20
            ? 'SLOW MEME CYCLE'
            : 'DEAD INTERNET';

  breakdown.push(`Combined karma: ${combined.toLocaleString()}`);

  return { value, label, breakdown };
}

// ---------------------------------------------------------------------------
// TOUCH GRASS INDEX
// Inverse of online activity. High meme engagement = LOW touch grass score.
// Also penalizes for high fear/greed (markets got you glued to the screen).
// Returns 0-100 where 100 = you definitely touched grass today.
// ---------------------------------------------------------------------------
export async function computeTouchGrassIndex(): Promise<IndexResult> {
  const [memesRes, fgRes] = await Promise.allSettled([
    fetch('https://www.reddit.com/r/memes/hot.json?limit=10&raw_json=1', {
      headers: { Accept: 'application/json' },
    }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ data: { children: Array<{ data: { score: number } }> } }>;
    }),
    fetch('https://api.alternative.me/fng/?limit=1').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ data: Array<{ value: string; value_classification: string }> }>;
    }),
  ]);

  const breakdown: string[] = [];
  let memeKarma = 0;
  let fgValue = 50;

  if (memesRes.status === 'fulfilled') {
    memeKarma = memesRes.value.data.children.reduce((sum, p) => sum + (p.data.score ?? 0), 0);
    breakdown.push(`r/memes top-10 karma: ${memeKarma.toLocaleString()}`);
  } else {
    breakdown.push('Reddit: unavailable');
  }

  if (fgRes.status === 'fulfilled') {
    const entry = fgRes.value.data[0];
    if (entry) {
      fgValue = parseInt(entry.value, 10);
      breakdown.push(`Crypto fear/greed: ${fgValue} (${entry.value_classification})`);
    }
  } else {
    breakdown.push('Fear/Greed: unavailable');
  }

  // High meme karma = internet is very active = less grass touched
  const memeOnlineness = Math.min(memeKarma / 400_000, 1); // 400k = fully online
  // Markets at extremes keep people glued to screens
  const marketOnlineness = Math.abs(fgValue - 50) / 50; // 0 = neutral, 1 = extreme

  const totalOnlineness = memeOnlineness * 0.65 + marketOnlineness * 0.35;
  const value = Math.round((1 - totalOnlineness) * 100);

  const label =
    value >= 80
      ? 'GRASS TOUCHED'
      : value >= 60
        ? 'SEMI-ONLINE'
        : value >= 40
          ? 'CHRONICALLY ONLINE'
          : value >= 20
            ? 'TERMINAL POSTER'
            : 'NEVER LEAVES SCREEN';

  breakdown.push(`Grass score: ${value}/100`);

  return { value, label, breakdown };
}
