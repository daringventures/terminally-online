import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

// Semantic Scholar — trending AI papers by citation count
export async function fetch_s2_papers(query = 'large language model', count = 15) {
  const data = await fetchJSON(
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${count}&sort=citationCount:desc&fields=title,citationCount,year,authors`
  );
  return (data.data || []).map((p, i) => [
    String(i + 1),
    trunc(p.title || '', 80),
    fmtNum(p.citationCount || 0) + ' cit',
    String(p.year || ''),
  ]);
}
