<script setup lang="ts">
import { reactive } from "vue";
import { DESKTOP_ICONS, startDrag, type WindowManager } from "../../core/src";
import { useStore } from "./useStore";
import { IMG } from "./assets";
import WinFrame from "./WinFrame.vue";

const props = defineProps<{ wm: WindowManager }>();
const state = useStore(props.wm.state);
const pos = reactive(Object.fromEntries(DESKTOP_ICONS.map((i) => [i.app, { x: 0, y: i.top }])));
const coarse = window.matchMedia("(pointer: coarse)").matches;

function drag(e: PointerEvent, app: string) {
  startDrag(e, pos[app].x, pos[app].y, (x, y) => {
    pos[app].x = x;
    pos[app].y = y;
  });
}
</script>

<template>
  <div
    v-for="icon in DESKTOP_ICONS"
    :key="icon.app"
    class="icon-content"
    :title="icon.label"
    tabindex="0"
    :style="{ top: pos[icon.app].y + 'px', left: pos[icon.app].x + 'px' }"
    @dblclick="wm.open(icon.app)"
    @click="coarse && wm.open(icon.app)"
    @keydown.enter="wm.open(icon.app)"
  >
    <img :src="IMG + icon.img" width="50" height="50" alt="" draggable="false" @pointerdown="drag($event, icon.app)" />
    <a>{{ icon.label }}</a>
  </div>
  <WinFrame v-for="w in state.windows" :key="w.id" :win="w" :active="state.active === w.id" :wm="wm" />
</template>
