// Shared content for every Webdows edition. Same words and same markup, whatever the framework.

export interface Edition {
  key: string;
  name: string;
  icon: string;
  /** Path from the site root, used to build relative links between editions */
  dir: string;
}

export const EDITIONS: Edition[] = [
  { key: "js", name: "JavaScript", icon: "devicon-javascript-plain", dir: "" },
  { key: "react", name: "React", icon: "devicon-react-original", dir: "react/" },
  { key: "vue", name: "Vue", icon: "devicon-vuejs-plain", dir: "vue/" },
  { key: "angular", name: "Angular", icon: "devicon-angularjs-plain", dir: "angular/" },
  { key: "svelte", name: "Svelte", icon: "devicon-svelte-plain", dir: "svelte/" }
];

/** Link from one edition to another. Editions live one folder below the site root. */
export function editionHref(from: string, to: Edition): string {
  const up = from === "js" ? "" : "../";
  return up + to.dir + "index.html";
}

export const ABOUT_HTML = "<div class=\"banner\"></div>\n  <hr>\n  <p>I've been fascinated by computers since I was 10 years old, when I started helping my uncle build and repair them. My first experience with programming was QBASIC on a 386 MS-DOS machine, and by the age of 11 I had written my first program. That blinking cursor is why this site boots the way it does.</p>\n\n  <p>I have more than two decades of experience in IT, covering hardware repair, software development, end-user support, server administration, graphic design and management. I qualified as an IT Service Engineer through my PartServe apprenticeship in 2006, built my first website in 2009, and I've been building for the web ever since.</p>\n\n  <p>Today I'm the Managing Director and lead developer at <a class=\"link\" href=\"https://webacumen.co.za/\" target=\"_blank\" rel=\"noopener\">WebAcumen Software Development and Hosting</a>. We build bespoke web applications, websites and mobile apps and run managed hosting for clients in South Africa, the USA, the UK, Australia and New Zealand. I am also employed by the South African Government as an IT Engineer and Web Developer.</p>\n\n  <p>In my free time I enjoy spending time with my family, playing guitar, watching professional skateboarding, or feeding my addiction to playing chess \ud83d\ude04</p>\n\n  <fieldset class=\"group\">\n    <legend>Find me</legend>\n    <p><i class=\"devicon-linkedin-plain\"></i> <a class=\"link\" href=\"https://www.linkedin.com/in/andr%C3%A9-van-rensburg/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>\n       &nbsp;&nbsp; <i class=\"devicon-github-original\"></i> <a class=\"link\" href=\"https://github.com/andre-vanrensburg\" target=\"_blank\" rel=\"noopener\">GitHub</a>\n       &nbsp;&nbsp; <i class=\"fa-solid fa-globe\"></i> <a class=\"link\" href=\"https://webacumen.co.za/\" target=\"_blank\" rel=\"noopener\">webacumen.co.za</a></p>\n  </fieldset>";

export function aboutWebdowsHtml(edition: Edition, logo: string): string {
  return (
    '<img src="' + logo + '" alt="" width="20%" height="auto" />' +
    "<p><strong>Webdows 9.5</strong> V.29.02 &middot; " + edition.name + " Edition</p><hr>" +
    "<p>This edition runs on " + edition.name +
    ". The boot, the BIOS, the windows and Minesweeper all come from one shared TypeScript core; only the user interface changes from framework to framework. " +
    "Use the icons next to the clock to reboot into another edition.</p><hr>" +
    '<p class="disclaimer">WebDos and Webdows are a tribute I made for fun, inspired by the MS-DOS and Windows machines I grew up on. ' +
    "They are not affiliated with, endorsed by or connected to Microsoft in any way. Microsoft, MS-DOS, Windows, QBasic, ENERGY STAR and all other product names, logos, sounds and brands belong to their respective owners. " +
    "No licence, ownership or affiliation is claimed or implied, and they are used here for nostalgia and entertainment only.</p>"
  );
}

export function curiousHtml(name: string): string {
  const safe = name.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
  return (
    '<div class="curious"><i class="fa-solid fa-circle-info"></i><div>' +
    "<p><strong>" + safe + "</strong></p>" +
    "<p>You curious mind, you.</p>" +
    "<p>I never set out to rebuild all of Windows. Webdows runs About Me, Minesweeper and this message, and that's the whole operating system.</p>" +
    "</div></div>"
  );
}

// ---- Start menu ------------------------------------------------------------
export interface MenuItem {
  label: string;
  /** Underlined access key, shown as in Windows 95 */
  key?: string;
  icon: { fa?: string; img?: string };
  app?: string;
  curious?: boolean;
  shutdown?: boolean;
  children?: MenuItem[];
}

