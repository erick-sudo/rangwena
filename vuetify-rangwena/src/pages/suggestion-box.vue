<template>
  <div class="p-2">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <v-text-field
        rounded="xl"
        density="compact"
        v-model="search"
        placeholder="Search suggestions"
        clearable
        class=""
        prepend-inner-icon="mdi-search"
        variant="solo-filled"
      >
        <template #append-inner>
          <v-btn class="pa-0" size="small" color="primary" rounded="xl"
            >go</v-btn
          >
        </template>
      </v-text-field>
      <!-- Filters -->
      <div>
        <v-select
          density="compact"
          rounded="xl"
          v-model="filter"
          :items="['All', 'Resolved', 'Unresolved']"
          placeholder="Filter by status"
          class=""
          variant="solo-filled"
        />
      </div>
    </div>

    <!-- Add Suggestion FAB -->
    <div class="fixed bottom-4 right-4 z-50">
      <v-btn
        @click="openAddDialog = true"
        variant="elevated"
        rounded="xl"
        color="primary"
        prepend-icon="mdi-plus"
        >Add Suggestion</v-btn
      >
    </div>

    <!-- Suggestion Cards -->
    <v-row v-if="filteredSuggestions.length" class="pe-4 pb-16">
      <v-col
        v-for="suggestion in filteredSuggestions"
        :key="suggestion.id"
        cols="12"
        sm="6"
        md="4"
        class="pa-0"
      >
        <suggestion-card
          :suggestion="suggestion"
          rounded="xl"
          class="ms-4 mb-2"
        ></suggestion-card>
      </v-col>
    </v-row>
    <div v-else>
      <h3>No results found!</h3>
    </div>

    <!-- Add Suggestion Dialog -->
    <v-dialog v-model="openAddDialog" max-width="500px">
      <v-card rounded="xl" class="pa-2">
        <SuggestionForm
          @cancel="openAddDialog = false"
          @added="openAddDialog = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useSuggestionStore } from "@/stores/store.suggestions";

const suggestionStore = useSuggestionStore();
const search = ref("");
const filter = ref<"All" | "Resolved" | "Unresolved">("All");
const openAddDialog = ref(false);

// Computed Properties
const filteredSuggestions = computed(() => {
  let filtered = suggestionStore.suggestions.filter(
    (s) =>
      s.title.toLowerCase().includes(search.value.toLowerCase()) ||
      s.description.toLowerCase().includes(search.value.toLowerCase())
  );
  if (filter.value === "Resolved") {
    filtered = filtered.filter((s) => s.resolved);
  } else if (filter.value === "Unresolved") {
    filtered = filtered.filter((s) => !s.resolved);
  }
  return filtered;
});

onMounted(() => {
  suggestionStore.fetchSuggestions();
});
</script>
<route lang="yaml">
meta:
  layout: index
</route>
