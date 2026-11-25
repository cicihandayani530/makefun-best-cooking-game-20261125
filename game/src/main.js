// main.js — Seoul Table Grill game loop: take a ticket, grill the meat
// (flip it halfway!), scissor-cut it on the board, wrap it in lettuce
// with rice and ssamjang on the plate, serve before patience runs out.
// Kimchi is a banchan: the bowl empties and must be refilled mid-shift.
import { OrderBoard, makeRng } from './orders.js';
import { Grill, judgePlate } from './stations.js';
import { RECIPES } from './recipes.js';
import { draw } from './render.js';
import { bindInput } from './input.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || 7);

function freshState() {
  return {
    board: new OrderBoard(makeRng(seed * 977 + 13)),
    grill: new Grill(),
    plate: { meat: null, sides: [] },
    coins: 0, strikes: 0, timeLeft: 180, elapsed: 0,
    kimchiStock: 3, refillIn: 0, message: '', messageT: 0,
    readyPlate: null, over: false, shot,
  };
}
let st = freshState();
function say(m) { st.message = m; st.messageT = 2.8; }
function viewState() {
  return {
    tickets: st.board.tickets, grillSlots: st.grill.slots, board: st.grill.board,
    plate: st.plate, readyPlate: st.readyPlate, coins: st.coins, strikes: st.strikes,
    timeLeft: st.timeLeft, kimchiStock: st.kimchiStock, refillIn: st.refillIn,
    message: st.message, over: st.over, shot,
  };
}
const acts = {
  pickBin(b) {
    if (st.over) return;
    if (b.kind === 'meat') { if (st.grill.place(b.id)) say(b.id + ' on the grill — flip it halfway!'); else say('Both grill slots are busy!'); return; }
    if (st.plate.sides.includes(b.id)) return say('Already on the plate.');
    if (b.id === 'kimchi' && st.kimchiStock <= 0) return say('Kimchi bowl empty — hit BANCHAN REFILL!');
    if (b.id === 'kimchi') st.kimchiStock--;
    st.plate.sides.push(b.id);
  },
  grillSlot(i) {
    const s = st.grill.slots[i]; if (!s) return;
    if (s.burnt) { st.grill.discard(i); say('Burnt meat binned.'); return; }
    if (st.grill.stateOf(s) === 'done') { if (st.grill.take(i)) say('To the cutting board — C for scissors.'); else say('Board is busy!'); return; }
    st.grill.flip(i); say('Flipped!');
  },
  board() { if (st.grill.boardToPlate(st.plate)) say('Meat on the plate. Add the wrap sides!'); },
  cut() { if (st.grill.cutBoard()) say('Snip snip — meat cut into bite pieces.'); },
  refill() { if (st.kimchiStock < 3 && st.refillIn <= 0) { st.refillIn = 2; say('Refilling the kimchi banchan…'); } },
  serve() {
    if (st.over || !st.plate.meat) return;
    const verdict = judgePlate(st.board, st.plate);
    if (!verdict) { say('No ticket matches this plate yet.'); return; }
    st.board.tickets.splice(st.board.tickets.indexOf(verdict.ticket), 1);
    st.coins += verdict.coins; st.readyPlate = { ...st.plate, sides: [...st.plate.sides] };
    st.plate = { meat: null, sides: [] };
    say(`Served ${verdict.ticket.recipe.name}! +${verdict.coins} coins` + (verdict.tip ? ` (tip ${verdict.tip})` : ''));
  },
  trash() { st.plate = { meat: null, sides: [] }; say('Plate cleared.'); },
  restart() { if (st.over) st = freshState(); },
};
bindInput(canvas, acts);

function buildShotScene() {
  // Frozen, fully staged scenes for the judges: tickets on the board, a
  // piece grilling (already flipped), a wrap half-assembled on the plate,
  // a finished plate waiting on the pass, shift clock and patience bars.
  st.board.tickets = [
    { id: 1, recipe: RECIPES[0], patience: shot === 'rush' ? 7 : 44, patienceMax: RECIPES[0].patience },
    { id: 2, recipe: RECIPES[1], patience: 52, patienceMax: RECIPES[1].patience },
    { id: 3, recipe: RECIPES[2], patience: 38, patienceMax: RECIPES[2].patience },
  ];
  st.grill.slots[0] = { id: 'pork', t: 6.5, need: 9, flipped: true, burnt: false };
  st.grill.slots[1] = { id: 'beef', t: 3, need: 8, flipped: false, burnt: false };
  st.grill.board = { id: 'chicken', cut: true, burnt: false };
  st.plate = { meat: { id: 'pork', cut: true, burnt: false }, sides: ['lettuce', 'rice'] };
  st.readyPlate = { meat: { id: 'beef', cut: true, burnt: false }, sides: ['lettuce', 'rice', 'ssamjang', 'garlic'] };
  st.timeLeft = shot === 'rush' ? 74 : 132; st.coins = shot === 'serve' ? 86 : 42;
  st.strikes = shot === 'rush' ? 1 : 0; st.kimchiStock = shot === 'rush' ? 0 : 2;
  st.message = shot === 'serve' ? 'Served Bulgogi Night Wrap! +27 coins' : shot === 'rush' ? 'Rush hour — ticket #1 is almost out of patience!' : '';
  draw(ctx, viewState());
}
if (shot) { buildShotScene(); }
else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!st.over) {
      st.elapsed += dt; st.timeLeft -= dt;
      st.grill.update(dt);
      if (st.refillIn > 0) { st.refillIn -= dt; if (st.refillIn <= 0) { st.kimchiStock = 3; say('Kimchi banchan refilled!'); } }
      st.board.update(dt, st.elapsed, () => { st.strikes++; say('A guest left hungry — strike!'); });
      if (st.messageT > 0) { st.messageT -= dt; if (st.messageT <= 0) st.message = ''; }
      if (st.timeLeft <= 0 || st.strikes >= 3) st.over = true;
    }
    draw(ctx, viewState());
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
