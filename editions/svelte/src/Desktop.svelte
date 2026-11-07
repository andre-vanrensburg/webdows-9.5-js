<script lang="ts">
  import { DESKTOP_ICONS, startDrag, type WindowManager } from "../../core/src";
  import { IMG } from "./assets";
  import WinFrame from "./WinFrame.svelte";
  let { wm }: { wm: WindowManager } = $props();
  // svelte-ignore state_referenced_locally
  const wmState = wm.state;
  let pos = $state(Object.fromEntries(DESKTOP_ICONS.map((i) => [i.app, { x: 0, y: i.top }])));
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  function drag(e: PointerEvent, app: string) {
    startDrag(e, pos[app].x, pos[app].y, (x, y) => (pos[app] = { x, y }));
  }
</script>

{#each DESKTOP_ICONS as icon (icon.app)}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    class="icon-content"
    title={icon.label}
    tabindex="0"
    style="top: {pos[icon.app].y}px; left: {pos[icon.app].x}px"
    ondblclick={() => wm.open(icon.app)}
    onclick={() => coarse && wm.open(icon.app)}
    onkeydown={(e) => e.key === "Enter" && wm.open(icon.app)}
  >
    <img src="{IMG}{icon.img}" width="50" height="50" alt="" draggable="false" onpointerdown={(e) => drag(e, icon.app)} />
    <!-- svelte-ignore a11y_missing_attribute -->
    <a>{icon.label}</a>
  </div>
{/each}
{#each $wmState.windows as w (w.id)}
  <WinFrame win={w} active={$wmState.active === w.id} {wm} />
{/each}
