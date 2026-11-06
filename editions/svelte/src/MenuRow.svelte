<script lang="ts">
  import { splitLabel, type MenuItem } from "../../core/src";
  import { IMG } from "./assets";
  import MenuRow from "./MenuRow.svelte";
  let { item, openSub, inSub = false, choose }: { item: MenuItem; openSub: string | null; inSub?: boolean; choose: (i: MenuItem) => void } = $props();
  const parts = $derived(splitLabel(item));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<li
  class="start-menu-items-item"
  class:has-sub={!!item.children}
  class:sub-item={inSub}
  class:sub-open={openSub === item.label}
  onclick={(e) => {
    e.stopPropagation();
    choose(item);
  }}
>
  <div class="icon">
    {#if item.icon.fa}<i class="fa-solid {item.icon.fa}"></i>{:else}<img src="{IMG}{item.icon.img}" alt="" width="100%" height="auto" />{/if}
  </div>
  <p>{parts[0]}{#if parts[1]}<span class="underline">{parts[1]}</span>{/if}{parts[2]}</p>
  {#if item.children}
    <span class="arrow">&#9654;</span>
    <ul class="submenu">
      {#each item.children as c (c.label)}<MenuRow item={c} {openSub} inSub {choose} />{/each}
    </ul>
  {/if}
</li>
