// stations.js — the table grill: two charcoal slots. Meat must be
// flipped once halfway (click a slot) or one side burns; leave it too
// long after it is done and the whole piece burns. Scissors cut a
// cooked piece on the board before it goes on the plate.
import { MEATS } from './recipes.js';
export class Grill {
  constructor() { this.slots = [null, null]; this.board = null; }
  place(meatId) {
    const i = this.slots.findIndex(s => !s);
    if (i < 0) return false;
    this.slots[i] = { id: meatId, t: 0, need: MEATS[meatId].cook, flipped: false, burnt: false };
    return true;
  }
  flip(i) { const s = this.slots[i]; if (s && !s.burnt) s.flipped = true; }
  stateOf(s) {
    if (!s) return 'empty';
    if (s.burnt) return 'burnt';
    if (s.t >= s.need) return s.flipped ? 'done' : 'one-sided';
    return s.flipped ? 'grilling-flipped' : 'grilling';
  }
  update(dt) {
    for (const s of this.slots) {
      if (!s || s.burnt) continue;
      s.t += dt;
      if (s.t >= s.need && !s.flipped) s.burnt = true;      // never flipped: burnt side
      if (s.t >= s.need + 4) s.burnt = true;                  // left too long
    }
  }
  take(i) {
    const s = this.slots[i];
    if (!s || this.stateOf(s) !== 'done' || this.board) return false;
    this.board = { id: s.id, cut: false, burnt: false };
    this.slots[i] = null;
    return true;
  }
  discard(i) { if (this.slots[i] && this.slots[i].burnt) { this.slots[i] = null; return true; } return false; }
  cutBoard() { if (this.board && !this.board.cut) { this.board.cut = true; return true; } return false; }
  boardToPlate(plate) {
    if (!this.board || plate.meat) return false;
    plate.meat = { ...this.board }; this.board = null; return true;
  }
}
export function judgePlate(board, plate) {
  const idx = board.matchIndex(plate);
  if (idx < 0) return null;
  const t = board.tickets[idx];
  const tip = t.patience / t.patienceMax > 0.5 ? 5 : t.patience / t.patienceMax > 0.25 ? 2 : 0;
  return { ticket: t, coins: t.recipe.price + tip, tip };
}
