<template>
  <v-list-item>
    <template #append> </template>
    <v-list-item-subtitle>{{ poll.title }} </v-list-item-subtitle>
    <v-card-text class="ps-0 pe-0">
      <div>{{ poll.description }}</div>
      <div class="mt-2 grid">
        <span
          >Won by <em>{{ pollResults.winningVotes }} votes</em> out of
          {{ pollResults.castVotes }}</span
        >
        <span
          ><strong class="mr-2 text-primary">Resolution:</strong
          >{{ pollResults.win }}</span
        >
      </div>
    </v-card-text>
    <v-list-item-action>
      <v-btn
        v-if="authStore.isAdmin"
        @click="updatePoll({ closed: false })"
        rounded="xl"
        variant="tonal"
        density="comfortable"
        class=""
        prepend-icon="mdi-ballot-recount-outline"
        color="primary"
      >
        <span>Reopen</span>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import { Poll, PollTally } from "@/lib/types";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

interface ClosedPollResults {
  castVotes: number;
  win: string;
  winningVotes: number;
}

const props = defineProps<{
  poll: Poll;
}>();
const wsStore = useWsStore();
const choices = computed(() =>
  props.poll.choices.reduce((acc, { id, value }) => {
    acc[id] = value;
    return acc;
  }, {} as Record<string, string>)
);
const { pushAlert } = useAlertStore();
const authStore = useAuthStore();
const updating = ref(false);
const tally = ref<PollTally | null>(null);

const pollResults = computed<ClosedPollResults>(() => {
  const initial = {
    castVotes: 0,
    win: "",
    winningVotes: 0,
  };
  if (tally.value) {
    return Object.entries(tally.value).reduce((acc, [choice, votes]) => {
      acc = {
        castVotes: acc.castVotes + votes,
        win:
          votes > acc.winningVotes ? choices.value[choice] : acc.win || choice,
        winningVotes: votes > acc.winningVotes ? votes : acc.winningVotes,
      };
      return acc;
    }, initial);
  }

  return initial;
});

const updatePoll = async (payload: any) => {
  updating.value = true;
  const res = await wsStore.updatePoll(props.poll.id, payload);
  updating.value = false;
  pushAlert({ alert: res });
};

const fetchTally = async () => {
  tally.value = await wsStore.fetchTally(props.poll.id);
};

watchEffect(async () => {
  await fetchTally();
});
</script>
