export interface DexToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  description?: string;
  header?: string;
}

export interface DexBoost {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  description?: string;
  totalAmount: number;
}

export async function fetchLatestTokenProfiles(count = 20): Promise<DexToken[]> {
  const res = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
  if (!res.ok) throw new Error(`DexScreener profiles: ${res.status}`);
  const data: DexToken[] = await res.json();
  return data.slice(0, count);
}

export async function fetchBoostedTokens(count = 20): Promise<DexBoost[]> {
  const res = await fetch('https://api.dexscreener.com/token-boosts/latest/v1');
  if (!res.ok) throw new Error(`DexScreener boosts: ${res.status}`);
  const data: DexBoost[] = await res.json();
  return data.slice(0, count);
}
