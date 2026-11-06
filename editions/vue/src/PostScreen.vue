<script setup lang="ts">
import { IMG, YEAR } from "./assets";
defineEmits<{ setup: [] }>();
</script>

<template>
  <div id="boot">
    <div>
      <p>
        System Configuration (c) 1998 - {{ YEAR }} WebDos (Web Disk Operating System [Version 19.87]), <br />
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
    <div><img :src="IMG + 'es.png'" alt="" /></div>
    <div class="footer" @click="$emit('setup')">
      <p>Press Del to enter setup. Press Esc to skip boot.<br />15/04/87-dsakd32r.43834ksa.134931</p>
    </div>
  </div>
</template>
