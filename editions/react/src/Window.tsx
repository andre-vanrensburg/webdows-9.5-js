import { useLayoutEffect, useRef } from "react";
import { startDrag, type Win, type WindowManager } from "../../core/src";
import { Minesweeper } from "./Minesweeper";

export function Window({ win, active, wm }: { win: Win; active: boolean; wm: WindowManager }) {
  const ref = useRef<HTMLDivElement>(null);

  // Dialogs and Minesweeper open centred, once we know how big they are
  useLayoutEffect(() => {
    if (!win.placed && ref.current) wm.place(win.id, ref.current.offsetWidth, ref.current.offsetHeight);
  }, [win.placed, win.id, wm]);

  const cls = ["window", active && "active", win.size !== "normal" && win.size, win.maximized && "maximize"].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      className={cls}
      role="dialog"
      aria-label={win.title}
      style={{
        display: win.minimized ? "none" : "flex",
        left: win.x,
        top: win.y,
        zIndex: win.z,
        visibility: win.placed ? "visible" : "hidden"
      }}
      onPointerDown={() => wm.focus(win.id)}
    >
      <div
        className="titlebar"
        onPointerDown={(e) => !win.maximized && startDrag(e.nativeEvent, win.x, win.y, (x, y) => wm.move(win.id, x, y))}
        onDoubleClick={() => wm.toggleMax(win.id)}
      >
        <span className="title">{win.title}</span>
        <div className="titlebar-buttons" onPointerDown={(e) => e.stopPropagation()}>
          <div className="titlebar-button min" title="Minimise" onClick={() => wm.minimize(win.id)}>
            <i className="fa-solid fa-window-minimize" />
          </div>
          {win.size !== "fit" && (
            <div className="titlebar-button max" title="Maximise" onClick={() => wm.toggleMax(win.id)}>
              <i className="fa-sharp fa-regular fa-square" />
            </div>
          )}
          <div className="titlebar-button close" title="Close" onClick={() => wm.close(win.id)}>
            <i className="fa-solid fa-xmark" />
          </div>
        </div>
      </div>
      <div className="content-body">
        {win.app === "minesweeper" ? (
          <div className="content">
            <Minesweeper onExit={() => wm.close(win.id)} />
          </div>
        ) : (
          <div className="content" dangerouslySetInnerHTML={{ __html: win.html || "" }} />
        )}
      </div>
      {win.size !== "fit" && (
        <div className="footer-buttons">
          <button className="button ok" onClick={() => wm.close(win.id)}>OK</button>
        </div>
      )}
    </div>
  );
}
