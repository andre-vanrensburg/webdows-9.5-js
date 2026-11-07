<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { BootSequence } from "../../core/src";
import { useStore } from "./useStore";
import { YEAR } from "./assets";

const props = defineProps<{ boot: BootSequence }>();
const state = useStore(props.boot.state);
const input = ref<HTMLInputElement | null>(null);
onMounted(() => input.value?.focus());
</script>

<template>
  <div id="prompt">
    <table class="table">
      <tbody>
        <tr>
          <th colspan="2">
            System Configuration (c) 1998 - {{ YEAR }} WebDos (Web disk Operating System [Version 19.87]), Andre van Rensburg. All rights reserved.
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
          ref="input"
          id="key"
          type="text"
          autocomplete="off"
          spellcheck="false"
          aria-label="WebDos prompt"
          :value="state.typed"
          @input="boot.setTyped(($event.target as HTMLInputElement).value)"
          @keydown.enter="boot.submit(($event.target as HTMLInputElement).value)"
        />
      </p>
    </div>
  </div>
</template>
