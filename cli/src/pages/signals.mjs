import { tbl, COL } from '../ui/widgets.mjs';
import { I } from '../ui/theme.mjs';
import { fetch_iss } from '../services/iss-tracker.mjs';
import { fetch_space_weather } from '../services/space-weather.mjs';
import { fetch_neo } from '../services/nasa-neo.mjs';
import { fetch_flights_nyc } from '../services/flights.mjs';
import { fetch_caiso } from '../services/power-grid.mjs';
import { fetch_airport_delays } from '../services/airport-delays.mjs';
import { fetch_weather_alerts } from '../services/weather-alerts.mjs';
import { fetch_earthquakes } from '../services/usgs.mjs';

export function build(grid, W) {
  W.iss = tbl(grid, 0, 0, 4, 4, `${I.rocket} ISS TRACKER`, COL.kv3, 'cyan');
  W.spaceWx = tbl(grid, 0, 4, 4, 4, `${I.bolt} SPACE WEATHER`, COL.feed3, 'yellow');
  W.neo = tbl(grid, 0, 8, 4, 4, `${I.quake} NEAR-EARTH OBJECTS`, COL.feed4, 'red');
  W.flights = tbl(grid, 4, 0, 4, 4, `${I.globe} FLIGHTS OVER NYC`, COL.feed4, 'cyan');
  W.powerGrid = tbl(grid, 4, 4, 4, 4, `${I.bolt} CA POWER GRID`, COL.kv3, 'green');
  W.airports = tbl(grid, 4, 8, 4, 4, `${I.globe} AIRPORT DELAYS`, COL.feed4, 'yellow');
  W.wxAlerts = tbl(grid, 8, 0, 4, 6, `${I.quake} SEVERE WEATHER`, COL.feed4, 'red');
  W.quakes3 = tbl(grid, 8, 6, 4, 6, `${I.quake} EARTHQUAKES`, COL.geo, 'yellow');
}

export async function load(W, ctx) {
  const { safe, cf, set, setTicker } = ctx;

  const [iss, sw, neo, fl, pg, ap, wx, eq] = await Promise.allSettled([
    safe(cf('iss', fetch_iss, 30)),
    safe(cf('space-wx', fetch_space_weather, 300)),
    safe(cf('nasa-neo', fetch_neo, 3600)),
    safe(cf('flights-nyc', fetch_flights_nyc, 30)),
    safe(cf('caiso', fetch_caiso, 300)),
    safe(cf('airports', fetch_airport_delays, 120)),
    safe(cf('wx-alerts', fetch_weather_alerts, 120)),
    safe(cf('quakes', fetch_earthquakes, 300)),
  ]);
  set(W.iss, iss.value); set(W.spaceWx, sw.value); set(W.neo, neo.value);
  set(W.flights, fl.value); set(W.powerGrid, pg.value); set(W.airports, ap.value);
  set(W.wxAlerts, wx.value); set(W.quakes3, eq.value);

  const tickerItems = [];
  if (iss.value?.[0]) tickerItems.push(`${I.rocket}ISS: ${iss.value[0][2]}`);
  if (sw.value?.[0]) tickerItems.push(`${I.bolt}SOLAR: ${sw.value[0][1]}`);
  if (fl.value) tickerItems.push(`${I.globe}${fl.value.length} AIRCRAFT OVER NYC`);
  if (wx.value?.[0]) tickerItems.push(`${I.quake}WX: ${wx.value[0][1]}`);
  setTicker(tickerItems);
}
