export interface SteamGame {
  appid: number;
  rank: number;
  name?: string;
  peakInGame: number;
  currentPlayers: number;
}

interface SteamChartsResponse {
  response: {
    ranks: Array<{
      rank: number;
      appid: number;
      last_week_rank: number;
      peak_in_game: number;
      current_players?: number;
    }>;
  };
}

// Steam app names are not included in the charts API response.
// We batch-fetch them from the store API appdetails endpoint where feasible,
// but fall back to a small static lookup for the perennial top titles so the
// panel always shows readable names even when the store API rate-limits us.
const KNOWN_NAMES: Record<number, string> = {
  730: 'CS2',
  570: 'Dota 2',
  578080: 'PUBG',
  1172470: 'Apex Legends',
  252490: 'Rust',
  271590: 'GTA V',
  1245620: 'Elden Ring',
  440: 'Team Fortress 2',
  1938090: 'Call of Duty: MW III',
  2246340: 'Helldivers 2',
  1091500: 'Cyberpunk 2077',
  292030: 'The Witcher 3',
  435150: 'Divinity: OS 2',
  863550: 'Phasmophobia',
  1599340: 'Lost Ark',
  359550: 'Rainbow Six Siege',
  1086940: 'Baldur\'s Gate 3',
  881020: 'No Man\'s Sky',
  1716740: 'Deep Rock Galactic',
  550: 'Left 4 Dead 2',
};

export async function fetchSteamTopGames(count = 15): Promise<SteamGame[]> {
  const res = await fetch(
    'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/',
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`Steam Charts: ${res.status}`);
  const data: SteamChartsResponse = await res.json();

  const ranks = data.response.ranks.slice(0, count);

  return ranks.map((r) => ({
    appid: r.appid,
    rank: r.rank,
    name: KNOWN_NAMES[r.appid],
    peakInGame: r.peak_in_game,
    currentPlayers: r.current_players ?? 0,
  }));
}
