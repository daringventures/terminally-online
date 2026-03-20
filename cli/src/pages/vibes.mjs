import { tbl, gaugeWidget, logWidget, sparkWidget, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { computeVibesIndex, computeDegenIndex } from '../services/vibes-index.mjs';
import { computeClownIndex, computeDoomIndex, computeMainCharIndex, computeTechPanicIndex } from '../services/custom-indices.mjs';

export function build(grid, W) {
  // Row 0-3: Top 3 gauges + their sparkline trends
  W.vibesG = gaugeWidget(grid, 0, 0, 3, 2, `${I.fire} VIBES`, 'yellow');
  W.vibesSpark = sparkWidget(grid, 0, 2, 3, 2, `${I.fire} VIBES TREND`, 'yellow');
  W.degenG = gaugeWidget(grid, 0, 4, 3, 2, `${I.bolt} DEGEN`, 'magenta');
  W.degenSpark = sparkWidget(grid, 0, 6, 3, 2, `${I.bolt} DEGEN TREND`, 'magenta');
  W.clownG = gaugeWidget(grid, 0, 8, 3, 2, `${I.rocket} CLOWN`, 'cyan');
  W.clownSpark = sparkWidget(grid, 0, 10, 3, 2, `${I.rocket} CLOWN TREND`, 'cyan');

  // Row 3-6: Bottom 3 gauges + their sparkline trends
  W.doomG = gaugeWidget(grid, 3, 0, 3, 2, `${I.skull} DOOM`, 'red');
  W.doomSpark = sparkWidget(grid, 3, 2, 3, 2, `${I.skull} DOOM TREND`, 'red');
  W.maincharG = gaugeWidget(grid, 3, 4, 3, 2, `${I.eye} MAIN CHAR`, 'green');
  W.maincharSpark = sparkWidget(grid, 3, 6, 3, 2, `${I.eye} MAIN TREND`, 'green');
  W.techpanicG = gaugeWidget(grid, 3, 8, 3, 2, `${I.brain} TECH PANIC`, 'blue');
  W.techpanicSpark = sparkWidget(grid, 3, 10, 3, 2, `${I.brain} PANIC TREND`, 'blue');

  // Row 6-12: Big breakdown log
  W.breakdownLog = logWidget(grid, 6, 0, 6, 12, `${I.chart} SIGNAL BREAKDOWN`);
}

export async function load(W, ctx) {
  const { safe, cf, setTicker, tsRecord, tsSince } = ctx;

  const [vb, dg, cl, dm, mc, tp] = await Promise.allSettled([
    safe(cf('idx-vibes', computeVibesIndex, 120)),
    safe(cf('idx-degen', computeDegenIndex, 120)),
    safe(cf('idx-clown', computeClownIndex, 120)),
    safe(cf('idx-doom', computeDoomIndex, 120)),
    safe(cf('idx-mainchar', computeMainCharIndex, 120)),
    safe(cf('idx-techpanic', computeTechPanicIndex, 120)),
  ]);

  const log = W.breakdownLog;
  const indices = [
    { r: vb, w: W.vibesG, spark: W.vibesSpark, icon: I.fire, color: 'yellow', name: 'SO COOKED/SO BACK', tsKey: 'idx:vibes' },
    { r: dg, w: W.degenG, spark: W.degenSpark, icon: I.bolt, color: 'magenta', name: 'DEGEN INDEX', tsKey: 'idx:degen' },
    { r: cl, w: W.clownG, spark: W.clownSpark, icon: I.rocket, color: 'cyan', name: 'CLOWN MARKET', tsKey: 'idx:clown' },
    { r: dm, w: W.doomG, spark: W.doomSpark, icon: I.skull, color: 'red', name: 'DOOM SCROLL', tsKey: 'idx:doom' },
    { r: mc, w: W.maincharG, spark: W.maincharSpark, icon: I.eye, color: 'green', name: 'MAIN CHARACTER', tsKey: 'idx:mainchar' },
    { r: tp, w: W.techpanicG, spark: W.techpanicSpark, icon: I.brain, color: 'blue', name: 'TECH BRO PANIC', tsKey: 'idx:techpanic' },
  ];

  const tickerItems = [];
  for (const { r, w, spark, icon, name, tsKey } of indices) {
    if (r.value?.index != null) {
      const val = r.value.index;
      w?.setPercent(val);
      log?.log(`{bold}${icon}${name}{/bold}: ${val}/100 — ${r.value.label}`);
      r.value.breakdown?.forEach(b => log?.log(`  ${b}`));
      log?.log('');
      tickerItems.push(`${icon}${name}: ${val} ${r.value.label}`);
      // Record to timeseries DB
      tsRecord(tsKey, val, r.value.label);
      // Load sparkline from historical data (last 6 hours)
      try {
        const history = tsSince(tsKey, 6 * 3600);
        const points = history.map(h => h.value);
        if (points.length > 1 && spark) {
          spark.setData([name], [points]);
        }
      } catch {}
    }
  }
  setTicker(tickerItems);
}
