import { Panel } from './Panel';
import { fetchEthGas } from '@/services/eth-gas';

function gasColor(gwei: number): string {
  if (gwei < 15) return 'var(--green)';
  if (gwei < 40) return 'var(--yellow)';
  if (gwei < 100) return 'var(--orange)';
  return 'var(--red)';
}

export class EthGasPanel extends Panel {
  constructor() {
    super({ id: 'eth-gas', title: 'ETH Gas Prices', refreshMs: 15_000 });
  }

  async refresh(): Promise<void> {
    try {
      const gas = await fetchEthGas();

      this.setBadge(`${gas.average} Gwei`);

      this.content.innerHTML = `
        <div style="padding:16px;display:flex;flex-direction:column;gap:10px;height:100%;justify-content:center;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
            <div style="background:var(--bg-2);border-radius:6px;padding:12px 8px;">
              <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Safe Low</div>
              <div style="font-size:22px;font-weight:800;color:${gasColor(gas.safeLow)}">${gas.safeLow}</div>
              <div style="font-size:10px;color:var(--text-2);margin-top:2px;">Gwei</div>
            </div>
            <div style="background:var(--bg-2);border-radius:6px;padding:12px 8px;">
              <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Average</div>
              <div style="font-size:22px;font-weight:800;color:${gasColor(gas.average)}">${gas.average}</div>
              <div style="font-size:10px;color:var(--text-2);margin-top:2px;">Gwei</div>
            </div>
            <div style="background:var(--bg-2);border-radius:6px;padding:12px 8px;">
              <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Fast</div>
              <div style="font-size:22px;font-weight:800;color:${gasColor(gas.fast)}">${gas.fast}</div>
              <div style="font-size:10px;color:var(--text-2);margin-top:2px;">Gwei</div>
            </div>
          </div>
          <div style="background:var(--bg-2);border-radius:6px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:11px;color:var(--text-2);">Base Fee</span>
            <span style="font-size:13px;font-weight:600;color:var(--accent)">${gas.baseFee.toFixed(2)} Gwei</span>
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`ETH Gas: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
