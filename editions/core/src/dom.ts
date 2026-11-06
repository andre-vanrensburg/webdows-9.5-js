/**
 * Loads the site's shared stylesheet (../css/app.css) at runtime, so every edition uses the
 * very same file as the vanilla site, and images like the loading screen aren't duplicated per build.
 */
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
