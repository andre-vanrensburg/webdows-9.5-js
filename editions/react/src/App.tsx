import { useEffect, useMemo } from "react";
import { BootSequence, BiosController, WindowManager, EDITIONS, editionHref, playWelcome, showShutdown, Edition } from "../../core/src";
import { useStore } from "./useStore";
import { EDITION, IMG, LOGO, SOUND } from "./assets";
import { Post, Prompt, Loading } from "./Boot";
import { Bios } from "./Bios";
import { Desktop } from "./Desktop";
import { Taskbar } from "./Taskbar";

export function App() {
  const boot = useMemo(() => new BootSequence(() => playWelcome(SOUND)), []);
  const bios = useMemo(() => new BiosController(), []);
  const wm = useMemo(() => new WindowManager(EDITION, LOGO), []);
  const { phase } = useStore(boot.state);

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

  // Windows 95-style Shut Down dialog, shared by every edition
  const reboot = (ed: Edition) =>
    showShutdown({ from: EDITION, to: ed, screen: IMG + "loading-react.jpg", href: editionHref(EDITION.key, ed) });

  return (
    <>
      {phase === "post" && <Post onSetup={enterBios} />}
      {phase === "prompt" && <Prompt boot={boot} />}
      {phase === "loading" && <Loading />}
      {phase === "bios" && <Bios bios={bios} onExit={() => boot.exitBios()} />}
      <Desktop wm={wm} />
      <Taskbar wm={wm} editions={EDITIONS.filter((e) => e.key !== EDITION.key)} onReboot={reboot} />
    </>
  );
}
