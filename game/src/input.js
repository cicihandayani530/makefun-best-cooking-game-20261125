// input.js — mouse and keyboard for Seoul Table Grill.
import { LAYOUT } from './render.js';
function inside(x, y, r) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
export function bindInput(canvas, acts) {
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    for (const b of LAYOUT.bins) if (inside(x, y, b)) return acts.pickBin(b);
    LAYOUT.grill.forEach((s, i) => { if (inside(x, y, s)) acts.grillSlot(i); });
    if (inside(x, y, LAYOUT.board)) acts.board();
    if (inside(x, y, LAYOUT.refill)) acts.refill();
    if (inside(x, y, LAYOUT.serve)) acts.serve();
    if (inside(x, y, LAYOUT.trash)) acts.trash();
  });
  window.addEventListener('keydown', e => {
    if (e.key >= '1' && e.key <= '8') acts.pickBin(LAYOUT.bins[Number(e.key) - 1]);
    else if (e.key === 'c' || e.key === 'C') acts.cut();
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); acts.serve(); }
    else if (e.key === 'Backspace') { e.preventDefault(); acts.trash(); }
    else if (e.key === 'r' || e.key === 'R') acts.restart();
  });
}
