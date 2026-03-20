import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_fda_recalls(count = 10) {
  const data = await fetchJSON(
    `https://api.fda.gov/food/enforcement.json?sort=report_date:desc&limit=${count}`
  );
  return (data.results || []).map(item => [
    String(item.classification || ''),
    trunc(String(item.reason_for_recall || ''), 60),
    trunc(String(item.recalling_firm || ''), 30),
    String(item.report_date || ''),
  ]);
}

export async function fetch_fda_events(count = 10) {
  const data = await fetchJSON(
    `https://api.fda.gov/drug/event.json?sort=receiptdate:desc&limit=${count}`
  );
  return (data.results || []).map(item => {
    const drugs = item.patient?.drug || [];
    const drugName = trunc(String(
      drugs[0]?.medicinalproduct || drugs[0]?.openfda?.brand_name?.[0] || 'Unknown'
    ), 30);
    const reactions = trunc((item.patient?.reaction || [])
      .map(r => String(r.reactionmeddrapt || ''))
      .join(', '), 60);
    const serious = item.serious === 1 ? 'YES' : 'no';
    const date = String(item.receiptdate || '');
    return [drugName, reactions, serious, date];
  });
}
