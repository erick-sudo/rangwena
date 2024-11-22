<template>
  <v-card elevation="3">
    <v-card-title>Previous Activities</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="activity in previousActivities" :key="activity.id">
          <v-list-item-content>
            <v-list-item-title>{{ activity.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.description }} <br />
              <strong>Date Completed:</strong> {{ activity.date }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-if="!previousActivities.length" class="text-center">
        <p>No previous activities yet!</p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Activity } from "@/lib/types";

const previousActivities = ref<Activity[]>([]);
</script>
