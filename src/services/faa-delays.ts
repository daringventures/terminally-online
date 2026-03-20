export interface AirportDelay {
  airportCode: string;
  airportName: string;
  delayType: string; // e.g. "Ground Delay", "Ground Stop", "Arrival/Departure Delay"
  reason: string;
  avgDelay?: string; // e.g. "2 hours 30 minutes"
  closureBegin?: string;
  closureEnd?: string;
}

interface FAAGeneralAviationRule {
  'ARPT'?: string;
  'Reason'?: string;
  'Departure-Arrival'?: Array<{
    'Reason'?: string;
    'Arrival-Departure'?: string;
    'Min'?: string;
    'Max'?: string;
    'Trend'?: string;
  }>;
  'Ground-Delay'?: Array<{
    'Reason'?: string;
    'Avg'?: string;
    'Max'?: string;
    'Trend'?: string;
  }>;
  'Ground-Stop'?: Array<{
    'Reason'?: string;
    'Endtime'?: string;
  }>;
  'Closure'?: Array<{
    'Reason'?: string;
    'Begin'?: string;
    'End'?: string;
  }>;
}

interface FAAStatusResponse {
  'AIRPORT_STATUS_INFORMATION'?: {
    'Delay_type'?: Array<{
      'Name'?: string;
      'ARPT_Info'?: FAAGeneralAviationRule[];
    }>;
  };
}

export async function fetchAirportDelays(): Promise<AirportDelay[]> {
  const res = await fetch('https://nasstatus.faa.gov/api/airport-status-information', {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`FAA: ${res.status}`);

  const data = await res.json() as FAAStatusResponse;
  const delays: AirportDelay[] = [];

  const delayTypes = data?.AIRPORT_STATUS_INFORMATION?.Delay_type ?? [];

  for (const group of delayTypes) {
    const typeName = group.Name ?? 'Delay';
    const airports = group.ARPT_Info ?? [];

    for (const arpt of airports) {
      const code = arpt.ARPT ?? 'UNKNOWN';

      if (arpt['Ground-Delay']?.length) {
        for (const gd of arpt['Ground-Delay']) {
          delays.push({
            airportCode: code,
            airportName: code,
            delayType: 'Ground Delay',
            reason: gd.Reason ?? 'Unknown',
            avgDelay: gd.Avg,
          });
        }
      }

      if (arpt['Ground-Stop']?.length) {
        for (const gs of arpt['Ground-Stop']) {
          delays.push({
            airportCode: code,
            airportName: code,
            delayType: 'Ground Stop',
            reason: gs.Reason ?? 'Unknown',
            closureEnd: gs.Endtime,
          });
        }
      }

      if (arpt['Departure-Arrival']?.length) {
        for (const da of arpt['Departure-Arrival']) {
          delays.push({
            airportCode: code,
            airportName: code,
            delayType: typeName,
            reason: da.Reason ?? 'Unknown',
            avgDelay: da.Min && da.Max ? `${da.Min}–${da.Max} min` : undefined,
          });
        }
      }

      if (arpt['Closure']?.length) {
        for (const cl of arpt['Closure']) {
          delays.push({
            airportCode: code,
            airportName: code,
            delayType: 'Closure',
            reason: cl.Reason ?? 'Unknown',
            closureBegin: cl.Begin,
            closureEnd: cl.End,
          });
        }
      }
    }
  }

  return delays;
}
