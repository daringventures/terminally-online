import { Panel } from './Panel';
import { fetchTreasuryYields } from '@/services/treasury';
import { escapeHtml } from '@/utils/format';

export class TreasuryPanel extends Panel {
  constructor() {
    super({ id: 'treasury', title: 'Treasury — Yield Curve', refreshMs: 3_600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const data = await fetchTreasuryYields();

      const rows = Object.entries(data.yields);
      const count = rows.filter(([, v]) => v !== null).length;
      this.setBadge(count > 0 ? `${count} rates` : '');

      // Build a compact yield table
      const yieldRows = rows.filter(([, v]) => v !== null);

      if (yieldRows.length === 0) {
        this.setError('Treasury: no yield data available');
        return;
      }

      const tableRows = yieldRows
        .map(([maturity, rate]) => {
          const rateStr = rate !== null ? `${rate.toFixed(2)}%` : 'N/A';
          const color = rateColor(rate);
          return `
          <div class="feed-item" style="cursor:default;">
            <div class="feed-body" style="display:flex;justify-content:space-between;align-items:center;">
              <span class="feed-title" style="margin:0;">${escapeHtml(maturity)}</span>
              <span style="font-weight:700;color:${color};font-variant-numeric:tabular-nums;">${escapeHtml(rateStr)}</span>
            </div>
          </div>`;
        })
        .join('');

      this.content.innerHTML = `
        <div class="feed-meta" style="padding:4px 8px;opacity:.6;font-size:.75em;">
          As of ${escapeHtml(data.date)}
        </div>
        ${tableRows}
      `;

      // Append inversion warning if 2yr > 10yr
      const twoYr = data.yields['2 Yr'] ?? data.yields['2 Year'] ?? null;
      const tenYr = data.yields['10 Yr'] ?? data.yields['10 Year'] ?? null;
      if (twoYr !== null && tenYr !== null && twoYr > tenYr) {
        this.content.innerHTML += `
          <div class="feed-meta" style="padding:4px 8px;color:var(--red);font-weight:700;font-size:.8em;">
            ⚠ INVERTED: 2Y ${twoYr.toFixed(2)}% &gt; 10Y ${tenYr.toFixed(2)}%
          </div>`;
      }
    } catch (e) {
      this.setError(`Treasury: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function rateColor(rate: number | null): string {
  if (rate === null) return 'var(--text-1)';
  if (rate >= 5.0) return 'var(--red)';
  if (rate >= 4.0) return 'var(--orange)';
  if (rate >= 3.0) return 'var(--yellow)';
  return 'var(--green)';
}
