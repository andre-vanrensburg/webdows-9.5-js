<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { BIOS_MENU, BIOS_FLAT, HARD_DISKS, biosDate, biosTime, type BiosController } from "../../core/src";
import { useStore } from "./useStore";

const props = defineProps<{ bios: BiosController }>();
const emit = defineEmits<{ exit: [] }>();
const s = useStore(props.bios.state);
const now = ref(new Date());
let t: ReturnType<typeof setInterval>;
onMounted(() => (t = setInterval(() => (now.value = new Date()), 1000)));
onUnmounted(() => clearInterval(t));

const act = (r: "exit" | null) => r === "exit" && emit("exit");
const flatIndex = (col: number, row: number) => col * BIOS_MENU[0].length + row;
const HEAD = ["HARD DISKS", "TYPE", "SIZE", "CYLS", "HEAD", "PRECOMP", "LANDZ", "SECTOR", "MODE"];
</script>

<template>
  <div id="bios" style="display: flex" @click="act(bios.clickBackground())">
    <div class="bios-head">
      <div>ROM ISA BIOS (WEBDOS94)</div>
      <div>{{ s.screen === "standard" ? "STANDARD CMOS SETUP" : "CMOS SETUP UTILITY" }}</div>
      <div>WEBDOS SOFTWARE, INC.</div>
    </div>

    <div class="bios-screen" :class="{ on: s.screen === 'main' }">
      <div class="bios-menu">
        <ul v-for="(col, ci) in BIOS_MENU" :key="ci">
          <li
            v-for="(item, ri) in col"
            :key="item.label"
            :class="{ sel: s.sel === flatIndex(ci, ri) }"
            @click.stop="act(bios.clickItem(flatIndex(ci, ri)))"
          >{{ item.label }}</li>
        </ul>
      </div>
      <div class="bios-keys">
        Esc : Quit &nbsp;&nbsp;&nbsp; ↑↓→← : Select Item<br />F10 : Save &amp; Exit Setup &nbsp;&nbsp;&nbsp; (Shift)F2 : Change Color
      </div>
      <div class="bios-hint">{{ BIOS_FLAT[s.sel].hint }}</div>
    </div>

    <div class="bios-screen" :class="{ on: s.screen === 'standard' }">
      <div class="bios-std">
        <div class="bios-std-top">
          <div>Date (mm:dd:yy) : <span class="bios-val">{{ biosDate(now) }}</span></div>
          <div>Time (hh:mm:ss) : <span class="bios-val">{{ biosTime(now) }}</span></div>
        </div>
        <table class="bios-table">
          <tbody>
            <tr class="bios-th"><td v-for="h in HEAD" :key="h">{{ h }}</td></tr>
            <tr v-for="row in HARD_DISKS" :key="row[0]">
              <td v-for="(v, i) in row" :key="i" :class="{ 'bios-val': i === 1 }">{{ v }}</td>
            </tr>
          </tbody>
        </table>
        <div class="bios-std-bottom">
          <div>
            <div>Drive A : <span class="bios-val">1.44M, 3.5 in.</span></div>
            <div>Drive B : <span class="bios-val">None</span></div>
            <br />
            <div>Video &nbsp;&nbsp;: <span class="bios-val">EGA/VGA</span></div>
            <div>Halt On : <span class="bios-val">All Errors</span></div>
            <div>Curiosity : <span class="bios-val bios-on">Enabled</span></div>
          </div>
          <div class="bios-membox">
            <div>Base Memory: &nbsp;&nbsp;&nbsp;640K</div>
            <div>Extended Memory: 7552K</div>
            <div>Other Memory: &nbsp;&nbsp;384K</div>
            <div class="bios-rule"></div>
            <div>Total Memory: &nbsp;8192K</div>
          </div>
        </div>
      </div>
      <div class="bios-keys">
        ESC : Quit &nbsp;&nbsp; ↑↓→← : Select Item &nbsp;&nbsp; PU/PD/+/- : Modify<br />F1 : Help &nbsp;&nbsp; (Shift)F2 : Change Color
      </div>
    </div>

    <div v-if="s.dialog" class="bios-dialog" style="display: block">
      <p class="bios-dialog-title">ACCESS DENIED</p>
      <p>You curious mind, you.</p>
      <p>I knew someone would press Del. Nothing in here can be changed, but Curiosity was already enabled, so you're all set.</p>
      <p class="bios-dialog-ok">Press Esc to continue booting</p>
    </div>
  </div>
</template>
