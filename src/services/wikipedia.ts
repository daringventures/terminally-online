export interface WikiPageview {
  article: string;
  views: number;
  rank: number;
}

export async function fetchTopPageviews(count = 25): Promise<WikiPageview[]> {
  const now = new Date();
  // Use yesterday since today's data may be incomplete
  now.setDate(now.getDate() - 1);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const res = await fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`,
    { headers: { 'Api-User-Agent': 'TerminallyOnline/0.1 (dashboard)' } }
  );
  if (!res.ok) throw new Error(`Wikipedia pageviews: ${res.status}`);

  const data = await res.json() as {
    items: Array<{
      articles: Array<{ article: string; views: number; rank: number }>;
    }>;
  };

  const articles = data.items?.[0]?.articles ?? [];

  // Filter out Special:, Main_Page, and other meta pages
  return articles
    .filter(
      (a) =>
        !a.article.startsWith('Special:') &&
        !a.article.startsWith('Wikipedia:') &&
        !a.article.startsWith('Portal:') &&
        !a.article.startsWith('File:') &&
        a.article !== 'Main_Page' &&
        a.article !== '-'
    )
    .slice(0, count)
    .map((a) => ({
      article: a.article.replace(/_/g, ' '),
      views: a.views,
      rank: a.rank,
    }));
}
