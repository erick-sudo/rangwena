<template>
  <div style="z-index: 999;" class="fixed bottom-4 w-full max-w-sm left-1/2 -translate-x-1/2 grid gap-2">
    <div v-for="(alertObj, index) in alerts" :key="index">
      <DisplayObject class="px-4 py-1.5 rounded-md text-sm" :data="alertObj.alert">
        <button @click="dismissAlert(alertObj.key)" class="font-bold">&times;</button>
      </DisplayObject>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAlertStore } from '@/stores/store.alerts';
import DisplayObject from './DisplayObject.vue';

const alertStore = useAlertStore();

// Computed property to access alerts from the store
const alerts = computed(() => alertStore.alerts);

const dismissAlert = (key: string) => {
  alertStore.removeAlert(key);
};
</script>
