import { Component, HostListener, OnDestroy, effect, output, signal } from "@angular/core";
import { MinesweeperGame, LEVELS, FACES, cellView, led, HOWTO_HTML, ABOUT_MS_HTML, bestTimesHtml, type LevelKey } from "../../../core/src";
import { TrustHtmlPipe, fromStore } from "./shared";

@Component({
  selector: "app-minesweeper",
  imports: [TrustHtmlPipe],
  template: `
    <div class="ms">
      <div class="ms-menubar">
        <div class="ms-menu" [class.open]="menu() === 'game'">
          <span class="ms-menu-title" (click)="toggle($event, 'game')"><u>G</u>ame</span>
          <div class="ms-dropdown">
            <div (click)="cmd('new')">New<span>F2</span></div>
            <hr />
            @for (k of levels; track k) {
              <div class="ms-level" [class.on]="s().level === k" (click)="cmd(k)"><b>&#10003;</b>{{ levelInfo[k].name }}</div>
            }
            <hr />
            <div (click)="cmd('best')">Best Times...</div>
            <hr />
            <div (click)="cmd('exit')">Exit</div>
          </div>
        </div>
        <div class="ms-menu" [class.open]="menu() === 'help'">
          <span class="ms-menu-title" (click)="toggle($event, 'help')"><u>H</u>elp</span>
          <div class="ms-dropdown">
            <div (click)="cmd('howto')">How to Play</div>
            <hr />
            <div (click)="cmd('about')">About Minesweeper...</div>
          </div>
        </div>
      </div>

      <div class="ms-body">
        <div class="ms-top">
          <div class="ms-led">{{ led(s().minesLeft) }}</div>
          <button class="ms-face" aria-label="New game" (click)="game.newGame()" [innerHTML]="faces[s().face] | trustHtml"></button>
          <div class="ms-led">{{ led(s().seconds) }}</div>
        </div>
        <div
          class="ms-grid"
          role="grid"
          [style.grid-template-columns]="'repeat(' + s().cols + ', 16px)'"
          (contextmenu)="$event.preventDefault()"
          (mousedown)="onDown($event)"
          (click)="onClick($event)"
          (touchstart)="onTouchStart($event)"
          (touchend)="cancelPress()"
          (touchmove)="cancelPress()"
        >
          @for (c of s().cells; track $index) {
            @let v = view(c);
            <div [attr.data-i]="$index" [class]="v.cls" [innerHTML]="v.html | trustHtml"></div>
          }
        </div>
      </div>

      @if (note()) {
        <div class="ms-note" style="display: block">
          <div [innerHTML]="note() | trustHtml"></div>
          <div class="ms-note-btn"><button class="button" (click)="note.set(null)">OK</button></div>
        </div>
      }
    </div>
  `
})
export class MineSweeper implements OnDestroy {
  readonly exit = output<void>();
  readonly game = new MinesweeperGame();
  readonly s = fromStore(this.game.state);
  readonly menu = signal<"game" | "help" | null>(null);
  readonly note = signal<string | null>(null);
  readonly levels = Object.keys(LEVELS) as LevelKey[];
  readonly levelInfo = LEVELS;
  readonly faces = FACES;
  readonly led = led;
  readonly view = cellView;
  private mountedAt = Date.now();
  private pressTimer?: ReturnType<typeof setTimeout>;
  private longPressed = false;

  constructor() {
    effect(() => {
      const snap = this.s();
      if (snap.newBest === null) return;
      this.note.set(`<p>You have the fastest time for ${LEVELS[snap.level].name.toLowerCase()} level: <b>${snap.newBest} seconds</b>.</p>`);
      queueMicrotask(() => this.game.clearNewBest());
    });
  }

  @HostListener("document:mouseup") up(): void {
    this.game.setPressing(false);
  }
  @HostListener("document:click") closeMenu(): void {
    this.menu.set(null);
  }
  @HostListener("document:keydown", ["$event"]) f2(e: KeyboardEvent): void {
    if (e.key === "F2") {
      e.preventDefault();
      this.game.newGame();
    }
  }

  // Ignore stray clicks left over from the double-click that opened the window
  private tooSoon = () => Date.now() - this.mountedAt < 400;
  private cellIndex(t: EventTarget | null): number {
    const el = (t as HTMLElement | null)?.closest(".ms-cell") as HTMLElement | null;
    return el ? Number(el.dataset["i"]) : -1;
  }
  private over = () => this.s().state === "won" || this.s().state === "lost";

  onDown(e: MouseEvent): void {
    const i = this.cellIndex(e.target);
    if (i < 0 || this.tooSoon() || this.over()) return;
    if (e.button === 0) this.game.setPressing(true);
    if (e.button === 2) this.game.mark(i);
    if (e.button === 1) {
      e.preventDefault();
      this.game.chord(i);
    }
  }
  onClick(e: MouseEvent): void {
    if (this.longPressed) {
      this.longPressed = false;
      return;
    }
    const i = this.cellIndex(e.target);
    if (i >= 0 && !this.tooSoon()) this.game.open(i);
  }
  onTouchStart(e: TouchEvent): void {
    const i = this.cellIndex(e.target);
    if (i < 0) return;
    this.longPressed = false;
    this.pressTimer = setTimeout(() => {
      this.longPressed = true;
      this.game.mark(i);
      navigator.vibrate?.(30);
    }, 400);
  }
  cancelPress(): void {
    clearTimeout(this.pressTimer);
  }

  toggle(e: MouseEvent, id: "game" | "help"): void {
    e.stopPropagation();
    this.menu.set(this.menu() === id ? null : id);
  }
  cmd(c: string): void {
    this.menu.set(null);
    if (c === "new") this.game.newGame();
    else if (c in LEVELS) this.game.newGame(c as LevelKey);
    else if (c === "best") this.note.set(bestTimesHtml());
    else if (c === "howto") this.note.set(HOWTO_HTML);
    else if (c === "about") this.note.set(ABOUT_MS_HTML);
    else if (c === "exit") this.exit.emit();
  }

  ngOnDestroy(): void {
    this.game.destroy();
  }
}
