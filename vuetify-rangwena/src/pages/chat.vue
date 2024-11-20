<template>
  <div class="h-full" v-if="$vuetify.display.mobile">
    <conversation-list v-if="!wsStore.conversation"></conversation-list>
    <div v-else class="h-full">
      <conversation-screen class="h-full flex-grow p-2">
        <template #prepend>
          <v-btn
            @click="backToConversationList"
            class="m-2"
            variant="tonal"
            color="primary"
            icon="mdi-arrow-left"
          ></v-btn>
        </template>
        <template v-if="wsStore.conversation?.partner" #title>
          <v-list-item prepend-avatar="http://192.168.180.148:8000/erick.jpg">
            <v-list-item-title
              >{{ wsStore.conversation.partner.firstName }}
              {{ wsStore.conversation.partner.lastName }}</v-list-item-title
            >
            <v-list-item-subtitle>last seen </v-list-item-subtitle>
          </v-list-item>
        </template>
      </conversation-screen>
    </div>
  </div>
  <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 h-full items-start">
    <conversation-list></conversation-list>
    <div class="border-s h-full flex flex-col xl:col-span-2">
      <conversation-screen class="flex-grow p-2">
        <template v-if="wsStore.conversation?.partner" #title>
          <v-list-item prepend-avatar="http://192.168.180.148:8000/erick.jpg">
            <v-list-item-title
              >{{ wsStore.conversation.partner.firstName }}
              {{ wsStore.conversation.partner.lastName }}</v-list-item-title
            >
            <v-list-item-subtitle>last seen </v-list-item-subtitle>
          </v-list-item>
        </template>
      </conversation-screen>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWsStore } from "@/stores/store.ws";

const wsStore = useWsStore();
const backToConversationList = () => {
  wsStore.unselectConversation();
};
</script>
<style lang="css" scoped></style>
<route lang="yaml">
meta:
  layout: index
</route>
