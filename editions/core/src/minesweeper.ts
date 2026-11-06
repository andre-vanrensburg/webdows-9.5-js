import { Store } from "./store";

export type LevelKey = "beginner" | "intermediate" | "expert";
export const LEVELS: Record<LevelKey, { name: string; rows: number; cols: number; mines: number }> = {
  beginner: { name: "Beginner", rows: 9, cols: 9, mines: 10 },
  intermediate: { name: "Intermediate", rows: 16, cols: 16, mines: 40 },
  expert: { name: "Expert", rows: 16, cols: 30, mines: 99 }
};

export interface Cell {
  mine: boolean;
  n: number;
  open: boolean;
  /** 0 none, 1 flag, 2 question mark */
  mark: 0 | 1 | 2;
  boom?: boolean;
  wrong?: boolean;
}

export type GameState = "ready" | "playing" | "won" | "lost";
export type Face = "smile" | "oh" | "cool" | "dead";

export interface Snapshot {
  level: LevelKey;
  rows: number;
  cols: number;
  cells: Cell[];
  state: GameState;
  minesLeft: number;
  seconds: number;
  face: Face;
  /** set when a win beats the stored best time */
  newBest: number | null;
}

const BEST_KEY = "webdows-mines-best";
const LEVEL_KEY = "webdows-mines-level";

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode or blocked storage: play on without saving */
  }
}

export function bestTimes(): Partial<Record<LevelKey, number>> {
  try {
    return JSON.parse(storageGet(BEST_KEY) || "{}");
  } catch {
    return {};
  }
}

export function led(n: number): string {
  n = Math.max(-99, Math.min(999, n));
  return n < 0 ? "-" + String(-n).padStart(2, "0") : String(n).padStart(3, "0");
}

/** Framework-agnostic Minesweeper. UIs render snapshot() and call open/mark/chord. */
export class MinesweeperGame {
  readonly state: Store<Snapshot>;
  private cells: Cell[] = [];
  private level: LevelKey;
  private game: GameState = "ready";
  private flags = 0;
  private openCount = 0;
  private seconds = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private pressing = false;
  private newBest: number | null = null;

  constructor() {
    const saved = storageGet(LEVEL_KEY) as LevelKey | null;
    this.level = saved && LEVELS[saved] ? saved : "beginner";
    this.state = new Store<Snapshot>(this.snapshot());
    this.newGame();
  }

  private get L() {
    return LEVELS[this.level];
  }

  private face(): Face {
    if (this.game === "won") return "cool";
    if (this.game === "lost") return "dead";
    return this.pressing ? "oh" : "smile";
  }

  private snapshot(): Snapshot {
    return {
      level: this.level,
      rows: LEVELS[this.level].rows,
      cols: LEVELS[this.level].cols,
      cells: this.cells.map((c) => ({ ...c })),
      state: this.game,
      minesLeft: this.game === "won" ? 0 : LEVELS[this.level].mines - this.flags,
      seconds: this.seconds,
      face: this.face(),
      newBest: this.newBest
    };
  }

  private emit(): void {
    this.state.set(this.snapshot());
  }

  newGame(level?: LevelKey): void {
    if (level) {
      this.level = level;
      storageSet(LEVEL_KEY, level);
    }
    this.stopTimer();
    this.game = "ready";
    this.flags = 0;
    this.openCount = 0;
    this.seconds = 0;
    this.newBest = null;
    this.cells = Array.from({ length: this.L.rows * this.L.cols }, () => ({ mine: false, n: 0, open: false, mark: 0 as const }));
    this.emit();
  }

  setPressing(p: boolean): void {
    if (this.pressing === p) return;
    this.pressing = p;
    if (this.game === "ready" || this.game === "playing") this.emit();
  }

