import { useEffect, useState } from "react";
import { BIOS_MENU, BIOS_FLAT, HARD_DISKS, biosDate, biosTime, type BiosController } from "../../core/src";
import { useStore } from "./useStore";

export function Bios({ bios, onExit }: { bios: BiosController; onExit: () => void }) {
  const s = useStore(bios.state);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const act = (r: "exit" | null) => r === "exit" && onExit();
  let idx = 0;

  return (
    <div id="bios" style={{ display: "flex" }} onClick={() => act(bios.clickBackground())}>
      <div className="bios-head">
        <div>ROM ISA BIOS (WEBDOS94)</div>
        <div>{s.screen === "standard" ? "STANDARD CMOS SETUP" : "CMOS SETUP UTILITY"}</div>
        <div>WEBDOS SOFTWARE, INC.</div>
      </div>

      <div className={"bios-screen" + (s.screen === "main" ? " on" : "")}>
        <div className="bios-menu">
          {BIOS_MENU.map((col, ci) => (
            <ul key={ci}>
              {col.map((item) => {
                const i = idx++;
                return (
                  <li
                    key={item.label}
                    className={s.sel === i ? "sel" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      act(bios.clickItem(i));
                    }}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
        <div className="bios-keys">
          Esc : Quit &nbsp;&nbsp;&nbsp; ↑↓→← : Select Item<br />F10 : Save &amp; Exit Setup &nbsp;&nbsp;&nbsp; (Shift)F2 : Change Color
        </div>
        <div className="bios-hint">{BIOS_FLAT[s.sel].hint}</div>
      </div>

      <div className={"bios-screen" + (s.screen === "standard" ? " on" : "")}>
        <div className="bios-std">
          <div className="bios-std-top">
            <div>Date (mm:dd:yy) : <span className="bios-val">{biosDate(now)}</span></div>
            <div>Time (hh:mm:ss) : <span className="bios-val">{biosTime(now)}</span></div>
          </div>
          <table className="bios-table">
            <tbody>
              <tr className="bios-th">
                {["HARD DISKS", "TYPE", "SIZE", "CYLS", "HEAD", "PRECOMP", "LANDZ", "SECTOR", "MODE"].map((h) => <td key={h}>{h}</td>)}
              </tr>
              {HARD_DISKS.map((row) => (
                <tr key={row[0]}>
                  {row.map((v, i) => <td key={i} className={i === 1 ? "bios-val" : undefined}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bios-std-bottom">
            <div>
              <div>Drive A : <span className="bios-val">1.44M, 3.5 in.</span></div>
              <div>Drive B : <span className="bios-val">None</span></div>
              <br />
              <div>Video &nbsp;&nbsp;: <span className="bios-val">EGA/VGA</span></div>
              <div>Halt On : <span className="bios-val">All Errors</span></div>
              <div>Curiosity : <span className="bios-val bios-on">Enabled</span></div>
            </div>
            <div className="bios-membox">
              <div>Base Memory: &nbsp;&nbsp;&nbsp;640K</div>
              <div>Extended Memory: 7552K</div>
              <div>Other Memory: &nbsp;&nbsp;384K</div>
              <div className="bios-rule" />
              <div>Total Memory: &nbsp;8192K</div>
            </div>
          </div>
        </div>
        <div className="bios-keys">
          ESC : Quit &nbsp;&nbsp; ↑↓→← : Select Item &nbsp;&nbsp; PU/PD/+/- : Modify<br />F1 : Help &nbsp;&nbsp; (Shift)F2 : Change Color
        </div>
      </div>

      {s.dialog && (
        <div className="bios-dialog" style={{ display: "block" }}>
          <p className="bios-dialog-title">ACCESS DENIED</p>
          <p>You curious mind, you.</p>
          <p>I knew someone would press Del. Nothing in here can be changed, but Curiosity was already enabled, so you're all set.</p>
          <p className="bios-dialog-ok">Press Esc to continue booting</p>
        </div>
      )}
    </div>
  );
}
