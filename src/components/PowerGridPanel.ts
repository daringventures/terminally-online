import { Panel } from './Panel';
import { fetchCAISORenewables } from '@/services/power-grid';
import { escapeHtml, timeAgo } from '@/utils/format';

export class PowerGridPanel extends Panel {
  constructor() {
    super({ id: 'power-grid', title: 'CA Grid — Renewables', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const data = await fetchCAISORenewables();
      this.setBadge(`${data.renewablePct}%`);

      const pctColor = renewablePctColor(data.renewablePct);

      this.content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;padding:8px 0;">
          <div style="display:flex;align-items:baseline;gap:10px;">
            <div style="font-size:48px;font-weight:800;color:${pctColor};line-height:1;">${data.renewablePct}%</div>
            <div style="font-size:12px;color:var(--text-2);line-height:1.4;">
              renewable<br>
              <span style="color:var(--text-1);">${formatMW(data.totalRenewableMW)}</span>
              <span> / ${formatMW(data.totalLoadMW)} MW load</span>
            </div>
          </div>

          <div style="width:100%;height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.min(100, data.renewablePct)}%;background:${pctColor};border-radius:3px;transition:width 0.5s;"></div>
          </div>

          <div style="display:flex;flex-direction:column;gap:4px;">
            ${data.sources.map((s) => {
              const barColor = sourceColor(s.name);
              return `
                <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                  <span style="color:var(--text-2);min-width:80px;">${escapeHtml(s.name)}</span>
                  <div style="flex:1;height:4px;background:var(--bg-3);border-radius:2px;overflow:hidden;">
                    <div style="height:100%;width:${s.pct}%;background:${barColor};border-radius:2px;transition:width 0.5s;"></div>
                  </div>
                  <span style="color:var(--text-1);min-width:54px;text-align:right;">${formatMW(s.mw)} MW</span>
                  <span style="color:var(--text-2);min-width:30px;text-align:right;">${s.pct}%</span>
                </div>`;
            }).join('')}
          </div>

          <div style="font-size:10px;color:var(--text-3);text-align:right;">
            CAISO · ${escapeHtml(timeAgo(data.timestamp))} ago
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`CAISO: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatMW(mw: number): string {
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)}k`;
  return String(Math.round(mw));
}

function renewablePctColor(pct: number): string {
  if (pct >= 70) return 'var(--green)';
  if (pct >= 45) return 'var(--accent)';
  if (pct >= 25) return 'var(--yellow)';
  return 'var(--orange)';
}

function sourceColor(name: string): string {
  switch (name.toLowerCase()) {
    case 'solar':       return 'var(--yellow)';
    case 'wind':        return 'var(--accent)';
    case 'geothermal':  return 'var(--orange)';
    case 'biomass':     return '#8b7355';
    case 'biogas':      return '#a0856c';
    case 'small hydro': return 'var(--green)';
    default:            return 'var(--text-2)';
  }
}
