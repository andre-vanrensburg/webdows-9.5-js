<script lang="ts">
  import { onDestroy } from "svelte";
  import { BIOS_MENU, BIOS_FLAT, HARD_DISKS, biosDate, biosTime, type BiosController } from "../../core/src";
  let { bios, onexit }: { bios: BiosController; onexit: () => void } = $props();
  // svelte-ignore state_referenced_locally
  const biosState = bios.state;
  let now = $state(new Date());
  const t = setInterval(() => (now = new Date()), 1000);
  onDestroy(() => clearInterval(t));
  const act = (r: "exit" | null) => r === "exit" && onexit();
  const flat = (col: number, row: number) => col * BIOS_MENU[0].length + row;
  const HEAD = ["HARD DISKS", "TYPE", "SIZE", "CYLS", "HEAD", "PRECOMP", "LANDZ", "SECTOR", "MODE"];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div id="bios" style="display: flex" onclick={() => act(bios.clickBackground())}>
  <div class="bios-head">
    <div>ROM ISA BIOS (WEBDOS94)</div>
    <div>{$biosState.screen === "standard" ? "STANDARD CMOS SETUP" : "CMOS SETUP UTILITY"}</div>
    <div>WEBDOS SOFTWARE, INC.</div>
  </div>

  <div class="bios-screen" class:on={$biosState.screen === "main"}>
    <div class="bios-menu">
      {#each BIOS_MENU as col, ci}
        <ul>
          {#each col as item, ri (item.label)}
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
            <li
              class:sel={$biosState.sel === flat(ci, ri)}
              onclick={(e) => {
                e.stopPropagation();
                act(bios.clickItem(flat(ci, ri)));
              }}
            >{item.label}</li>
          {/each}
        </ul>
      {/each}
    </div>
    <div class="bios-keys">
      Esc : Quit &nbsp;&nbsp;&nbsp; ↑↓→← : Select Item<br />F10 : Save &amp; Exit Setup &nbsp;&nbsp;&nbsp; (Shift)F2 : Change Color
    </div>
    <div class="bios-hint">{BIOS_FLAT[$biosState.sel].hint}</div>
  </div>

  <div class="bios-screen" class:on={$biosState.screen === "standard"}>
    <div class="bios-std">
      <div class="bios-std-top">
        <div>Date (mm:dd:yy) : <span class="bios-val">{biosDate(now)}</span></div>
        <div>Time (hh:mm:ss) : <span class="bios-val">{biosTime(now)}</span></div>
      </div>
      <table class="bios-table">
        <tbody>
          <tr class="bios-th">{#each HEAD as h}<td>{h}</td>{/each}</tr>
          {#each HARD_DISKS as row (row[0])}
            <tr>{#each row as v, i}<td class:bios-val={i === 1}>{v}</td>{/each}</tr>
          {/each}
        </tbody>
      </table>
      <div class="bios-std-bottom">
        <div>
          <div>Drive A : <span class="bios-val">1.44M, 3.5 in.</span></div>
          <div>Drive B : <span class="bios-val">None</span></div>
          <br />
          <div>Video &nbsp;&nbsp;: <span class="bios-val">EGA/VGA</span></div>
          <div>Halt On : <span class="bios-val">All Errors</span></div>
          <div>Curiosity : <span class="bios-val bios-on">Enabled</span></div>
        </div>
        <div class="bios-membox">
          <div>Base Memory: &nbsp;&nbsp;&nbsp;640K</div>
          <div>Extended Memory: 7552K</div>
          <div>Other Memory: &nbsp;&nbsp;384K</div>
          <div class="bios-rule"></div>
          <div>Total Memory: &nbsp;8192K</div>
        </div>
      </div>
    </div>
    <div class="bios-keys">
      ESC : Quit &nbsp;&nbsp; ↑↓→← : Select Item &nbsp;&nbsp; PU/PD/+/- : Modify<br />F1 : Help &nbsp;&nbsp; (Shift)F2 : Change Color
    </div>
  </div>

  {#if $biosState.dialog}
    <div class="bios-dialog" style="display: block">
      <p class="bios-dialog-title">ACCESS DENIED</p>
      <p>You curious mind, you.</p>
      <p>I knew someone would press Del. Nothing in here can be changed, but Curiosity was already enabled, so you're all set.</p>
      <p class="bios-dialog-ok">Press Esc to continue booting</p>
    </div>
  {/if}
</div>
