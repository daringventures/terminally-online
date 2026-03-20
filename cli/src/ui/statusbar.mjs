import blessed from 'blessed';
import { getTimeString } from '../vibes.mjs';

// ── Status bar ──────────────────────────────────────────
export const statusBar = blessed.box({
  bottom: 0, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'white', bg: 'black' },
});

export function updateStatus(screen, msg, pageNames, currentPage) {
  const tabs = pageNames.map((n, i) =>
    i === currentPage
      ? `{yellow-fg}{bold}${n}{/bold}{/}`
      : `{gray-fg}${n}{/}`
  ).join('{gray-fg}│{/}');
  const time = getTimeString();
  statusBar.setContent(
    ` ${tabs} {gray-fg}│{/} ${msg} {gray-fg}│{/} {white-fg}${time}{/} {gray-fg}│{/} {cyan-fg}[1-0]{/} {cyan-fg}[r]{/} {cyan-fg}[q]{/}`
  );
  screen.render();
}
