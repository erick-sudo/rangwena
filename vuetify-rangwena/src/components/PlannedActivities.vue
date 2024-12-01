<template>
  <v-card variant="text" rounded="0" elevation="0">
    <v-card-title>Planned Activities</v-card-title>
    <v-card-subtitle v-if="$slots.subtitle">
      <slot name="subtitle"></slot>
    </v-card-subtitle>
    <v-card-text class="pt-1">
      <div v-if="activitiesStore.planned.length">
        <v-card
          rounded="0"
          variant="text"
          class="pt-2 border-b"
          :class="{ 'border-t': index === 0 }"
          v-for="(activity, index) in activitiesStore.planned"
          :key="activity.id"
        >
          <v-card-subtitle class="mb-2 ps-0">{{
            activity.title
          }}</v-card-subtitle>
          <v-card-text class="pa-0">
            <v-img
              height="100"
              cover
              src="http://192.168.158.148:8000/gnome/xfce-leaves.svg"
            ></v-img>
            <div class="mt-2">{{ activity.description }}</div>
            <div class="my-2">
              Date:
              <em class="text-secondary ms-2">{{
                new Date(activity.date).toDateString()
              }}</em>
            </div>
          </v-card-text>

          <v-card-actions v-if="authstore.isAdmin" class="pa-0">
            <v-checkbox-btn
              @update:model-value="(v) => emit('toggle', activity, v)"
              :model-value="activity.completed"
              color="primary"
              inline
              density="comfortable"
            ></v-checkbox-btn>
            <em>Mark as completed</em>
            <v-spacer></v-spacer>
            <v-btn
              size="small"
              variant="tonal"
              density="comfortable"
              icon
              color="primary"
              @click="emit('edit', activity)"
            >
              <v-icon size="small">mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              size="small"
              @click="emit('delete', activity)"
              density="comfortable"
              icon
              color="error"
              variant="tonal"
            >
              <v-icon size="small">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else class="flex flex-col items-center py-4 gap-3">
        <v-img width="300" src="/svg/undraw_empty_street.svg"></v-img>
        <p class="max-w-36 text-center">No planned activities.</p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Activity } from "@/lib/types";
import { useActivityStore } from "@/stores/store.activities";
import { useAuthStore } from "@/stores/store.auth";

const authstore = useAuthStore();
const activitiesStore = useActivityStore();

const emit = defineEmits<{
  (e: "delete", activity: Activity): void;
  (e: "edit", activity: Activity): void;
  (e: "toggle", activity: Activity, completed: boolean): void;
}>();
</script>