  private neighbours(i: number): number[] {
    const { rows, cols } = this.L;
    const r = Math.floor(i / cols), c = i % cols;
    const out: number[] = [];
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(rr * cols + cc);
      }
    return out;
  }

  /** Mines are laid after the first click, so the first click and its neighbours are always safe */
  private layMines(safe: number): void {
    const banned = new Set([safe, ...this.neighbours(safe)]);
    const pool = this.cells.map((_, i) => i).filter((i) => !banned.has(i));
    for (let m = 0; m < this.L.mines && pool.length; m++) {
      const pick = Math.floor(Math.random() * pool.length);
      this.cells[pool[pick]].mine = true;
      pool.splice(pick, 1);
    }
    this.cells.forEach((cell, i) => {
      cell.n = this.neighbours(i).filter((n) => this.cells[n].mine).length;
    });
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.seconds = Math.min(999, this.seconds + 1);
      this.emit();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private reveal(i: number): void {
    const stack = [i];
    while (stack.length) {
      const j = stack.pop() as number;
      const cell = this.cells[j];
      if (cell.open || cell.mark === 1) continue;
      cell.open = true;
      cell.mark = 0;
      this.openCount++;
      if (!cell.mine && cell.n === 0) this.neighbours(j).forEach((n) => !this.cells[n].open && stack.push(n));
    }
  }

  private lose(hit: number): void {
    this.game = "lost";
    this.stopTimer();
    this.cells.forEach((cell) => {
      if (cell.mine && cell.mark !== 1) cell.open = true;
      else if (!cell.mine && cell.mark === 1) cell.wrong = true;
    });
    this.cells[hit].open = true;
    this.cells[hit].boom = true;
  }

  private checkWin(): void {
    if (this.openCount !== this.cells.length - this.L.mines) return;
    this.game = "won";
    this.stopTimer();
    this.cells.forEach((cell) => {
      if (cell.mine) cell.mark = 1;
    });
    const best = bestTimes();
    if (!best[this.level] || this.seconds < (best[this.level] as number)) {
      best[this.level] = this.seconds;
      storageSet(BEST_KEY, JSON.stringify(best));
      this.newBest = this.seconds;
    }
  }

  open(i: number): void {
    if (this.game === "won" || this.game === "lost") return;
    const cell = this.cells[i];
    if (cell.mark === 1) return;
    if (this.game === "ready") {
      this.layMines(i);
      this.game = "playing";
      this.startTimer();
    }
    if (cell.open) return this.chord(i);
    if (cell.mine) this.lose(i);
    else {
      this.reveal(i);
      this.checkWin();
    }
    this.emit();
  }

  /** Clicking a number with the right count of flags around it opens the rest */
  chord(i: number): void {
    const cell = this.cells[i];
    if (this.game !== "playing" || !cell.open || !cell.n) return;
    const around = this.neighbours(i);
    if (around.filter((n) => this.cells[n].mark === 1).length !== cell.n) return;
    for (const n of around) {
      const c = this.cells[n];
      if (!c.open && c.mark !== 1) {
        if (c.mine) {
          this.lose(n);
          return this.emit();
        }
        this.reveal(n);
      }
    }
    this.checkWin();
    this.emit();
  }

  mark(i: number): void {
    if (this.game === "won" || this.game === "lost") return;
    const cell = this.cells[i];
    if (cell.open) return;
    cell.mark = ((cell.mark + 1) % 3) as 0 | 1 | 2;
    if (cell.mark === 1) this.flags++;
    if (cell.mark === 2) this.flags--;
    this.emit();
  }

  clearNewBest(): void {
    this.newBest = null;
    this.emit();
  }

  destroy(): void {
    this.stopTimer();
  }
}

// SVG artwork shared by every edition (original drawings)
export const FACES: Record<Face, string> = {
  smile: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><rect x="6.5" y="6.5" width="2" height="2"/><rect x="11.5" y="6.5" width="2" height="2"/><path d="M6 12.5q4 3.5 8 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
  oh: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><rect x="6.5" y="6" width="2" height="2.5"/><rect x="11.5" y="6" width="2" height="2.5"/><circle cx="10" cy="13.5" r="2" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
  cool: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><path d="M3.5 7h13v1l-1 2.5h-4l-1-2h-1l-1 2h-4l-1-2.5z"/><path d="M6.5 13q3.5 2.5 7 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
  dead: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><path d="M6 6l3 3M9 6l-3 3M11 6l3 3M14 6l-3 3" stroke="#000" stroke-width="1.3"/><path d="M6.5 14.5q3.5-3 7 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>'
};
export const MINE_SVG = '<svg viewBox="0 0 16 16" width="12" height="12"><g stroke="#000" stroke-width="1.5"><path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13"/></g><circle cx="8" cy="8" r="4.5"/><rect x="5.5" y="5.5" width="2" height="2" fill="#fff"/></svg>';
export const FLAG_SVG = '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 2L3 5l5 3z" fill="#f00"/><path d="M8 2v9" stroke="#000" stroke-width="1.5"/><path d="M5 12h6v1.5H4V12z"/></svg>';

/** Class list and inner HTML for one cell, so every edition renders cells identically */
export function cellView(c: Cell): { cls: string; html: string } {
  let cls = "ms-cell", html = "";
  if (c.open) {
    cls += " open";
    if (c.mine) html = MINE_SVG;
    else if (c.n) {
      cls += " n" + c.n;
      html = String(c.n);
    }
  } else if (c.mark === 1) html = FLAG_SVG;
  else if (c.mark === 2) html = "?";
  if (c.boom) cls += " boom";
  if (c.wrong) cls += " wrong";
  return { cls, html };
}

export const HOWTO_HTML =
  "<p><b>How to play</b></p><p>Click a square to open it. Numbers tell you how many mines touch that square. " +
  "Right-click (or long-press) to flag a mine. Click a number once all its mines are flagged to open the rest around it.</p>" +
  "<p>Open every square without a mine to win. The first click is always safe.</p>";
export const ABOUT_MS_HTML =
  "<p><b>Webdows Minesweeper</b></p><p>Written from scratch for Webdows as a tribute to the classic. No mines were harmed.</p>";
export function bestTimesHtml(): string {
  const b = bestTimes();
  return (
    "<p><b>Fastest Mine Sweepers</b></p>" +
    (Object.keys(LEVELS) as LevelKey[])
      .map((k) => "<div class='ms-best'><span>" + LEVELS[k].name + ":</span><span>" + (b[k] ? b[k] + " seconds" : "999 seconds") + "</span></div>")
      .join("")
  );
}
