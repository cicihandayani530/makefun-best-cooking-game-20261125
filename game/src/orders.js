// orders.js — order board for Seoul Table Grill: ticket queue, patience.
import { RECIPES } from './recipes.js';
export function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export class OrderBoard {
  constructor(rng) { this.rng = rng; this.tickets = []; this.nextId = 1; this.spawnIn = 0; }
  spawn(elapsed) {
    const base = RECIPES[Math.floor(this.rng() * RECIPES.length)];
    const squeeze = Math.min(16, elapsed * 0.12);
    const max = Math.max(34, base.patience - squeeze);
    this.tickets.push({ id: this.nextId++, recipe: base, patience: max, patienceMax: max });
  }
  update(dt, elapsed, onExpire) {
    this.spawnIn -= dt;
    if (this.tickets.length < 3 && this.spawnIn <= 0) {
      this.spawn(elapsed);
      this.spawnIn = Math.max(3.5, 8 - elapsed * 0.05);
    }
    for (const t of [...this.tickets]) {
      t.patience -= dt;
      if (t.patience <= 0) { this.tickets.splice(this.tickets.indexOf(t), 1); onExpire(t); }
    }
  }
  matchIndex(plate) {
    return this.tickets.findIndex(t => {
      const r = t.recipe;
      if (!plate.meat || plate.meat.id !== r.meat || plate.meat.cut !== r.cut || plate.meat.burnt) return false;
      if (plate.sides.length !== r.sides.length) return false;
      return r.sides.every(s => plate.sides.includes(s));
    });
  }
}
