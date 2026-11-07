import { Component, input, output, signal } from "@angular/core";
import { START_MENU, splitLabel, showShutdown, type MenuItem, type WindowManager } from "../../../core/src";
import { EDITION, IMG, LOGO, SCREEN } from "./shared";

/** One Start menu row. The host element is the <li> itself, so the Win95 menu CSS applies unchanged. */
@Component({
  selector: "li[app-menu-row]",
  host: {
    class: "start-menu-items-item",
    "[class.has-sub]": "!!item().children",
    "[class.sub-item]": "inSub()",
    "[class.sub-open]": "openSub() === item().label",
    "(click)": "$event.stopPropagation(); choose.emit(item())"
  },
  template: `
    <div class="icon">
      @if (item().icon.fa) { <i [class]="'fa-solid ' + item().icon.fa"></i> }
      @else { <img [src]="img + item().icon.img" alt="" width="100%" height="auto" /> }
    </div>
    <p>{{ parts()[0] }}@if (parts()[1]) {<span class="underline">{{ parts()[1] }}</span>}{{ parts()[2] }}</p>
    @if (item().children; as kids) {
      <span class="arrow">&#9654;</span>
      <ul class="submenu">
        @for (c of kids; track c.label) {
          <li app-menu-row [item]="c" [openSub]="openSub()" [inSub]="true" (choose)="choose.emit($event)"></li>
        }
      </ul>
    }
  `
})
export class MenuRow {
  readonly item = input.required<MenuItem>();
  readonly openSub = input<string | null>(null);
  readonly inSub = input(false);
  readonly choose = output<MenuItem>();
  readonly img = IMG;
  parts = () => splitLabel(this.item());
}

@Component({
  selector: "app-start-menu",
  imports: [MenuRow],
  template: `
    <div class="start-menu" style="display: grid" (click)="$event.stopPropagation()">
      <div class="start-menu-side">
        <div class="start-menu-side-text text">
          <p class="ninefive">9.5</p>
          <p class="windows">Webdows</p>
          <img [src]="logo" alt="" width="100%" height="auto" />
        </div>
      </div>
      <div class="start-menu-items">
        @for (group of menu; track $index; let last = $last) {
          <ul [class]="last ? 'start-menu-items-list2' : 'start-menu-items-list1'">
            @for (item of group; track item.label) {
              <li app-menu-row [item]="item" [openSub]="sub()" (choose)="pick($event)"></li>
            }
          </ul>
        }
      </div>
    </div>
  `
})
export class StartMenu {
  readonly wm = input.required<WindowManager>();
  readonly close = output<void>();
  readonly menu = START_MENU;
  readonly logo = LOGO;
  readonly sub = signal<string | null>(null);

  pick(item: MenuItem): void {
    if (item.children) {
      // Touch screens can't hover, so a tap toggles the flyout
      this.sub.set(this.sub() === item.label ? null : item.label);
      return;
    }
    this.close.emit();
    if (item.shutdown) return showShutdown({ from: EDITION, screen: SCREEN, preselect: "shutdown" });
    if (item.app) this.wm().open(item.app);
    else if (item.curious) this.wm().curious(item.label);
  }
}
