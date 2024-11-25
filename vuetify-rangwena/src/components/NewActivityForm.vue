<template>
  <v-card variant="text" elevation="0" rounded="0">
    <v-card-title>Plan a New Activity</v-card-title>
    <v-card-text>
      <v-form
        :disabled="!authstore.isAdmin"
        @submit.prevent="handleSubmit"
        ref="form"
        v-model="valid"
      >
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
          :disabled="!authstore.isAdmin"
          v-model="newActivity.date"
          width="100%"
          show-adjacent-months
          elevation="10"
          color="primary"
          class="border border-primary"
        >
          <template #title>
            <h3>Preferred date</h3>
          </template>
        </v-date-picker>
        <div class="flex justify-end">
          <v-btn
            :disabled="!authstore.isAdmin"
            :loading="submitting"
            color="primary"
            class="mt-3"
            type="submit"
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
import { useActivityStore } from "@/stores/store.activities";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const authstore = useAuthStore();
const activityStore = useActivityStore();
const { pushAlert } = useAlertStore();

const newActivity = ref<CreateActivity>({
  title: "",
  description: "",
  date: new Date(),
});

const valid = ref(false);
const submitting = ref(false);

const rules = {
  required: (value: string) => !!value || "This field is required",
};

const handleSubmit = async () => {
  if (valid.value) {
    submitting.value = true;
    const res = await activityStore.addActivity(newActivity.value);
    submitting.value = false;
    pushAlert({ alert: res });
  }
};
</script>
