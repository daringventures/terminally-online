import { Panel } from './Panel';
import { fetchChainTVL } from '@/services/defi-llama';
import { escapeHtml } from '@/utils/format';

function formatTVL(usd: number): string {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(2)}M`;
  return `$${usd.toLocaleString()}`;
}

export class DeFiTVLPanel extends Panel {
  constructor() {
    super({ id: 'defi-tvl', title: 'DeFi TVL by Chain', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const chains = await fetchChainTVL(10);

      if (chains.length === 0) {
        this.setError('DeFiLlama: no data');
        return;
      }

      this.setBadge(formatTVL(chains.reduce((sum, c) => sum + c.tvl, 0)));

      const maxTVL = chains[0]!.tvl;

      this.content.innerHTML = chains
        .map(
          (c, i) => `
        <div class="feed-item">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body" style="width:100%;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
              <span class="feed-title" style="font-size:13px;">${escapeHtml(c.name)}</span>
              <span style="font-size:12px;font-weight:700;color:var(--accent)">${formatTVL(c.tvl)}</span>
            </div>
            <div style="height:3px;background:var(--bg-3);border-radius:2px;overflow:hidden;">
              <div style="height:100%;width:${((c.tvl / maxTVL) * 100).toFixed(1)}%;background:var(--accent);border-radius:2px;"></div>
            </div>
          </div>
        </div>`
        )
        .join('');
    } catch (e) {
      this.setError(`DeFiLlama: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
