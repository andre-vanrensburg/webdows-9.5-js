/**
 * Loads the site's shared stylesheet (../css/app.css) at runtime, so every edition uses the
 * very same file as the vanilla site, and images like the loading screen aren't duplicated per build.
 */
/**
 * Each edition's index.html starts with a black #precover so the visitor never sees a blank
 * page or the desktop colour before the POST screen. Remove it once the boot screen is drawn.
 */
export function revealWhenBooted(): void {
  const check = () => {
    if (document.querySelector("#boot, #prompt, #loading, #bios")) {
      requestAnimationFrame(() => document.getElementById("precover")?.remove());
    } else requestAnimationFrame(check);
  };
  check();
}

/** Starts downloading images now (e.g. the logo screen during POST) so they're ready when shown */
const preloaded: HTMLImageElement[] = [];
export function preloadImages(...srcs: string[]): void {
  for (const src of srcs) {
    const img = new Image();
    img.src = src;
    preloaded.push(img);
  }
}

export function loadSharedStyles(href = "../css/app.css"): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    // Same order as the vanilla site: app.css before the icon fonts, so Font Awesome's weights win
    const firstSheet = document.head.querySelector('link[rel="stylesheet"]');
    document.head.insertBefore(link, firstSheet);
  });
}
