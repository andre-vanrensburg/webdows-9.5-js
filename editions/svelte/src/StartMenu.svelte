<script lang="ts">
  import { START_MENU, showShutdown, type MenuItem, type WindowManager } from "../../core/src";
  import { EDITION, LOGO, SCREEN } from "./assets";
  import MenuRow from "./MenuRow.svelte";
  let { wm, onclose }: { wm: WindowManager; onclose: () => void } = $props();
  let sub = $state<string | null>(null);

  function choose(item: MenuItem) {
    if (item.children) {
      // Touch screens can't hover, so a tap toggles the flyout
      sub = sub === item.label ? null : item.label;
      return;
    }
    onclose();
    if (item.shutdown) return showShutdown({ from: EDITION, screen: SCREEN, preselect: "shutdown" });
    if (item.app) wm.open(item.app);
    else if (item.curious) wm.curious(item.label);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="start-menu" style="display: grid" onclick={(e) => e.stopPropagation()}>
  <div class="start-menu-side">
    <div class="start-menu-side-text text">
      <p class="ninefive">9.5</p>
      <p class="windows">Webdows</p>
      <img src={LOGO} alt="" width="100%" height="auto" />
    </div>
  </div>
  <div class="start-menu-items">
    {#each START_MENU as group, gi}
      <ul class={gi === START_MENU.length - 1 ? "start-menu-items-list2" : "start-menu-items-list1"}>
        {#each group as item (item.label)}<MenuRow {item} openSub={sub} {choose} />{/each}
      </ul>
    {/each}
  </div>
</div>
