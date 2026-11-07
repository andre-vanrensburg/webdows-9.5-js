import { useEffect, useState } from "react";
import { taskbarTime, type Edition, type WindowManager } from "../../core/src";
import { useStore } from "./useStore";
import { StartMenu } from "./StartMenu";

export function Taskbar({ wm, editions, onReboot }: { wm: WindowManager; editions: Edition[]; onReboot: (e: Edition) => void }) {
  const { windows, active } = useStore(wm.state);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => {
      clearInterval(t);
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <>
      <div className="taskbar">
        <div
          className="start-button button"
          title="Start"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          Start
        </div>
        <div className="tasks">
          {windows.map((w) => (
            <div key={w.id} className={"task button" + (active === w.id && !w.minimized ? " pressed" : "")} onClick={() => wm.taskClick(w.id)}>
              {w.title}
            </div>
          ))}
        </div>
        <div className="taskbar-time">
          {editions.map((ed) => (
            <i key={ed.key} className={ed.icon + " tray-edition"} title={"Reboot in " + ed.name} onClick={() => onReboot(ed)} />
          ))}
          <p className="taskbar-time-text" title={now.toLocaleDateString()}>{taskbarTime(now)}</p>
        </div>
      </div>
      {open && <StartMenu wm={wm} onClose={() => setOpen(false)} />}
    </>
  );
}
