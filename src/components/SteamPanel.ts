import { Panel } from './Panel';
import { fetchSteamTopGames } from '@/services/steam-top';
import { escapeHtml } from '@/utils/format';

export class SteamPanel extends Panel {
  constructor() {
    super({ id: 'steam', title: 'STEAM — TOP PLAYED', refreshMs: 600_000 });
  }

  async refresh(): Promise<void> {
    try {
      const games = await fetchSteamTopGames(15);
      this.setBadge(String(games.length));

      this.content.innerHTML = games
        .map((g, i) => {
          const storeUrl = `https://store.steampowered.com/app/${g.appid}`;
          const displayName = g.name ?? `App ${g.appid}`;
          return `
        <a class="feed-item" href="${escapeHtml(storeUrl)}" target="_blank" rel="noopener">
          <span class="feed-rank">${i + 1}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(displayName)}</div>
            <div class="feed-meta">
              <span class="feed-score">${formatNum(g.peakInGame)} peak</span>
              ${g.currentPlayers ? `<span>${formatNum(g.currentPlayers)} now</span>` : ''}
              <span style="color:var(--text-2)">appid ${g.appid}</span>
            </div>
          </div>
        </a>`;
        })
        .join('');
    } catch (e) {
      this.setError(`Steam: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
