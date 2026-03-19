import { Panel } from './Panel';
import { fetchBoostedTokens } from '@/services/dexscreener';
import { escapeHtml } from '@/utils/format';

export class DexScreenerPanel extends Panel {
  constructor() {
    super({ id: 'dexscreener', title: 'DEX Boosted Tokens', refreshMs: 60_000 });
  }

  async refresh(): Promise<void> {
    try {
      const tokens = await fetchBoostedTokens(20);
      this.setBadge(String(tokens.length));

      this.content.innerHTML = tokens
        .map(
          (t, i) => `
        <a class="feed-item" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">
              ${escapeHtml(t.description || t.tokenAddress.slice(0, 12) + '…')}
            </div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(t.chainId)}</span>
              <span class="feed-score">$${t.totalAmount} boost</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`DexScreener: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
