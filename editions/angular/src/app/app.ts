import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { BootSequence, BiosController, WindowManager, EDITIONS, editionHref, playWelcome, showShutdown, type Edition } from "../../../core/src";
import { EDITION, IMG, LOGO, SOUND, fromStore } from "./shared";
import { PostScreen, PromptScreen } from "./boot";
import { BiosSetup } from "./bios";
import { Desktop } from "./desktop";
import { TaskBar } from "./taskbar";

@Component({
  selector: "app-root",
  imports: [PostScreen, PromptScreen, BiosSetup, Desktop, TaskBar],
  template: `
    @switch (boot$().phase) {
      @case ("post") { <app-post (setup)="enterBios()" /> }
      @case ("prompt") { <app-prompt [boot]="boot" [typed]="boot$().typed" /> }
      @case ("loading") { <div id="loading" [style.background-image]="loadingImg"></div> }
      @case ("bios") { <app-bios [bios]="bios" [s]="bios$()" (exit)="boot.exitBios()" /> }
    }
    <app-desktop [wm]="wm" [state]="wm$()" />
    <app-taskbar [wm]="wm" [state]="wm$()" [editions]="others" (reboot)="reboot($event)" />
  `
})
export class App implements OnInit, OnDestroy {
  readonly boot = new BootSequence(() => playWelcome(SOUND));
  readonly bios = new BiosController();
  readonly wm = new WindowManager(EDITION, LOGO);
  readonly boot$ = fromStore(this.boot.state);
  readonly bios$ = fromStore(this.bios.state);
  readonly wm$ = fromStore(this.wm.state);
  readonly others = EDITIONS.filter((e) => e.key !== EDITION.key);
  readonly loadingImg = `url(${IMG}loading-angular.jpg)`;

  ngOnInit(): void {
    this.boot.start();
  }

  ngOnDestroy(): void {
    this.boot.destroy();
  }

  // Global keys: Del enters setup during boot, Esc skips the boot, the BIOS takes every key while open
  @HostListener("window:keydown", ["$event"])
  onKey(e: KeyboardEvent): void {
    if (this.boot.state.get().phase === "bios") {
      e.preventDefault();
      if (this.bios.key(e.key) === "exit") this.boot.exitBios();
      return;
    }
    if (this.boot.canEnterBios() && (e.key === "Delete" || e.key === "Del")) {
      e.preventDefault();
      this.enterBios();
    } else if (e.key === "Escape") this.boot.skip();
  }

  enterBios(): void {
    if (!this.boot.canEnterBios()) return;
    this.bios.reset();
    this.boot.enterBios();
  }

  // Windows 95-style Shut Down dialog, shared by every edition
  reboot(ed: Edition): void {
    showShutdown({ from: EDITION, to: ed, screen: `${IMG}loading-angular.jpg`, href: editionHref(EDITION.key, ed) });
  }
}
