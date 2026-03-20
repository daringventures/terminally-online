import { Panel } from './Panel';
import { fetchRecentCVEs } from '@/services/nvd-cve';
import { escapeHtml, timeAgo } from '@/utils/format';

function severityColor(score: number | undefined): string {
  if (score === undefined) return 'var(--text-2)';
  // score stored as baseScore * 10 (e.g., 9.8 → 98)
  const base = score / 10;
  if (base >= 9.0) return 'var(--red)';
  if (base >= 7.0) return 'var(--orange)';
  if (base >= 4.0) return 'var(--yellow)';
  return 'var(--text-1)';
}

export class CVEPanel extends Panel {
  constructor() {
    super({ id: 'nvd-cve', title: 'CVEs — Recent Disclosures', refreshMs: 1_800_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchRecentCVEs();
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map((it) => {
          const scoreVal = it.score !== undefined ? (it.score / 10).toFixed(1) : '—';
          const scoreColor = severityColor(it.score);

          return `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <span class="feed-rank" style="color:${scoreColor};font-weight:700;">${escapeHtml(scoreVal)}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.domain || 'nvd.nist.gov')}</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`;
        })
        .join('');
    } catch (e) {
      this.setError(`NVD CVE: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
