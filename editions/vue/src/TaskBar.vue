<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { taskbarTime, type Edition, type WindowManager } from "../../core/src";
import { useStore } from "./useStore";
import StartMenu from "./StartMenu.vue";

const props = defineProps<{ wm: WindowManager; editions: Edition[] }>();
defineEmits<{ reboot: [ed: Edition] }>();
const state = useStore(props.wm.state);
const open = ref(false);
const now = ref(new Date());
let t: ReturnType<typeof setInterval>;
const close = () => (open.value = false);
onMounted(() => {
  t = setInterval(() => (now.value = new Date()), 1000);
  document.addEventListener("click", close);
});
onUnmounted(() => {
  clearInterval(t);
  document.removeEventListener("click", close);
});
</script>

<template>
  <div class="taskbar">
    <div class="start-button button" title="Start" @click.stop="open = !open">Start</div>
    <div class="tasks">
      <div
        v-for="w in state.windows"
        :key="w.id"
        class="task button"
        :class="{ pressed: state.active === w.id && !w.minimized }"
        @click="wm.taskClick(w.id)"
      >{{ w.title }}</div>
    </div>
    <div class="taskbar-time">
      <i v-for="ed in editions" :key="ed.key" :class="[ed.icon, 'tray-edition']" :title="'Reboot in ' + ed.name" @click="$emit('reboot', ed)"></i>
      <p class="taskbar-time-text" :title="now.toLocaleDateString()">{{ taskbarTime(now) }}</p>
    </div>
  </div>
  <StartMenu v-if="open" :wm="wm" @close="open = false" />
</template>
