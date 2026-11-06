<script lang="ts">
  import { onMount, tick } from "svelte";
  import { startDrag, type Win, type WindowManager } from "../../core/src";
  import MineSweeper from "./MineSweeper.svelte";
  let { win, active, wm }: { win: Win; active: boolean; wm: WindowManager } = $props();
  let el: HTMLDivElement | undefined = $state();

  // Dialogs and Minesweeper open centred, once we know how big they are
  onMount(async () => {
    await tick();
    if (!win.placed && el) wm.place(win.id, el.offsetWidth, el.offsetHeight);
  });

  function dragStart(e: PointerEvent) {
    if (!win.maximized) startDrag(e, win.x, win.y, (x, y) => wm.move(win.id, x, y));
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={el}
  class="window {win.size !== 'normal' ? win.size : ''}"
  class:active
  class:maximize={win.maximized}
  role="dialog"
  tabindex="-1"
  aria-label={win.title}
  style="display: {win.minimized ? 'none' : 'flex'}; left: {win.x}px; top: {win.y}px; z-index: {win.z}; visibility: {win.placed ? 'visible' : 'hidden'}"
  onpointerdown={() => wm.focus(win.id)}
>
  <div class="titlebar" onpointerdown={dragStart} ondblclick={() => wm.toggleMax(win.id)}>
    <span class="title">{win.title}</span>
    <div class="titlebar-buttons" onpointerdown={(e) => e.stopPropagation()}>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="titlebar-button min" title="Minimise" onclick={() => wm.minimize(win.id)}><i class="fa-solid fa-window-minimize"></i></div>
      {#if win.size !== "fit"}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="titlebar-button max" title="Maximise" onclick={() => wm.toggleMax(win.id)}><i class="fa-sharp fa-regular fa-square"></i></div>
      {/if}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="titlebar-button close" title="Close" onclick={() => wm.close(win.id)}><i class="fa-solid fa-xmark"></i></div>
    </div>
  </div>
  <div class="content-body">
    {#if win.app === "minesweeper"}
      <div class="content"><MineSweeper onexit={() => wm.close(win.id)} /></div>
    {:else}
      <div class="content">{@html win.html}</div>
    {/if}
  </div>
  {#if win.size !== "fit"}
    <div class="footer-buttons"><button class="button ok" onclick={() => wm.close(win.id)}>OK</button></div>
  {/if}
</div>
