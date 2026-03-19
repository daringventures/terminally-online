import { fetchJSON } from '../fetch.mjs';

export async function fetch_fear_greed() {
  const data = await fetchJSON('https://api.alternative.me/fng/?limit=1');
  const e = data.data[0];
  return { value: parseInt(e.value, 10), label: e.value_classification };
}
