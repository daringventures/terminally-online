import { Panel } from './Panel';
import { fetchTrendingCoins } from '@/services/coingecko';
import { escapeHtml } from '@/utils/format';

export class CoinGeckoTrendingPanel extends Panel {
  constructor() {
    super({ id: 'coingecko-trending', title: 'Trending Coins', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const coins = await fetchTrendingCoins();
      this.setBadge(String(coins.length));

      this.content.innerHTML = coins
        .map(
          (c, i) => `
        <div class="feed-item">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">
              <span>${escapeHtml(c.name)}</span>
              <span style="color:var(--text-2);margin-left:6px">${escapeHtml(c.symbol)}</span>
            </div>
            <div class="feed-meta">
              ${c.marketCapRank ? `<span>rank #${c.marketCapRank}</span>` : ''}
              ${c.priceChange24h !== null ? `<span style="color:${c.priceChange24h >= 0 ? 'var(--green)' : 'var(--red)'}">${c.priceChange24h >= 0 ? '+' : ''}${c.priceChange24h.toFixed(1)}%</span>` : ''}
            </div>
          </div>
        </div>`
        )
        .join('');
    } catch (e) {
      this.setError(`CoinGecko: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
