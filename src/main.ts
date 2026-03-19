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
import { GitHubTrendingPanel } from './components/GitHubTrendingPanel';
import { ArxivPanel } from './components/ArxivPanel';
import { NpmTrendsPanel } from './components/NpmTrendsPanel';
import { SECEdgarPanel } from './components/SECEdgarPanel';
import { EarthquakePanel } from './components/EarthquakePanel';
import { DataBreachPanel } from './components/DataBreachPanel';
import { ManifoldPanel } from './components/ManifoldPanel';
import { ProductHuntPanel } from './components/ProductHuntPanel';
import { CongressPanel } from './components/CongressPanel';
import { VC_FEEDS, TECH_FEEDS, CRYPTO_FEEDS } from './config/feeds';

function renderHeader(): void {
  const header = document.getElementById('header')!;
  header.innerHTML = `
    <span class="header-title">terminally online</span>
    <span class="header-status">live · ${panels.length} feeds</span>
  `;
}

const panels = [
  new HackerNewsPanel(),
  new RedditPanel('wallstreetbets'),
  new BlueskyFirehosePanel(),
  new DexScreenerPanel(),
  new CoinGeckoTrendingPanel(),
  new FearGreedPanel(),
  new PolymarketPanel(),
  new ManifoldPanel(),
  new GitHubTrendingPanel(),
  new ProductHuntPanel(),
  new LobstersPanel(),
  new ArxivPanel('cs.AI', 'arXiv — AI Papers'),
  new NpmTrendsPanel(),
  new SECEdgarPanel(),
  new CongressPanel(),
  new EarthquakePanel(),
  new DataBreachPanel(),
  new RSSPanel('vc-rss', 'VC & Startups', VC_FEEDS),
  new RSSPanel('tech-rss', 'Tech News', TECH_FEEDS),
  new RSSPanel('crypto-rss', 'Crypto News', CRYPTO_FEEDS),
  new GoogleTrendsPanel(),
  new WikipediaPanel(),
];

async function init(): Promise<void> {
  renderHeader();

  const grid = document.getElementById('grid')!;
  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount();
  }
}

init();
