// render.js — every picture for Seoul Table Grill is drawn here in code:
// charcoal-and-neon Seoul night, order board, table grill with two slots,
// scissor cutting board, wrap plate being assembled, pass with a finished
// plate, banchan bowls and the ingredient counter.
import { MEATS, SIDES, recipeNeeds } from './recipes.js';
export const LAYOUT = {
  bins: [], // filled below: {kind:'meat'|'side', id, x,y,w,h}
  grill: [{ x: 370, y: 250, w: 240, h: 150 }, { x: 640, y: 250, w: 240, h: 150 }],
  board: { x: 370, y: 440, w: 240, h: 90 },
  plate: { x: 950, y: 230, w: 260, h: 200 },
  serve: { x: 950, y: 470, w: 120, h: 46 },
  trash: { x: 1090, y: 470, w: 120, h: 46 },
  refill: { x: 640, y: 440, w: 240, h: 90 },
};
const BIN_DEFS = [
  { kind: 'meat', id: 'pork' }, { kind: 'meat', id: 'beef' }, { kind: 'meat', id: 'chicken' },
  { kind: 'side', id: 'lettuce' }, { kind: 'side', id: 'rice' }, { kind: 'side', id: 'ssamjang' },
  { kind: 'side', id: 'kimchi' }, { kind: 'side', id: 'garlic' },
];
BIN_DEFS.forEach((b, i) => LAYOUT.bins.push({ ...b, x: 30 + i * 154, y: 640, w: 140, h: 110 }));
function rr(ctx, x, y, w, h, r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
function txt(ctx, s, x, y, size, color, align = 'left', bold = true) {
  ctx.fillStyle = color; ctx.font = `${bold ? 'bold ' : ''}${size}px sans-serif`; ctx.textAlign = align; ctx.fillText(s, x, y);
}
function drawMeat(ctx, cx, cy, w, meat, cut, burnt) {
  ctx.fillStyle = burnt ? '#26201e' : MEATS[meat].color;
  ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - w * 0.28, w, w * 0.56, 12); ctx.fill();
  ctx.strokeStyle = 'rgba(60,20,10,.55)'; ctx.lineWidth = 3;
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(cx + i * w * 0.22, cy - w * 0.24); ctx.lineTo(cx + i * w * 0.22, cy + w * 0.24); ctx.stroke(); }
  if (cut) { ctx.strokeStyle = '#f5f0e6'; ctx.lineWidth = 2; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(cx + i * w * 0.16, cy - w * 0.28); ctx.lineTo(cx + i * w * 0.16, cy + w * 0.28); ctx.stroke(); } }
}
function drawSide(ctx, id, cx, cy, r) {
  const c = SIDES[id].color;
  if (id === 'lettuce') { ctx.fillStyle = c; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(cx + Math.cos(i * 1.26) * r * 0.4, cy + Math.sin(i * 1.26) * r * 0.3, r * 0.62, r * 0.34, i, 0, 7); ctx.fill(); } }
  else if (id === 'rice') { ctx.fillStyle = '#d8d2c4'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy - r * 0.2, r * 0.8, 0, 7); ctx.fill(); }
  else { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, r * 0.75, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.22, 0, 7); ctx.fill(); }
}
function drawPlateContents(ctx, plate, cx, cy, scale = 1) {
  ctx.fillStyle = '#ece7db'; ctx.beginPath(); ctx.ellipse(cx, cy, 105 * scale, 68 * scale, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#b9b0a0'; ctx.lineWidth = 3; ctx.stroke();
  if (plate.meat) drawMeat(ctx, cx, cy - 8 * scale, 120 * scale, plate.meat.id, plate.meat.cut, plate.meat.burnt);
  plate.sides.forEach((s, i) => drawSide(ctx, s, cx - 70 * scale + i * 36 * scale, cy + 38 * scale, 17 * scale));
}
export function draw(ctx, st) {
  ctx.clearRect(0, 0, 1280, 800);
  const g = ctx.createLinearGradient(0, 0, 0, 800); g.addColorStop(0, '#241419'); g.addColorStop(1, '#120d10');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 800);
  // neon Seoul night signage
  rr(ctx, 330, 14, 620, 52, 10, '#2c0f16'); ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 3; ctx.strokeRect(333, 17, 614, 46);
  txt(ctx, 'SEOUL TABLE GRILL', 640, 50, 30, '#ff5b74', 'center');
  txt(ctx, '서울 테이블', 1210, 44, 20, '#ffb3c0', 'right');
  txt(ctx, `SHIFT ${Math.max(0, Math.ceil(st.timeLeft))}s`, 40, 48, 26, '#ffd76a');
  txt(ctx, `COINS ${st.coins}`, 990, 92, 22, '#ffd76a'); txt(ctx, `STRIKES ${st.strikes}/3`, 1130, 92, 22, st.strikes ? '#ff7a6a' : '#cfc4bb');
  // order board
  rr(ctx, 20, 76, 310, 520, 12, '#1e2126'); txt(ctx, 'ORDER BOARD', 36, 106, 20, '#9fd8ff');
  st.tickets.forEach((t, i) => {
    const y = 120 + i * 158;
    rr(ctx, 32, y, 286, 146, 10, '#f5efdf');
    txt(ctx, `#${t.id} ${t.recipe.name}`, 44, y + 26, 16, '#33261a');
    recipeNeeds(t.recipe).forEach((n, j) => txt(ctx, '• ' + n, 48, y + 50 + j * 17, 13, '#5a4632', 'left', false));
    const f = Math.max(0, t.patience / t.patienceMax);
    rr(ctx, 44, y + 126, 262, 10, 5, '#d8cfb8'); rr(ctx, 44, y + 126, 262 * f, 10, 5, f > 0.4 ? '#58b368' : '#e0483c');
  });
  if (!st.tickets.length) txt(ctx, 'waiting for guests…', 44, 150, 15, '#8a97a5', 'left', false);
  // table grill
  rr(ctx, 350, 190, 550, 230, 14, '#33302f'); txt(ctx, 'CHARCOAL TABLE GRILL — click meat to flip, click done meat to board', 366, 218, 14, '#ffb59a');
  LAYOUT.grill.forEach((s, i) => {
    rr(ctx, s.x, s.y, s.w, s.h, 12, '#191516');
    ctx.strokeStyle = '#57504d'; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(s.x + 12, s.y + k * 28); ctx.lineTo(s.x + s.w - 12, s.y + k * 28); ctx.stroke(); }
    ctx.fillStyle = '#ff6a2a'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + s.h - 16, 80, 10, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    const slot = st.grillSlots[i];
    if (slot) {
      drawMeat(ctx, s.x + s.w / 2, s.y + 62, 150, slot.id, false, slot.burnt);
      const f = Math.min(1, slot.t / slot.need);
      rr(ctx, s.x + 20, s.y + 118, s.w - 40, 12, 6, '#3d3835'); rr(ctx, s.x + 20, s.y + 118, (s.w - 40) * f, 12, 6, slot.burnt ? '#e0483c' : f >= 1 ? '#58b368' : '#ffb02e');
      txt(ctx, slot.burnt ? 'BURNT — click to clear' : f >= 1 ? 'DONE!' : slot.flipped ? 'FLIPPED · grilling' : 'FLIP ME at half!', s.x + s.w / 2, s.y + 108, 14, '#ffe9d6', 'center');
    } else txt(ctx, 'empty grill slot', s.x + s.w / 2, s.y + 80, 14, '#7d746e', 'center', false);
  });
  // cutting board + scissors, banchan refill station
  rr(ctx, LAYOUT.board.x, LAYOUT.board.y, LAYOUT.board.w, LAYOUT.board.h, 10, '#8a6844');
  txt(ctx, '✂ CUTTING BOARD (C = cut)', LAYOUT.board.x + 12, LAYOUT.board.y + 22, 13, '#ffe9c9');
  if (st.board) { drawMeat(ctx, LAYOUT.board.x + 120, LAYOUT.board.y + 60, 92, st.board.id, st.board.cut, false); txt(ctx, st.board.cut ? 'CUT ✓ — click board to plate it' : 'click board to plate · press C to cut', LAYOUT.board.x + 120, LAYOUT.board.y + 86, 10, '#3a2413', 'center'); }
  rr(ctx, LAYOUT.refill.x, LAYOUT.refill.y, LAYOUT.refill.w, LAYOUT.refill.h, 10, '#24382c');
  txt(ctx, 'BANCHAN REFILL', LAYOUT.refill.x + 120, LAYOUT.refill.y + 24, 14, '#a8e6b0', 'center');
  txt(ctx, `kimchi stock ${'●'.repeat(st.kimchiStock)}${'○'.repeat(3 - st.kimchiStock)}  ${st.refillIn > 0 ? 'refilling ' + st.refillIn.toFixed(0) + 's…' : 'click to refill'}`, LAYOUT.refill.x + 132, LAYOUT.refill.y + 58, 13, '#e6f5e8', 'center', false);
  drawSide(ctx, 'kimchi', LAYOUT.refill.x + 28, LAYOUT.refill.y + 58, 17);
  // wrap plate assembly + pass
  rr(ctx, 925, 190, 335, 250, 12, '#2a2320'); txt(ctx, 'WRAP PLATE — ASSEMBLING', 1092, 218, 16, '#ffd76a', 'center');
  drawPlateContents(ctx, st.plate, 1092, 320, 1);
  txt(ctx, st.plate.meat ? `${MEATS[st.plate.meat.id].name}${st.plate.meat.cut ? ' · cut' : ' · whole'} + ${st.plate.sides.map(s => SIDES[s].name).join(', ') || 'no sides yet'}` : 'plate is empty', 1092, 425, 13, '#e8ded0', 'center', false);
  rr(ctx, LAYOUT.serve.x, LAYOUT.serve.y, LAYOUT.serve.w, LAYOUT.serve.h, 8, '#2e7d46'); txt(ctx, 'SERVE ⏎', LAYOUT.serve.x + 60, LAYOUT.serve.y + 30, 16, '#fff', 'center');
  rr(ctx, LAYOUT.trash.x, LAYOUT.trash.y, LAYOUT.trash.w, LAYOUT.trash.h, 8, '#7d2e2e'); txt(ctx, 'TRASH ⌫', LAYOUT.trash.x + 60, LAYOUT.trash.y + 30, 16, '#fff', 'center');
  rr(ctx, 925, 526, 335, 88, 10, '#3a2f28'); txt(ctx, 'PASS — READY TO SERVE', 1092, 550, 13, '#ffb59a', 'center');
  if (st.readyPlate) { drawPlateContents(ctx, st.readyPlate, 1092, 582, 0.4); }
  // ingredient counter
  rr(ctx, 16, 622, 1248, 140, 12, '#201a17'); txt(ctx, 'INGREDIENT COUNTER — click or keys 1-8', 30, 618 - 6, 1, '#201a17');
  LAYOUT.bins.forEach((b, i) => {
    rr(ctx, b.x, b.y, b.w, b.h, 10, b.kind === 'meat' ? '#3d2422' : '#26331f');
    if (b.kind === 'meat') drawMeat(ctx, b.x + b.w / 2, b.y + 44, 84, b.id, false, false); else drawSide(ctx, b.id, b.x + b.w / 2, b.y + 42, 26);
    txt(ctx, `${i + 1} ${b.kind === 'meat' ? MEATS[b.id].name : SIDES[b.id].name}`, b.x + b.w / 2, b.y + 92, 13, '#f0e6d6', 'center');
    if (b.id === 'kimchi' && st.kimchiStock <= 0) txt(ctx, 'EMPTY — refill!', b.x + b.w / 2, b.y + 64, 12, '#ff8a75', 'center');
  });
  if (st.message) { rr(ctx, 390, 556, 520, 40, 10, 'rgba(0,0,0,.72)'); txt(ctx, st.message, 650, 582, 17, '#ffe9a8', 'center'); }
  if (st.shot === 'cover') { rr(ctx, 340, 96, 600, 74, 12, 'rgba(20,4,8,.88)'); txt(ctx, 'SEOUL TABLE GRILL', 640, 128, 34, '#ff5b74', 'center'); txt(ctx, 'Korean BBQ Night — flip it, cut it, wrap it!', 640, 156, 16, '#ffd76a', 'center'); }
  if (st.over) { rr(ctx, 390, 300, 500, 170, 16, 'rgba(10,6,8,.92)'); txt(ctx, 'SHIFT OVER', 640, 360, 36, '#ff5b74', 'center'); txt(ctx, `Coins earned: ${st.coins}`, 640, 402, 22, '#ffd76a', 'center'); txt(ctx, 'Press R to work another night', 640, 438, 16, '#e8ded0', 'center', false); }
}
