import { Panel } from './Panel';
import { fetchCFPBComplaints } from '@/services/cfpb';
import { timeAgo, escapeHtml } from '@/utils/format';

export class CFPBPanel extends Panel {
  constructor() {
    super({ id: 'cfpb', title: 'CFPB — Consumer Complaints', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const complaints = await fetchCFPBComplaints();
      this.setBadge(String(complaints.length));

      this.content.innerHTML = complaints
        .map(
          (c) => `
        <a class="feed-item" href="${escapeHtml(c.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(c.title)}</div>
            <div class="feed-meta">
              ${c.author ? `<span class="feed-domain">${escapeHtml(c.author)}</span>` : ''}
              <span>${timeAgo(c.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`CFPB: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
