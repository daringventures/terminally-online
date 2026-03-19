export interface ManifoldMarket {
  id: string;
  question: string;
  url: string;
  probability: number;
  volume: number;
  createdTime: number;
  closeTime: number;
}

export async function fetchManifoldTrending(count = 20): Promise<ManifoldMarket[]> {
  const res = await fetch(
    `https://api.manifold.markets/v0/search-markets?sort=score&limit=${count}&filter=open`
  );
  if (!res.ok) throw new Error(`Manifold: ${res.status}`);

  const markets = await res.json() as Array<{
    id: string;
    question: string;
    url: string;
    probability?: number;
    volume: number;
    createdTime: number;
    closeTime: number;
  }>;

  return markets.map((m) => ({
    id: m.id,
    question: m.question,
    url: m.url,
    probability: m.probability ?? 0,
    volume: m.volume,
    createdTime: m.createdTime,
    closeTime: m.closeTime,
  }));
}
