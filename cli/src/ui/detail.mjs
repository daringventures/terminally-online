import blessed from 'blessed';
import { exec } from 'node:child_process';
import { cacheGet, historyGet, tsSince } from '../cache.mjs';
import { I, C } from './theme.mjs';

// ── Open URL in default browser ─────────────────────────
export function openUrl(url) {
  if (!url) return;
  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

// ── Detail popup panel ──────────────────────────────────
// Shows a modal overlay with item details, scrollable, dismissible.
let activeDetail = null;

export function openDetail(screen, title, lines) {
  closeDetail(screen);

  const content = lines.join('\n');
  const panel = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '75%',
    height: '70%',
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: { ch: ' ', inverse: true },
    label: ` ${title} `,
    content,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'yellow' },
      label: { fg: 'yellow', bold: true },
      scrollbar: { bg: 'cyan' },
    },
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
  });

  screen.saveFocus();
  panel.focus();
  panel.setFront();
  screen.render();

  panel.key(['q', 'escape'], () => {
    closeDetail(screen);
  });

  // 'o' opens URL if present in the detail
  panel._url = null;
  panel.key(['o'], () => {
    if (panel._url) openUrl(panel._url);
  });

  activeDetail = panel;
  return panel;
}

export function closeDetail(screen) {
  if (activeDetail) {
    activeDetail.detach();
    activeDetail = null;
    screen.restoreFocus();
    screen.render();
  }
}

export function isDetailOpen() {
  return activeDetail !== null;
}

// ── Build detail content from a table row ───────────────
// Maps raw data row + column headers into readable detail lines.
export function buildDetailLines(headers, row, extra = {}) {
  const lines = [];

  // Title line (usually col 1)
  if (row[1]) {
    lines.push(`{bold}{white-fg}${row[1]}{/}`);
    lines.push('');
  }

  // All columns as labeled key-value pairs
  for (let i = 0; i < headers.length && i < row.length; i++) {
    if (i === 1) continue; // already showed title
    const label = headers[i] || `COL${i}`;
    const value = row[i] || '—';
    lines.push(`  {cyan-fg}${label}:{/}  ${value}`);
  }

  // Extra metadata
  if (extra.url) {
    lines.push('');
    lines.push(`  {cyan-fg}URL:{/}  {underline}${extra.url}{/underline}`);
    lines.push(`  {gray-fg}Press {yellow-fg}o{/yellow-fg} to open in browser{/}`);
  }

  if (extra.cacheKey) {
    lines.push('');
    lines.push(`{gray-fg}── Cache History ──{/}`);
    try {
      const hist = historyGet(extra.cacheKey, 5);
      if (hist.length > 0) {
        for (const h of hist) {
          const age = Math.floor(Date.now() / 1000) - h.fetchedAt;
          const ageStr = age < 60 ? `${age}s ago` : age < 3600 ? `${Math.floor(age/60)}m ago` : `${Math.floor(age/3600)}h ago`;
          const rowCount = Array.isArray(h.data) ? h.data.length : '?';
          lines.push(`  {gray-fg}${ageStr}: ${rowCount} rows{/}`);
        }
      } else {
        lines.push(`  {gray-fg}No history yet{/}`);
      }
    } catch {
      lines.push(`  {gray-fg}Cache unavailable{/}`);
    }
  }

  if (extra.tsKey) {
    lines.push('');
    lines.push(`{gray-fg}── Timeseries (last 6h) ──{/}`);
    try {
      const ts = tsSince(extra.tsKey, 6 * 3600);
      if (ts.length > 0) {
        const values = ts.map(t => t.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const latest = values[values.length - 1];
        lines.push(`  {cyan-fg}Latest:{/} ${latest}  {cyan-fg}Min:{/} ${min}  {cyan-fg}Max:{/} ${max}  {cyan-fg}Points:{/} ${ts.length}`);
        // ASCII mini sparkline
        const width = 50;
        const range = max - min || 1;
        const spark = values.slice(-width).map(v => {
          const norm = (v - min) / range;
          const chars = ' ▁▂▃▄▅▆▇█';
          return chars[Math.floor(norm * 8)];
        }).join('');
        lines.push(`  {green-fg}${spark}{/}`);
      } else {
        lines.push(`  {gray-fg}No data yet — leave dashboard running{/}`);
      }
    } catch {
      lines.push(`  {gray-fg}Timeseries unavailable{/}`);
    }
  }

  lines.push('');
  lines.push('{gray-fg}[q/esc] close  [o] open URL  [↑↓] scroll{/}');

  return lines;
}
