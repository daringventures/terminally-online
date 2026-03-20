import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_federal_register(count = 15) {
  const data = await fetchJSON(
    `https://www.federalregister.gov/api/v1/documents.json?conditions[publication_date][is]=today&per_page=${count}`
  );
  return (data.results || []).map(doc => [
    trunc(String(doc.type || ''), 30),
    trunc(String(doc.title || ''), 80),
    String(doc.document_number || ''),
  ]);
}
