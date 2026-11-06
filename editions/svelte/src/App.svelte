<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { BootSequence, BiosController, WindowManager, EDITIONS, editionHref, playWelcome, type Edition } from "../../core/src";
  import { EDITION, LOGO, SOUND, IMG } from "./assets";
  import PostScreen from "./PostScreen.svelte";
  import PromptScreen from "./PromptScreen.svelte";
  import BiosSetup from "./BiosSetup.svelte";
  import Desktop from "./Desktop.svelte";
  import TaskBar from "./TaskBar.svelte";

  const boot = new BootSequence(() => playWelcome(SOUND));
  const bios = new BiosController();
  const wm = new WindowManager(EDITION, LOGO);
  const bootState = boot.state;
  const others = EDITIONS.filter((e) => e.key !== EDITION.key);
  let rebooting = $state<string | null>(null);

  function enterBios() {
    if (!boot.canEnterBios()) return;
    bios.reset();
    boot.enterBios();
  }

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

  function reboot(ed: Edition) {
    wm.closeAll();
    rebooting = ed.name;
    setTimeout(() => (location.href = editionHref(EDITION.key, ed)), 1500);
  }

  onMount(() => boot.start());
  onDestroy(() => boot.destroy());
</script>

<svelte:window onkeydown={onKey} />

{#if $bootState.phase === "post"}<PostScreen onsetup={enterBios} />{/if}
{#if $bootState.phase === "prompt"}<PromptScreen {boot} />{/if}
{#if $bootState.phase === "loading"}<div id="loading" style="background-image: url({IMG}loading-svelte.jpg)"></div>{/if}
{#if $bootState.phase === "bios"}<BiosSetup {bios} onexit={() => boot.exitBios()} />{/if}
<Desktop {wm} />
<TaskBar {wm} editions={others} onreboot={reboot} />
{#if rebooting}
  <div id="reboot" style="display: block"><p>Shutting down Webdows... Rebooting into the {rebooting} Edition.</p></div>
{/if}
