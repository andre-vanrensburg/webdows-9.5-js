<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { MinesweeperGame, LEVELS, FACES, cellView, led, HOWTO_HTML, ABOUT_MS_HTML, bestTimesHtml, type LevelKey } from "../../core/src";
  let { onexit }: { onexit: () => void } = $props();

  const game = new MinesweeperGame();
  const ms = game.state;
  let menu = $state<"game" | "help" | null>(null);
  let note = $state<string | null>(null);
  const mountedAt = Date.now();
  let pressTimer: ReturnType<typeof setTimeout> | undefined;
  let longPressed = false;
  const levels = Object.keys(LEVELS) as LevelKey[];

  $effect(() => {
    const best = $ms.newBest;
    if (best === null) return;
    note = `<p>You have the fastest time for ${LEVELS[$ms.level].name.toLowerCase()} level: <b>${best} seconds</b>.</p>`;
    game.clearNewBest();
  });

  const up = () => game.setPressing(false);
  const closeMenu = () => (menu = null);
  const f2 = (e: KeyboardEvent) => {
    if (e.key === "F2") {
      e.preventDefault();
      game.newGame();
    }
  };
  onMount(() => {
    document.addEventListener("mouseup", up);
    document.addEventListener("click", closeMenu);
    document.addEventListener("keydown", f2);
  });
  onDestroy(() => {
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
  const over = () => $ms.state === "won" || $ms.state === "lost";

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

  function toggle(e: MouseEvent, id: "game" | "help") {
    e.stopPropagation();
    menu = menu === id ? null : id;
  }
  function cmd(c: string) {
    menu = null;
    if (c === "new") game.newGame();
    else if (c in LEVELS) game.newGame(c as LevelKey);
    else if (c === "best") note = bestTimesHtml();
    else if (c === "howto") note = HOWTO_HTML;
    else if (c === "about") note = ABOUT_MS_HTML;
    else if (c === "exit") onexit();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="ms">
  <div class="ms-menubar">
    <div class="ms-menu" class:open={menu === "game"}>
      <span class="ms-menu-title" onclick={(e) => toggle(e, "game")}><u>G</u>ame</span>
      <div class="ms-dropdown">
        <div onclick={() => cmd("new")}>New<span>F2</span></div>
        <hr />
        {#each levels as k}
          <div class="ms-level" class:on={$ms.level === k} onclick={() => cmd(k)}><b>&#10003;</b>{LEVELS[k].name}</div>
        {/each}
        <hr />
        <div onclick={() => cmd("best")}>Best Times...</div>
        <hr />
        <div onclick={() => cmd("exit")}>Exit</div>
      </div>
    </div>
    <div class="ms-menu" class:open={menu === "help"}>
      <span class="ms-menu-title" onclick={(e) => toggle(e, "help")}><u>H</u>elp</span>
      <div class="ms-dropdown">
        <div onclick={() => cmd("howto")}>How to Play</div>
        <hr />
        <div onclick={() => cmd("about")}>About Minesweeper...</div>
      </div>
    </div>
  </div>

  <div class="ms-body">
    <div class="ms-top">
      <div class="ms-led">{led($ms.minesLeft)}</div>
      <button class="ms-face" aria-label="New game" onclick={() => game.newGame()}>{@html FACES[$ms.face]}</button>
      <div class="ms-led">{led($ms.seconds)}</div>
    </div>
    <div
      class="ms-grid"
      role="grid"
      tabindex="-1"
      style="grid-template-columns: repeat({$ms.cols}, 16px)"
      oncontextmenu={(e) => e.preventDefault()}
      onmousedown={onDown}
      onclick={onClick}
      ontouchstart={onTouchStart}
      ontouchend={cancelPress}
      ontouchmove={cancelPress}
    >
      {#each $ms.cells as c, i}
        {@const v = cellView(c)}
        <div data-i={i} class={v.cls}>{@html v.html}</div>
      {/each}
    </div>
  </div>

  {#if note}
    <div class="ms-note" style="display: block">
      <div>{@html note}</div>
      <div class="ms-note-btn"><button class="button" onclick={() => (note = null)}>OK</button></div>
    </div>
  {/if}
</div>
