import { useState } from "react";
import { DESKTOP_ICONS, startDrag, type WindowManager } from "../../core/src";
import { useStore } from "./useStore";
import { IMG } from "./assets";
import { Window } from "./Window";

const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export function Desktop({ wm }: { wm: WindowManager }) {
  const { windows, active } = useStore(wm.state);
  const [pos, setPos] = useState(() => Object.fromEntries(DESKTOP_ICONS.map((i) => [i.app, { x: 0, y: i.top }])));

  return (
    <>
      {DESKTOP_ICONS.map((icon) => (
        <div
          key={icon.app}
          className="icon-content"
          title={icon.label}
          tabIndex={0}
          style={{ top: pos[icon.app].y, left: pos[icon.app].x }}
          onDoubleClick={() => wm.open(icon.app)}
          onClick={() => coarse && wm.open(icon.app)}
          onKeyDown={(e) => e.key === "Enter" && wm.open(icon.app)}
        >
          <img
            src={IMG + icon.img}
            width={50}
            height={50}
            alt=""
            draggable={false}
            onPointerDown={(e) =>
              startDrag(e.nativeEvent, pos[icon.app].x, pos[icon.app].y, (x, y) => setPos((p) => ({ ...p, [icon.app]: { x, y } })))
            }
          />
          <a>{icon.label}</a>
        </div>
      ))}
      {windows.map((w) => (
        <Window key={w.id} win={w} active={active === w.id} wm={wm} />
      ))}
    </>
  );
}
