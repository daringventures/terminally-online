import { IndexGaugePanel } from './IndexGaugePanel';
import {
  computeDegenIndex,
  computeDoomerIndex,
  computeCosmicVibes,
  computeMemeVelocity,
  computeTouchGrassIndex,
} from '@/services/cursed-indices';

export class DegenIndexPanel extends IndexGaugePanel {
  constructor() {
    super({
      id: 'degen-index',
      title: 'DEGEN INDEX',
      computeFn: computeDegenIndex,
      refreshMs: 120_000,
    });
  }
}

export class DoomerIndexPanel extends IndexGaugePanel {
  constructor() {
    super({
      id: 'doomer-index',
      title: 'DOOMER INDEX',
      computeFn: computeDoomerIndex,
      refreshMs: 120_000,
    });
  }
}

export class CosmicVibesPanel extends IndexGaugePanel {
  constructor() {
    super({
      id: 'cosmic-vibes',
      title: 'COSMIC VIBES',
      computeFn: computeCosmicVibes,
      refreshMs: 120_000,
    });
  }
}

export class MemeVelocityPanel extends IndexGaugePanel {
  constructor() {
    super({
      id: 'meme-velocity',
      title: 'MEME VELOCITY',
      computeFn: computeMemeVelocity,
      refreshMs: 120_000,
    });
  }
}

export class TouchGrassPanel extends IndexGaugePanel {
  constructor() {
    super({
      id: 'touch-grass',
      title: 'TOUCH GRASS INDEX',
      computeFn: computeTouchGrassIndex,
      refreshMs: 120_000,
    });
  }
}
