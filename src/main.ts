import { HackerNewsPanel } from './components/HackerNewsPanel';
import { RedditPanel } from './components/RedditPanel';
import { CoinGeckoTrendingPanel } from './components/CoinGeckoTrendingPanel';
import { FearGreedPanel } from './components/FearGreedPanel';
import { DexScreenerPanel } from './components/DexScreenerPanel';
import { WikipediaPanel } from './components/WikipediaPanel';
import { GoogleTrendsPanel } from './components/GoogleTrendsPanel';
import { PolymarketPanel } from './components/PolymarketPanel';
import { LobstersPanel } from './components/LobstersPanel';
import { RSSPanel } from './components/RSSPanel';
import { BlueskyFirehosePanel } from './components/BlueskyFirehosePanel';
import { VC_FEEDS, TECH_FEEDS, CRYPTO_FEEDS } from './config/feeds';

function renderHeader(): void {
  const header = document.getElementById('header')!;
  header.innerHTML = `
    <span class="header-title">terminally online</span>
    <span class="header-status">live</span>
  `;
}

async function init(): Promise<void> {
  renderHeader();

  const grid = document.getElementById('grid')!;

  const panels = [
    new HackerNewsPanel(),
    new RedditPanel('wallstreetbets'),
    new BlueskyFirehosePanel(),
    new DexScreenerPanel(),
    new CoinGeckoTrendingPanel(),
    new FearGreedPanel(),
    new PolymarketPanel(),
    new LobstersPanel(),
    new RSSPanel('vc-rss', 'VC & Startups', VC_FEEDS),
    new RSSPanel('tech-rss', 'Tech News', TECH_FEEDS),
    new RSSPanel('crypto-rss', 'Crypto News', CRYPTO_FEEDS),
    new GoogleTrendsPanel(),
    new WikipediaPanel(),
  ];

  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount();
  }
}

init();
