# terminally online

Real-time intelligence dashboard for the terminally online. 700+ data sources across markets, tech, security, government, culture, memes, and urban infrastructure — rendered in a Bloomberg-terminal-aesthetic CLI.

![Node.js](https://img.shields.io/badge/Node.js-22+-green) ![SQLite](https://img.shields.io/badge/SQLite-WAL-blue) ![Sources](https://img.shields.io/badge/Sources-700+-orange)

## Quick Start

```bash
cd cli
npm install
npm start
```

That's it. No API keys needed — everything hits public endpoints.

## What You Get

**10 pages of live intelligence, keyboard-navigable, auto-refreshing every 2 minutes:**

| Key | Page | What's On It |
|-----|------|--------------|
| `1` | **MAIN** | HN, r/WSB, Google Trends, Polymarket, Manifold, Wikipedia spikes, Lobsters, Product Hunt, Congress, SO COOKED/BACK + DEGEN gauges |
| `2` | **DEGEN** | DEX boosted tokens, trending coins, prediction markets, SEC insider trades, data breaches |
| `3` | **NERD** | GitHub trending repos, arXiv AI papers, npm/PyPI package stats, Semantic Scholar, HN, Lobsters |
| `4` | **CURSED** | Wikipedia most-viewed, certificate transparency, federal contracts, Wayback Machine, OONI censorship, earthquakes |
| `5` | **GLOWIE** | SEC insider trading, Congress trades, data breaches, Google Trends, r/technology, r/cryptocurrency |
| `6` | **VIBES** | 6 custom indices with live gauges + sparkline trend charts + signal breakdown log |
| `7` | **SIGNALS** | ISS tracker, space weather (solar flares, Kp index), NASA near-earth objects, flights over NYC, CA power grid, airport delays, severe weather |
| `8` | **THREAT** | CISA known exploited vulns, NVD CVEs, Feodo C2 servers, OpenPhish URLs, internet outages, data breaches |
| `9` | **MEMES** | r/memes, r/dankmemes, r/SubredditDrama, r/AmItheAsshole, Steam top games, Imgflip meme templates, r/collapse |
| `0` | **GOV/NYC** | Federal Register (today's regulations), FDA recalls, CFPB consumer complaints, Treasury rates, Citi Bike live, Bitcoin mempool, ETH gas, NYC 311 |

## Custom Indices

Six composite "vibes" indices computed from multiple live data sources:

| Index | What It Measures | Scale |
|-------|-----------------|-------|
| **SO COOKED / SO BACK** | Market fear/greed + crypto momentum + seismic activity + breach chaos + BTC dominance | 0 (ABSOLUTELY COOKED) → 100 (WE ARE SO FUCKING BACK) |
| **DEGEN INDEX** | Greed level + coin volatility + prediction market volume | 0 (NORMIE HOURS) → 100 (YOLO'D THE 401K) |
| **CLOWN MARKET** | Shitcoin avg rank + WSB score + DEX shill spending + F&G extremity | 0 → 100 |
| **DOOM SCROLL** | Earthquake count + data breaches + OONI censorship + inverted fear | 0 → 100 |
| **MAIN CHARACTER** | Wikipedia spike magnitude + Google Trends count + r/all top score | 0 → 100 |
| **TECH BRO PANIC** | HN comment/score ratio + "alternative" repo count + r/cscareerquestions heat | 0 → 100 |

All indices are recorded to a timeseries database and graphed as sparklines on the VIBES page.

## Keyboard Controls

```
NAVIGATION
  1-0       Switch pages
  ] / [     Next / prev page
  Tab       Focus next panel
  Shift-Tab Focus prev panel

WITHIN A PANEL
  ↑↓ / j/k  Navigate rows
  Enter      Open detail view
  g / G      Jump to top / bottom

DETAIL VIEW
  o          Open URL in browser
  ↑↓         Scroll content
  q / Esc    Close

GLOBAL
  r          Refresh current page
  h / ?      Help screen
  q          Quit
```

## Data Sources (48 services)

### Markets & Crypto
- CoinGecko trending coins
- DexScreener boosted tokens
- Fear & Greed Index
- Polymarket prediction markets
- Manifold Markets
- SEC EDGAR insider trades
- Bitcoin mempool stats (mempool.space)
- Ethereum gas prices (Etherscan)
- DeFi TVL by chain (DeFi Llama)

### Tech & Dev
- Hacker News
- GitHub trending repositories
- arXiv AI papers
- npm package downloads
- PyPI package downloads
- Semantic Scholar
- Lobste.rs
- Product Hunt

### News & Culture
- Google Trends
- Wikipedia most-viewed pages
- Reddit (any subreddit — WSB, technology, cryptocurrency, memes, dankmemes, SubredditDrama, AmItheAsshole, collapse, UpliftingNews)
- Steam most-played games
- Imgflip trending meme templates

### Government & Policy
- U.S. Congress trades
- Federal Register (today's new regulations)
- FDA recalls + adverse drug events
- CFPB consumer complaints
- Treasury interest rates
- USASpending federal contracts

### Security & Threat Intel
- CISA Known Exploited Vulnerabilities
- NVD recent CVEs
- Feodo Tracker C2 server IPs (abuse.ch)
- OpenPhish phishing URLs
- Cloudflare Radar internet outages
- Have I Been Pwned data breaches
- Certificate transparency (crt.sh)
- OONI internet censorship

### Space & Earth
- ISS real-time position + crew manifest
- NOAA space weather (solar wind, Kp index, X-ray flux)
- NASA near-earth objects
- USGS earthquakes
- NWS severe weather alerts
- FAA airport delays

### Infrastructure
- OpenSky flights over NYC metro
- CAISO California power grid renewables
- Citi Bike live station status
- NYC 311 complaints
- Wayback Machine recent captures

## Architecture

```
cli/
  src/
    main.mjs              # 220 lines — screen, page registry, keys, boot
    cache.mjs             # SQLite cache + timeseries (WAL mode)
    fetch.mjs             # fetchJSON/fetchText with User-Agent
    vibes.mjs             # taglines, ASCII art, spinners
    ui/
      theme.mjs           # icons (Nerd Font) + color palette
      widgets.mjs         # table/gauge/sparkline/log/lcd/donut factories
      ticker.mjs          # scrolling ticker bar
      statusbar.mjs       # status bar with page tabs
      detail.mjs          # modal popup + URL opener + cache viewer
    pages/
      main-page.mjs       # each page owns its own build() + load()
      markets.mjs
      dev.mjs
      weird.mjs
      intel.mjs
      vibes.mjs
      signals.mjs
      threat.mjs
      memes.mjs
      gov-nyc.mjs
    services/              # 48 service modules, one per data source
      hacker-news.mjs
      reddit.mjs
      coingecko.mjs
      ...
```

### Adding a New Page

1. Create `cli/src/pages/my-page.mjs`:
```js
import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_something } from '../services/something.mjs';

export function build(grid, W) {
  W.stuff = tbl(grid, 0, 0, 6, 12, `${I.fire} MY PANEL`, COL.feed5, 'yellow');
}

export async function load(W, { safe, cf, set, setTicker }) {
  const [data] = await Promise.allSettled([
    safe(cf('my-key', () => fetch_something(20), 120)),
  ]);
  set(W.stuff, data.value);
  setTicker([`${I.fire}TOP: ${data.value?.[0]?.[1] || '...'}`]);
}
```

2. Add one line to the `PAGES` array in `main.mjs`:
```js
{ name: `${I.fire}MINE`, mod: myPage, cacheKeys: ['my-key'] },
```

### Adding a New Service

Create `cli/src/services/my-thing.mjs`:
```js
import { fetchJSON, fmtNum, timeAgo } from '../fetch.mjs';

export async function fetch_my_thing(count = 20) {
  const data = await fetchJSON('https://api.example.com/data');
  return data.items.slice(0, count).map((item, i) => [
    String(i + 1),                    // rank
    item.title.slice(0, 55),          // title (truncated)
    fmtNum(item.score),               // metric
    timeAgo(item.created_at),         // age
  ]);
}
```

Every cell must be a string. Keep titles under 55 chars.

## Local Database

All data is cached in `~/.terminally-online/cache.db` (SQLite):

| Table | Purpose | Retention |
|-------|---------|-----------|
| `cache` | Latest value per service key | Current (overwritten on refresh) |
| `history` | Full JSON snapshots of every fetch | 30 days |
| `timeseries` | Numerical data points for trend graphs | 90 days |

The cache serves stale data instantly on page switch, then refreshes in the background. You never wait for a cold fetch on a previously-visited page.

Query the database directly:
```bash
sqlite3 ~/.terminally-online/cache.db
> SELECT key, datetime(fetched_at, 'unixepoch') FROM cache ORDER BY fetched_at DESC;
> SELECT key, value, label, datetime(recorded_at, 'unixepoch') FROM timeseries WHERE key LIKE 'idx:%' ORDER BY recorded_at DESC LIMIT 20;
> SELECT key, COUNT(*) as snapshots FROM history GROUP BY key ORDER BY snapshots DESC;
```

## RSS Feed Config (Web Dashboard)

The web dashboard (`src/`) has 612 RSS feeds configured across 29 categories in `src/config/feeds.ts`, plus 104 API sources and 13 custom index definitions in `src/config/api-sources.ts`. Run with `npm run dev` from the root.

## Requirements

- Node.js 22+
- A terminal that supports Unicode (Windows Terminal, iTerm2, Kitty, Alacritty)
- Nerd Font installed for icons (optional — works without, just no icons)

## No API Keys

Every data source uses public endpoints. No accounts, no tokens, no `.env` files. Some endpoints (NASA, Etherscan) use `DEMO_KEY` or unauthenticated access with rate limits — if you hit limits, the cache serves stale data transparently.

## License

MIT
