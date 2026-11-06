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
    document.head.appendChild(link);
  });
}
