<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { BootSequence, BiosController, WindowManager, EDITIONS, editionHref, playWelcome, type Edition } from "../../core/src";
import { useStore } from "./useStore";
import { EDITION, LOGO, SOUND } from "./assets";
import PostScreen from "./PostScreen.vue";
import PromptScreen from "./PromptScreen.vue";
import BiosSetup from "./BiosSetup.vue";
import DesktopArea from "./DesktopArea.vue";
import TaskBar from "./TaskBar.vue";

const boot = new BootSequence(() => playWelcome(SOUND));
const bios = new BiosController();
const wm = new WindowManager(EDITION, LOGO);
const bootState = useStore(boot.state);
const rebooting = ref<string | null>(null);
const others = EDITIONS.filter((e) => e.key !== EDITION.key);

// Global keys: Del enters setup during boot, Esc skips the boot, the BIOS takes every key while open
function onKey(e: KeyboardEvent) {
  if (boot.state.get().phase === "bios") {
    e.preventDefault();
    if (bios.key(e.key) === "exit") boot.exitBios();
    return;
  }
  if (boot.canEnterBios() && (e.key === "Delete" || e.key === "Del")) {
    e.preventDefault();
    enterBios();
  } else if (e.key === "Escape") boot.skip();
}

function enterBios() {
  if (!boot.canEnterBios()) return;
  bios.reset();
  boot.enterBios();
}

function reboot(ed: Edition) {
  wm.closeAll();
  rebooting.value = ed.name;
  setTimeout(() => (location.href = editionHref(EDITION.key, ed)), 1500);
}

onMounted(() => {
  boot.start();
  window.addEventListener("keydown", onKey);
});
onUnmounted(() => {
  boot.destroy();
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <PostScreen v-if="bootState.phase === 'post'" @setup="enterBios" />
  <PromptScreen v-if="bootState.phase === 'prompt'" :boot="boot" />
  <div v-if="bootState.phase === 'loading'" id="loading" style="background-image: url(../img/loading-vue.jpg)" />
  <BiosSetup v-if="bootState.phase === 'bios'" :bios="bios" @exit="boot.exitBios()" />
  <DesktopArea :wm="wm" />
  <TaskBar :wm="wm" :editions="others" @reboot="reboot" />
  <div v-if="rebooting" id="reboot" style="display: block">
    <p>Shutting down Webdows... Rebooting into the {{ rebooting }} Edition.</p>
  </div>
</template>