const fa = (n: string) => ({ fa: n });
const img = (f: string) => ({ img: f });
const c = (label: string, icon: { fa?: string; img?: string }): MenuItem => ({ label, icon, curious: true });

export const START_MENU: MenuItem[][] = [
  [
    {
      label: "Programs", key: "P", icon: fa("fa-folder-open"),
      children: [
        { label: "Minesweeper", icon: img("minesweeper.svg"), app: "minesweeper" },
        c("WebDos Prompt", fa("fa-terminal")),
        c("Notepad", fa("fa-file-lines")),
        c("Paint", fa("fa-paintbrush")),
        c("Calculator", fa("fa-calculator")),
        c("Web Browser", fa("fa-globe"))
      ]
    },
    { label: "Documents", key: "D", icon: fa("fa-file"), children: [c("autoexec.bat", fa("fa-gear")), c("readme.txt", fa("fa-file-lines"))] },
    { label: "Settings", key: "S", icon: fa("fa-gear"), children: [c("Control Panel", fa("fa-sliders")), c("Printers", fa("fa-print")), c("Taskbar...", fa("fa-table-columns"))] },
    { label: "Find", key: "F", icon: fa("fa-magnifying-glass"), children: [c("Files or Folders...", fa("fa-folder")), c("Computer...", fa("fa-desktop"))] },
    { ...c("Help", fa("fa-circle-question")), key: "H" },
    { ...c("Run...", fa("fa-person-running")), key: "R" }
  ],
  [
    { label: "About Me", key: "M", icon: img("aboutme.png"), app: "about" },
    { label: "Minesweeper", key: "s", icon: img("minesweeper.svg"), app: "minesweeper" }
  ],
  [
    { label: "About...", key: "A", icon: img("about.png"), app: "app" },
    { label: "Shut Down...", key: "u", icon: img("shutdown.png"), shutdown: true }
  ]
];

/** Splits a label around its access key so templates can underline it */
export function splitLabel(item: MenuItem): [string, string, string] {
  if (!item.key) return [item.label, "", ""];
  const i = item.label.indexOf(item.key);
  if (i < 0) return [item.label, "", ""];
  return [item.label.slice(0, i), item.key, item.label.slice(i + 1)];
}

export const DESKTOP_ICONS = [
  { app: "about", label: "About Me", img: "aboutme.png", top: 10 },
  { app: "minesweeper", label: "Minesweeper", img: "minesweeper.svg", top: 110 }
];

// ---- BIOS ------------------------------------------------------------------
export interface BiosItem { label: string; hint: string; act: "standard" | "locked" | "exit"; }

export const BIOS_MENU: BiosItem[][] = [
  [
    { label: "STANDARD CMOS SETUP", hint: "Time, Date, Hard Disk Type...", act: "standard" },
    { label: "BIOS FEATURES SETUP", hint: "Boot sequence, typematic rate, shadow RAM...", act: "locked" },
    { label: "CHIPSET FEATURES SETUP", hint: "Wait states, cache and DRAM timing...", act: "locked" },
    { label: "POWER MANAGEMENT SETUP", hint: "Doze, standby and suspend timers. An Energy Star Ally.", act: "locked" },
    { label: "LOAD BIOS DEFAULTS", hint: "Load BIOS defaults (locked)", act: "locked" },
    { label: "LOAD SETUP DEFAULTS", hint: "Load setup defaults (locked)", act: "locked" }
  ],
  [
    { label: "SUPERVISOR PASSWORD", hint: "Change, set or disable password. There isn't one.", act: "locked" },
    { label: "USER PASSWORD", hint: "Change, set or disable password. Still isn't one.", act: "locked" },
    { label: "IDE HDD AUTO DETECTION", hint: "Detect hard disk type automatically", act: "locked" },
    { label: "HDD LOW LEVEL FORMAT", hint: "Low level format the hard disk. Absolutely not.", act: "locked" },
    { label: "SAVE & EXIT SETUP", hint: "Save data to CMOS and exit setup", act: "locked" },
    { label: "EXIT WITHOUT SAVING", hint: "Abandon all data and continue booting", act: "exit" }
  ]
];

export const BIOS_FLAT: BiosItem[] = ([] as BiosItem[]).concat(...BIOS_MENU);

export const HARD_DISKS = [
  ["Primary Master", "Auto", "540", "1048", "16", "65535", "1047", "63", "LBA"],
  ["Primary Slave", "None", "0", "0", "0", "0", "0", "0", "----"],
  ["Secondary Master", "None", "0", "0", "0", "0", "0", "0", "----"],
  ["Secondary Slave", "None", "0", "0", "0", "0", "0", "0", "----"]
];
