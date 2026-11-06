import { AfterViewInit, Component, ElementRef, input, output, viewChild } from "@angular/core";
import type { BootSequence } from "../../../core/src";
import { IMG, YEAR } from "./shared";

@Component({
  selector: "app-post",
  template: `
    <div id="boot">
      <div>
        <p>System Configuration (c) 1998 - {{ year }} WebDos (Web Disk Operating System [Version 19.87]), <br />Andre van Rensburg. All rights reserved.</p>
        <br />
        <p>
          Intel 486DX2 CPU at 66MHz<br />
          Memory Test : 8192K OK<br />
          Detecting IDE Primary Master : Local Storage<br />
          Detecting IDE Primary Slave : None<br />
          Detecting IDE Secondary Master : None<br />
          Detecting IDE Secondary Slave : None
        </p>
      </div>
      <div><img [src]="img + 'es.png'" alt="" /></div>
      <div class="footer" (click)="setup.emit()">
        <p>Press Del to enter setup. Press Esc to skip boot.<br />15/04/87-dsakd32r.43834ksa.134931</p>
      </div>
    </div>
  `
})
export class PostScreen {
  readonly setup = output<void>();
  readonly img = IMG;
  readonly year = YEAR;
}

@Component({
  selector: "app-prompt",
  template: `
    <div id="prompt">
      <table class="table">
        <tbody>
          <tr><th colspan="2">System Configuration (c) 1998 - {{ year }} WebDos (Web disk Operating System [Version 19.87]), Andre van Rensburg. All rights reserved.</th></tr>
          <tr><td>Main Processor: 80486DX2-66</td><td>Base Memory Size: 640KB</td></tr>
          <tr><td>Numeric Processor: Built-in</td><td>Extended Memory Size: 7552KB</td></tr>
          <tr><td>Cache Size: 256KB</td><td>Hard Disk Type: Local Storage</td></tr>
          <tr><td>BIOS Date: 15/04/87</td><td>Display Type: VGA</td></tr>
        </tbody>
      </table>
      <div>
        <p>Type "start" and hit enter to start Webdows 9.5</p>
        <p>
          WebDos:\\&gt;<input
            #key
            id="key"
            type="text"
            autocomplete="off"
            spellcheck="false"
            aria-label="WebDos prompt"
            [value]="typed()"
            (input)="boot().setTyped(key.value)"
            (keydown.enter)="boot().submit(key.value)"
          />
        </p>
      </div>
    </div>
  `
})
export class PromptScreen implements AfterViewInit {
  readonly boot = input.required<BootSequence>();
  readonly typed = input.required<string>();
  readonly year = YEAR;
  private keyEl = viewChild<ElementRef<HTMLInputElement>>("key");

  ngAfterViewInit(): void {
    this.keyEl()?.nativeElement.focus();
  }
}
