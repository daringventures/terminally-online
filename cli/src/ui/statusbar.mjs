import blessed from 'blessed';
import { getTimeString } from '../vibes.mjs';

// ── Status bar ──────────────────────────────────────────
// Lazy-created after screen exists.
let statusBar = null;

export function createStatusBar() {
  statusBar = blessed.box({
    bottom: 0, left: 0, width: '100%', height: 1,
    tags: true,
    style: { fg: 'white', bg: 'black' },
  });
  return statusBar;
}

export function getStatusBar() {
  return statusBar;
}

export function updateStatus(screen, msg, pageNames, currentPage) {
  if (!statusBar) return;
  const tabs = pageNames.map((n, i) =>
    i === currentPage
      ? `{yellow-fg}{bold}${n}{/bold}{/}`
      : `{gray-fg}${n}{/}`
  ).join('{gray-fg}│{/}');
  const time = getTimeString();
  statusBar.setContent(
    ` ${tabs} {gray-fg}│{/} ${msg} {gray-fg}│{/} {white-fg}${time}{/} {gray-fg}│{/} {cyan-fg}[1-0]{/} {cyan-fg}[h]{/}elp {cyan-fg}[r]{/} {cyan-fg}[q]{/}`
  );
  screen.render();
}
