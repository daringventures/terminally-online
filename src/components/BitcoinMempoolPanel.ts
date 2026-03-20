import { Panel } from './Panel';
import { fetchMempoolStats, fetchLatestBlocks, fetchHashrate } from '@/services/bitcoin-mempool';
import { timeAgo } from '@/utils/format';

function formatHashrate(hps: number): string {
  if (hps >= 1e18) return `${(hps / 1e18).toFixed(2)} EH/s`;
  if (hps >= 1e15) return `${(hps / 1e15).toFixed(2)} PH/s`;
  if (hps >= 1e12) return `${(hps / 1e12).toFixed(2)} TH/s`;
  return `${hps.toLocaleString()} H/s`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${(bytes / 1e3).toFixed(1)} KB`;
}

function formatDifficulty(d: number): string {
  if (d >= 1e12) return `${(d / 1e12).toFixed(2)}T`;
  if (d >= 1e9) return `${(d / 1e9).toFixed(2)}B`;
  return d.toLocaleString();
}

export class BitcoinMempoolPanel extends Panel {
  constructor() {
    super({ id: 'bitcoin-mempool', title: 'Bitcoin Mempool', refreshMs: 30_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [mempool, blocks, hashrate] = await Promise.all([
        fetchMempoolStats(),
        fetchLatestBlocks(3),
        fetchHashrate(),
      ]);

      this.setBadge(`${mempool.count.toLocaleString()} txs`);

      const latestBlock = blocks[0];

      const blocksHtml = blocks
        .map(
          (b) => `
        <div class="feed-item">
          <span class="feed-rank" style="font-family:monospace;font-size:11px;">#${b.height.toLocaleString()}</span>
          <div class="feed-body">
            <div class="feed-title" style="font-size:12px;">
              ${b.txCount.toLocaleString()} txs &middot; ${formatBytes(b.size)}
              ${b.medianFee ? `&middot; <span style="color:var(--yellow)">${b.medianFee.toFixed(1)} sat/vB</span>` : ''}
            </div>
            <div class="feed-meta">
              <span style="color:var(--text-2)">${timeAgo(b.timestamp)} ago</span>
            </div>
          </div>
        </div>`
        )
        .join('');

      this.content.innerHTML = `
        <div style="padding:12px;display:flex;flex-direction:column;gap:12px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
              <div style="font-size:10px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Unconfirmed</div>
              <div style="font-size:20px;font-weight:700;color:var(--orange)">${mempool.count.toLocaleString()}</div>
              <div style="font-size:10px;color:var(--text-2);">${formatBytes(mempool.vsize)} vsize</div>
            </div>
            <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
              <div style="font-size:10px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Hashrate</div>
              <div style="font-size:16px;font-weight:700;color:var(--green)">${formatHashrate(hashrate.currentHashrate)}</div>
              <div style="font-size:10px;color:var(--text-2);">diff ${formatDifficulty(hashrate.currentDifficulty)}</div>
            </div>
          </div>
          ${latestBlock ? `
          <div style="background:var(--bg-2);border-radius:6px;padding:10px;">
            <div style="font-size:10px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Latest Blocks</div>
            ${blocksHtml}
          </div>` : ''}
        </div>
      `;
    } catch (e) {
      this.setError(`Bitcoin Mempool: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
