import { EDITIONS } from "../../core/src";
export const IMG = "../img/";
export const SOUND = "../mp3/win95.mp3";
export const EDITION = EDITIONS.find((e) => e.key === "svelte")!;
export const LOGO = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg";
export const YEAR = new Date().getFullYear();
