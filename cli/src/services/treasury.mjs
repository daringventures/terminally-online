import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_treasury() {
  try {
    const data = await fetchJSON(
      'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?sort=-record_date&page[size]=20'
    );
    const results = data?.data || [];
    if (results.length === 0) throw new Error('No data');
    return results.map(item => [
      trunc(String(item.security_desc || item.security_type_desc || ''), 80),
      String(item.avg_interest_rate_amt || item.interest_rate || ''),
      String(item.record_date || ''),
    ]);
  } catch {
    // Fallback: try the debt to the penny endpoint
    try {
      const data = await fetchJSON(
        'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=5'
      );
      const results = data?.data || [];
      return results.map(item => [
        'Total Public Debt',
        String(item.tot_pub_debt_out_amt || ''),
        String(item.record_date || ''),
      ]);
    } catch {
      return [
        ['Treasury API', 'Unavailable', new Date().toISOString().slice(0, 10)],
        ['Rates data', 'Try again later', ''],
      ];
    }
  }
}
