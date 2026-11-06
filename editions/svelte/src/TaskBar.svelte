<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { taskbarTime, type Edition, type WindowManager } from "../../core/src";
  import StartMenu from "./StartMenu.svelte";
  let { wm, editions, onreboot }: { wm: WindowManager; editions: Edition[]; onreboot: (e: Edition) => void } = $props();
  // svelte-ignore state_referenced_locally
  const wmState = wm.state;
  let open = $state(false);
  let now = $state(new Date());
  const t = setInterval(() => (now = new Date()), 1000);
  const close = () => (open = false);
  onMount(() => document.addEventListener("click", close));
  onDestroy(() => {
    clearInterval(t);
    document.removeEventListener("click", close);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="taskbar">
  <div
    class="start-button button"
    title="Start"
    onclick={(e) => {
      e.stopPropagation();
      open = !open;
    }}
  >Start</div>
  <div class="tasks">
    {#each $wmState.windows as w (w.id)}
      <div class="task button" class:pressed={$wmState.active === w.id && !w.minimized} onclick={() => wm.taskClick(w.id)}>{w.title}</div>
    {/each}
  </div>
  <div class="taskbar-time">
    {#each editions as ed (ed.key)}
      <i class="{ed.icon} tray-edition" title="Reboot in {ed.name}" onclick={() => onreboot(ed)}></i>
    {/each}
    <p class="taskbar-time-text" title={now.toLocaleDateString()}>{taskbarTime(now)}</p>
  </div>
</div>
{#if open}<StartMenu {wm} onclose={() => (open = false)} />{/if}
