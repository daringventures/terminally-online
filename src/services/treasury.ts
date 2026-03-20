export interface TreasuryYield {
  date: string;
  yields: Record<string, number | null>;
}

interface TreasuryApiRow {
  record_date?: string;
  bc_1month?: string;
  bc_2month?: string;
  bc_3month?: string;
  bc_4month?: string;
  bc_6month?: string;
  bc_1year?: string;
  bc_2year?: string;
  bc_3year?: string;
  bc_5year?: string;
  bc_7year?: string;
  bc_10year?: string;
  bc_20year?: string;
  bc_30year?: string;
}

function parseYield(val: string | undefined): number | null {
  if (!val || val === 'null' || val === '') return null;
  const n = parseFloat(val);
  return Number.isNaN(n) ? null : n;
}

export async function fetchTreasuryYields(): Promise<TreasuryYield> {
  // Primary: use the Treasury Fiscal Data API for average interest rates
  const yieldUrl =
    'https://api.fiscaldata.treasury.gov/services/api/v1/accounting/od/avg_interest_rates?' +
    'fields=record_date,security_type_desc,security_desc,avg_interest_rate_amt' +
    '&filter=security_type_desc:eq:Marketable&sort=-record_date&page[size]=30';

  try {
    const res = await fetch(yieldUrl);
    if (res.ok) {
      const json = (await res.json()) as {
        data: Array<{
          record_date: string;
          security_desc: string;
          avg_interest_rate_amt: string;
        }>;
      };

      if (json.data && json.data.length > 0) {
        const latestDate = json.data[0]!.record_date;
        const forDate = json.data.filter((r) => r.record_date === latestDate);
        const yields: Record<string, number | null> = {};

        for (const row of forDate) {
          const rate = parseFloat(row.avg_interest_rate_amt);
          if (!Number.isNaN(rate)) {
            yields[row.security_desc] = rate;
          }
        }

        return { date: latestDate, yields };
      }
    }
  } catch {
    // fall through to backup
  }

  // Fallback: use the home.treasury.gov JSON endpoint
  try {
    const currentYear = new Date().getFullYear();
    const fallbackUrl =
      `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/all/${currentYear}` +
      `?type=daily_treasury_yield_curve&field_tdr_date_value=${currentYear}&page&_format=json`;

    const res = await fetch(fallbackUrl);
    if (res.ok) {
      const rows = (await res.json()) as TreasuryApiRow[];

      if (Array.isArray(rows) && rows.length > 0) {
        const latest = rows[0];
        if (!latest) throw new Error('Treasury: empty response');

        return {
          date: latest.record_date ?? 'recent',
          yields: {
            '1 Mo': parseYield(latest.bc_1month),
            '2 Mo': parseYield(latest.bc_2month),
            '3 Mo': parseYield(latest.bc_3month),
            '4 Mo': parseYield(latest.bc_4month),
            '6 Mo': parseYield(latest.bc_6month),
            '1 Yr': parseYield(latest.bc_1year),
            '2 Yr': parseYield(latest.bc_2year),
            '3 Yr': parseYield(latest.bc_3year),
            '5 Yr': parseYield(latest.bc_5year),
            '7 Yr': parseYield(latest.bc_7year),
            '10 Yr': parseYield(latest.bc_10year),
            '20 Yr': parseYield(latest.bc_20year),
            '30 Yr': parseYield(latest.bc_30year),
          },
        };
      }
    }
  } catch {
    // fall through
  }

  throw new Error('Treasury: unable to fetch yield curve data');
}
