<script lang="ts">
  import { IMG, YEAR } from "./assets";
  let { onsetup }: { onsetup: () => void } = $props();
</script>

<div id="boot">
  <div>
    <p>
      System Configuration (c) 1998 - {YEAR} WebDos (Web Disk Operating System [Version 19.87]), <br />
      Andre van Rensburg. All rights reserved.
    </p>
    <br />
    <p>
      Intel 486DX2 CPU at 66MHz<br />
      Memory Test : 8192K OK<br />
      Detecting IDE Primary Master : Local Storage<br />
      Detecting IDE Primary Slave : None<br />
      Detecting IDE Secondary Master : None<br />
      Detecting IDE Secondary Slave : None
    </p>
  </div>
  <div><img src="{IMG}es.png" alt="" /></div>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="footer" onclick={onsetup}>
    <p>Press Del to enter setup. Press Esc to skip boot.<br />15/04/87-dsakd32r.43834ksa.134931</p>
  </div>
</div>
