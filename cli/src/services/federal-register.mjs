import { fetchJSON } from '../fetch.mjs';

export async function fetch_federal_register(count = 15) {
  const data = await fetchJSON(
    `https://www.federalregister.gov/api/v1/documents.json?conditions[publication_date][is]=today&per_page=${count}`
  );
  return (data.results || []).map(doc => [
    String(doc.type || '').slice(0, 10),
    String(doc.title || '').slice(0, 50),
    String(doc.document_number || ''),
  ]);
}
