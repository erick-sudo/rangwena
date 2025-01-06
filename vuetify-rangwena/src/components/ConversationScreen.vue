<template>
  <div v-if="wsStore.conversation" class="flex flex-col xl:col-span-2">
    <div class="flex items-center gap-2">
      <slot
        name="prepend"
        :conversationId="wsStore.selectedConversationKey!!"
      ></slot>
      <div class="flex-grow">
        <slot
          name="title"
          :conversationId="wsStore.selectedConversationKey!!"
        ></slot>
      </div>
      <slot
        name="append"
        :conversationId="wsStore.selectedConversationKey!!"
      ></slot>
    </div>
    <div class="flex-grow p-2">
      <chat-messages
        v-if="wsStore.conversation.conversations?.length"
        :msgs="wsStore.conversation.conversations"
        class=""
      ></chat-messages>
      <div
        v-else
        class="m-4 py-8 border flex flex-col items-center justify-center gap-3"
      >
        <span>No conversations yet</span>
        <div class="flex-grow h-52 max-w-lg w-full">
          <v-img src="/svg/undraw_begin_chat.svg"></v-img>
        </div>
        <div class="flex gap-2">
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-text-box-outline"
            @click=""
            rounded="xl"
            color="primary"
          ></v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-camera-outline"
            @click=""
            rounded="xl"
            color="primary"
          ></v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-image-outline"
            @click=""
            rounded="xl"
            color="primary"
          ></v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-file-document-outline"
            @click=""
            rounded="xl"
            color="primary"
          ></v-btn>
        </div>
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
        :variant="!!text ? 'elevated' : 'tonal'"
        icon
        :color="!!text ? 'primary' : 'secondary'"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-form>
  </div>
  <div v-else class="relative flex flex-col items-center justify-center gap-3">
    <h3 class="max-w-64 text-center">
      Select, send, and received direct messages from members.
    </h3>
    <div class="flex-grow max-h-64 max-w-lg w-full">
      <v-img src="/svg/undraw_begin_chat.svg"></v-img>
    </div>
  </div>
</template>
<script setup lang="ts">
import { WSChatMessage } from "@/lib/types";
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
      } as WSChatMessage,
      partner
    );
    text.value = "";
  }
};
</script>
