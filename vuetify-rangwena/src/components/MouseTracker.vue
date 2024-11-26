<template>
  <slot :x="coordinates.x" :y="coordinates.y"></slot>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const coordinates = ref<{ x: number; y: number }>({ x: 0, y: 0 });

onMounted(() => {
  window.addEventListener("mousemove", (e: MouseEvent) => {
    const { x, y } = e;
    coordinates.value = { x, y };
  });
});
</script>
