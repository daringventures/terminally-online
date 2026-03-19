import { Panel } from './Panel';
import { fetchTopPageviews } from '@/services/wikipedia';
import { escapeHtml } from '@/utils/format';

export class WikipediaPanel extends Panel {
  constructor() {
    super({ id: 'wikipedia', title: 'Wikipedia — Top Pageviews', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const pages = await fetchTopPageviews(25);
      this.setBadge(String(pages.length));

      this.content.innerHTML = pages
        .map(
          (p, i) => `
        <a class="feed-item" href="https://en.wikipedia.org/wiki/${encodeURIComponent(p.article.replace(/ /g, '_'))}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(p.article)}</div>
            <div class="feed-meta">
              <span class="feed-score">${formatViews(p.views)} views</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Wikipedia: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
