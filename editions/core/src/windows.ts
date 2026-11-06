import { Store } from "./store";
import { ABOUT_HTML, aboutWebdowsHtml, curiousHtml, Edition } from "./content";

export interface Win {
  id: string;
  app: string;
  title: string;
  html?: string;
  /** small = fixed-width dialog, fit = sized to content (Minesweeper) */
  size: "normal" | "small" | "fit";
  minimized: boolean;
  maximized: boolean;
  z: number;
  x: number;
  y: number;
  /** false until the UI has measured and centred a small/fit window */
  placed: boolean;
}

export interface WmState {
  windows: Win[];
  active: string | null;
}

/** Window manager: open, focus, minimise, maximise, move and close, plus taskbar behaviour */
export class WindowManager {
  readonly state = new Store<WmState>({ windows: [], active: null });
  private zTop = 100;
  private cascade = 0;

  constructor(private edition: Edition, private logo: string) {}

  private patch(fn: (w: Win[]) => Win[], active?: string | null): void {
    this.state.update((s) => ({ windows: fn(s.windows), active: active === undefined ? s.active : active }));
  }

  open(app: string, custom?: { title: string; html: string }): void {
    const id = app;
    const existing = this.state.get().windows.find((w) => w.id === id);
    if (existing) {
      this.patch((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: false, ...(custom || {}) } : w)));
      this.focus(id);
      return;
    }
    let title = "", html: string | undefined, size: Win["size"] = "normal";
    if (app === "about") { title = "About me"; html = ABOUT_HTML; }
    else if (app === "app") { title = "About Webdows"; html = aboutWebdowsHtml(this.edition, this.logo); size = "small"; }
    else if (app === "minesweeper") { title = "Minesweeper"; size = "fit"; }
    else if (custom) { title = custom.title; html = custom.html; size = "small"; }
    else return;

    const offset = (this.cascade++ % 5) * 28;
    const small = typeof window !== "undefined" && window.innerWidth < 700;
    const win: Win = {
      id, app, title, html, size,
      minimized: false,
      maximized: small && size === "normal",
      z: ++this.zTop,
      x: 40 + offset, y: 20 + offset,
      placed: size === "normal"
    };
    this.patch((ws) => [...ws, win], id);
  }

  curious(name: string): void {
    this.open("curious", { title: "Webdows", html: curiousHtml(name) });
  }

  focus(id: string): void {
    const z = ++this.zTop;
    this.patch((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)), id);
  }

  close(id: string): void {
    const s = this.state.get();
    this.patch((ws) => ws.filter((w) => w.id !== id), s.active === id ? null : s.active);
  }

  minimize(id: string): void {
    const s = this.state.get();
    this.patch((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)), s.active === id ? null : s.active);
  }

  toggleMax(id: string): void {
    this.patch((ws) => ws.map((w) => (w.id === id && w.size === "normal" ? { ...w, maximized: !w.maximized } : w)));
  }

  move(id: string, x: number, y: number): void {
    this.patch((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }

  /** Centre a dialog once the UI knows its size */
  place(id: string, width: number, height: number): void {
    const x = Math.max(0, (window.innerWidth - width) / 2);
    const y = Math.max(0, (window.innerHeight - 40 - height) / 3);
    this.patch((ws) => ws.map((w) => (w.id === id ? { ...w, x, y, placed: true } : w)));
  }

  /** Taskbar button: restore, focus, or minimise */
  taskClick(id: string): void {
    const s = this.state.get();
    const w = s.windows.find((x) => x.id === id);
    if (!w) return;
    if (w.minimized) {
      this.patch((ws) => ws.map((x) => (x.id === id ? { ...x, minimized: false } : x)));
      this.focus(id);
    } else if (s.active === id) this.minimize(id);
    else this.focus(id);
  }

  closeAll(): void {
    this.state.set({ windows: [], active: null });
  }
}
