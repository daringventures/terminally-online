import { HackerNewsPanel } from './components/HackerNewsPanel';

function renderHeader(): void {
  const header = document.getElementById('header')!;
  header.innerHTML = `
    <span class="header-title">terminally online</span>
    <span class="header-status">live</span>
  `;
}

async function init(): Promise<void> {
  renderHeader();

  const grid = document.getElementById('grid')!;

  const panels = [
    new HackerNewsPanel(),
  ];

  for (const panel of panels) {
    grid.appendChild(panel.el);
    panel.mount();
  }
}

init();
