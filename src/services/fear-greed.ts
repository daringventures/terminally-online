export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: number;
}

interface FGResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
}

export async function fetchFearGreed(): Promise<FearGreedData> {
  const res = await fetch('https://api.alternative.me/fng/?limit=1');
  if (!res.ok) throw new Error(`Fear & Greed: ${res.status}`);
  const data: FGResponse = await res.json();
  const entry = data.data[0];
  if (!entry) throw new Error('Fear & Greed: no data');
  return {
    value: parseInt(entry.value, 10),
    classification: entry.value_classification,
    timestamp: parseInt(entry.timestamp, 10),
  };
}
