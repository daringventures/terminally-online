import type { FeedItem } from '@/types/feed';

interface FRDocument {
  title: string;
  html_url: string;
  document_number: string;
  publication_date: string;
  type: string;
  abstract?: string;
}

interface FRResponse {
  results: FRDocument[];
}

export async function fetchFederalRegister(): Promise<FeedItem[]> {
  const res = await fetch(
    'https://www.federalregister.gov/api/v1/documents.json?conditions[publication_date][is]=today&per_page=20'
  );
  if (!res.ok) throw new Error(`Federal Register: ${res.status}`);

  const data = (await res.json()) as FRResponse;
  const today = Math.floor(Date.now() / 1000);

  return data.results.map((doc) => ({
    id: doc.document_number,
    title: doc.title,
    url: doc.html_url,
    domain: 'federalregister.gov',
    time: today,
    source: 'federal-register',
    author: doc.type,
  }));
}
