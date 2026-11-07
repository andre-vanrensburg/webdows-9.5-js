import { Component, OnDestroy, input, output, signal } from "@angular/core";
import { BIOS_MENU, BIOS_FLAT, HARD_DISKS, biosDate, biosTime, type BiosController, type BiosState } from "../../../core/src";

@Component({
  selector: "app-bios",
  template: `
    <div id="bios" style="display: flex" (click)="act(bios().clickBackground())">
      <div class="bios-head">
        <div>ROM ISA BIOS (WEBDOS94)</div>
        <div>{{ s().screen === "standard" ? "STANDARD CMOS SETUP" : "CMOS SETUP UTILITY" }}</div>
        <div>WEBDOS SOFTWARE, INC.</div>
      </div>

      <div class="bios-screen" [class.on]="s().screen === 'main'">
        <div class="bios-menu">
          @for (col of menu; track $index; let ci = $index) {
            <ul>
              @for (item of col; track item.label; let ri = $index) {
                <li [class.sel]="s().sel === ci * perCol + ri" (click)="$event.stopPropagation(); act(bios().clickItem(ci * perCol + ri))">{{ item.label }}</li>
              }
            </ul>
          }
        </div>
        <div class="bios-keys">Esc : Quit &nbsp;&nbsp;&nbsp; ↑↓→← : Select Item<br />F10 : Save &amp; Exit Setup &nbsp;&nbsp;&nbsp; (Shift)F2 : Change Color</div>
        <div class="bios-hint">{{ flat[s().sel].hint }}</div>
      </div>

      <div class="bios-screen" [class.on]="s().screen === 'standard'">
        <div class="bios-std">
          <div class="bios-std-top">
            <div>Date (mm:dd:yy) : <span class="bios-val">{{ date(now()) }}</span></div>
            <div>Time (hh:mm:ss) : <span class="bios-val">{{ time(now()) }}</span></div>
          </div>
          <table class="bios-table">
            <tbody>
              <tr class="bios-th">@for (h of head; track h) { <td>{{ h }}</td> }</tr>
              @for (row of disks; track row[0]) {
                <tr>@for (v of row; track $index) { <td [class.bios-val]="$index === 1">{{ v }}</td> }</tr>
              }
            </tbody>
          </table>
          <div class="bios-std-bottom">
            <div>
              <div>Drive A : <span class="bios-val">1.44M, 3.5 in.</span></div>
              <div>Drive B : <span class="bios-val">None</span></div>
              <br />
              <div>Video &nbsp;&nbsp;: <span class="bios-val">EGA/VGA</span></div>
              <div>Halt On : <span class="bios-val">All Errors</span></div>
              <div>Curiosity : <span class="bios-val bios-on">Enabled</span></div>
            </div>
            <div class="bios-membox">
              <div>Base Memory: &nbsp;&nbsp;&nbsp;640K</div>
              <div>Extended Memory: 7552K</div>
              <div>Other Memory: &nbsp;&nbsp;384K</div>
              <div class="bios-rule"></div>
              <div>Total Memory: &nbsp;8192K</div>
            </div>
          </div>
        </div>
        <div class="bios-keys">ESC : Quit &nbsp;&nbsp; ↑↓→← : Select Item &nbsp;&nbsp; PU/PD/+/- : Modify<br />F1 : Help &nbsp;&nbsp; (Shift)F2 : Change Color</div>
      </div>

      @if (s().dialog) {
        <div class="bios-dialog" style="display: block">
          <p class="bios-dialog-title">ACCESS DENIED</p>
          <p>You curious mind, you.</p>
          <p>I knew someone would press Del. Nothing in here can be changed, but Curiosity was already enabled, so you're all set.</p>
          <p class="bios-dialog-ok">Press Esc to continue booting</p>
        </div>
      }
    </div>
  `
})
export class BiosSetup implements OnDestroy {
  readonly bios = input.required<BiosController>();
  readonly s = input.required<BiosState>();
  readonly exit = output<void>();
  readonly menu = BIOS_MENU;
  readonly flat = BIOS_FLAT;
  readonly perCol = BIOS_MENU[0].length;
  readonly disks = HARD_DISKS;
  readonly head = ["HARD DISKS", "TYPE", "SIZE", "CYLS", "HEAD", "PRECOMP", "LANDZ", "SECTOR", "MODE"];
  readonly date = biosDate;
  readonly time = biosTime;
  readonly now = signal(new Date());
  private t = setInterval(() => this.now.set(new Date()), 1000);

  act(r: "exit" | null): void {
    if (r === "exit") this.exit.emit();
  }

  ngOnDestroy(): void {
    clearInterval(this.t);
  }
}
