import { Panel } from './components/Panel';
// ── Original API panels ──
import { HackerNewsPanel } from './components/HackerNewsPanel';
import { RedditPanel } from './components/RedditPanel';
import { CoinGeckoTrendingPanel } from './components/CoinGeckoTrendingPanel';
import { FearGreedPanel } from './components/FearGreedPanel';
import { DexScreenerPanel } from './components/DexScreenerPanel';
import { WikipediaPanel } from './components/WikipediaPanel';
import { GoogleTrendsPanel } from './components/GoogleTrendsPanel';
import { PolymarketPanel } from './components/PolymarketPanel';
import { LobstersPanel } from './components/LobstersPanel';
import { RSSPanel } from './components/RSSPanel';
import { BlueskyFirehosePanel } from './components/BlueskyFirehosePanel';
import { GitHubTrendingPanel } from './components/GitHubTrendingPanel';
import { ArxivPanel } from './components/ArxivPanel';
import { NpmTrendsPanel } from './components/NpmTrendsPanel';
import { SECEdgarPanel } from './components/SECEdgarPanel';
import { EarthquakePanel } from './components/EarthquakePanel';
import { DataBreachPanel } from './components/DataBreachPanel';
import { ManifoldPanel } from './components/ManifoldPanel';
import { ProductHuntPanel } from './components/ProductHuntPanel';
import { CongressPanel } from './components/CongressPanel';
// ── NYC Urban Intelligence ──
import { CitiBikePanel } from './components/CitiBikePanel';
import { NYC311Panel } from './components/NYC311Panel';
import { NYCTrafficPanel } from './components/NYCTrafficPanel';
// ── Space & Earth ──
import { ISSPanel } from './components/ISSPanel';
import { SpaceWeatherPanel } from './components/SpaceWeatherPanel';
import { NearEarthPanel } from './components/NearEarthPanel';
import { WeatherAlertsPanel } from './components/WeatherAlertsPanel';
// ── Threat Intelligence ──
import { CISAKEVPanel } from './components/CISAKEVPanel';
import { CVEPanel } from './components/CVEPanel';
import { ThreatFeedPanel } from './components/ThreatFeedPanel';
// ── Memes & Social Signals ──
import { MemePanel } from './components/MemePanel';
import { InternetDramaPanel } from './components/InternetDramaPanel';
import { VibesPanel } from './components/VibesPanel';
import { SteamPanel } from './components/SteamPanel';
import { MemeTemplatePanel } from './components/MemeTemplatePanel';
// ── Government Data ──
import { FederalRegisterPanel } from './components/FederalRegisterPanel';
import { FDAPanel } from './components/FDAPanel';
import { CFPBPanel } from './components/CFPBPanel';
import { TreasuryPanel } from './components/TreasuryPanel';
// ── Crypto On-Chain ──
import { BitcoinMempoolPanel } from './components/BitcoinMempoolPanel';
import { EthGasPanel } from './components/EthGasPanel';
import { DeFiTVLPanel } from './components/DeFiTVLPanel';
import { CryptoGlobalPanel } from './components/CryptoGlobalPanel';
// ── Infrastructure ──
import { AirportDelaysPanel } from './components/AirportDelaysPanel';
import { FlightsOverheadPanel } from './components/FlightsOverheadPanel';
import { PowerGridPanel } from './components/PowerGridPanel';
// ── Cursed Indices ──
import {
  DegenIndexPanel, DoomerIndexPanel, CosmicVibesPanel,
  MemeVelocityPanel, TouchGrassPanel,
} from './components/CursedIndexPanels';
// ── RSS Feed configs ──
import {
  VC_FEEDS, TECH_FEEDS, CRYPTO_FEEDS, SECURITY_FEEDS, CULTURE_FEEDS,
  AI_FEEDS, FINANCE_FEEDS, SCIENCE_FEEDS, SPACE_FEEDS, POLICY_FEEDS,
  CLIMATE_FEEDS, BIOTECH_FEEDS, GAMING_FEEDS, DESIGN_FEEDS, DEVOPS_FEEDS,
  OPENSOURCE_FEEDS, MEDIA_FEEDS, LEGAL_FEEDS, NEWSLETTER_FEEDS,
  ECOMMERCE_FEEDS, DEFENSE_FEEDS, LABOR_FEEDS, ENERGY_FEEDS,
  TRANSPORT_FEEDS, EDUCATION_FEEDS, FOOD_FEEDS, NYC_FEEDS, LA_FEEDS, SF_FEEDS,
  ALL_FEEDS,
} from './config/feeds';

// ============================================================================
// PAGE DEFINITIONS — each page is a named group of panels
// ============================================================================
interface PageDef {
  key: string;     // keyboard shortcut
  label: string;   // tab label
  id: string;      // CSS id
  factory: () => Panel[];  // lazy panel creation
}

