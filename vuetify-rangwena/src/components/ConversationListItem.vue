<template>
  <v-list-item variant="text" rounded="0">
    <template #prepend>
      <div class="me-2 relative py-0.5">
        <v-btn
          size="40"
          :color="wsStore.isOnline(user.id) ? 'primary' : undefined"
          variant="tonal"
          rounded="xl"
        >
          <span class="text-sm" v-if="user.firstName && user.lastName">{{
            `${user.firstName[0]}${user.lastName[0]}`
          }}</span>
          <v-icon v-else>mdi-account</v-icon>
        </v-btn>
        <span
          v-if="unread > 0"
          class="text-xs absolute bottom-0 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-primary"
          >{{ unread }}</span
        >
      </div>
    </template>
    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            variant="text"
            density="comfortable"
            size="small"
            rounded="xl"
            class="ml-2"
            icon
            v-bind="props"
          >
            <v-icon size="small">mdi-dots-vertical</v-icon>
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
// const isOnline = computed(() => wsStore.isOnline(props.user.id));
</script>
