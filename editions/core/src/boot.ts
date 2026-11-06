import { Store } from "./store";

export type Phase = "post" | "prompt" | "loading" | "bios" | "desktop";

export interface BootState {
  phase: Phase;
  typed: string;
}

/** Drives POST → WebDos prompt → loading → desktop, with Del for the BIOS and Esc to skip */
export class BootSequence {
  readonly state = new Store<BootState>({ phase: "post", typed: "" });
  private timers: ReturnType<typeof setTimeout>[] = [];
  private onDesktop: () => void;

  constructor(onDesktop: () => void = () => {}) {
    this.onDesktop = onDesktop;
  }

  start(): void {
    this.run(4000);
  }

  private clear(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private at(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private set(patch: Partial<BootState>): void {
    this.state.update((s) => ({ ...s, ...patch }));
  }

  /** From the end of POST: prompt, auto-type "start", loading, desktop */
  private run(postMs: number): void {
    this.at(postMs, () => {
      this.set({ phase: "prompt", typed: "" });
      this.typeStart(0);
    });
    this.at(postMs + 3000, () => this.set({ phase: "loading" }));
    this.at(postMs + 6000, () => this.finish());
  }

  private typeStart(i: number): void {
    const word = "start";
    if (i > word.length) return;
    this.set({ typed: word.slice(0, i) });
    this.at(150, () => this.typeStart(i + 1));
  }

  finish(): void {
    if (this.state.get().phase === "desktop") return;
    this.clear();
    this.set({ phase: "desktop" });
    this.onDesktop();
  }

  /** Esc skips the boot (not while in the BIOS) */
  skip(): void {
    const p = this.state.get().phase;
    if (p === "post" || p === "prompt" || p === "loading") this.finish();
  }

  canEnterBios(): boolean {
    const p = this.state.get().phase;
    return p === "post" || p === "prompt";
  }

  enterBios(): void {
    if (!this.canEnterBios()) return;
    this.clear();
    this.set({ phase: "bios" });
  }

  exitBios(): void {
    this.clear();
    this.run(0);
  }

  /** Visitor typed into the prompt themselves */
  submit(value: string): void {
    if (value.trim().toLowerCase() !== "start") return;
    this.clear();
    this.set({ phase: "loading" });
    this.at(3000, () => this.finish());
  }

  setTyped(value: string): void {
    this.set({ typed: value });
  }

  destroy(): void {
    this.clear();
  }
}
