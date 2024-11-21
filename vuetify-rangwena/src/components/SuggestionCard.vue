<template>
  <v-card :loading="!!!reactions">
    <v-text-field
      placeholder="Modify title"
      class="ps-4 pe-4 border-b"
      variant="plain"
      v-if="editting === 'title'"
      v-model="edittingValue"
    >
      <template #append-inner>
        <v-btn
          :loading="saving"
          :disabled="!!!edittingValue || saving"
          class="pa-0"
          density="comfortable"
          size="small"
          variant="tonal"
          color="primary"
          rounded="xl"
          @click="editSuggestion"
          icon="mdi-content-save-outline"
        ></v-btn>
        <v-btn
          :disabled="saving"
          @click="editting = null"
          class="pa-0"
          density="comfortable"
          size="small"
          variant="tonal"
          color="primary"
          rounded="xl"
          icon="mdi-close-circle-outline"
        ></v-btn>
      </template>
    </v-text-field>
    <v-card-title v-else
      ><v-chip
        v-if="authStore.principal?.id === suggestion.userId"
        @click="editting = 'title'"
        size="small"
        variant="text"
        prepend-icon="mdi-pen"
        class="border me-2"
        >edit</v-chip
      >{{ suggestion.title }}
    </v-card-title>
    <v-card-subtitle>
      Submitted by: <em class="font-semibold">@{{ suggestion.user }}</em>
    </v-card-subtitle>
    <v-card-text v-if="editting === 'description'">
      <v-textarea
        placeholder="Modify title"
        class="ps-4 pe-4 border rounded-lg"
        variant="plain"
        v-model="edittingValue"
      >
        <template #append-inner>
          <div class="grid gap-2">
            <v-btn
              :loading="saving"
              :disabled="saving || !!!edittingValue"
              class="pa-0"
              density="comfortable"
              size="small"
              variant="tonal"
              color="primary"
              rounded="xl"
              @click="editSuggestion"
              icon="mdi-content-save-outline"
            ></v-btn>
            <v-btn
              :disabled="saving"
              @click="editting = null"
              class="pa-0"
              density="comfortable"
              size="small"
              variant="tonal"
              color="primary"
              rounded="xl"
              icon="mdi-close-circle-outline"
            ></v-btn>
          </div>
        </template>
      </v-textarea>
    </v-card-text>
    <v-card-text v-else>
      {{ suggestion.description }}
      <div
        v-if="authStore.principal?.id === suggestion.userId"
        class="inline-block float-end"
      >
        <v-chip
          @click="editting = 'description'"
          size="small"
          variant="text"
          prepend-icon="mdi-pen"
          class="border"
          >edit</v-chip
        >
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        size="small"
        icon
        @click="toggle(reactions?.me === 'like' ? 'dismiss' : 'like')"
      >
        <v-icon color="primary">
          {{
            reactions?.me === "like" ? "mdi-thumb-up" : "mdi-thumb-up-outline"
          }}
        </v-icon>
      </v-btn>
      <span class="text-sm">{{ reactions?.like }}</span>
      <v-btn
        size="small"
        icon
        @click="toggle(reactions?.me === 'dislike' ? 'dismiss' : 'dislike')"
      >
        <v-icon color="secondary">
          {{
            reactions?.me === "dislike"
              ? "mdi-thumb-down"
              : "mdi-thumb-down-outline"
          }}
        </v-icon>
      </v-btn>
      <span class="text-sm">{{ reactions?.dislike }}</span>
      <v-spacer />
      <v-btn
        :disabled="deleting || !(authStore.principal?.id === suggestion.userId || authStore.isAdmin)"
        @click="deleteSuggestion"
        class="pa-0"
        density="comfortable"
        size="small"
        color="primary"
        rounded="xl"
        icon="mdi-trash-can-outline"
      ></v-btn>
      <v-btn
        :disabled="!authStore.isAdmin"
        rounded="xl"
        class=""
        small
        @click="toggle('resolve')"
        v-if="!suggestion.resolved"
      >
        <span class="text-xs">Mark Resolved</span>
      </v-btn>
      <v-chip
        @click="toggle('unresolve')"
        prepend-icon="mdi-check"
        rounded="xl"
        v-else-if="authStore.isAdmin"
        label
        >Mark Unresolved</v-chip
      >
      <v-chip append-icon="mdi-check" rounded="xl" v-else color="primary" label
        >Resolved</v-chip
      >
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosGet } from "@/lib/lib.axios";
import {
  Suggestion,
  SuggestionReactions,
  SuggestionToggleAction,
} from "@/lib/types";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useSuggestionStore } from "@/stores/store.suggestions";

const suggestionStore = useSuggestionStore();
const authStore = useAuthStore();
const { pushAlert } = useAlertStore();

const handleRequest = useAPI();

const reactions = ref<SuggestionReactions | null>(null);

const props = defineProps<{
  suggestion: Suggestion;
}>();

const editting = ref<string | null>(null);
const edittingValue = ref("");
const saving = ref(false);
const deleting = ref(false);

const editSuggestion = async () => {
  if (editting.value) {
    saving.value = true;
    const success = await suggestionStore.update(props.suggestion.id, {
      [editting.value]: edittingValue.value,
    });
    saving.value = false;
    if (success) {
      editting.value = null;
    } else {
      pushAlert({
        alert: {
          status: "success",
          message: "Failed to update suggestion. Please try again later!",
        },
      });
    }
  }
};

const deleteSuggestion = async () => {
  deleting.value = true;
  const response = await suggestionStore.delete(props.suggestion.id);
  deleting.value = false;
  pushAlert({
    alert: response,
  });
};

const toggle = async (value: SuggestionToggleAction) => {
  await suggestionStore.toggle(props.suggestion, value);
  await fetchReactions();
};

const fetchReactions = async () => {
  await handleRequest<SuggestionReactions>({
    func: axiosGet,
    args: [
      APIS.suggestions.countReactions.replace(
        "<:suggestionId>",
        props.suggestion.id
      ),
    ],
  }).then((res) => {
    if (res.status === "ok" && res.result) {
      reactions.value = res.result;
    }
  });
};

onMounted(async () => {
  await fetchReactions();
});
watchEffect(() => {
  if (editting.value) {
    edittingValue.value =
      editting.value === "title"
        ? props.suggestion.title
        : props.suggestion.description;
  }
});
</script>
<style lang=""></style>
