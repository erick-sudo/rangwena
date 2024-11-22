<template>
  <v-card elevation="3" class="mb-5">
    <v-card-title>Plan a New Activity</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="newActivity.title"
          label="Activity Title"
          :rules="[rules.required]"
          variant="solo-filled"
          color="primary"
        ></v-text-field>
        <v-textarea
          counter="500"
          v-model="newActivity.description"
          label="Describe Activity"
          :rules="[rules.required]"
          rows="3"
          variant="solo-filled"
          color="primary"
        ></v-textarea>
        <v-date-picker
          show-week
          elevation="10"
          color="primary"
          class="border border-primary"
        >
          <template #title>
            <h3>Preferred date</h3>
          </template>
          <template #header>
            <v-date-picker-header>Schedule Date</v-date-picker-header>
          </template>
        </v-date-picker>
        <div class="flex justify-end">
          <v-btn
            :disabled="valid"
            @click="addActivity"
            color="primary"
            class="mt-3"
          >
            Add Activity
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { CreateActivity } from "@/lib/types";

const newActivity = ref<CreateActivity>({
  title: "",
  description: "",
  date: "",
});

const valid = ref(false);

const rules = {
  required: (value: string) => !!value || "This field is required",
};

const addActivity = () => {};
</script>
