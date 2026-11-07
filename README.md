# Webdows 9.5 (Old PC Simulation)

An early-90s PC (Intel 486DX2-66, 8 MB) that boots from WebDos into Webdows 9.5, a Windows 95-inspired desktop. Press **Del** during boot to enter a (read-only) CMOS setup, open **About Me**, or play **Minesweeper**.

Live at [andrevanrensburg.co.za](https://andrevanrensburg.co.za/).

## Five editions, one machine

| Edition | Path | Built with |
| --- | --- | --- |
| JavaScript | `/` | Plain JavaScript + jQuery (the original) |
| React | `/react/` | React 19, Vite |
| Vue | `/vue/` | Vue 3 (Composition API), Vite |
| Svelte | `/svelte/` | Svelte 5 (runes), Vite |
| Angular | `/angular/` | Angular 22 (standalone, signals, zoneless) |

Use the icons next to the clock to reboot into another edition.

The framework editions share one TypeScript core in `editions/core` (boot sequence, BIOS, window manager and the Minesweeper engine). Each framework only provides the user interface. All five use the same stylesheet (`css/app.css`) and images.

```
editions/
  core/       framework-agnostic TypeScript + engine tests
  react/      vue/      svelte/      angular/
  build-all.sh   builds every edition into /react /vue /svelte /angular
```

## Disclaimer

_WebDos and Webdows are a tribute made for fun, inspired by MS-DOS and Windows. They are not affiliated with, endorsed by or connected to Microsoft. All product names, logos, sounds and brands are and remain the property of their respective owners. The JavaScript, React, Vue.js, Angular and Svelte names and logos appear only to show which technology each edition is built with; no affiliation, endorsement, licence or ownership is claimed or implied._
