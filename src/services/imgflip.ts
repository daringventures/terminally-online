export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  boxCount: number;
}

interface ImgflipResponse {
  success: boolean;
  data: {
    memes: Array<{
      id: string;
      name: string;
      url: string;
      width: number;
      height: number;
      box_count: number;
    }>;
  };
}

export async function fetchTrendingMemeTemplates(): Promise<MemeTemplate[]> {
  const res = await fetch('https://api.imgflip.com/get_memes', {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Imgflip: ${res.status}`);
  const data: ImgflipResponse = await res.json();
  if (!data.success) throw new Error('Imgflip: API returned success=false');

  return data.data.memes.map((m) => ({
    id: m.id,
    name: m.name,
    url: m.url,
    width: m.width,
    height: m.height,
    boxCount: m.box_count,
  }));
}
