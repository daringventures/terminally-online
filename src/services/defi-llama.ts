export interface ChainTVL {
  name: string;
  tvl: number;
  tokenSymbol: string;
}

export interface Stablecoin {
  id: string;
  name: string;
  symbol: string;
  pegType: string;
  price: number | null;
  circulating: number;
  change24h: number | null;
}

interface LlamaChainResponse {
  name: string;
  tvl: number;
  tokenSymbol: string;
}

interface LlamaStablecoinResponse {
  id: string;
  name: string;
  symbol: string;
  pegType: string;
  price: number | null;
  circulating: {
    peggedUSD?: number;
    peggedEUR?: number;
    peggedVAR?: number;
  };
  pegDeviation?: number | null;
}

interface LlamaStablecoinsWrapper {
  peggedAssets: LlamaStablecoinResponse[];
}

export async function fetchChainTVL(count = 10): Promise<ChainTVL[]> {
  const res = await fetch('https://api.llama.fi/v2/chains');
  if (!res.ok) throw new Error(`DeFiLlama chains: ${res.status}`);
  const data: LlamaChainResponse[] = await res.json();
  return data
    .filter((c) => c.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, count)
    .map((c) => ({
      name: c.name,
      tvl: c.tvl,
      tokenSymbol: c.tokenSymbol ?? '',
    }));
}

export async function fetchStablecoins(count = 10): Promise<Stablecoin[]> {
  const res = await fetch(
    'https://stablecoins.llama.fi/stablecoins?includePrices=true'
  );
  if (!res.ok) throw new Error(`DeFiLlama stablecoins: ${res.status}`);
  const wrapper: LlamaStablecoinsWrapper = await res.json();
  const assets = wrapper.peggedAssets ?? [];
  return assets
    .sort((a, b) => {
      const acirc =
        a.circulating.peggedUSD ?? a.circulating.peggedEUR ?? a.circulating.peggedVAR ?? 0;
      const bcirc =
        b.circulating.peggedUSD ?? b.circulating.peggedEUR ?? b.circulating.peggedVAR ?? 0;
      return bcirc - acirc;
    })
    .slice(0, count)
    .map((s) => ({
      id: s.id,
      name: s.name,
      symbol: s.symbol,
      pegType: s.pegType,
      price: s.price ?? null,
      circulating:
        s.circulating.peggedUSD ??
        s.circulating.peggedEUR ??
        s.circulating.peggedVAR ??
        0,
      change24h: null,
    }));
}
