import { Panel } from './Panel';
import { fetchTrendingMemeTemplates } from '@/services/imgflip';
import { escapeHtml } from '@/utils/format';

export class MemeTemplatePanel extends Panel {
  constructor() {
    super({ id: 'meme-templates', title: 'MEME TEMPLATES', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const templates = await fetchTrendingMemeTemplates();
      this.setBadge(String(templates.length));

      this.content.innerHTML = templates
        .slice(0, 30)
        .map(
          (t, i) => `
        <a class="feed-item" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(t.name)}</div>
            <div class="feed-meta">
              <span class="feed-domain">imgflip</span>
              <span>${t.boxCount} text box${t.boxCount !== 1 ? 'es' : ''}</span>
              <span style="color:var(--text-2)">${t.width}x${t.height}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`Imgflip: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
