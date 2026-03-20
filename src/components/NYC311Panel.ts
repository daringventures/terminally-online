import { Panel } from './Panel';
import { fetchNYC311 } from '@/services/nyc-311';
import { escapeHtml, timeAgo } from '@/utils/format';

const COMPLAINT_COLORS: Record<string, string> = {
  'Noise': 'var(--yellow)',
  'Noise - Residential': 'var(--yellow)',
  'Noise - Commercial': 'var(--yellow)',
  'Noise - Street/Sidewalk': 'var(--yellow)',
  'HEAT/HOT WATER': 'var(--orange)',
  'PLUMBING': 'var(--blue)',
  'PAINT/PLASTER': 'var(--text-muted)',
  'Street Light Condition': 'var(--text-muted)',
  'Blocked Driveway': 'var(--red)',
  'Illegal Parking': 'var(--red)',
  'Rodent': 'var(--orange)',
};

function complaintColor(type: string): string {
  for (const [key, color] of Object.entries(COMPLAINT_COLORS)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'var(--text-1)';
}

export class NYC311Panel extends Panel {
  constructor() {
    super({ id: 'nyc-311', title: 'NYC 311 — Recent Complaints', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const items = await fetchNYC311();
      this.setBadge(String(items.length));

      this.content.innerHTML = items
        .map(
          (it) => `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <div class="feed-body">
            <div class="feed-title" style="color:${complaintColor(it.title)};">
              ${escapeHtml(it.title)}
            </div>
            <div class="feed-meta">
              ${it.author ? `<span>${escapeHtml(it.author)}</span>` : ''}
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`
        )
        .join('');
    } catch (e) {
      this.setError(`NYC 311: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
