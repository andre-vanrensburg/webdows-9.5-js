<script lang="ts">
  import type { BootSequence } from "../../core/src";
  import { YEAR } from "./assets";
  let { boot }: { boot: BootSequence } = $props();
  // svelte-ignore state_referenced_locally
  const bootState = boot.state;
  let input: HTMLInputElement | undefined = $state();
  $effect(() => input?.focus());
</script>

<div id="prompt">
  <table class="table">
    <tbody>
      <tr>
        <th colspan="2">
          System Configuration (c) 1998 - {YEAR} WebDos (Web disk Operating System [Version 19.87]), Andre van Rensburg. All rights reserved.
        </th>
      </tr>
      <tr><td>Main Processor: 80486DX2-66</td><td>Base Memory Size: 640KB</td></tr>
      <tr><td>Numeric Processor: Built-in</td><td>Extended Memory Size: 7552KB</td></tr>
      <tr><td>Cache Size: 256KB</td><td>Hard Disk Type: Local Storage</td></tr>
      <tr><td>BIOS Date: 15/04/87</td><td>Display Type: VGA</td></tr>
    </tbody>
  </table>
  <div>
    <p>Type "start" and hit enter to start Webdows 9.5</p>
    <p>
      WebDos:\&gt;<input
        bind:this={input}
        id="key"
        type="text"
        autocomplete="off"
        spellcheck="false"
        aria-label="WebDos prompt"
        value={$bootState.typed}
        oninput={(e) => boot.setTyped(e.currentTarget.value)}
        onkeydown={(e) => e.key === "Enter" && boot.submit(e.currentTarget.value)}
      />
    </p>
  </div>
</div>
