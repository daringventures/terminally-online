## Terminally Online Terminal — Roadmap

### Phase 1: Foundation
- [x] Project scaffold (Vite + vanilla TS)
- [x] Panel base class + CSS grid layout
- [x] Theme system (dark-first, monospace)
- [x] Dev server running
- [x] Playwright smoke test suite (8 tests passing)

### Phase 2: Tier 1 Sources (no auth, highest signal)
- [x] Hacker News panel (Firebase API)
- [x] Reddit trending panel (.json hack)
- [x] RSS engine + VC/tech/crypto feed panels (24 feeds across 3 panels)
- [x] DexScreener panel (DEX boosted tokens)
- [x] CoinGecko trending panel
- [x] Fear & Greed Index gauge widget
- [x] Google Trends RSS panel
- [x] Wikipedia pageviews anomaly panel
- [x] Polymarket prediction markets panel
- [x] Manifold Markets predictions panel
- [x] Lobste.rs panel
- [x] Bluesky Jetstream WebSocket firehose

### Phase 2.5: Tier 1.5 Sources (no auth, high value)
- [x] GitHub trending (new repos by star velocity)
- [x] Product Hunt RSS feed
- [x] arXiv AI papers (cs.AI latest)
- [x] npm weekly download leaderboard (24 packages)
- [x] SEC EDGAR insider trading (Form 4 RSS)
- [x] Congress.gov most-viewed bills
- [x] USGS earthquakes M4.5+ (GeoJSON)
- [x] HIBP data breaches (free endpoint)

### Phase 3: Seeder + Caching Infrastructure
- [ ] Redis (Upstash) integration
- [ ] Seeder pattern (fetch → normalize → atomic write to Redis)
- [ ] API layer (Vercel Edge Functions with gateway)
- [ ] Bootstrap hydration endpoint
- [ ] Cache tiers (fast/medium/slow/daily)
- [ ] Health monitoring (seed-meta freshness)

### Phase 4: Tier 2 Sources (free key required)
- [ ] Finnhub (WebSocket real-time market data)
- [ ] FRED (macro indicators — yield curve, fed funds, money supply)
- [ ] FMP Congress trading (what politicians are buying)
- [ ] Cloudflare Radar (internet infrastructure, BGP anomalies)
- [ ] GDELT (global news intelligence, sentiment)
- [ ] Farcaster/Neynar (crypto-native social)

### Phase 5: Intelligence Layer
- [ ] ML worker (sentiment analysis, headline clustering, dedup)
- [ ] Cross-source correlation engine (Wikipedia spike → news → market move)
- [ ] Anomaly detection (pageview spikes, volume spikes, social velocity)
- [ ] Vector store (IndexedDB + embeddings for semantic search)

### Phase 6: Tier 3 Power Sources
- [ ] Certificate Transparency (crt.sh — company infra surveillance)
- [ ] USPTO Patents/Trademarks (what companies are building)
- [ ] USAspending (government contracts)
- [ ] OpenSky (flight tracking — VC jets, military)
- [ ] AISStream (ship tracking — global trade)
- [ ] OONI (censorship detection)
- [ ] Wayback Machine CDX (website change detection)
- [ ] PyPI download stats
- [ ] Semantic Scholar (citation velocity)

### Phase 7: Polish
- [ ] Smart polling (exp backoff, viewport-conditional, tab-pause)
- [ ] Circuit breakers per source
- [ ] PWA support (installable, offline-capable)
- [ ] Keyboard shortcuts
- [ ] Panel drag/resize/reorder with localStorage persistence
- [ ] Multiple layout presets (degen mode, VC mode, infra mode)

### Decisions Made
- **Framework**: Vanilla TS (proven in WorldMonitor, no framework overhead)
- **Bundler**: Vite
- **State**: Start with mutable singleton (like WM), migrate to Zustand if painful
- **Layout**: CSS grid with resizable panels (no maps)
- **API**: Plain TS types for v0 (no proto overhead), proto later if needed
- **Desktop**: Web-first, PWA, Tauri later
- **Repo**: Standalone at C:/dev/terminally-online
- **Testing**: Playwright E2E smoke tests

### Stats
- **Panels**: 22 (20 unique components, RSS reused 3x)
- **Services**: 20 data source integrations
- **RSS feeds**: 24 curated sources
- **Bundle**: 36 KB JS (9 KB gzipped) + 3 KB CSS
- **Build**: 342ms
- **Tests**: 8 Playwright smoke tests, all passing
