<template>
  <v-container>
    <v-tabs color="primary" v-model="tab">
      <v-tab text="active" value="active"></v-tab>
      <v-tab text="previous" value="previous"></v-tab>
      <v-tab :disabled="!authStore.isAdmin" text="new poll" value="new"></v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="active">
        <div class="grid gap-2 pt-2 pb-4" v-if="wsStore.activePolls.length > 0">
          <v-card
            rounded="lg"
            class="pa-4"
            v-for="(poll, index) in wsStore.activePolls"
            :key="index"
          >
            <accordion>
              <template #prepend-summary>
                <v-icon color="primary" class="mr-2">mdi-vote</v-icon>
              </template>
              <template #summary="{ expanded }">
                <div v-if="!expanded">
                  <span>{{ poll.title }}</span>
                </div>
              </template>
              <template #default>
                <active-poll :poll="poll"></active-poll>
              </template>
            </accordion>
          </v-card>
        </div>
        <div class="p-12 border rounded mt-2 flex items-center gap-3" v-else>
          <v-btn
            @click="tab = 'previous'"
            variant="tonal"
            color="primary"
            icon="mdi-arrow-right-thin"
          ></v-btn>
          <p>No active polls...</p>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="previous">
        <v-list
          rounded="lg"
          class="mt-2"
          v-if="wsStore.previousPolls.length > 0"
        >
          <closed-poll
            :class="{
              'border-t': index > 0,
            }"
            v-for="(poll, index) in wsStore.previousPolls"
            :key="poll.id"
            :poll="poll"
          >
          </closed-poll>
        </v-list>
        <div class="p-12 border rounded mt-2 flex items-center gap-3" v-else>
          <v-btn
            @click="tab = 'active'"
            variant="tonal"
            color="primary"
            icon="mdi-arrow-left-thin"
          ></v-btn>
          <p>No past polls...</p>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="new">
        <create-poll-form class="mt-2 max-w-lg"></create-poll-form>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const wsStore = useWsStore();
const tab = ref<string | null>(null);
const authStore = useAuthStore();

onMounted(() => {
  wsStore.fetchPolls();
});
</script>

<route lang="yaml">
meta:
  layout: index
</route>
