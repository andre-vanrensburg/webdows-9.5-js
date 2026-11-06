import { Component, HostListener, OnDestroy, input, output, signal } from "@angular/core";
import { taskbarTime, type Edition, type WindowManager, type WmState } from "../../../core/src";
import { StartMenu } from "./start-menu";

@Component({
  selector: "app-taskbar",
  imports: [StartMenu],
  template: `
    <div class="taskbar">
      <div class="start-button button" title="Start" (click)="$event.stopPropagation(); open.set(!open())">Start</div>
      <div class="tasks">
        @for (w of state().windows; track w.id) {
          <div class="task button" [class.pressed]="state().active === w.id && !w.minimized" (click)="wm().taskClick(w.id)">{{ w.title }}</div>
        }
      </div>
      <div class="taskbar-time">
        @for (ed of editions(); track ed.key) {
          <i [class]="ed.icon + ' tray-edition'" [title]="'Reboot in ' + ed.name" (click)="reboot.emit(ed)"></i>
        }
        <p class="taskbar-time-text" [title]="now().toLocaleDateString()">{{ clock(now()) }}</p>
      </div>
    </div>
    @if (open()) {
      <app-start-menu [wm]="wm()" (close)="open.set(false)" />
    }
  `
})
export class TaskBar implements OnDestroy {
  readonly wm = input.required<WindowManager>();
  readonly state = input.required<WmState>();
  readonly editions = input.required<Edition[]>();
  readonly reboot = output<Edition>();
  readonly open = signal(false);
  readonly now = signal(new Date());
  readonly clock = taskbarTime;
  private t = setInterval(() => this.now.set(new Date()), 1000);

  @HostListener("document:click") closeMenu(): void {
    this.open.set(false);
  }

  ngOnDestroy(): void {
    clearInterval(this.t);
  }
}
