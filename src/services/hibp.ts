export interface DataBreach {
  name: string;
  title: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  pwnCount: number;
  description: string;
  dataClasses: string[];
  isVerified: boolean;
}

export async function fetchRecentBreaches(count = 15): Promise<DataBreach[]> {
  const res = await fetch('https://haveibeenpwned.com/api/v3/breaches', {
    headers: { 'User-Agent': 'TerminallyOnline/0.1' },
  });
  if (!res.ok) throw new Error(`HIBP: ${res.status}`);

  const breaches = await res.json() as Array<{
    Name: string;
    Title: string;
    Domain: string;
    BreachDate: string;
    AddedDate: string;
    PwnCount: number;
    Description: string;
    DataClasses: string[];
    IsVerified: boolean;
  }>;

  // Sort by AddedDate descending (most recently added)
  breaches.sort((a, b) => new Date(b.AddedDate).getTime() - new Date(a.AddedDate).getTime());

  return breaches.slice(0, count).map((b) => ({
    name: b.Name,
    title: b.Title,
    domain: b.Domain,
    breachDate: b.BreachDate,
    addedDate: b.AddedDate,
    pwnCount: b.PwnCount,
    description: b.Description,
    dataClasses: b.DataClasses,
    isVerified: b.IsVerified,
  }));
}
