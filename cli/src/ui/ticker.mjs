import blessed from 'blessed';

// ── Ticker bar at TOP ───────────────────────────────────
// Lazy-created after screen exists.
let tickerBar = null;
let tickerText = '';
let tickerOffset = 0;

export function createTickerBar() {
  tickerBar = blessed.box({
    top: 0, left: 0, width: '100%', height: 1,
    tags: true,
    style: { fg: 'yellow', bg: 'black' },
  });
  return tickerBar;
}

export function getTickerBar() {
  return tickerBar;
}

export function setTicker(items) {
  tickerText = items.map(t => `  ◆ ${t}  `).join('{gray-fg}│{/}');
  tickerOffset = 0;
}

function animateTicker(screen) {
  if (!tickerText || !tickerBar) return;
  const w = screen.width || 120;
  const padded = tickerText + '    ' + tickerText;
  const slice = padded.slice(tickerOffset % padded.length, (tickerOffset % padded.length) + w);
  tickerBar.setContent(slice);
  tickerOffset++;
}

export function startTickerAnimation(screen) {
  return setInterval(() => animateTicker(screen), 150);
}
