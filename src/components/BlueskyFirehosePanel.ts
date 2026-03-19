import { Panel } from './Panel';
import { BlueskyJetstream } from '@/services/bluesky';
import { escapeHtml } from '@/utils/format';

export class BlueskyFirehosePanel extends Panel {
  private readonly stream = new BlueskyJetstream();
  private count = 0;
  private renderScheduled = false;

  constructor() {
    super({ id: 'bluesky-firehose', title: 'Bluesky Firehose', refreshMs: 0 });
  }

  async refresh(): Promise<void> {
    // No polling — WebSocket driven
  }

  override async mount(): Promise<void> {
    this.content.innerHTML = '<div class="panel-loading">connecting to jetstream…</div>';

    this.stream.connect(() => {
      this.count++;
      this.setBadge(`${this.count}`);
      this.scheduleRender();
    });
  }

  private scheduleRender(): void {
    if (this.renderScheduled) return;
    this.renderScheduled = true;
    requestAnimationFrame(() => {
      this.renderScheduled = false;
      this.renderPosts();
    });
  }

  private renderPosts(): void {
    const posts = this.stream.getRecentPosts().slice(0, 50);
    this.content.innerHTML = posts
      .map(
        (p) => `
      <div class="feed-item" style="cursor:default;">
        <div class="feed-body">
          <div class="feed-title">${escapeHtml(truncate(p.text, 200))}</div>
          <div class="feed-meta">
            <span class="feed-domain">${escapeHtml(p.did.slice(0, 20))}…</span>
          </div>
        </div>
      </div>`
      )
      .join('');
  }

  override destroy(): void {
    this.stream.disconnect();
    super.destroy();
  }
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
