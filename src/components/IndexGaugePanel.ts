import { Panel, type PanelOptions } from './Panel';
import type { IndexResult } from '@/services/cursed-indices';

interface IndexGaugePanelOptions extends Omit<PanelOptions, 'refreshMs'> {
  computeFn: () => Promise<IndexResult>;
  refreshMs?: number;
}

export abstract class IndexGaugePanel extends Panel {
  private readonly computeFn: () => Promise<IndexResult>;

  constructor(opts: IndexGaugePanelOptions) {
    super({
      id: opts.id,
      title: opts.title,
      refreshMs: opts.refreshMs ?? 120_000,
    });
    this.computeFn = opts.computeFn;
  }

  async refresh(): Promise<void> {
    try {
      const result = await this.computeFn();
      this.setBadge(String(result.value));
      this.render(result);
    } catch (e) {
      this.setError(`${this.opts.title}: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }

  private render({ value, label, breakdown }: IndexResult): void {
    const color = gaugeColor(value);
    this.content.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:10px;padding:16px;">
        <div class="index-gauge" style="width:100%;max-width:240px;height:8px;background:var(--bg-3);border-radius:4px;overflow:hidden;">
          <div class="index-bar" style="height:100%;width:${value}%;background:${color};border-radius:4px;transition:width 0.5s ease;"></div>
        </div>
        <div class="index-value" style="font-size:48px;font-weight:800;color:${color};line-height:1;">${value}<span style="font-size:20px;font-weight:400;color:var(--text-2)">/100</span></div>
        <div class="index-label" style="font-size:13px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(label)}</div>
        <div class="index-breakdown" style="width:100%;max-width:240px;font-size:10px;color:var(--text-2);display:flex;flex-direction:column;gap:2px;margin-top:4px;">
          ${breakdown.map((b) => `<div>${escapeHtml(b)}</div>`).join('')}
        </div>
      </div>
    `;
  }
}

function gaugeColor(value: number): string {
  if (value >= 80) return 'var(--red)';
  if (value >= 60) return 'var(--orange)';
  if (value >= 40) return 'var(--yellow)';
  if (value >= 20) return 'var(--green)';
  return 'var(--accent)';
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[ch] ?? ch;
  });
}
