<template>
  <v-card elevation="3" class="mb-5">
    <v-card-title>Planned Activities</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="activity in plannedActivities" :key="activity.id">
          <v-list-item-content>
            <v-list-item-title>{{ activity.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.description }} <br />
              <strong>Date:</strong> {{ activity.date }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon color="green" @click="">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn icon color="blue" @click="">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-if="!plannedActivities.length" class="text-center">
        <p>No planned activities. Add one above!</p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Activity } from "@/lib/types";

const plannedActivities = ref<Activity[]>([]);
</script>
