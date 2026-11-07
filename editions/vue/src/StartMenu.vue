<script setup lang="ts">
import { ref } from "vue";
import { START_MENU, showShutdown, type MenuItem, type WindowManager } from "../../core/src";
import { EDITION, LOGO, SCREEN } from "./assets";
import MenuRow from "./MenuRow.vue";

const props = defineProps<{ wm: WindowManager }>();
const emit = defineEmits<{ close: [] }>();
const sub = ref<string | null>(null);

function choose(item: MenuItem) {
  if (item.children) {
    // Touch screens can't hover, so a tap toggles the flyout
    sub.value = sub.value === item.label ? null : item.label;
    return;
  }
  emit("close");
  if (item.shutdown) return showShutdown({ from: EDITION, screen: SCREEN, preselect: "shutdown" });
  if (item.app) props.wm.open(item.app);
  else if (item.curious) props.wm.curious(item.label);
}
</script>

<template>
  <div class="start-menu" style="display: grid" @click.stop>
    <div class="start-menu-side">
      <div class="start-menu-side-text text">
        <p class="ninefive">9.5</p>
        <p class="windows">Webdows</p>
        <img :src="LOGO" alt="" width="100%" height="auto" />
      </div>
    </div>
    <div class="start-menu-items">
      <ul
        v-for="(group, gi) in START_MENU"
        :key="gi"
        :class="gi === START_MENU.length - 1 ? 'start-menu-items-list2' : 'start-menu-items-list1'"
      >
        <MenuRow v-for="item in group" :key="item.label" :item="item" :open-sub="sub" @choose="choose" />
      </ul>
    </div>
  </div>
</template>
