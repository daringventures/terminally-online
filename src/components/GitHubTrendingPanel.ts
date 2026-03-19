import { Panel } from './Panel';
import { fetchTrendingRepos } from '@/services/github-trending';
import { escapeHtml } from '@/utils/format';

export class GitHubTrendingPanel extends Panel {
  constructor() {
    super({ id: 'github-trending', title: 'GitHub — New & Rising', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const repos = await fetchTrendingRepos(20);
      this.setBadge(String(repos.length));

      this.content.innerHTML = repos
        .map(
          (r, i) => `
        <a class="feed-item" href="${escapeHtml(r.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(r.fullName)}</div>
            <div class="feed-meta">
              ${r.language ? `<span style="color:var(--purple)">${escapeHtml(r.language)}</span>` : ''}
              <span class="feed-score">★ ${formatNum(r.stars)}</span>
              <span>${formatNum(r.forks)} forks</span>
            </div>
            ${r.description ? `<div style="font-size:10px;color:var(--text-2);margin-top:3px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(r.description)}</div>` : ''}
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`GitHub: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
