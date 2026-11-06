import { useEffect, useMemo, useRef, useState } from "react";
import {
  MinesweeperGame, LEVELS, FACES, cellView, led, HOWTO_HTML, ABOUT_MS_HTML, bestTimesHtml, type LevelKey
} from "../../core/src";
import { useStore } from "./useStore";

export function Minesweeper({ onExit }: { onExit: () => void }) {
  const game = useMemo(() => new MinesweeperGame(), []);
  const s = useStore(game.state);
  const [menu, setMenu] = useState<"game" | "help" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());
  const press = useRef<{ timer?: ReturnType<typeof setTimeout>; long: boolean }>({ long: false });

  useEffect(() => () => game.destroy(), [game]);

  useEffect(() => {
    if (s.newBest !== null) {
      setNote(`<p>You have the fastest time for ${LEVELS[s.level].name.toLowerCase()} level: <b>${s.newBest} seconds</b>.</p>`);
      game.clearNewBest();
    }
  }, [s.newBest, s.level, game]);

  useEffect(() => {
    const up = () => game.setPressing(false);
    const closeMenu = () => setMenu(null);
    const f2 = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        game.newGame();
      }
    };
    document.addEventListener("mouseup", up);
    document.addEventListener("click", closeMenu);
    document.addEventListener("keydown", f2);
    return () => {
      document.removeEventListener("mouseup", up);
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("keydown", f2);
    };
  }, [game]);

  // Ignore stray clicks left over from the double-click that opened the window
  const tooSoon = () => Date.now() - mountedAt.current < 400;
  const cellIndex = (t: EventTarget) => {
    const el = (t as HTMLElement).closest(".ms-cell") as HTMLElement | null;
    return el ? Number(el.dataset.i) : -1;
  };

  const cmd = (c: string) => {
    setMenu(null);
    if (c === "new") game.newGame();
    else if (c in LEVELS) game.newGame(c as LevelKey);
    else if (c === "best") setNote(bestTimesHtml());
    else if (c === "howto") setNote(HOWTO_HTML);
    else if (c === "about") setNote(ABOUT_MS_HTML);
    else if (c === "exit") onExit();
  };

  const menuTitle = (id: "game" | "help", letter: string, rest: string) => (
    <span
      className="ms-menu-title"
      onClick={(e) => {
        e.stopPropagation();
        setMenu(menu === id ? null : id);
      }}
    >
      <u>{letter}</u>{rest}
    </span>
  );

  return (
    <div className="ms">
      <div className="ms-menubar">
        <div className={"ms-menu" + (menu === "game" ? " open" : "")}>
          {menuTitle("game", "G", "ame")}
          <div className="ms-dropdown">
            <div onClick={() => cmd("new")}>New<span>F2</span></div>
            <hr />
            {(Object.keys(LEVELS) as LevelKey[]).map((k) => (
              <div key={k} className={"ms-level" + (s.level === k ? " on" : "")} onClick={() => cmd(k)}>
                <b>&#10003;</b>{LEVELS[k].name}
              </div>
            ))}
            <hr />
            <div onClick={() => cmd("best")}>Best Times...</div>
            <hr />
            <div onClick={() => cmd("exit")}>Exit</div>
          </div>
        </div>
        <div className={"ms-menu" + (menu === "help" ? " open" : "")}>
          {menuTitle("help", "H", "elp")}
          <div className="ms-dropdown">
            <div onClick={() => cmd("howto")}>How to Play</div>
            <hr />
            <div onClick={() => cmd("about")}>About Minesweeper...</div>
          </div>
        </div>
      </div>

      <div className="ms-body">
        <div className="ms-top">
          <div className="ms-led">{led(s.minesLeft)}</div>
          <button className="ms-face" aria-label="New game" onClick={() => game.newGame()} dangerouslySetInnerHTML={{ __html: FACES[s.face] }} />
          <div className="ms-led">{led(s.seconds)}</div>
        </div>
        <div
          className="ms-grid"
          role="grid"
          style={{ gridTemplateColumns: `repeat(${s.cols}, 16px)` }}
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            const i = cellIndex(e.target);
            if (i < 0 || tooSoon() || s.state === "won" || s.state === "lost") return;
            if (e.button === 0) game.setPressing(true);
            if (e.button === 2) game.mark(i);
            if (e.button === 1) {
              e.preventDefault();
              game.chord(i);
            }
          }}
          onClick={(e) => {
            if (press.current.long) {
              press.current.long = false;
              return;
            }
            const i = cellIndex(e.target);
            if (i >= 0 && !tooSoon()) game.open(i);
          }}
          onTouchStart={(e) => {
            const i = cellIndex(e.target);
            if (i < 0) return;
            press.current.long = false;
            press.current.timer = setTimeout(() => {
              press.current.long = true;
              game.mark(i);
              navigator.vibrate?.(30);
            }, 400);
          }}
          onTouchEnd={() => clearTimeout(press.current.timer)}
          onTouchMove={() => clearTimeout(press.current.timer)}
        >
          {s.cells.map((c, i) => {
            const v = cellView(c);
            return <div key={i} data-i={i} className={v.cls} dangerouslySetInnerHTML={{ __html: v.html }} />;
          })}
        </div>
      </div>

      {note && (
        <div className="ms-note" style={{ display: "block" }}>
          <div dangerouslySetInnerHTML={{ __html: note }} />
          <div className="ms-note-btn">
            <button className="button" onClick={() => setNote(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
