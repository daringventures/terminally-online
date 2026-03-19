// ── THE VIBES LAYER ─────────────────────────────────────
// Makes the terminal feel alive, cursed, and retrofuturistic.

const CURSED_TAGLINES = [
  'see everything. touch nothing. profit maybe.',
  'the internet never sleeps. neither should you.',
  'weaponized autism in terminal form.',
  'bloomberg terminal for people who can\'t afford bloomberg.',
  'the world is on fire. here\'s a dashboard.',
  'powered by insomnia and bad decisions.',
  'your mom wouldn\'t understand this.',
  'rotating through all 12 stages of grief.',
  'SIGINT for shitposters.',
  'the panopticon, but make it aesthetic.',
  'all your feeds are belong to us.',
  'we are all bots on this blessed day.',
  'touch grass? in THIS economy?',
  'memento mori but with API calls.',
  'the simulation is rendering.',
  'just vibes. no thesis.',
  'watching the world burn in 60fps.',
  'this is financial advice (it isn\'t).',
  'your attention is the product.',
  'terminally online. terminally based.',
  'scrolling into the void. the void scrolls back.',
  'BREAKING: everything, always, forever.',
  'not a cult. just a dashboard.',
  'real-time copium distribution.',
  'the algos are watching you watch the algos.',
];

const BOOT_MESSAGES = [
  '[SYS] initializing neural uplink...',
  '[SYS] calibrating doom sensors...',
  '[SYS] connecting to the hivemind...',
  '[SYS] loading shitpost detectors...',
  '[SYS] warming up the copium reactor...',
  '[SYS] syncing with the simulation...',
  '[SYS] establishing degen protocols...',
  '[SYS] tuning memecoin antennas...',
  '[SYS] activating schizo mode...',
  '[SYS] parsing the collective unconscious...',
  '[NET] socket: bluesky firehose ✓',
  '[NET] socket: reddit hivemind ✓',
  '[NET] socket: prediction markets ✓',
  '[NET] socket: seismic sensors ✓',
  '[NET] socket: cert transparency ✓',
  '[NET] socket: government feeds ✓',
  '[DB]  cache: sqlite warm ✓',
  '[IDX] vibes engine: online ✓',
  '[IDX] doom sensors: calibrated ✓',
  '[IDX] clown detector: armed ✓',
  '[OK]  all systems nominal.',
  '[OK]  terminal is LIVE.',
];

const ALERTS = {
  doom_high: [
    '⚠ DOOM LEVEL CRITICAL — consider touching grass',
    '⚠ THE SIMULATION IS LAGGING',
    '⚠ RECOMMEND: close terminal, open window',
    '⚠ DOOM.EXE HAS STOPPED RESPONDING',
  ],
  doom_low: [
    '✓ vibes: immaculate',
    '✓ the timeline is healing',
    '✓ grass: touched. soul: cleansed.',
  ],
  degen_high: [
    '🎰 DEGEN PROTOCOL ACTIVE — NFA DYOR',
    '🎰 YOUR 401K IS WATCHING',
    '🎰 SIR THIS IS A WENDY\'S',
  ],
  clown_high: [
    '🤡 HONK HONK — efficient market hypothesis in shambles',
    '🤡 THE MARKET CAN STAY IRRATIONAL LONGER THAN YOU CAN STAY SOLVENT',
  ],
  mainchar_high: [
    '📸 SOMEONE IS HAVING A MAIN CHARACTER MOMENT',
    '📸 THE INTERNET HAS CHOSEN ITS PROTAGONIST',
  ],
  panic_high: [
    '💀 TECH TWITTER IS IN SHAMBLES',
    '💀 LINKEDIN IS UPDATING IN REAL TIME',
    '💀 HAVE YOU CONSIDERED LEARNING TO WELD?',
  ],
  cooked: [
    '🔥 SO COOKED IT\'S CHARCOAL',
    '🔥 THE VIBES ARE RANCID',
    '🔥 EVEN THE ALGORITHMS ARE DEPRESSED',
  ],
  back: [
    '🚀 WE ARE SO BACK',
    '🚀 THE COMEBACK ARC BEGINS',
    '🚀 WAGMI (PROBABLY)',
  ],
};

const GLITCH_CHARS = '░▒▓█▄▀▐▌┃━╋╳╱╲◌◍◎●◗◖▪▫';
const SCAN_FRAMES = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂', '▁', ' '];

let taglineIdx = Math.floor(Math.random() * CURSED_TAGLINES.length);
let scanFrame = 0;
let alertQueue = [];

export function getTagline() {
  return CURSED_TAGLINES[taglineIdx % CURSED_TAGLINES.length];
}

export function rotateTagline() {
  taglineIdx = (taglineIdx + 1) % CURSED_TAGLINES.length;
  return getTagline();
}

export function getBootMessages(count = 8) {
  // Shuffle and pick
  const shuffled = [...BOOT_MESSAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getScanFrame() {
  const frame = SCAN_FRAMES[scanFrame % SCAN_FRAMES.length];
  scanFrame++;
  return frame;
}

export function getGlitchText(len = 5) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }
  return s;
}

export function getSignalBar() {
  const bars = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
  const level = 3 + Math.floor(Math.random() * 5); // 3-7
  return bars.slice(0, level).join('');
}

export function generateAlerts(indices) {
  const alerts = [];
  if (indices.doom?.index > 70) {
    alerts.push(pick(ALERTS.doom_high));
  } else if (indices.doom?.index < 20) {
    alerts.push(pick(ALERTS.doom_low));
  }
  if (indices.degen?.index > 60) alerts.push(pick(ALERTS.degen_high));
  if (indices.clown?.index > 60) alerts.push(pick(ALERTS.clown_high));
  if (indices.mainchar?.index > 60) alerts.push(pick(ALERTS.mainchar_high));
  if (indices.panic?.index > 60) alerts.push(pick(ALERTS.panic_high));
  if (indices.vibes?.index < 25) alerts.push(pick(ALERTS.cooked));
  if (indices.vibes?.index > 75) alerts.push(pick(ALERTS.back));
  return alerts;
}

export function getTimeString() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function getUptimeString(startTime) {
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const ASCII_LOGO = `
{yellow-fg}╔══════════════════════════════════════════════════════════════════════════╗
║ {cyan-fg}████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     ██╗  ██╗   ██╗{/}  ║
║ {cyan-fg}╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     ██║  ╚██╗ ██╔╝{/}  ║
║ {cyan-fg}   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     ██║   ╚████╔╝ {/}  ║
║ {cyan-fg}   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     ██║    ╚██╔╝  {/}  ║
║ {cyan-fg}   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗███████╗██║   {/}  ║
║ {cyan-fg}   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝   {/}  ║
║                  {green-fg}██████╗ ███╗   ██╗██╗     ██╗███╗   ██╗███████╗{/}                   ║
║                  {green-fg}██╔═══██╗████╗  ██║██║     ██║████╗  ██║██╔════╝{/}                   ║
║                  {green-fg}██║   ██║██╔██╗ ██║██║     ██║██╔██╗ ██║█████╗  {/}                   ║
║                  {green-fg}██║   ██║██║╚██╗██║██║     ██║██║╚██╗██║██╔══╝  {/}                   ║
║                  {green-fg}╚██████╔╝██║ ╚████║███████╗██║██║ ╚████║███████╗{/}                   ║
║                  {green-fg} ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝{/}                   ║
╚══════════════════════════════════════════════════════════════════════════╝{/}`;
