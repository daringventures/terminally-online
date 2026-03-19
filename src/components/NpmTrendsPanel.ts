import { Panel } from './Panel';
import { fetchNpmDownloads } from '@/services/npm-stats';
import { escapeHtml } from '@/utils/format';

export class NpmTrendsPanel extends Panel {
  constructor() {
    super({ id: 'npm-trends', title: 'npm — Weekly Downloads', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const packages = await fetchNpmDownloads();
      this.setBadge(String(packages.length));

      this.content.innerHTML = packages
        .map(
          (p, i) => `
        <a class="feed-item" href="https://www.npmjs.com/package/${encodeURIComponent(p.package)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title" style="font-family:var(--font-mono);font-size:12px;">${escapeHtml(p.package)}</div>
            <div class="feed-meta">
              <span class="feed-score">${formatDownloads(p.downloads)}/wk</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`npm: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
