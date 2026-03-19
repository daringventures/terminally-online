export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  endDate: string;
  active: boolean;
  markets: PolymarketMarket[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  outcomePrices: string; // JSON string of number[]
  volume: number;
  active: boolean;
}

export interface PredictionItem {
  id: string;
  question: string;
  yesPrice: number;
  volume: number;
  slug: string;
}

export async function fetchPolymarketTrending(count = 20): Promise<PredictionItem[]> {
  const res = await fetch(
    `https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=${count}`
  );
  if (!res.ok) throw new Error(`Polymarket: ${res.status}`);
  const events: PolymarketEvent[] = await res.json();

  const items: PredictionItem[] = [];
  for (const evt of events) {
    if (!evt.markets?.length) continue;
    const market = evt.markets[0]!;
    let yesPrice = 0;
    try {
      const prices: number[] = JSON.parse(market.outcomePrices);
      yesPrice = prices[0] ?? 0;
    } catch { /* ignore parse errors */ }

    items.push({
      id: market.id,
      question: evt.title || market.question,
      yesPrice,
      volume: market.volume,
      slug: evt.slug,
    });
  }

  return items.slice(0, count);
}
