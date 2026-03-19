import { HackerNewsPanel } from './components/HackerNewsPanel';
import { RedditPanel } from './components/RedditPanel';
import { CoinGeckoTrendingPanel } from './components/CoinGeckoTrendingPanel';
import { FearGreedPanel } from './components/FearGreedPanel';
import { DexScreenerPanel } from './components/DexScreenerPanel';
import { WikipediaPanel } from './components/WikipediaPanel';
import { GoogleTrendsPanel } from './components/GoogleTrendsPanel';

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
    new DexScreenerPanel(),
    new CoinGeckoTrendingPanel(),
    new FearGreedPanel(),
    new GoogleTrendsPanel(),
    new WikipediaPanel(),
  ];

  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount();
  }
}

init();
