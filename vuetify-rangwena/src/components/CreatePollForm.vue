<template>
  <v-card elevation="0" rounded="lg">
    <v-card-title>Open New Poll</v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="handleSubmit"
        class="grid gap-2"
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="newPoll.title"
          label="Poll Title"
          :rules="[rules.required]"
          variant="solo-filled"
          color="primary"
        ></v-text-field>
        <v-textarea
          counter="500"
          v-model="newPoll.description"
          label="Poll Description"
          :rules="[rules.required]"
          rows="3"
          variant="solo-filled"
          color="primary"
        ></v-textarea>
        <v-text-field
          type="number"
          v-model="newPoll.totalNumberOfvoters"
          label="Total Number of Voters"
          :rules="[rules.required]"
          variant="solo-filled"
          color="primary"
        ></v-text-field>
        <div class="mb-2">
          <h3 class="flex gap-2 items-center mb-2">
            <v-btn
              size="small"
              type="button"
              @click="addChoice"
              color="primary"
              rounded="lg"
              icon="mdi-plus-box"
            ></v-btn
            >Add Choices
          </h3>
          <div
            class="flex gap-2"
            v-for="({ value }, index) in choices"
            :key="index"
          >
            <v-text-field
              @update:model-value="(n) => handleChange(n, index)"
              :model-value="value"
              :placeholder="`Choice ${index + 1}`"
              :rules="[rules.required]"
              variant="solo-filled"
              color="primary"
              density="comfortable"
            ></v-text-field>
            <v-btn
              variant="tonal"
              @click="removeChoice(index)"
              type="button"
              color="primary"
              rounded="lg"
              icon="mdi-trash-can-outline"
            ></v-btn>
          </div>
        </div>
        <div>
          <v-btn type="submit" color="primary" class="ps-8 pe-8">
            Submit
          </v-btn>
        </div>
      </v-form>

      <ul class="mt-2 list-disc list-inside text-error">
        <li v-for="(error, index) in errors" :key="index">
          {{ error }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { CreatePoll } from "@/lib/types";
import { useAlertStore } from "@/stores/store.alerts";
import { useWsStore } from "@/stores/store.ws";

const { pushAlert } = useAlertStore();
const wsStore = useWsStore();
const newPoll = ref<CreatePoll>({
  title: "",
  description: "",
  totalNumberOfvoters: 0,
});

const form = useTemplateRef("form");

const choices = ref<{ value: string }[]>([{ value: "" }, { value: "" }]);

const errors = ref<string[]>([]);

const valid = ref(false);

const rules = {
  required: (value: string) => !!value || "This field is required",
};

const submitting = ref(false);

const handleChange = (newValue: string, index: number) => {
  choices.value.splice(index, 1, { value: newValue });
};

const addChoice = () => choices.value.push({ value: "" });

const removeChoice = (index: number) => choices.value.splice(index, 1);

const handleSubmit = async () => {
  if (valid.value) {
    submitting.value = true;
    const { title, description, totalNumberOfvoters } = newPoll.value;
    const res = await wsStore.createPoll({
      poll: {
        title,
        description,
        totalNumberOfvoters: Number(totalNumberOfvoters) || 0,
      },
      choices: choices.value,
    });
    if (res.status !== "success") {
      if (Array.isArray(res.message)) {
        errors.value = res.message;
      } else {
        errors.value = [`${res.message}`];
      }
    } else {
      pushAlert({
        alert: res,
      });
      errors.value = [];
      choices.value = [{ value: "" }, { value: "" }];
      form.value?.reset();
    }
  }
};
</script>
