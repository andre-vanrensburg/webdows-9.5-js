import { Store } from "./store";
import { BIOS_FLAT } from "./content";

export interface BiosState {
  screen: "main" | "standard";
  sel: number;
  dialog: boolean;
}

/** Keyboard and click handling for the read-only CMOS setup. Returns "exit" when setup should close. */
export class BiosController {
  readonly state = new Store<BiosState>({ screen: "main", sel: 0, dialog: false });
  private perCol = 6;

  reset(): void {
    this.state.set({ screen: "main", sel: 0, dialog: false });
  }

  private patch(p: Partial<BiosState>): void {
    this.state.update((s) => ({ ...s, ...p }));
  }

  select(n: number): void {
    const len = BIOS_FLAT.length;
    this.patch({ sel: (n + len) % len });
  }

  run(): "exit" | null {
    const item = BIOS_FLAT[this.state.get().sel];
    if (item.act === "standard") this.patch({ screen: "standard", dialog: false });
    else if (item.act === "exit") return "exit";
    else this.patch({ dialog: true });
    return null;
  }

  key(k: string): "exit" | null {
    const s = this.state.get();
    if (s.dialog) return k === "Escape" ? "exit" : null;
    if (s.screen === "main") {
      if (k === "ArrowDown") this.select(s.sel + 1);
      else if (k === "ArrowUp") this.select(s.sel - 1);
      else if (k === "ArrowLeft" || k === "ArrowRight") this.select((s.sel + this.perCol) % (this.perCol * 2));
      else if (k === "Escape") return "exit";
      else if (k === "Enter") return this.run();
      else if (k === "F10" || k === "F2") this.patch({ dialog: true });
    } else {
      if (k === "Escape") this.patch({ screen: "main" });
      else if (["PageUp", "PageDown", "+", "-", "Enter"].includes(k)) this.patch({ dialog: true });
    }
    return null;
  }

  clickItem(i: number): "exit" | null {
    this.select(i);
    return this.run();
  }

  clickBackground(): "exit" | null {
    if (this.state.get().dialog) return "exit";
    this.patch({ dialog: true });
    return null;
  }
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const two = (n: number) => (n < 10 ? "0" + n : String(n));

export function biosDate(d = new Date()): string {
  return DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
}
export function biosTime(d = new Date()): string {
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map(two).join(" : ");
}
export function taskbarTime(d = new Date()): string {
  const h = d.getHours();
  return (h % 12 === 0 ? 12 : h % 12) + ":" + two(d.getMinutes()) + " " + (h < 12 ? "AM" : "PM");
}
