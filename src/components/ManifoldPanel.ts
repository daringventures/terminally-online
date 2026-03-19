import { Panel } from './Panel';
import { fetchManifoldTrending } from '@/services/manifold';
import { escapeHtml } from '@/utils/format';

export class ManifoldPanel extends Panel {
  constructor() {
    super({ id: 'manifold', title: 'Manifold — Predictions', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const markets = await fetchManifoldTrending(20);
      this.setBadge(String(markets.length));

      this.content.innerHTML = markets
        .map(
          (m, i) => `
        <a class="feed-item" href="${escapeHtml(m.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(m.question)}</div>
            <div class="feed-meta">
              <span style="color:${priceColor(m.probability)};font-weight:600;">${(m.probability * 100).toFixed(0)}%</span>
              <span class="feed-score">$${formatVol(m.volume)} vol</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Manifold: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function priceColor(p: number): string {
  if (p >= 0.8) return 'var(--green)';
  if (p <= 0.2) return 'var(--red)';
  return 'var(--yellow)';
}

function formatVol(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.floor(n));
}
