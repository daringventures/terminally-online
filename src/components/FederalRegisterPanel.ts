import { Panel } from './Panel';
import { fetchFederalRegister } from '@/services/federal-register';
import { escapeHtml } from '@/utils/format';

export class FederalRegisterPanel extends Panel {
  constructor() {
    super({ id: 'federal-register', title: 'Federal Register — Today', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchFederalRegister();
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (item) => `
        <a class="feed-item" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(item.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(item.domain ?? 'federalregister.gov')}</span>
              ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ''}
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Federal Register: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
