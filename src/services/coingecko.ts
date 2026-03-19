export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number | null;
  thumb: string;
  priceChange24h: number | null;
  score: number;
}

interface CGTrendingItem {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    data?: {
      price_change_percentage_24h?: Record<string, number>;
    };
    score: number;
  };
}

interface CGTrendingResponse {
  coins: CGTrendingItem[];
}

export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
  if (!res.ok) throw new Error(`CoinGecko trending: ${res.status}`);
  const data: CGTrendingResponse = await res.json();

  return data.coins.map((c) => ({
    id: c.item.id,
    name: c.item.name,
    symbol: c.item.symbol.toUpperCase(),
    marketCapRank: c.item.market_cap_rank,
    thumb: c.item.thumb,
    priceChange24h: c.item.data?.price_change_percentage_24h?.usd ?? null,
    score: c.item.score,
  }));
}
