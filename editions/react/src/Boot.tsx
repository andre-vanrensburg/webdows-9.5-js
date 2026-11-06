import { useEffect, useRef } from "react";
import type { BootSequence } from "../../core/src";
import { useStore } from "./useStore";
import { IMG } from "./assets";

const YEAR = new Date().getFullYear();

export function Post({ onSetup }: { onSetup: () => void }) {
  return (
    <div id="boot">
      <div>
        <p>
          System Configuration (c) 1998 - {YEAR} WebDos (Web Disk Operating System [Version 19.87]), <br />
          Andre van Rensburg. All rights reserved.
        </p>
        <br />
        <p>
          Intel 486DX2 CPU at 66MHz<br />
          Memory Test : 8192K OK<br />
          Detecting IDE Primary Master : Local Storage<br />
          Detecting IDE Primary Slave : None<br />
          Detecting IDE Secondary Master : None<br />
          Detecting IDE Secondary Slave : None
        </p>
      </div>
      <div>
        <img src={IMG + "es.png"} alt="" />
      </div>
      <div className="footer" onClick={onSetup}>
        <p>
          Press Del to enter setup. Press Esc to skip boot.<br />
          15/04/87-dsakd32r.43834ksa.134931
        </p>
      </div>
    </div>
  );
}

export function Prompt({ boot }: { boot: BootSequence }) {
  const { typed } = useStore(boot.state);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  return (
    <div id="prompt">
      <table className="table">
        <tbody>
          <tr>
            <th colSpan={2}>
              System Configuration (c) 1998 - {YEAR} WebDos (Web disk Operating System [Version 19.87]), Andre van Rensburg. All rights reserved.
            </th>
          </tr>
          <tr><td>Main Processor: 80486DX2-66</td><td>Base Memory Size: 640KB</td></tr>
          <tr><td>Numeric Processor: Built-in</td><td>Extended Memory Size: 7552KB</td></tr>
          <tr><td>Cache Size: 256KB</td><td>Hard Disk Type: Local Storage</td></tr>
          <tr><td>BIOS Date: 15/04/87</td><td>Display Type: VGA</td></tr>
        </tbody>
      </table>
      <div>
        <p>Type "start" and hit enter to start Webdows 9.5</p>
        <p>
          WebDos:\&gt;
          <input
            ref={input}
            type="text"
            id="key"
            autoComplete="off"
            spellCheck={false}
            aria-label="WebDos prompt"
            value={typed}
            onChange={(e) => boot.setTyped(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && boot.submit(e.currentTarget.value)}
          />
        </p>
      </div>
    </div>
  );
}

export function Loading() {
  return <div id="loading" style={{ backgroundImage: `url(${IMG}loading-react.jpg)` }} />;
}
