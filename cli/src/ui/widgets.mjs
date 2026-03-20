import contrib from 'blessed-contrib';
import { C } from './theme.mjs';

// ── Column layouts: [widths, headers] ───────────────────
// Widths are in chars. Headers tell you what each column IS.
// Column layouts: widths in chars, matched to trunc() limits in services.
// Title columns are wide — services now trunc to 80 chars with ellipsis.
export const COL = {
  feed5: { w: [3, 70, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed3: { w: [3, 72, 10],       h: ['#', 'TITLE', 'METRIC'] },
  feed4: { w: [3, 60, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  pred:  { w: [3, 55, 6, 12],    h: ['#', 'QUESTION', 'ODDS', 'VOLUME'] },
  wide2: { w: [3, 80],           h: ['#', 'TITLE'] },
  kv3:   { w: [3, 42, 14],       h: ['#', 'NAME', 'VALUE'] },
  geo:   { w: [6, 55, 5, 8],     h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
};

// ── Interactive color-coded table ───────────────────────
// Tables are navigable (up/down/j/k), selectable (Enter), and focusable (Tab).
// Focused table gets yellow border. Selected row highlighted cyan.
// Per-column color map: header name → color for that column's data.
// Title/question stay the table's cellColor. Metrics get distinct colors.
const COL_COLORS = {
  '#':       'gray',
  'PTS':     'yellow',
  'CMTS':    'cyan',
  'AGE':     'gray',
  'ODDS':    'green',
  'VOLUME':  'yellow',
  'VALUE':   'yellow',
  'METRIC':  'cyan',
  'MAG':     'red',
  'DETAIL':  'gray',
};

export function tbl(grid, row, col, rowSpan, colSpan, label, colDef, cellColor = 'green') {
  const widget = grid.set(row, col, rowSpan, colSpan, contrib.table, {
    label: ` ${label} `,
    keys: true,
    vi: true,
    interactive: true,
    mouse: true,
    tags: true,
    selectedFg: 'black',
    selectedBg: 'cyan',
    columnSpacing: 2,
    columnWidth: colDef.w,
    style: {
      header: { fg: 'white', bold: true },
      cell: { fg: cellColor },
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });
  widget._colHeaders = colDef.h;
  widget._colWidths = colDef.w;
  widget._cellColor = cellColor;
  widget._data = [];
  widget._label = label;

  // Focus/blur border highlighting — only change border color, don't touch label
  // (contrib.table's internal label box doesn't support blessed tags)
  if (widget.rows) {
    widget.rows.on('focus', () => {
      widget.style.border.fg = 'yellow';
    });
    widget.rows.on('blur', () => {
      widget.style.border.fg = 'cyan';
    });
  }

  return widget;
}

export function logWidget(grid, row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.log, {
    label: ` ${label} `,
    keys: true,
    scrollable: true,
    mouse: true,
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
      text: { fg: C.green },
    },
    border: { type: 'line', fg: 'cyan' },
    bufferLength: 80,
    tags: true,
  });
}

export function gaugeWidget(grid, row, col, rowSpan, colSpan, label, color = 'yellow') {
  return grid.set(row, col, rowSpan, colSpan, contrib.gauge, {
    label: ` ${label} `,
    stroke: color,
    fill: 'white',
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });
}

export function sparkWidget(grid, row, col, rowSpan, colSpan, label, color = 'cyan') {
  return grid.set(row, col, rowSpan, colSpan, contrib.sparkline, {
    label: ` ${label} `,
    tags: true,
    style: {
      fg: color,
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });
}

export function lcdWidget(grid, row, col, rowSpan, colSpan, label, color = 'yellow') {
  return grid.set(row, col, rowSpan, colSpan, contrib.lcd, {
    label: ` ${label} `,
    segmentWidth: 0.06,
    segmentInterval: 0.11,
    strokeWidth: 0.11,
    elements: 4,
    display: '----',
    elementSpacing: 4,
    elementPadding: 2,
    color,
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });
}

export function donutWidget(grid, row, col, rowSpan, colSpan, label) {
  return grid.set(row, col, rowSpan, colSpan, contrib.donut, {
    label: ` ${label} `,
    radius: 14,
    arcWidth: 4,
    yPadding: 2,
    remainColor: C.dim,
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'white', bold: true },
    },
    border: { type: 'line', fg: 'cyan' },
  });
}
