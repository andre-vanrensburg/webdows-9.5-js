<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { MinesweeperGame, LEVELS, FACES, cellView, led, HOWTO_HTML, ABOUT_MS_HTML, bestTimesHtml, type LevelKey } from "../../core/src";
import { useStore } from "./useStore";

const emit = defineEmits<{ exit: [] }>();
const game = new MinesweeperGame();
const s = useStore(game.state);
const menu = ref<"game" | "help" | null>(null);
const note = ref<string | null>(null);
const mountedAt = Date.now();
let pressTimer: ReturnType<typeof setTimeout> | undefined;
let longPressed = false;
const levels = Object.keys(LEVELS) as LevelKey[];

watch(
  () => s.value.newBest,
  (best) => {
    if (best === null) return;
    note.value = `<p>You have the fastest time for ${LEVELS[s.value.level].name.toLowerCase()} level: <b>${best} seconds</b>.</p>`;
    game.clearNewBest();
  }
);

const up = () => game.setPressing(false);
const closeMenu = () => (menu.value = null);
const f2 = (e: KeyboardEvent) => {
  if (e.key === "F2") {
    e.preventDefault();
    game.newGame();
  }
};
onMounted(() => {
  document.addEventListener("mouseup", up);
  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", f2);
});
onUnmounted(() => {
  game.destroy();
  document.removeEventListener("mouseup", up);
  document.removeEventListener("click", closeMenu);
  document.removeEventListener("keydown", f2);
});

// Ignore stray clicks left over from the double-click that opened the window
const tooSoon = () => Date.now() - mountedAt < 400;
const cellIndex = (t: EventTarget | null) => {
  const el = (t as HTMLElement | null)?.closest(".ms-cell") as HTMLElement | null;
  return el ? Number(el.dataset.i) : -1;
};
const over = () => s.value.state === "won" || s.value.state === "lost";

function onDown(e: MouseEvent) {
  const i = cellIndex(e.target);
  if (i < 0 || tooSoon() || over()) return;
  if (e.button === 0) game.setPressing(true);
  if (e.button === 2) game.mark(i);
  if (e.button === 1) {
    e.preventDefault();
    game.chord(i);
  }
}
function onClick(e: MouseEvent) {
  if (longPressed) {
    longPressed = false;
    return;
  }
  const i = cellIndex(e.target);
  if (i >= 0 && !tooSoon()) game.open(i);
}
function onTouchStart(e: TouchEvent) {
  const i = cellIndex(e.target);
  if (i < 0) return;
  longPressed = false;
  pressTimer = setTimeout(() => {
    longPressed = true;
    game.mark(i);
    navigator.vibrate?.(30);
  }, 400);
}
const cancelPress = () => clearTimeout(pressTimer);

function toggleMenu(id: "game" | "help") {
  menu.value = menu.value === id ? null : id;
}
function cmd(c: string) {
  menu.value = null;
  if (c === "new") game.newGame();
  else if (c in LEVELS) game.newGame(c as LevelKey);
  else if (c === "best") note.value = bestTimesHtml();
  else if (c === "howto") note.value = HOWTO_HTML;
  else if (c === "about") note.value = ABOUT_MS_HTML;
  else if (c === "exit") emit("exit");
}
</script>

<template>
  <div class="ms">
    <div class="ms-menubar">
      <div class="ms-menu" :class="{ open: menu === 'game' }">
        <span class="ms-menu-title" @click.stop="toggleMenu('game')"><u>G</u>ame</span>
        <div class="ms-dropdown">
          <div @click="cmd('new')">New<span>F2</span></div>
          <hr />
          <div v-for="k in levels" :key="k" class="ms-level" :class="{ on: s.level === k }" @click="cmd(k)">
            <b>&#10003;</b>{{ LEVELS[k].name }}
          </div>
          <hr />
          <div @click="cmd('best')">Best Times...</div>
          <hr />
          <div @click="cmd('exit')">Exit</div>
        </div>
      </div>
      <div class="ms-menu" :class="{ open: menu === 'help' }">
        <span class="ms-menu-title" @click.stop="toggleMenu('help')"><u>H</u>elp</span>
        <div class="ms-dropdown">
          <div @click="cmd('howto')">How to Play</div>
          <hr />
          <div @click="cmd('about')">About Minesweeper...</div>
        </div>
      </div>
    </div>

    <div class="ms-body">
      <div class="ms-top">
        <div class="ms-led">{{ led(s.minesLeft) }}</div>
        <button class="ms-face" aria-label="New game" @click="game.newGame()" v-html="FACES[s.face]"></button>
        <div class="ms-led">{{ led(s.seconds) }}</div>
      </div>
      <div
        class="ms-grid"
        role="grid"
        :style="{ gridTemplateColumns: `repeat(${s.cols}, 16px)` }"
        @contextmenu.prevent
        @mousedown="onDown"
        @click="onClick"
        @touchstart.passive="onTouchStart"
        @touchend="cancelPress"
        @touchmove.passive="cancelPress"
      >
        <div v-for="(c, i) in s.cells" :key="i" :data-i="i" :class="cellView(c).cls" v-html="cellView(c).html"></div>
      </div>
    </div>

    <div v-if="note" class="ms-note" style="display: block">
      <div v-html="note"></div>
      <div class="ms-note-btn"><button class="button" @click="note = null">OK</button></div>
    </div>
  </div>
</template>
