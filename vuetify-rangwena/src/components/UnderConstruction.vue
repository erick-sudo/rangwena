<template>
  <mouse-tracker v-slot="{ x, y }">
    <div
      :style="{
        position: 'absolute',
        left: `${x - 144}px`,
        top: `${y - 144}px`,
      }"
      class="z-40 h-96 w-96 rounded-full bg-radial-gradient from-[#FF3D00] via-transparent to-transparent"
    ></div>
  </mouse-tracker>

  <div class="z-50 p-12 flex flex-col items-center justify-center gap-4">
    <h1 class="text-2xl font-extrabold border p-4 uppercase">
      under <span class="text-primary">construction</span>
    </h1>
    <v-img class="h-72 w-full" src="/svg/undraw_taken.svg"></v-img>
    <div>
      <p class="text-lg">Please visit later!!</p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="css" scoped></style>
