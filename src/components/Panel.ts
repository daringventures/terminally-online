export interface PanelOptions {
  id: string;
  title: string;
  refreshMs?: number;
}

export abstract class Panel {
  readonly el: HTMLElement;
  protected readonly content: HTMLElement;
  private readonly badge: HTMLElement;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(protected readonly opts: PanelOptions) {
    this.el = document.createElement('div');
    this.el.className = 'panel';
    this.el.id = `panel-${opts.id}`;

    const header = document.createElement('div');
    header.className = 'panel-header';

    const title = document.createElement('span');
    title.className = 'panel-title';
    title.textContent = opts.title;

    this.badge = document.createElement('span');
    this.badge.className = 'panel-badge';
    this.badge.style.display = 'none';

    header.append(title, this.badge);

    this.content = document.createElement('div');
    this.content.className = 'panel-content';
    this.content.innerHTML = '<div class="panel-loading">loading…</div>';

    this.el.append(header, this.content);
  }

  protected setBadge(text: string): void {
    this.badge.textContent = text;
    this.badge.style.display = text ? '' : 'none';
  }

  protected setError(msg: string): void {
    this.content.innerHTML = `<div class="panel-error">${msg}</div>`;
  }

  async mount(): Promise<void> {
    await this.refresh();
    if (this.opts.refreshMs) {
      this.timer = setInterval(() => this.refresh(), this.opts.refreshMs);
    }
  }

  destroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  abstract refresh(): Promise<void>;
}
