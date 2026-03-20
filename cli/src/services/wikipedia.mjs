import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

export async function fetch_wiki_top() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const data = await fetchJSON(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`
  );
  const articles = data.items?.[0]?.articles ?? [];
  return articles
    .filter(a =>
      !a.article.startsWith('Special:') &&
      !a.article.startsWith('Wikipedia:') &&
      !a.article.startsWith('Portal:') &&
      !a.article.startsWith('File:') &&
      a.article !== 'Main_Page' &&
      a.article !== '-'
    )
    .slice(0, 25)
    .map((a, i) => [
      String(i + 1),
      trunc(a.article.replace(/_/g, ' '), 80),
      fmtNum(a.views),
    ]);
}