const PAGES: PageDef[] = [
  {
    key: '1', label: 'MAIN', id: 'main',
    factory: () => [
      // Cursed indices at the top
      new DegenIndexPanel(),
      new DoomerIndexPanel(),
      new CosmicVibesPanel(),
      new MemeVelocityPanel(),
      new TouchGrassPanel(),
      // Top signals
      new HackerNewsPanel(),
      new RedditPanel('wallstreetbets'),
      new BlueskyFirehosePanel(),
      new GoogleTrendsPanel(),
      new WikipediaPanel(),
      new PolymarketPanel(),
      new ManifoldPanel(),
    ],
  },
  {
    key: '2', label: 'MARKETS', id: 'markets',
    factory: () => [
      new CryptoGlobalPanel(),
      new BitcoinMempoolPanel(),
      new EthGasPanel(),
      new FearGreedPanel(),
      new DeFiTVLPanel(),
      new DexScreenerPanel(),
      new CoinGeckoTrendingPanel(),
      new TreasuryPanel(),
      new SECEdgarPanel(),
      new RSSPanel('crypto-rss', 'CRYPTO / WEB3', CRYPTO_FEEDS),
      new RSSPanel('finance-rss', 'FINANCE / ECON', FINANCE_FEEDS),
      new RSSPanel('vc-rss', 'VC & STARTUPS', VC_FEEDS),
    ],
  },
  {
    key: '3', label: 'TECH', id: 'tech',
    factory: () => [
      new GitHubTrendingPanel(),
      new ArxivPanel('cs.AI', 'arXiv — AI Papers'),
      new NpmTrendsPanel(),
      new ProductHuntPanel(),
      new LobstersPanel(),
      new RSSPanel('ai-rss', 'AI / ML', AI_FEEDS),
      new RSSPanel('tech-rss', 'TECH', TECH_FEEDS),
      new RSSPanel('devops-rss', 'DEVOPS / CLOUD', DEVOPS_FEEDS),
      new RSSPanel('opensource-rss', 'OPEN SOURCE', OPENSOURCE_FEEDS),
      new RSSPanel('design-rss', 'DESIGN / UX', DESIGN_FEEDS),
      new RSSPanel('newsletter-rss', 'NEWSLETTERS', NEWSLETTER_FEEDS),
    ],
  },
  {
    key: '4', label: 'WORLD', id: 'world',
    factory: () => [
      new WeatherAlertsPanel(),
      new EarthquakePanel(),
      new FederalRegisterPanel(),
      new FDAPanel(),
      new CFPBPanel(),
      new CongressPanel(),
      new RSSPanel('policy-rss', 'POLICY / GEOPOLITICS', POLICY_FEEDS),
      new RSSPanel('defense-rss', 'DEFENSE / MIL', DEFENSE_FEEDS),
      new RSSPanel('science-rss', 'SCIENCE', SCIENCE_FEEDS),
      new RSSPanel('climate-rss', 'CLIMATE / ENERGY', CLIMATE_FEEDS),
      new RSSPanel('biotech-rss', 'BIOTECH / HEALTH', BIOTECH_FEEDS),
      new RSSPanel('energy-rss', 'ENERGY', ENERGY_FEEDS),
      new RSSPanel('legal-rss', 'LEGAL', LEGAL_FEEDS),
    ],
  },
  {
    key: '5', label: 'CULTURE', id: 'culture',
    factory: () => [
      new MemePanel(),
      new InternetDramaPanel(),
      new VibesPanel(),
      new SteamPanel(),
      new MemeTemplatePanel(),
      new RSSPanel('culture-rss', 'CULTURE / MEDIA', CULTURE_FEEDS),
      new RSSPanel('gaming-rss', 'GAMING', GAMING_FEEDS),
      new RSSPanel('food-rss', 'FOOD / AG', FOOD_FEEDS),
      new RSSPanel('media-rss', 'JOURNALISM', MEDIA_FEEDS),
      new RSSPanel('education-rss', 'EDUCATION', EDUCATION_FEEDS),
      new RSSPanel('transport-rss', 'TRANSPORT', TRANSPORT_FEEDS),
      new RSSPanel('labor-rss', 'LABOR / WORK', LABOR_FEEDS),
      new RSSPanel('ecommerce-rss', 'ECOMMERCE / SUPPLY', ECOMMERCE_FEEDS),
    ],
  },
  {
    key: '6', label: 'SIGNALS', id: 'signals',
    factory: () => [
      new ISSPanel(),
      new SpaceWeatherPanel(),
      new NearEarthPanel(),
      new FlightsOverheadPanel(),
      new PowerGridPanel(),
      new AirportDelaysPanel(),
      new DataBreachPanel(),
      new CISAKEVPanel(),
      new CVEPanel(),
      new ThreatFeedPanel(),
      new RSSPanel('security-rss', 'SECURITY / INFOSEC', SECURITY_FEEDS),
      new RSSPanel('space-rss', 'SPACE', SPACE_FEEDS),
    ],
  },
  {
    key: '7', label: 'LOCAL', id: 'local',
    factory: () => [
      new CitiBikePanel(),
      new NYC311Panel(),
      new NYCTrafficPanel(),
      new RSSPanel('nyc-rss', 'NYC', NYC_FEEDS),
      new RSSPanel('la-rss', 'LOS ANGELES', LA_FEEDS),
      new RSSPanel('sf-rss', 'SF / SILICON VALLEY', SF_FEEDS),
    ],
  },
];

