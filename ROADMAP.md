## Terminally Online Terminal — Roadmap

### Phase 1: Foundation
- [ ] Project scaffold (Vite + vanilla TS)
- [ ] Panel base class + CSS grid layout
- [ ] Theme system (dark-first)
- [ ] Dev server running

### Phase 2: Tier 1 Sources (no auth, highest signal)
- [ ] Hacker News panel (Firebase API — real-time, no auth)
- [ ] Reddit trending panel (.json hack — no auth)
- [ ] RSS engine + VC/tech feed panels (a16z, Sequoia, TechCrunch, etc.)
- [ ] DexScreener panel (DEX token launches, no auth)
- [ ] CoinGecko trending panel (no auth)
- [ ] Fear & Greed Index widget (no auth, single number)
- [ ] Google Trends RSS panel (no auth)
- [ ] Wikipedia pageviews anomaly panel (no auth, sleeper signal)
- [ ] Bluesky Jetstream panel (WebSocket firehose, no auth)

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
- [ ] Polymarket (prediction market odds)
- [ ] Manifold Markets (niche predictions)
- [ ] SEC EDGAR (insider trading Form 4, IPO filings)
- [ ] FMP Congress trading (what politicians are buying)
- [ ] Cloudflare Radar (internet infrastructure, BGP anomalies)
- [ ] GitHub trending (developer attention velocity)
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
- [ ] npm/PyPI download stats (developer adoption trends)
- [ ] Semantic Scholar (citation velocity)
- [ ] arXiv (AI/ML papers before anyone talks about them)

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
