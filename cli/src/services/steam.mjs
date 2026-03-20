import { fetchJSON, fmtNum, trunc } from '../fetch.mjs';

const KNOWN_NAMES = {
  730:     'CS2',
  570:     'Dota 2',
  440:     'TF2',
  578080:  'PUBG',
  1172470: 'Apex Legends',
  252490:  'Rust',
  892970:  'Valheim',
  1623730: 'Palworld',
  2357570: 'Overwatch 2',
  271590:  'GTA V',
  1086940: "Baldur's Gate 3",
  381210:  'Dead by Daylight',
  1245620: 'Elden Ring',
  413150:  'Stardew Valley',
  105600:  'Terraria',
  945360:  'Among Us',
  1599340: 'Lost Ark',
  230410:  'Warframe',
};

export async function fetch_steam_top(count = 15) {
  const data = await fetchJSON(
    'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/'
  );
  return data.response.ranks
    .slice(0, count)
    .map((r, i) => {
      const name = trunc(KNOWN_NAMES[r.appid] || `App ${r.appid}`, 80);
      return [
        String(i + 1),
        name,
        fmtNum(r.concurrent_in_game),
        fmtNum(r.peak_in_game),
      ];
    });
}
