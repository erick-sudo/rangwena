<template>
  <v-container>
    <v-card elevation="3" class="mb-5">
      <v-card-title>Current Poll</v-card-title>
      <v-card-text>
        <div v-if="currentPoll">
          <h3>{{ currentPoll.title }}</h3>
          <v-radio-group v-model="selectedChoice" :disabled="voteSubmitted">
            <v-radio
              v-for="choice in currentPoll.choices"
              :key="choice"
              :label="choice"
              :value="choice"
            />
          </v-radio-group>
          <v-btn
            v-if="!voteSubmitted"
            @click="submitVote"
            :disabled="!selectedChoice"
            class="mt-3"
            color="primary"
          >
            Submit Vote
          </v-btn>
          <div v-else>
            <h4>Results:</h4>
            <v-progress-linear
              v-for="(votes, choice) in pollResults"
              :key="choice"
              :value="(votes / totalVotes) * 100"
              height="20"
              color="primary"
              class="mb-2"
            >
              <template #default>
                {{ choice }} - {{ votes }} votes ({{
                  ((votes / totalVotes) * 100).toFixed(1)
                }}%)
              </template>
            </v-progress-linear>
          </div>
        </div>
        <div v-else>
          <p>No active poll currently.</p>
        </div>
      </v-card-text>
    </v-card>

    <v-card elevation="3">
      <v-card-title>Previous Polls</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="poll in previousPolls" :key="poll.id">
            <v-list-item-title>{{ poll.title }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear
                v-for="(votes, choice) in poll.results"
                :key="choice"
                :value="(votes / poll.totalVotes) * 100"
                height="20"
                color="secondary"
                class="mb-2"
              >
                <template #default>
                  {{ choice }} - {{ votes }} votes ({{
                    ((votes / poll.totalVotes) * 100).toFixed(1)
                  }}%)
                </template>
              </v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
interface Poll {
  id: number;
  title: string;
  choices: string[];
  results: Record<string, number>;
  totalVotes: number;
}

const currentPoll = ref<Poll | null>({
  id: 1,
  title: "What is your favorite programming language?",
  choices: ["JavaScript", "Python", "Java", "C++"],
  results: { JavaScript: 0, Python: 0, Java: 0, "C++": 0 },
  totalVotes: 0,
});

const previousPolls = reactive<Poll[]>([]);
const selectedChoice = ref<string | null>(null);
const voteSubmitted = ref(false);

const pollResults = computed(() => currentPoll.value?.results || {});
const totalVotes = computed(() => currentPoll.value?.totalVotes || 0);

const submitVote = () => {
  if (currentPoll.value && selectedChoice.value) {
    currentPoll.value.results[selectedChoice.value] += 1;
    currentPoll.value.totalVotes += 1;
    voteSubmitted.value = true;
  }
};

const endPoll = () => {
  if (currentPoll.value) {
    previousPolls.push({ ...currentPoll.value });
    currentPoll.value = null;
    voteSubmitted.value = false;
    selectedChoice.value = null;
  }
};
</script>

<style scoped>
.mb-5 {
  margin-bottom: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: index
</route>