// ============================================================================
// PAGE STATE — lazy mount/unmount
// ============================================================================
let activePage = 0;
const mountedPanels: Map<number, Panel[]> = new Map();
const pageGrids: HTMLElement[] = [];

function mountPage(idx: number): void {
  const page = PAGES[idx];
  if (!page) return;

  // Already mounted? Just show it
  if (mountedPanels.has(idx)) {
    pageGrids[idx].style.display = '';
    return;
  }

  // Create panels via factory
  const panels = page.factory();
  mountedPanels.set(idx, panels);

  // Create grid container
  const grid = pageGrids[idx];
  grid.innerHTML = '';
  grid.style.display = '';

  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount(); // starts fetch + interval
  }
}

function unmountPage(idx: number): void {
  const panels = mountedPanels.get(idx);
  if (panels) {
    for (const p of panels) p.destroy(); // stops intervals
    mountedPanels.delete(idx);
    pageGrids[idx].innerHTML = '';
  }
  pageGrids[idx].style.display = 'none';
}

function hidePage(idx: number): void {
  // Just hide, don't destroy — panels keep refreshing in background
  pageGrids[idx].style.display = 'none';
}

function switchPage(idx: number): void {
  if (idx === activePage && mountedPanels.has(idx)) return;

  // Hide current
  hidePage(activePage);

  // Mount + show new
  activePage = idx;
  mountPage(idx);

  // Update tab bar
  updateTabs();
  updateStatus();
}

// ============================================================================
// HEADER — tabs + status
// ============================================================================
function renderHeader(): void {
  const header = document.getElementById('header')!;

  // Tab bar
  const tabBar = document.createElement('nav');
  tabBar.id = 'tab-bar';
  tabBar.innerHTML = PAGES.map((page, i) =>
    `<button class="tab${i === 0 ? ' tab-active' : ''}" data-page="${i}">
      <span class="tab-key">${page.key}</span>${page.label}
    </button>`
  ).join('');

  // Status
  const status = document.createElement('div');
  status.id = 'status';
  status.innerHTML = `<span class="header-title">terminally online</span>`;

  header.innerHTML = '';
  header.append(tabBar, status);

  // Tab click handlers
  tabBar.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt((btn as HTMLElement).dataset.page ?? '0', 10);
      switchPage(idx);
    });
  });
}

function updateTabs(): void {
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('tab-active', i === activePage);
  });
}

function updateStatus(): void {
  const status = document.getElementById('status');
  if (!status) return;
  const panelCount = mountedPanels.get(activePage)?.length ?? 0;
  status.innerHTML = `
    <span class="header-title">terminally online</span>
    <span class="header-status">${ALL_FEEDS.length} feeds · ${panelCount} panels · page ${activePage + 1}/${PAGES.length}</span>
  `;
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================
function setupKeyboard(): void {
  document.addEventListener('keydown', (e) => {
    // Number keys 1-7 switch pages
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= PAGES.length) {
      e.preventDefault();
      switchPage(num - 1);
      return;
    }

    // Left/Right arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      const next = (activePage + dir + PAGES.length) % PAGES.length;
      switchPage(next);
      return;
    }

    // R to refresh current page
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      const panels = mountedPanels.get(activePage);
      if (panels) {
        for (const p of panels) p.refresh();
      }
    }
  });
}

// ============================================================================
// INIT
// ============================================================================
async function init(): Promise<void> {
  // Create grid containers for each page
  const main = document.getElementById('grid')!;
  for (let i = 0; i < PAGES.length; i++) {
    const grid = document.createElement('div');
    grid.className = 'page-grid';
    grid.id = `page-${PAGES[i].id}`;
    grid.style.display = 'none';
    main.appendChild(grid);
    pageGrids.push(grid);
  }

  renderHeader();
  setupKeyboard();

  // Mount first page
  switchPage(0);
}

init();
