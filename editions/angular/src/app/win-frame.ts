import { AfterViewInit, Component, ElementRef, inject, input } from "@angular/core";
import { startDrag, type Win, type WindowManager } from "../../../core/src";
import { TrustHtmlPipe } from "./shared";
import { MineSweeper } from "./minesweeper";

@Component({
  selector: "app-win",
  imports: [TrustHtmlPipe, MineSweeper],
  template: `
    <div
      class="window"
      [class.active]="active()"
      [class.maximize]="win().maximized"
      [class.small]="win().size === 'small'"
      [class.fit]="win().size === 'fit'"
      role="dialog"
      [attr.aria-label]="win().title"
      [style.display]="win().minimized ? 'none' : 'flex'"
      [style.left.px]="win().x"
      [style.top.px]="win().y"
      [style.z-index]="win().z"
      [style.visibility]="win().placed ? 'visible' : 'hidden'"
      (pointerdown)="wm().focus(win().id)"
    >
      <div class="titlebar" (pointerdown)="dragStart($event)" (dblclick)="wm().toggleMax(win().id)">
        <span class="title">{{ win().title }}</span>
        <div class="titlebar-buttons" (pointerdown)="$event.stopPropagation()">
          <div class="titlebar-button min" title="Minimise" (click)="wm().minimize(win().id)"><i class="fa-solid fa-window-minimize"></i></div>
          @if (win().size !== "fit") {
            <div class="titlebar-button max" title="Maximise" (click)="wm().toggleMax(win().id)"><i class="fa-sharp fa-regular fa-square"></i></div>
          }
          <div class="titlebar-button close" title="Close" (click)="wm().close(win().id)"><i class="fa-solid fa-xmark"></i></div>
        </div>
      </div>
      <div class="content-body">
        @if (win().app === "minesweeper") {
          <div class="content"><app-minesweeper (exit)="wm().close(win().id)" /></div>
        } @else {
          <div class="content" [innerHTML]="win().html | trustHtml"></div>
        }
      </div>
      @if (win().size !== "fit") {
        <div class="footer-buttons"><button class="button ok" (click)="wm().close(win().id)">OK</button></div>
      }
    </div>
  `
})
export class WinFrame implements AfterViewInit {
  readonly win = input.required<Win>();
  readonly active = input(false);
  readonly wm = input.required<WindowManager>();
  private host = inject(ElementRef<HTMLElement>);

  // Dialogs and Minesweeper open centred, once we know how big they are
  ngAfterViewInit(): void {
    const el = this.host.nativeElement.querySelector(".window") as HTMLElement;
    if (!this.win().placed) setTimeout(() => this.wm().place(this.win().id, el.offsetWidth, el.offsetHeight));
  }

  dragStart(e: PointerEvent): void {
    const w = this.win();
    if (!w.maximized) startDrag(e, w.x, w.y, (x, y) => this.wm().move(w.id, x, y));
  }
}
