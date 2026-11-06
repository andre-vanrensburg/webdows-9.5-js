<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { startDrag, type Win, type WindowManager } from "../../core/src";
import MineSweeper from "./MineSweeper.vue";

const props = defineProps<{ win: Win; active: boolean; wm: WindowManager }>();
const el = ref<HTMLDivElement | null>(null);

// Dialogs and Minesweeper open centred, once we know how big they are
onMounted(async () => {
  await nextTick();
  if (!props.win.placed && el.value) props.wm.place(props.win.id, el.value.offsetWidth, el.value.offsetHeight);
});

const classes = computed(() => [
  "window",
  { active: props.active, maximize: props.win.maximized },
  props.win.size !== "normal" ? props.win.size : ""
]);

function dragStart(e: PointerEvent) {
  if (!props.win.maximized) startDrag(e, props.win.x, props.win.y, (x, y) => props.wm.move(props.win.id, x, y));
}
</script>

<template>
  <div
    ref="el"
    :class="classes"
    role="dialog"
    :aria-label="win.title"
    :style="{
      display: win.minimized ? 'none' : 'flex',
      left: win.x + 'px',
      top: win.y + 'px',
      zIndex: win.z,
      visibility: win.placed ? 'visible' : 'hidden'
    }"
    @pointerdown="wm.focus(win.id)"
  >
    <div class="titlebar" @pointerdown="dragStart" @dblclick="wm.toggleMax(win.id)">
      <span class="title">{{ win.title }}</span>
      <div class="titlebar-buttons" @pointerdown.stop>
        <div class="titlebar-button min" title="Minimise" @click="wm.minimize(win.id)"><i class="fa-solid fa-window-minimize"></i></div>
        <div v-if="win.size !== 'fit'" class="titlebar-button max" title="Maximise" @click="wm.toggleMax(win.id)">
          <i class="fa-sharp fa-regular fa-square"></i>
        </div>
        <div class="titlebar-button close" title="Close" @click="wm.close(win.id)"><i class="fa-solid fa-xmark"></i></div>
      </div>
    </div>
    <div class="content-body">
      <div v-if="win.app === 'minesweeper'" class="content"><MineSweeper @exit="wm.close(win.id)" /></div>
      <div v-else class="content" v-html="win.html"></div>
    </div>
    <div v-if="win.size !== 'fit'" class="footer-buttons">
      <button class="button ok" @click="wm.close(win.id)">OK</button>
    </div>
  </div>
</template>
