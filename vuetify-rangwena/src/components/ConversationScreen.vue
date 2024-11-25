<template>
  <div v-if="wsStore.conversation" class="flex flex-col xl:col-span-2">
    <div class="flex items-center gap-2">
      <slot name="prepend"></slot>
      <div class="flex-grow"><slot name="title"></slot></div>
      <slot name="append"></slot>
    </div>
    <div class="flex-grow p-2">
      <chat-messages
        v-if="wsStore.conversation.conversations?.length"
        :msgs="wsStore.conversation.conversations"
        class=""
      ></chat-messages>
      <div v-else class="m-4 p-12 border">
        <span>No conversations yet</span>
      </div>
    </div>
    <v-form
      v-model="formValid"
      ref="form"
      @submit.prevent="handleSubmit"
      class="flex items-start gap-2 px-2 w-full"
    >
      <v-textarea
        v-model="text"
        class=""
        :max-errors="0"
        placeholder="Message"
        rows="1"
        density="comfortable"
        variant="solo-filled"
        rounded="xl"
      ></v-textarea>
      <v-btn
        :disabled="!!!text"
        type="submit"
        variant="elevated"
        icon
        color="primary"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-form>
  </div>
  <div v-else class="relative">No conversations</div>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const formValid = ref(false);
const wsStore = useWsStore();
const text = ref("");
const authStore = useAuthStore();

const handleSubmit = (e: Event) => {
  if (wsStore.selectedConversationKey && wsStore.conversation) {
    const convId = wsStore.selectedConversationKey;
    const { partner } = wsStore.conversation;
    wsStore.sendMessage(
      {
        from: `${authStore.principal?.id}`,
        to: convId,
        conversationType: "individual",
        time: new Date().toString(),
        content: text.value,
        status: "pending",
      },
      partner
    );
    text.value = "";
  }
};
</script>
