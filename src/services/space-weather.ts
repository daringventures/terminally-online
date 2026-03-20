export interface SpaceWeatherAlert {
  productId: string;
  issueTime: string;
  message: string;
}

export interface SpaceWeatherSummary {
  solarWindSpeed: number | null;   // km/s
  kpIndex: number | null;          // 0–9 planetary K-index
  xrayFlux: number | null;         // watts/m^2, latest reading
  xrayClass: string;               // e.g. "A1.2", "M5.3", "X1.0"
  alerts: SpaceWeatherAlert[];
  fetchedAt: number;               // unix ms
}

interface SolarWindResponse {
  WindSpeed: string;
}

type KpRow = [string, string]; // [time_tag, Kp]

interface XrayRow {
  time_tag: string;
  flux: number;
  energy: string;
}

export async function fetchSpaceWeather(): Promise<SpaceWeatherSummary> {
  const [alertsRes, windRes, kpRes, xrayRes] = await Promise.allSettled([
    fetch('https://services.swpc.noaa.gov/products/alerts.json'),
    fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'),
    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
    fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json'),
  ]);

  // --- Alerts ---
  let alerts: SpaceWeatherAlert[] = [];
  if (alertsRes.status === 'fulfilled' && alertsRes.value.ok) {
    const raw = await alertsRes.value.json() as Array<{
      productId: string;
      issueTime: string;
      message: string;
    }>;
    alerts = raw.slice(0, 10).map((a) => ({
      productId: a.productId ?? '',
      issueTime: a.issueTime ?? '',
      message: a.message ?? '',
    }));
  }

  // --- Solar Wind Speed ---
  let solarWindSpeed: number | null = null;
  if (windRes.status === 'fulfilled' && windRes.value.ok) {
    const raw = await windRes.value.json() as SolarWindResponse;
    const parsed = parseFloat(raw.WindSpeed);
    if (!isNaN(parsed)) solarWindSpeed = parsed;
  }

  // --- Kp Index ---
  let kpIndex: number | null = null;
  if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
    const raw = await kpRes.value.json() as KpRow[];
    // Skip header row (first element), take last entry
    const last = raw[raw.length - 1];
    if (last) {
      const parsed = parseFloat(last[1]);
      if (!isNaN(parsed)) kpIndex = parsed;
    }
  }

  // --- X-ray Flux ---
  let xrayFlux: number | null = null;
  let xrayClass = 'A0.0';
  if (xrayRes.status === 'fulfilled' && xrayRes.value.ok) {
    const raw = await xrayRes.value.json() as XrayRow[];
    // Use long channel (0.1–0.8 nm) for classification — filter by energy band
    const longChannel = raw.filter((r) => r.energy === '0.1-0.8nm');
    const last = longChannel[longChannel.length - 1];
    if (last) {
      xrayFlux = last.flux;
      xrayClass = classifyXray(last.flux);
    }
  }

  return {
    solarWindSpeed,
    kpIndex,
    xrayFlux,
    xrayClass,
    alerts,
    fetchedAt: Date.now(),
  };
}

function classifyXray(flux: number): string {
  if (flux < 1e-8) return `A${(flux / 1e-8).toFixed(1)}`;
  if (flux < 1e-7) return `B${(flux / 1e-7).toFixed(1)}`;
  if (flux < 1e-6) return `C${(flux / 1e-6).toFixed(1)}`;
  if (flux < 1e-5) return `M${(flux / 1e-5).toFixed(1)}`;
  return `X${(flux / 1e-4).toFixed(1)}`;
}
