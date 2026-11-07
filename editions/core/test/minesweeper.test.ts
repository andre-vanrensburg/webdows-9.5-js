import { MinesweeperGame, LEVELS } from "../src/minesweeper";
let fails = 0;
const ok = (c: boolean, m: string) => { if (!c) { fails++; console.log("FAIL", m); } };
// first click never loses, on every level
for (const lvl of ["beginner", "intermediate", "expert"] as const) {
  for (let t = 0; t < 300; t++) {
    const g = new MinesweeperGame(); g.newGame(lvl);
    const s0 = g.state.get(); const i = Math.floor(Math.random() * s0.cells.length);
    g.open(i);
    const s = g.state.get();
    ok(s.state === "playing" || s.state === "won", lvl + " first click lost");
    ok(s.cells.filter(c => c.mine).length === LEVELS[lvl].mines, lvl + " mine count");
    g.destroy();
  }
}
// full solve: open every safe cell -> win
const g = new MinesweeperGame(); g.newGame("beginner"); g.open(40);
g.state.get().cells.forEach((c, i) => { if (!c.mine) g.open(i); });
ok(g.state.get().state === "won", "win when all safe opened");
ok(g.state.get().face === "cool", "cool face on win");
g.destroy();
// hitting a mine loses
const h = new MinesweeperGame(); h.newGame("beginner"); h.open(0);
const mi = h.state.get().cells.findIndex(c => c.mine); h.open(mi);
ok(h.state.get().state === "lost" && h.state.get().cells[mi].boom === true, "lose on mine");
h.destroy();
// flags cycle and counter
const f = new MinesweeperGame(); f.newGame("beginner");
f.mark(5); ok(f.state.get().minesLeft === 9, "flag decrements"); f.mark(5); ok(f.state.get().minesLeft === 10 && f.state.get().cells[5].mark === 2, "? mark"); f.mark(5); ok(f.state.get().cells[5].mark === 0, "clear");
f.destroy();
console.log(fails ? fails + " failures" : "all minesweeper tests passed");
