import { HackerNewsPanel } from './components/HackerNewsPanel';
import { RedditPanel } from './components/RedditPanel';
import { CoinGeckoTrendingPanel } from './components/CoinGeckoTrendingPanel';
import { FearGreedPanel } from './components/FearGreedPanel';

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
    new CoinGeckoTrendingPanel(),
    new FearGreedPanel(),
  ];

  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount();
  }
}

init();
