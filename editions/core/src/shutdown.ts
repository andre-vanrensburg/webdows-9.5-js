// Windows 95-style "Shut Down Webdows" flow, shared by every edition (the vanilla site loads a compiled copy).
// It's a short-lived overlay on top of whichever framework is running, so it is plain DOM on purpose.
import type { Edition } from "./content";

export interface ShutdownOptions {
  /** Edition we're leaving (its loading screen is shown while "shutting down") */
  from: Edition;
  /** Edition to restart into; when omitted, the third option is hidden */
  to?: Edition;
  /** Background image for the "shutting down" screen */
  screen: string;
  /** Where "restart in X mode" goes */
  href?: string;
  /** Which option is selected when the dialog opens */
  preselect?: "shutdown" | "restart" | "mode";
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

function el(html: string): HTMLElement {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild as HTMLElement;
}

export function showShutdown(o: ShutdownOptions): void {
  if (document.querySelector(".sd-dither")) return;
  const pre = o.preselect || (o.to ? "mode" : "shutdown");
  const radio = (v: string, label: string) =>
    `<label class="sd-option"><input type="radio" name="sd-choice" value="${v}"${pre === v ? " checked" : ""}> ${label}</label>`;

  const dither = el('<div class="sd-dither"></div>');
  const dialog = el(`
    <div class="window active small sd-dialog" role="dialog" aria-label="Shut Down Webdows" style="display:flex">
      <div class="titlebar">
        <span class="title">Shut Down Webdows</span>
        <div class="titlebar-buttons"><div class="titlebar-button close sd-no" title="Close"><i class="fa-solid fa-xmark"></i></div></div>
      </div>
      <div class="content-body">
        <div class="content sd-body">
          <i class="fa-solid fa-desktop sd-icon"></i>
          <div>
            <p>Are you sure you want to:</p>
            ${radio("shutdown", "<u>S</u>hut down the computer?")}
            ${radio("restart", "<u>R</u>estart the computer?")}
            ${o.to ? radio("mode", "Restart the computer in <u>" + esc(o.to.name) + "</u> mode?") : ""}
          </div>
        </div>
      </div>
      <div class="footer-buttons sd-buttons">
        <button class="button sd-yes">Yes</button>
        <button class="button sd-no">No</button>
        <button class="button" disabled>Help</button>
      </div>
    </div>`);

  document.body.append(dither, dialog);
  (dialog.querySelector(".sd-yes") as HTMLButtonElement).focus();

  const close = () => {
    dither.remove();
    dialog.remove();
    document.removeEventListener("keydown", onKey, true);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopImmediatePropagation();
      close();
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopImmediatePropagation();
      yes();
    }
  };
  document.addEventListener("keydown", onKey, true);

  dialog.querySelectorAll(".sd-no").forEach((b) => b.addEventListener("click", close));
  dialog.querySelector(".sd-yes")!.addEventListener("click", () => yes());

  function yes() {
    const choice = (dialog.querySelector('input[name="sd-choice"]:checked') as HTMLInputElement | null)?.value || "shutdown";
    close();
    run(choice as "shutdown" | "restart" | "mode", o);
  }
}

function run(choice: "shutdown" | "restart" | "mode", o: ShutdownOptions): void {
  // Stop whatever is playing underneath (timers keep running harmlessly behind the overlay)
  const shutting = el(`
    <div class="sd-screen sd-shutting" style="background-image:url('${o.screen}')">
      <p>Please wait while your computer shuts down.</p>
    </div>`);
  document.body.append(shutting);

  setTimeout(() => {
    const black = el(`<div class="sd-screen sd-black"></div>`);
    document.body.append(black);
    shutting.remove();

    // Restart: a moment of black screen, then the machine POSTs again
    if (choice === "restart") {
      setTimeout(() => location.reload(), 800);
      return;
    }

    if (choice === "shutdown") {
      black.classList.add("sd-safe");
      black.innerHTML = "<p>It's now safe to turn off<br>your computer.</p><small>Click anywhere to switch it back on.</small>";
      black.addEventListener("click", () => location.reload());
      return;
    }

    // Restart in <framework> mode: a DOS-style handover, like "Restart in MS-DOS mode"
    const name = o.to ? o.to.name : "";
    const lines = [
      "Webdows is restarting...",
      "",
      "Loading the " + name + " Edition of Webdows 9.5",
      "Starting Webdows 9.5 in " + name + " mode..."
    ];
    black.innerHTML = '<pre class="sd-dos"></pre>';
    const pre = black.querySelector("pre") as HTMLPreElement;
    let i = 0;
    const next = () => {
      if (i < lines.length) {
        pre.textContent += lines[i++] + "\n";
        setTimeout(next, 450);
      } else {
        pre.textContent += "\nC:\\>_";
        setTimeout(() => o.href && (location.href = o.href), 700);
      }
    };
    next();
  }, 2200);
}
