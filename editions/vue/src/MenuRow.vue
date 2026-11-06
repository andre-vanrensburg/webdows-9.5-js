<script setup lang="ts">
import { computed } from "vue";
import { splitLabel, type MenuItem } from "../../core/src";
import { IMG } from "./assets";

const props = defineProps<{ item: MenuItem; openSub: string | null; inSub?: boolean }>();
defineEmits<{ choose: [item: MenuItem] }>();
const parts = computed(() => splitLabel(props.item));
</script>

<template>
  <li
    class="start-menu-items-item"
    :class="{ 'has-sub': item.children, 'sub-item': inSub, 'sub-open': openSub === item.label }"
    @click.stop="$emit('choose', item)"
  >
    <div class="icon">
      <i v-if="item.icon.fa" :class="['fa-solid', item.icon.fa]"></i>
      <img v-else :src="IMG + item.icon.img" alt="" width="100%" height="auto" />
    </div>
    <p>{{ parts[0] }}<span v-if="parts[1]" class="underline">{{ parts[1] }}</span>{{ parts[2] }}</p>
    <template v-if="item.children">
      <span class="arrow">&#9654;</span>
      <ul class="submenu">
        <MenuRow v-for="c in item.children" :key="c.label" :item="c" :open-sub="openSub" in-sub @choose="$emit('choose', $event)" />
      </ul>
    </template>
  </li>
</template>
