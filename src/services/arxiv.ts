export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  url: string;
  categories: string[];
}

export async function fetchArxivRecent(
  category = 'cs.AI',
  count = 20
): Promise<ArxivPaper[]> {
  const res = await fetch(
    `https://export.arxiv.org/api/query?search_query=cat:${category}&sortBy=submittedDate&sortOrder=descending&max_results=${count}`
  );
  if (!res.ok) throw new Error(`arXiv: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const entries = doc.querySelectorAll('entry');

  const papers: ArxivPaper[] = [];
  entries.forEach((entry) => {
    const id = entry.querySelector('id')?.textContent?.trim() ?? '';
    const title = entry.querySelector('title')?.textContent?.trim().replace(/\s+/g, ' ') ?? '';
    const summary = entry.querySelector('summary')?.textContent?.trim().replace(/\s+/g, ' ') ?? '';
    const published = entry.querySelector('published')?.textContent?.trim() ?? '';

    const authors: string[] = [];
    entry.querySelectorAll('author > name').forEach((n) => {
      const name = n.textContent?.trim();
      if (name) authors.push(name);
    });

    const categories: string[] = [];
    entry.querySelectorAll('category').forEach((c) => {
      const term = c.getAttribute('term');
      if (term) categories.push(term);
    });

    papers.push({ id, title, summary, authors, published, url: id, categories });
  });

  return papers;
}
