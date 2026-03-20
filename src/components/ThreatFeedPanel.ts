import { Panel } from './Panel';
import { fetchFeodoC2, fetchOpenPhish } from '@/services/abuse-ch';
import { fetchInternetOutages } from '@/services/cloudflare-radar';
import { escapeHtml, timeAgo } from '@/utils/format';
import type { FeedItem } from '@/types/feed';

type ThreatCategory = 'c2' | 'phishing' | 'outage';

interface ThreatItem extends FeedItem {
  category: ThreatCategory;
}

function categoryLabel(cat: ThreatCategory): string {
  switch (cat) {
    case 'c2':
      return 'C2';
    case 'phishing':
      return 'PHISH';
    case 'outage':
      return 'OUTAGE';
  }
}

function categoryColor(cat: ThreatCategory): string {
  switch (cat) {
    case 'c2':
      return 'var(--red)';
    case 'phishing':
      return 'var(--orange)';
    case 'outage':
      return 'var(--yellow)';
  }
}

export class ThreatFeedPanel extends Panel {
  constructor() {
    super({ id: 'threat-feed', title: 'Threat Feed — C2 / Phish / Outages', refreshMs: 300_000 });
  }

  async refresh(): Promise<void> {
    try {
      const [c2, phish, outages] = await Promise.allSettled([
        fetchFeodoC2(20),
        fetchOpenPhish(20),
        fetchInternetOutages(),
      ]);

      const items: ThreatItem[] = [];

      if (c2.status === 'fulfilled') {
        items.push(...c2.value.map((it): ThreatItem => ({ ...it, category: 'c2' })));
      }
      if (phish.status === 'fulfilled') {
        items.push(...phish.value.map((it): ThreatItem => ({ ...it, category: 'phishing' })));
      }
      if (outages.status === 'fulfilled') {
        items.push(...outages.value.map((it): ThreatItem => ({ ...it, category: 'outage' })));
      }

      // Sort newest first
      items.sort((a, b) => b.time - a.time);

      this.setBadge(String(items.length));

      if (items.length === 0) {
        this.content.innerHTML = '<div class="panel-error">No threat data available.</div>';
        return;
      }

      this.content.innerHTML = items
        .map((it) => {
          const color = categoryColor(it.category);
          const label = categoryLabel(it.category);

          return `
        <a class="feed-item" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
          <span class="feed-rank" style="color:${color};font-weight:700;font-size:10px;letter-spacing:0.5px;">${label}</span>
          <div class="feed-body">
            <div class="feed-title">${escapeHtml(it.title)}</div>
            <div class="feed-meta">
              <span class="feed-domain">${escapeHtml(it.domain || it.source)}</span>
              <span>${timeAgo(it.time)}</span>
            </div>
          </div>
        </a>`;
        })
        .join('');
    } catch (e) {
      this.setError(`Threat Feed: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
}
