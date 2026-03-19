import { Panel } from './Panel';
import { fetchArxivRecent } from '@/services/arxiv';
import { escapeHtml } from '@/utils/format';

export class ArxivPanel extends Panel {
  constructor(
    private readonly category = 'cs.AI',
    title = 'arXiv — AI Papers'
  ) {
    super({ id: `arxiv-${category}`, title, refreshMs: 900_000 });
  }

  async refresh(): Promise<void> {
    try {
      const papers = await fetchArxivRecent(this.category, 20);
      this.setBadge(String(papers.length));

      this.content.innerHTML = papers
        .map(
          (p, i) => `
        <a class="feed-item" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(p.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(p.authors.slice(0, 3).join(', '))}${p.authors.length > 3 ? ' et al.' : ''}</span>
              <span>${escapeHtml(p.published.split('T')[0] ?? '')}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`arXiv: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
