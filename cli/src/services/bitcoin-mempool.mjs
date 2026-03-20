import { fetchJSON, fmtNum } from '../fetch.mjs';

export async function fetch_mempool() {
  const [mempool, blocks] = await Promise.all([
    fetchJSON('https://mempool.space/api/mempool'),
    fetchJSON('https://mempool.space/api/v1/blocks'),
  ]);

  const rows = [
    ['UNCONFIRMED', fmtNum(mempool.count), 'txs'],
    ['VSIZE',       fmtNum(mempool.vsize), 'vBytes'],
  ];

  const topBlocks = Array.isArray(blocks) ? blocks.slice(0, 3) : [];
  for (const b of topBlocks) {
    const medianFee = b.extras?.medianFee != null
      ? `${b.extras.medianFee.toFixed(1)} sat/vB`
      : 'n/a';
    rows.push([
      `BLOCK #${b.height}`,
      fmtNum(b.tx_count),
      medianFee,
    ]);
  }

  return rows;
}
