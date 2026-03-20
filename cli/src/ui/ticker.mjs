import blessed from 'blessed';

// ── Ticker bar at TOP ───────────────────────────────────
export const tickerBar = blessed.box({
  top: 0, left: 0, width: '100%', height: 1,
  tags: true,
  style: { fg: 'yellow', bg: 'black' },
});

let tickerText = '';
let tickerOffset = 0;

export function setTicker(items) {
  tickerText = items.map(t => `  ◆ ${t}  `).join('{gray-fg}│{/}');
  tickerOffset = 0;
}

function animateTicker(screen) {
  if (!tickerText) return;
  const w = screen.width || 120;
  const padded = tickerText + '    ' + tickerText;
  const slice = padded.slice(tickerOffset % padded.length, (tickerOffset % padded.length) + w);
  tickerBar.setContent(slice);
  tickerOffset++;
}

export function startTickerAnimation(screen) {
  return setInterval(() => animateTicker(screen), 150);
}
