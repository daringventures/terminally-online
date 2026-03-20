import contrib from 'blessed-contrib';
import { C } from './theme.mjs';

// ── Column layouts: [widths, headers] ───────────────────
// Widths are in chars. Headers tell you what each column IS.
export const COL = {
  feed5: { w: [3, 52, 7, 8, 4],  h: ['#', 'TITLE', 'PTS', 'CMTS', 'AGE'] },
  feed3: { w: [3, 58, 10],       h: ['#', 'TITLE', 'METRIC'] },
  feed4: { w: [3, 48, 8, 10],    h: ['#', 'TITLE', 'VALUE', 'DETAIL'] },
  pred:  { w: [3, 46, 6, 12],    h: ['#', 'QUESTION', 'YES%', 'VOLUME'] },
  wide2: { w: [3, 65],           h: ['#', 'TITLE'] },
  kv3:   { w: [3, 36, 14],       h: ['#', 'NAME', 'VALUE'] },
  geo:   { w: [6, 46, 5, 8],     h: ['MAG', 'LOCATION', 'AGE', 'DETAIL'] },
};

// ── Interactive color-coded table ───────────────────────
// Tables are navigable (up/down/j/k), selectable (Enter), and focusable (Tab).
// Focused table gets yellow border. Selected row highlighted cyan.
export function tbl(grid, row, col, rowSpan, colSpan, label, colDef, cellColor = 'green') {
  const widget = grid.set(row, col, rowSpan, colSpan, contrib.table, {
    label: ` ${label} `,
    keys: true,
    vi: true,
    interactive: true,
    mouse: true,
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
  widget._data = [];
  widget._label = label;

  // Focus/blur border highlighting
  if (widget.rows) {
    widget.rows.on('focus', () => {
      widget.style.border.fg = 'yellow';
      widget.setLabel(` {yellow-fg}{bold}${label}{/bold}{/yellow-fg} `);
    });
    widget.rows.on('blur', () => {
      widget.style.border.fg = 'cyan';
      widget.setLabel(` ${label} `);
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
