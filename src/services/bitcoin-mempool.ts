export interface MempoolStats {
  count: number;
  vsize: number;
  totalFee: number;
}

export interface Block {
  id: string;
  height: number;
  timestamp: number;
  txCount: number;
  size: number;
  weight: number;
  medianFee: number;
}

export interface HashrateData {
  currentHashrate: number;
  currentDifficulty: number;
  timestamp: number;
}

interface MempoolResponse {
  count: number;
  vsize: number;
  total_fee: number;
}

interface BlockResponse {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  extras?: {
    medianFee?: number;
  };
}

interface HashrateResponse {
  currentHashrate: number;
  currentDifficulty: number;
  hashrates: Array<{ timestamp: number; avgHashrate: number }>;
}

export async function fetchMempoolStats(): Promise<MempoolStats> {
  const res = await fetch('https://mempool.space/api/mempool');
  if (!res.ok) throw new Error(`mempool.space mempool: ${res.status}`);
  const data: MempoolResponse = await res.json();
  return {
    count: data.count,
    vsize: data.vsize,
    totalFee: data.total_fee,
  };
}

export async function fetchLatestBlocks(count = 5): Promise<Block[]> {
  const res = await fetch('https://mempool.space/api/v1/blocks');
  if (!res.ok) throw new Error(`mempool.space blocks: ${res.status}`);
  const data: BlockResponse[] = await res.json();
  return data.slice(0, count).map((b) => ({
    id: b.id,
    height: b.height,
    timestamp: b.timestamp,
    txCount: b.tx_count,
    size: b.size,
    weight: b.weight,
    medianFee: b.extras?.medianFee ?? 0,
  }));
}

export async function fetchHashrate(): Promise<HashrateData> {
  const res = await fetch('https://mempool.space/api/v1/mining/hashrate/1w');
  if (!res.ok) throw new Error(`mempool.space hashrate: ${res.status}`);
  const data: HashrateResponse = await res.json();
  return {
    currentHashrate: data.currentHashrate,
    currentDifficulty: data.currentDifficulty,
    timestamp: data.hashrates[data.hashrates.length - 1]?.timestamp ?? 0,
  };
}
