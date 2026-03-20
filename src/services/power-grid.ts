// CAISO (California ISO) Renewables data
// Endpoint: https://www.caiso.com/outlook/SP/renewables.json

export interface RenewableSource {
  name: string;      // e.g. "Solar", "Wind", "Geothermal", "Biomass", "Biogas", "Small hydro"
  mw: number;        // Generation in megawatts
  pct: number;       // Percentage of total renewables (of renewable total)
}

interface RenewableSourceRaw {
  name: string;
  mw: number;
}

export interface CAISORenewablesData {
  totalRenewableMW: number;
  totalLoadMW: number;
  renewablePct: number; // renewables as % of total load
  sources: RenewableSource[];
  timestamp: number; // unix seconds
}

export async function fetchCAISORenewables(): Promise<CAISORenewablesData> {
  const res = await fetch('https://www.caiso.com/outlook/SP/renewables.json');
  if (!res.ok) throw new Error(`CAISO: ${res.status}`);

  // CAISO returns an array of data points; we want the latest entry
  const raw = await res.json() as unknown;

  // Response is an array of arrays: each row is
  // [unixMs, solar, wind, geothermal, biomass, biogas, smallHydro, batteryCharging, imports, nuclear, thermal, hydro, totalLoad]
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('CAISO: unexpected response shape');
  }

  // Find the latest entry with actual data (some trailing entries may be null)
  let latestRow: unknown[] | null = null;
  for (let i = raw.length - 1; i >= 0; i--) {
    const row = raw[i] as unknown[];
    if (Array.isArray(row) && row[1] != null) {
      latestRow = row;
      break;
    }
  }

  if (!latestRow) throw new Error('CAISO: no valid data rows');

  const [
    timestampMs,
    solar,
    wind,
    geothermal,
    biomass,
    biogas,
    smallHydro,
    , // battery storage charging (can be negative)
    , // imports
    , // nuclear
    , // thermal
    , // large hydro
    totalLoad,
  ] = latestRow as number[];

  const sources: RenewableSourceRaw[] = [
    { name: 'Solar', mw: Math.max(0, solar ?? 0) },
    { name: 'Wind', mw: Math.max(0, wind ?? 0) },
    { name: 'Geothermal', mw: Math.max(0, geothermal ?? 0) },
    { name: 'Biomass', mw: Math.max(0, biomass ?? 0) },
    { name: 'Biogas', mw: Math.max(0, biogas ?? 0) },
    { name: 'Small Hydro', mw: Math.max(0, smallHydro ?? 0) },
  ];

  const totalRenewableMW = sources.reduce((sum, s) => sum + s.mw, 0);

  const sourcesWithPct = sources.map((s) => ({
    ...s,
    pct: totalRenewableMW > 0 ? Math.round((s.mw / totalRenewableMW) * 100) : 0,
  }));

  const loadMW = Math.max(1, totalLoad ?? 1);
  const renewablePct = Math.round((totalRenewableMW / loadMW) * 100);

  return {
    totalRenewableMW: Math.round(totalRenewableMW),
    totalLoadMW: Math.round(loadMW),
    renewablePct,
    sources: sourcesWithPct.filter((s) => s.mw > 0).sort((a, b) => b.mw - a.mw),
    timestamp: timestampMs ? Math.floor(timestampMs / 1000) : Math.floor(Date.now() / 1000),
  };
}
