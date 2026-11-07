import { Component, input, signal } from "@angular/core";
import { DESKTOP_ICONS, startDrag, type WindowManager, type WmState } from "../../../core/src";
import { IMG } from "./shared";
import { WinFrame } from "./win-frame";

@Component({
  selector: "app-desktop",
  imports: [WinFrame],
  template: `
    @for (icon of icons; track icon.app) {
      <div
        class="icon-content"
        [title]="icon.label"
        tabindex="0"
        [style.top.px]="pos()[icon.app].y"
        [style.left.px]="pos()[icon.app].x"
        (dblclick)="wm().open(icon.app)"
        (click)="coarse && wm().open(icon.app)"
        (keydown.enter)="wm().open(icon.app)"
      >
        <img [src]="img + icon.img" width="50" height="50" alt="" draggable="false" (pointerdown)="drag($event, icon.app)" />
        <a>{{ icon.label }}</a>
      </div>
    }
    @for (w of state().windows; track w.id) {
      <app-win [win]="w" [active]="state().active === w.id" [wm]="wm()" />
    }
  `
})
export class Desktop {
  readonly wm = input.required<WindowManager>();
  readonly state = input.required<WmState>();
  readonly icons = DESKTOP_ICONS;
  readonly img = IMG;
  readonly coarse = window.matchMedia("(pointer: coarse)").matches;
  readonly pos = signal<Record<string, { x: number; y: number }>>(Object.fromEntries(DESKTOP_ICONS.map((i) => [i.app, { x: 0, y: i.top }])));

  drag(e: PointerEvent, app: string): void {
    const p = this.pos()[app];
    startDrag(e, p.x, p.y, (x, y) => this.pos.update((all) => ({ ...all, [app]: { x, y } })));
  }
}
