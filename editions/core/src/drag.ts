/** Pointer-based dragging shared by every edition (titlebars and desktop icons) */
export function startDrag(e: PointerEvent, x0: number, y0: number, apply: (x: number, y: number) => void): void {
  if (e.button !== 0) return;
  const sx = e.clientX, sy = e.clientY;
  const move = (ev: PointerEvent) => {
    const x = Math.min(Math.max(x0 + ev.clientX - sx, -200), window.innerWidth - 60);
    const y = Math.min(Math.max(y0 + ev.clientY - sy, 0), window.innerHeight - 60);
    apply(x, y);
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

/** Plays the startup sound, retrying on the first click or key press if autoplay is blocked */
export function playWelcome(src: string): void {
  const audio = new Audio(src);
  audio.play().catch(() => {
    const retry = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    };
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
  });
}
