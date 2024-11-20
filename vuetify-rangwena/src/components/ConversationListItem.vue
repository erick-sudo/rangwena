<template>
  <v-list-item
    variant="text"
    rounded="0"
    prepend-avatar="http://192.168.180.148:8000/erick.jpg"
  >
    <template #prepend>
      <div class="me-2 relative">
        <v-avatar
          :border="isOnline(user.id)"
          color="primary"
          class="m-2"
        ></v-avatar>
        <span
          v-if="unread > 0"
          class="text-xs absolute bottom-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary"
          >{{ unread }}</span
        >
      </div>
    </template>
    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            variant="text"
            size="small"
            rounded="xl"
            class="ml-2"
            icon
            v-bind="props"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card rounded="lg" elevation="8">
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-chat-outline"
              subtitle="Direct Message"
              value="directMessage"
              @click="handleConversationSelection(user.id)"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-phone-plus-outline"
              subtitle="Call"
              value="call"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-delete-outline"
              subtitle="Delete Conversation"
              value="deleteConversation"
              @click="deleteConversation(user.id)"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-information-outline"
              subtitle="Details"
              value="details"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
    <v-list-item-title
      >{{ user.firstName }} {{ user.lastName }}</v-list-item-title
    >
    <v-list-item-subtitle>@{{ user.username }}</v-list-item-subtitle>
  </v-list-item>
</template>
<script setup lang="ts">
import { RUser } from "@/lib/types";
import { useWsStore } from "@/stores/store.ws";

const wsStore = useWsStore();
defineProps<{
  user: RUser;
  unread: number;
}>();

const handleConversationSelection = (conversationId: string) => {
  wsStore.selectConversation(conversationId);
};
const deleteConversation = (conversationId: string) => {
  wsStore.deleteConversation(conversationId);
};
const isOnline = (id: string) => wsStore.isOnline(id);
</script>
