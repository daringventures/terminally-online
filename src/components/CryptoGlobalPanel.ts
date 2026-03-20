import { Panel } from './Panel';
import { fetchCryptoGlobal } from '@/services/crypto-global';

function formatLargeUSD(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function changeColor(pct: number): string {
  if (pct > 0) return 'var(--green)';
  if (pct < 0) return 'var(--red)';
  return 'var(--text-2)';
}

export class CryptoGlobalPanel extends Panel {
  constructor() {
    super({ id: 'crypto-global', title: 'Crypto Market Overview', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const data = await fetchCryptoGlobal();
      const changePct = data.marketCapChangePercentage24h;
      const changeSign = changePct >= 0 ? '+' : '';

      this.setBadge(formatLargeUSD(data.totalMarketCap));

      this.content.innerHTML = `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;height:100%;justify-content:center;">
          <div style="background:var(--bg-2);border-radius:6px;padding:12px;text-align:center;">
            <div style="font-size:10px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Total Market Cap</div>
            <div style="font-size:28px;font-weight:800;color:var(--accent)">${formatLargeUSD(data.totalMarketCap)}</div>
            <div style="font-size:12px;margin-top:4px;color:${changeColor(changePct)};">${changeSign}${changePct.toFixed(2)}% 24h</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
              <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">24h Volume</div>
              <div style="font-size:15px;font-weight:700;color:var(--fg)">${formatLargeUSD(data.totalVolume24h)}</div>
            </div>
            <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
              <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Active Coins</div>
              <div style="font-size:15px;font-weight:700;color:var(--fg)">${data.activeCryptocurrencies.toLocaleString()}</div>
            </div>
          </div>
          <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
            <div style="font-size:9px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Dominance</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:11px;color:var(--orange);font-weight:600;width:28px;">BTC</span>
                <div style="flex:1;height:5px;background:var(--bg-3);border-radius:3px;overflow:hidden;">
                  <div style="height:100%;width:${data.btcDominance.toFixed(1)}%;background:var(--orange);border-radius:3px;"></div>
                </div>
                <span style="font-size:11px;font-weight:700;color:var(--orange);width:36px;text-align:right;">${data.btcDominance.toFixed(1)}%</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:11px;color:var(--accent);font-weight:600;width:28px;">ETH</span>
                <div style="flex:1;height:5px;background:var(--bg-3);border-radius:3px;overflow:hidden;">
                  <div style="height:100%;width:${data.ethDominance.toFixed(1)}%;background:var(--accent);border-radius:3px;"></div>
                </div>
                <span style="font-size:11px;font-weight:700;color:var(--accent);width:36px;text-align:right;">${data.ethDominance.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`Crypto Global: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
