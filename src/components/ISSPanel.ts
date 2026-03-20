import { Panel } from './Panel';
import { fetchISSPosition, fetchPeopleInSpace } from '@/services/iss-tracker';
import { escapeHtml, timeAgo } from '@/utils/format';

export class ISSPanel extends Panel {
  constructor() {
    super({ id: 'iss', title: 'ISS Tracker — Open Notify', refreshMs: 10_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [position, crew] = await Promise.all([
        fetchISSPosition(),
        fetchPeopleInSpace(),
      ]);

      this.setBadge(`${crew.number} in space`);

      const lat = position.latitude;
      const lng = position.longitude;
      const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
      const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=3`;

      // Group crew by spacecraft
      const crafts = new Map<string, string[]>();
      for (const person of crew.people) {
        const list = crafts.get(person.craft) ?? [];
        list.push(person.name);
        crafts.set(person.craft, list);
      }

      const crewHtml = Array.from(crafts.entries())
        .map(([craft, names]) => `
          <div style="margin-bottom:8px;">
            <div style="font-size:10px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">
              ${escapeHtml(craft)}
            </div>
            ${names.map((n) => `
              <div style="font-size:12px;color:var(--text-1);padding:2px 0;">
                ${escapeHtml(n)}
              </div>`).join('')}
          </div>`)
        .join('');

      this.content.innerHTML = `
        <div style="padding:10px;">
          <a href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener"
             style="display:block;text-decoration:none;margin-bottom:12px;">
            <div style="display:flex;align-items:baseline;gap:8px;">
              <span style="font-size:24px;font-weight:700;color:var(--accent);">${escapeHtml(latStr)}</span>
              <span style="font-size:14px;color:var(--text-2);">lat</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:8px;margin-top:2px;">
              <span style="font-size:24px;font-weight:700;color:var(--accent);">${escapeHtml(lngStr)}</span>
              <span style="font-size:14px;color:var(--text-2);">lng</span>
            </div>
            <div style="font-size:11px;color:var(--text-2);margin-top:4px;">
              updated ${timeAgo(position.timestamp)} · click to open map
            </div>
          </a>
          <div style="border-top:1px solid var(--bg-3);padding-top:10px;">
            <div style="font-size:11px;color:var(--text-2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">
              ${crew.number} people currently in space
            </div>
            ${crewHtml}
          </div>
        </div>
      `;
    } catch (e) {
      this.setError(`ISS: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
