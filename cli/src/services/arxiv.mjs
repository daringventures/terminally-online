import { fetchText, trunc } from '../fetch.mjs';

export async function fetch_arxiv(cat = 'cs.AI', count = 20) {
  const xml = await fetchText(
    `https://export.arxiv.org/api/query?search_query=cat:${cat}&sortBy=submittedDate&sortOrder=descending&max_results=${count}`
  );
  const papers = [];
  const entries = xml.split('<entry>').slice(1);
  for (const entry of entries) {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
    const authors = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1]);
    const date = entry.match(/<published>(.*?)<\/published>/)?.[1]?.split('T')[0] ?? '';
    papers.push([
      String(papers.length + 1),
      trunc(title, 80),
      trunc(authors.slice(0, 2).join(', '), 30) + (authors.length > 2 ? ' +' : ''),
      date,
    ]);
  }
  return papers.slice(0, count);
}
