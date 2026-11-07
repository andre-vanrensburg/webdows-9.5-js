"use strict";
var WebdowsShutdown = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // core/src/shutdown.ts
  var shutdown_exports = {};
  __export(shutdown_exports, {
    showShutdown: () => showShutdown
  });
  var esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function showShutdown(o) {
    if (document.querySelector(".sd-dither")) return;
    const pre = o.preselect || (o.to ? "mode" : "shutdown");
    const radio = (v, label) => `<label class="sd-option"><input type="radio" name="sd-choice" value="${v}"${pre === v ? " checked" : ""}> ${label}</label>`;
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
    dialog.querySelector(".sd-yes").focus();
    const close = () => {
      dither.remove();
      dialog.remove();
      document.removeEventListener("keydown", onKey, true);
    };
    const onKey = (e) => {
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
    dialog.querySelector(".sd-yes").addEventListener("click", () => yes());
    function yes() {
      var _a;
      const choice = ((_a = dialog.querySelector('input[name="sd-choice"]:checked')) == null ? void 0 : _a.value) || "shutdown";
      close();
      run(choice, o);
    }
  }
  function run(choice, o) {
    const shutting = el(`
    <div class="sd-screen sd-shutting" style="background-image:url('${o.screen}')">
      <p>Please wait while your computer shuts down.</p>
    </div>`);
    document.body.append(shutting);
    setTimeout(() => {
      if (choice === "restart") {
        location.reload();
        return;
      }
      const black = el(`<div class="sd-screen sd-black"></div>`);
      document.body.append(black);
      shutting.remove();
      if (choice === "shutdown") {
        black.classList.add("sd-safe");
        black.innerHTML = "<p>It's now safe to turn off<br>your computer.</p><small>Click anywhere to switch it back on.</small>";
        black.addEventListener("click", () => location.reload());
        return;
      }
      const name = o.to ? o.to.name : "";
      const lines = [
        "Webdows is restarting...",
        "",
        "Loading the " + name + " Edition of Webdows 9.5",
        "Starting Webdows 9.5 in " + name + " mode..."
      ];
      black.innerHTML = '<pre class="sd-dos"></pre>';
      const pre = black.querySelector("pre");
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
  return __toCommonJS(shutdown_exports);
})();
