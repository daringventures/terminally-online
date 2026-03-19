export interface TrendingRepo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  starsToday: number;
}

// GitHub doesn't have a trending API, but we can use the search API
// to find repos created recently with the most stars
export async function fetchTrendingRepos(count = 20): Promise<TrendingRepo[]> {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceStr = since.toISOString().split('T')[0];

  const res = await fetch(
    `https://api.github.com/search/repositories?q=created:>${sinceStr}&sort=stars&order=desc&per_page=${count}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) throw new Error(`GitHub search: ${res.status}`);

  const data = await res.json() as {
    items: Array<{
      name: string;
      full_name: string;
      description: string | null;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      html_url: string;
    }>;
  };

  return data.items.map((r) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? '',
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ?? '',
    url: r.html_url,
    starsToday: 0, // not available from search API
  }));
}
