import { Panel } from './Panel';
import { fetchFearGreed } from '@/services/fear-greed';
import { escapeHtml } from '@/utils/format';

export class FearGreedPanel extends Panel {
  constructor() {
    super({ id: 'fear-greed', title: 'Fear & Greed Index', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const data = await fetchFearGreed();
      const color = gaugeColor(data.value);

      this.content.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;padding:20px;">
          <div style="font-size:64px;font-weight:800;color:${color};line-height:1;">${data.value}</div>
          <div style="font-size:14px;font-weight:600;color:${color};text-transform:uppercase;letter-spacing:0.05em;">
            ${escapeHtml(data.classification)}
          </div>
          <div style="width:100%;max-width:240px;height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;margin-top:8px;">
            <div style="height:100%;width:${data.value}%;background:${color};border-radius:3px;transition:width 0.5s;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;width:100%;max-width:240px;font-size:10px;color:var(--text-2);">
            <span>Extreme Fear</span>
            <span>Extreme Greed</span>
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`Fear & Greed: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function gaugeColor(value: number): string {
  if (value <= 25) return 'var(--red)';
  if (value <= 45) return 'var(--orange)';
  if (value <= 55) return 'var(--yellow)';
  if (value <= 75) return 'var(--green)';
  return 'var(--accent)';
}
