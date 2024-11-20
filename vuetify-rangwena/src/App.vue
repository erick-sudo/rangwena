<template>
  <router-view />
</template>

<script lang="ts" setup>
import socket from "./lib/socket";
import { useAuthStore } from "./stores/store.auth";
import { useMemberStore } from "./stores/store.members";
import { useWsStore } from "./stores/store.ws";

const wsStore = useWsStore();
const authStore = useAuthStore();
const memberStore = useMemberStore();

socket.off();

watch(
  () => authStore.principal,
  async (newValue) => {
    if (newValue) {
      wsStore.bindWsEvents(newValue);
      await memberStore.fetchMembers();
      wsStore.initConversations()
      wsStore.bindConversationsEvents(newValue)
    } else {
      socket.off();
    }
  },
  {
    deep: true,
  }
);

onMounted(async () => {
  await authStore.fetchCurrentUser();
});
</script>
