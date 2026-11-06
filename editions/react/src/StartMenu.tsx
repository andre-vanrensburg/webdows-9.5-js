import { useState } from "react";
import { START_MENU, splitLabel, type MenuItem, type WindowManager } from "../../core/src";
import { IMG, LOGO } from "./assets";

function Label({ item }: { item: MenuItem }) {
  const [a, k, b] = splitLabel(item);
  return <p>{a}{k && <span className="underline">{k}</span>}{b}</p>;
}

function Icon({ item }: { item: MenuItem }) {
  return (
    <div className="icon">
      {item.icon.fa ? <i className={"fa-solid " + item.icon.fa} /> : <img src={IMG + item.icon.img} alt="" width="100%" height="auto" />}
    </div>
  );
}

export function StartMenu({ wm, onClose }: { wm: WindowManager; onClose: () => void }) {
  const [sub, setSub] = useState<string | null>(null);

  const choose = (item: MenuItem) => {
    if (item.children) {
      // Touch screens can't hover, so a tap toggles the flyout
      setSub(sub === item.label ? null : item.label);
      return;
    }
    if (item.shutdown) return location.reload();
    onClose();
    if (item.app) wm.open(item.app);
    else if (item.curious) wm.curious(item.label);
  };

  const row = (item: MenuItem, inSub = false) => (
    <li
      key={item.label}
      className={"start-menu-items-item" + (item.children ? " has-sub" : "") + (inSub ? " sub-item" : "") + (sub === item.label ? " sub-open" : "")}
      onClick={(e) => {
        e.stopPropagation();
        choose(item);
      }}
    >
      <Icon item={item} />
      <Label item={item} />
      {item.children && <span className="arrow">&#9654;</span>}
      {item.children && <ul className="submenu">{item.children.map((c) => row(c, true))}</ul>}
    </li>
  );

  return (
    <div className="start-menu" style={{ display: "grid" }} onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-side">
        <div className="start-menu-side-text text">
          <p className="ninefive">9.5</p>
          <p className="windows">Webdows</p>
          <img src={LOGO} alt="" width="100%" height="auto" />
        </div>
      </div>
      <div className="start-menu-items">
        {START_MENU.map((group, gi) => (
          <ul key={gi} className={gi === START_MENU.length - 1 ? "start-menu-items-list2" : "start-menu-items-list1"}>
            {group.map((item) => row(item))}
          </ul>
        ))}
      </div>
    </div>
  );
}
