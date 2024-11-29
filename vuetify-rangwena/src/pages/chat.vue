<template>
  <div class="h-full" v-if="$vuetify.display.mobile">
    <conversation-list v-if="!wsStore.conversation"></conversation-list>
    <div v-else class="h-full">
      <conversation-screen class="h-full flex-grow p-2">
        <template #prepend>
          <v-btn
            size="small"
            density="comfortable"
            @click="backToConversationList"
            class="m-2"
            variant="tonal"
            color="primary"
            icon
          >
            <v-icon size="small">mdi-arrow-left-thin</v-icon>
          </v-btn>
        </template>
        <template
          v-if="wsStore.conversation?.partner"
          #title="{ conversationId }"
        >
          <v-list-item>
            <template #prepend>
              <v-btn
                size="40"
                :color="
                  wsStore.isOnline(conversationId) ? 'primary' : undefined
                "
                variant="tonal"
                rounded="xl"
                class="me-2"
              >
                <span
                  class="text-sm"
                  v-if="
                    wsStore.conversation.partner.firstName &&
                    wsStore.conversation.partner.lastName
                  "
                  >{{
                    `${wsStore.conversation.partner.firstName[0]}${wsStore.conversation.partner.lastName[0]}`
                  }}</span
                >
                <v-icon v-else>mdi-account</v-icon>
              </v-btn>
            </template>
            <template #append>
              <div>
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
            </template>
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
        <template
          v-if="wsStore.conversation?.partner"
          #title="{ conversationId }"
        >
          <v-list-item>
            <template #prepend>
              <v-btn
                size="40"
                :color="
                  wsStore.isOnline(conversationId) ? 'primary' : undefined
                "
                variant="tonal"
                rounded="xl"
                class="me-2"
              >
                <span
                  class="text-sm"
                  v-if="
                    wsStore.conversation.partner.firstName &&
                    wsStore.conversation.partner.lastName
                  "
                  >{{
                    `${wsStore.conversation.partner.firstName[0]}${wsStore.conversation.partner.lastName[0]}`
                  }}</span
                >
                <v-icon v-else>mdi-account</v-icon>
              </v-btn>
            </template>
            <v-list-item-title
              >{{ wsStore.conversation.partner.firstName }}
              {{ wsStore.conversation.partner.lastName }}</v-list-item-title
            >
            <v-list-item-subtitle>last seen </v-list-item-subtitle>
          </v-list-item>
        </template>
        <template #append>
          <div>
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
