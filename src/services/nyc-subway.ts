const MTA_ALERTS_URL =
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json';

export interface SubwayAlert {
  id: string;
  headerText: string;
  descriptionText: string;
  affectedRoutes: string[];
  effectType: string;
  activePeriodStart: number; // unix seconds
  activePeriodEnd: number | null; // unix seconds, null = ongoing
  url: string;
}

// MTA GTFS-RT JSON structure (simplified)
interface MTAFeedMessage {
  entity?: Array<{
    id: string;
    alert?: {
      header_text?: {
        translation?: Array<{ text: string; language?: string }>;
      };
      description_text?: {
        translation?: Array<{ text: string; language?: string }>;
      };
      informed_entity?: Array<{
        route_id?: string;
      }>;
      effect?: string;
      active_period?: Array<{
        start?: number;
        end?: number;
      }>;
      url?: {
        translation?: Array<{ text: string }>;
      };
    };
  }>;
}

function pickTranslation(
  translations?: Array<{ text: string; language?: string }>
): string {
  if (!translations?.length) return '';
  const en = translations.find((t) => !t.language || t.language === 'en');
  return (en ?? translations[0]!).text;
}

export async function fetchSubwayAlerts(): Promise<SubwayAlert[]> {
  let data: MTAFeedMessage;

  try {
    const res = await fetch(MTA_ALERTS_URL);
    if (!res.ok) throw new Error(`MTA alerts: ${res.status}`);
    data = await res.json() as MTAFeedMessage;
  } catch {
    // Fallback: return empty rather than crashing — MTA API often rate-limits unauthenticated requests
    return [];
  }

  const entities = data.entity ?? [];
  const now = Math.floor(Date.now() / 1000);

  return entities
    .filter((e) => !!e.alert)
    .map((e): SubwayAlert | null => {
      const alert = e.alert!;
      const headerText = pickTranslation(alert.header_text?.translation);
      if (!headerText) return null;

      const affectedRoutes = [
        ...new Set(
          (alert.informed_entity ?? [])
            .map((ie) => ie.route_id)
            .filter((r): r is string => !!r)
        ),
      ].sort();

      const period = alert.active_period?.[0];
      const activePeriodStart = period?.start ?? now;
      const activePeriodEnd = period?.end ?? null;

      const alertUrl =
        pickTranslation(alert.url?.translation) ||
        'https://new.mta.info/alerts';

      return {
        id: e.id,
        headerText,
        descriptionText: pickTranslation(alert.description_text?.translation),
        affectedRoutes,
        effectType: alert.effect ?? 'UNKNOWN_EFFECT',
        activePeriodStart,
        activePeriodEnd,
        url: alertUrl,
      };
    })
    .filter((a): a is SubwayAlert => a !== null)
    .slice(0, 30);
}
