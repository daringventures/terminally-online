import { fetchJSON } from '../fetch.mjs';

export async function fetch_fda_recalls(count = 10) {
  const data = await fetchJSON(
    `https://api.fda.gov/food/enforcement.json?sort=report_date:desc&limit=${count}`
  );
  return (data.results || []).map(item => [
    String(item.classification || ''),
    String(item.reason_for_recall || '').slice(0, 45),
    String(item.recalling_firm || '').slice(0, 20),
    String(item.report_date || ''),
  ]);
}

export async function fetch_fda_events(count = 10) {
  const data = await fetchJSON(
    `https://api.fda.gov/drug/event.json?sort=receiptdate:desc&limit=${count}`
  );
  return (data.results || []).map(item => {
    const drugs = item.patient?.drug || [];
    const drugName = String(
      drugs[0]?.medicinalproduct || drugs[0]?.openfda?.brand_name?.[0] || 'Unknown'
    ).slice(0, 20);
    const reactions = (item.patient?.reaction || [])
      .map(r => String(r.reactionmeddrapt || ''))
      .join(', ')
      .slice(0, 40);
    const serious = item.serious === 1 ? 'YES' : 'no';
    const date = String(item.receiptdate || '');
    return [drugName, reactions, serious, date];
  });
}
