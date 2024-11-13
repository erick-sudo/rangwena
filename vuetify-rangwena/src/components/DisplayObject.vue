<template>
  <div
    :class="{
      's-success': data.status === 'success',
      's-error': data.status === 'error',
      's-warning': data.status === 'warning',
      's-info': data.status === 'info',
      's-success-fill': data.status === 'success-fill',
      's-error-fill': data.status === 'error-fill',
      's-warning-fill': data.status === 'warning-fill',
      's-info-fill': data.status === 'info-fill',
    }"
  >
    <div class="flex items-start gap-2">
      <!-- If type of steps is flat -->
      <div class="flex-grow" v-if="flatTypes.includes(typeof data.message)">
        {{ data.message }}
      </div>

      <!-- If type of steps is array -->
      <div class="flex-grow" v-if="Array.isArray(data.message)">
        <div v-for="(el, index) in data.message" :key="index">
          {{ el }}
        </div>
      </div>

      <div class="">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { AlertResponse } from "./ui.definitions";

const flatTypes = [
  "string",
  "number",
  "undefined",
  "symbol",
  "boolean",
  "bigint",
];

defineProps<{
  data: AlertResponse;
}>();
</script>

<style scoped></style>
