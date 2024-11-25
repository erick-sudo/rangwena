<template>
  <div class="grid lg:grid-cols-2 gap-4">   
    <v-card variant="text" rounded="0" elevation="0" density="compact">
      <v-card-text>
        <h3>{{ poll.title }}</h3>
        <v-radio-group
          v-model="selectedChoice"
          :disabled="voteStatus ? voteStatus.voted : true"
        >
          <v-radio
            color="primary"
            v-for="(choice, id) in choices"
            :key="id"
            :label="choice"
            :value="choice"
          />
        </v-radio-group>
        <div>{{ poll.description }}</div>
       <div class="mt-2 flex items-center">
        <span class="text-secondary" v-if="!!!voteStatus"><v-btn loading variant="text" disabled model-value="45" rotate=""></v-btn variant="text" disabled>
        <span>Loading your status...</span></span>
        <v-btn
          v-else-if="voteStatus?.voted === false"
          @click="castVote"
          :disabled="!selectedChoice"
          class="mt-3"
          color="primary"
          prepend-icon="mdi-vote-outline"
        >
          Cast
        </v-btn>
        <v-chip class="border" prepend-icon="mdi-check-decagram-outline" color="primary" v-else-if="voteStatus.voted === true">
          <span>Voted</span>
        </v-chip>
      <div class="grow"></div>
        <div class="flex gap-2 items-center">
          <v-btn :disabled="!authStore.isAdmin" :loading="updating" @click="updatePoll({closed: true})" density="comfortable" variant="tonal" rounded="xl" color="error" prepend-icon="mdi-close">Close</v-btn>
          <v-btn :disabled="!authStore.isAdmin" @click="deletePoll" color="error" density="comfortable" size="small" icon="mdi-trash-can-outline"></v-btn></div>
      </div>
      </v-card-text>
    </v-card>
    <div class="flex flex-col self-center">
      <h4 class="text-lg">Results:</h4>
      <v-card-text>
        <div class="mb-2" v-for="(votes, choice, index) in pollTally" :key="index">
        <div class="grid grid-cols-2 gap-3">
          <span class="flex truncate">{{ choice }}</span>
          <span class="flex truncate justify-end"
            >{{ votes }}
            <em class="w-10 ml-1">vote{{ votes > 1 ? "s" : "" }}</em>
          </span>
        </div>
        <v-progress-linear
          :model-value="(castVotes ? (votes / castVotes) : 0) * 100"
          height="16"
          color="primary"
          class=""
          rounded
        >
          <span>{{ ((votes / poll.totalNumberOfvoters) * 100).toFixed() }}% </span>
        </v-progress-linear>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span>Total Cast Votes</span>
          <span class="flex-grow border-b border-dashed"></span>
          <span>{{ castVotes || 0 }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>Number of Voters</span>
          <span class="flex-grow border-b border-dashed"></span>
          <span>{{ poll.totalNumberOfvoters || 0 }}</span>
        </div>
      </div>
      </v-card-text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LoggedInUserPollStatus, Poll, PollTally } from "@/lib/types";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const voteStatus = ref<LoggedInUserPollStatus | null>(null);
const wsStore = useWsStore();
const { pushAlert } = useAlertStore()
const deleting = ref(false)
const updating = ref(false)
const authStore = useAuthStore()

const props = defineProps<{
  poll: Poll;
}>();

const choices = computed(() => props.poll.choices.reduce((acc, {id, value}) => {
  acc[id] = value
  return acc
}, {} as Record<string, string>))

const tally = ref<PollTally | null>(null)

const selectedChoice = ref<string | null>(null);

const castVotes = ref<number | null>(null)

const pollTally = computed<Record<string, number>>(() => {
  
  if(tally.value) {
    return Object.entries(tally.value).reduce((acc, [choiceId, votes]) => {
      acc[choices.value[choiceId]] = votes
      return acc
    }, Object.entries(choices.value).reduce((acc, [_, choice]) => {
    acc[choice] = 0
    return acc
  }, {} as Record<string, number>))
  }
  return {}
})

const deletePoll = async () => {
  deleting.value = true
  const res = await wsStore.deletePoll(props.poll.id)
  deleting.value = false
    
pushAlert({alert: res})
}

const updatePoll = async (payload: any) => {
  updating.value = true
  const res = await wsStore.updatePoll(props.poll.id, payload)
  updating.value = false
  pushAlert({alert: res})
}

const castVote = async () => {
  if (selectedChoice.value) {
    const res = await wsStore.castVote(props.poll.id, selectedChoice.value)
    voteStatus.value = {
      voted: res.status === "success"
    }
pushAlert({alert: res})
  }
};

const fetchVoteStatus = async (pollId: string) => {
  voteStatus.value = await wsStore.fetchVoteStatus(pollId);
};

onMounted(async () => {
  await fetchVoteStatus(props.poll.id);
});

watchEffect(() => {
  if(tally.value) {
    castVotes.value = Object.entries(tally.value).reduce((acc, [, votes]) => {
    acc += votes;
    return acc;
  }, 0);
  }
})

const fetchTally = async () => {
  tally.value = await wsStore.fetchTally(props.poll.id)
}

watchEffect(async () => {
await fetchTally()
})
</script>
