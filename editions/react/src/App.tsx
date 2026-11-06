import { useEffect, useMemo, useState } from "react";
import { BootSequence, BiosController, WindowManager, EDITIONS, editionHref, playWelcome, Edition } from "../../core/src";
import { useStore } from "./useStore";
import { EDITION, LOGO, SOUND } from "./assets";
import { Post, Prompt, Loading } from "./Boot";
import { Bios } from "./Bios";
import { Desktop } from "./Desktop";
import { Taskbar } from "./Taskbar";

export function App() {
  const boot = useMemo(() => new BootSequence(() => playWelcome(SOUND)), []);
  const bios = useMemo(() => new BiosController(), []);
  const wm = useMemo(() => new WindowManager(EDITION, LOGO), []);
  const { phase } = useStore(boot.state);
  const [rebooting, setRebooting] = useState<string | null>(null);

  useEffect(() => {
    boot.start();
    return () => boot.destroy();
  }, [boot]);

  // Global keys: Del enters setup during boot, Esc skips the boot, the BIOS takes every key while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const p = boot.state.get().phase;
      if (p === "bios") {
        e.preventDefault();
        if (bios.key(e.key) === "exit") boot.exitBios();
        return;
      }
      if (boot.canEnterBios() && (e.key === "Delete" || e.key === "Del")) {
        e.preventDefault();
        bios.reset();
        boot.enterBios();
      } else if (e.key === "Escape") boot.skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [boot, bios]);

  const enterBios = () => {
    if (!boot.canEnterBios()) return;
    bios.reset();
    boot.enterBios();
  };

  const reboot = (ed: Edition) => {
    wm.closeAll();
    setRebooting(ed.name);
    setTimeout(() => (location.href = editionHref(EDITION.key, ed)), 1500);
  };

  return (
    <>
      {phase === "post" && <Post onSetup={enterBios} />}
      {phase === "prompt" && <Prompt boot={boot} />}
      {phase === "loading" && <Loading />}
      {phase === "bios" && <Bios bios={bios} onExit={() => boot.exitBios()} />}
      <Desktop wm={wm} />
      <Taskbar wm={wm} editions={EDITIONS.filter((e) => e.key !== EDITION.key)} onReboot={reboot} />
      {rebooting && (
        <div id="reboot" style={{ display: "block" }}>
          <p>Shutting down Webdows... Rebooting into the {rebooting} Edition.</p>
        </div>
      )}
    </>
  );
}
