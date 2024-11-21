<template>
  <v-form
    @submit.prevent="addSuggestion"
    v-model="formValid"
    ref="suggestion-form"
  >
    <v-card-title>Add Suggestion</v-card-title>
    <v-card-text>
      <v-text-field
        density="comfortable"
        color="primary"
        v-model="newSuggestion.title"
        label="Subject"
        :rules="[(v) => !!v || 'Please enter subject']"
        class="mb-2"
      />
      <v-textarea
        counter="500"
        density="comfortable"
        color="primary"
        v-model="newSuggestion.description"
        label="Description"
        :rules="[(v) => !!v || 'Please describe your suggestion']"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn type="button" rounded="xl" variant="text" @click="emit('cancel')"
        >Cancel</v-btn
      >
      <v-btn type="submit" rounded="xl" variant="tonal" color="primary"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-form>
</template>
<script setup lang="ts">
import { CreateSuggestion } from "@/lib/types";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useSuggestionStore } from "@/stores/store.suggestions";

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "added"): void;
}>();

const authStore = useAuthStore();
const { pushAlert } = useAlertStore();
const suggestionStore = useSuggestionStore();
const suggestionForm = useTemplateRef("suggestion-form");
const formValid = ref(false);
const newSuggestion = ref<CreateSuggestion>({
  title: "",
  description: "",
});

const addSuggestion = async () => {
  if (formValid.value && authStore.principal?.username) {
    const response = await suggestionStore.addSuggestion(
      newSuggestion.value,
      authStore.principal?.username
    );
    if (response.status === "success") {
      suggestionForm.value?.reset();
      emit("added");
    }
    pushAlert({ alert: response });
  }
};
</script>
