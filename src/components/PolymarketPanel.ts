import { Panel } from './Panel';
import { fetchPolymarketTrending } from '@/services/polymarket';
import { escapeHtml } from '@/utils/format';

export class PolymarketPanel extends Panel {
  constructor() {
    super({ id: 'polymarket', title: 'Polymarket — Trending', refreshMs: 120_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchPolymarketTrending(20);
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (it, i) => `
        <a class="feed-item" href="https://polymarket.com/event/${escapeHtml(it.slug)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.question)}</div>
            <div class="feed-meta">
              <span style="color:${priceColor(it.yesPrice)};font-weight:600;">${(it.yesPrice * 100).toFixed(0)}% Yes</span>
              <span class="feed-score">$${formatVolume(it.volume)} vol</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Polymarket: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function priceColor(p: number): string {
  if (p >= 0.8) return 'var(--green)';
  if (p <= 0.2) return 'var(--red)';
  return 'var(--yellow)';
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.floor(n));
}
