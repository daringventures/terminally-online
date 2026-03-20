export interface CryptoGlobalData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  marketCapChangePercentage24h: number;
}

interface CGGlobalResponse {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
}

export async function fetchCryptoGlobal(): Promise<CryptoGlobalData> {
  const res = await fetch('https://api.coingecko.com/api/v3/global');
  if (!res.ok) throw new Error(`CoinGecko global: ${res.status}`);
  const data: CGGlobalResponse = await res.json();
  const d = data.data;
  return {
    totalMarketCap: d.total_market_cap.usd ?? 0,
    totalVolume24h: d.total_volume.usd ?? 0,
    btcDominance: d.market_cap_percentage.btc ?? 0,
    ethDominance: d.market_cap_percentage.eth ?? 0,
    activeCryptocurrencies: d.active_cryptocurrencies,
    marketCapChangePercentage24h: d.market_cap_change_percentage_24h_usd ?? 0,
  };
}
