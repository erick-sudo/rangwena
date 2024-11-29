<template>
  <div class="flex flex-col gap-2 p-2 h-full relative">
    <div class="flex gap-1">
      <v-btn
        min-width="max-content"
        rounded="xl"
        @click="active = cat"
        :variant="active === cat ? 'tonal' : 'text'"
        density="comfortable"
        :color="active === cat ? 'primary' : undefined"
        v-for="(cat, index) in userCategories"
        :key="index"
        ><span class="lowercase">{{ cat }}</span></v-btn
      >
    </div>

    <div>
      <v-list class="pa-0" rounded="xl" nav>
        <conversation-list-item
          @click="handleConversationSelection(`${user.id}`)"
          v-for="(user, index) in conversationPartners"
          :unread="newMessages[user.id] || 0"
          :user="user"
          :key="index"
          class="mb-0"
        ></conversation-list-item>
      </v-list>
    </div>

    <!-- Start conversation FAB -->
    <div class="absolute bottom-8 right-8">
      <v-menu>
        <template #activator="{ props }">
          <v-fab
            absolute
            offset
            color="primary"
            size="small"
            v-bind="props"
            icon="mdi-plus"
          ></v-fab>
        </template>
        <v-card>
          <v-list v-if="otherMembers.length > 0" nav
            ><v-list-item
              nav
              v-for="(user, index) in otherMembers"
              :key="index"
              @click="initiateConversation(user)"
              variant="text"
              rounded="0"
            >
              <template #prepend>
                <v-btn
                  size="32"
                  :color="isOnline(user.id) ? 'primary' : undefined"
                  variant="tonal"
                  rounded="xl"
                  class="border me-2 my-1"
                >
                  <span
                    v-if="user.firstName && user.lastName"
                    class="text-sm"
                    >{{ `${user.firstName[0]}${user.lastName[0]}` }}</span
                  >
                  <v-icon v-else>mdi-account</v-icon>
                </v-btn>
              </template>
              <v-list-item-title>
                <span v-if="user.firstName && user.lastName"
                  >{{ user.firstName }} {{ user.lastName }}</span
                >
                <span v-else>{{ user.phoneNumber }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>@{{ user.username }}</v-list-item-subtitle>
            </v-list-item></v-list
          >
          <div class="px-4 py-8" v-else>No members yet!!</div>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ConversationPartner } from "@/lib/types";
import { useAuthStore } from "@/stores/store.auth";
import { useMemberStore } from "@/stores/store.members";
import { useWsStore } from "@/stores/store.ws";

const authStore = useAuthStore();
const memberStore = useMemberStore();
const wsStore = useWsStore();
const userCategories = ["All", "Online", "Offline", "Channels"];
const active = ref("All");

const otherMembers = computed(() =>
  memberStore.members.filter((m) => m.id !== authStore.principal?.id)
);

const newMessages = computed<Record<string, number>>(() => {
  return Object.entries(wsStore.conversations).reduce(
    (acc, [key, { conversations }]) => {
      const unread = conversations.reduce((acc2, { status }) => {
        if (status === "new") {
          acc2++;
        }
        return acc2;
      }, 0);

      acc[key] = unread;
      return acc;
    },
    {} as Record<string, number>
  );
  return {};
});

const conversationPartners = computed<ConversationPartner[]>(() => {
  if (wsStore.conversations) {
    return Object.values(wsStore.conversations)
      .map(({ partner }) => partner)
      .filter((m) =>
        active.value !== "All"
          ? ["Online", "Offline"].includes(active.value)
            ? active.value === "Offline"
              ? !wsStore.isOnline(m.id)
              : wsStore.isOnline(m.id)
            : false
          : true
      );
  } else {
    return [];
  }
});

const isOnline = (id: string) => wsStore.isOnline(id);

const handleConversationSelection = (conversationKey: string) => {
  wsStore.selectConversation(conversationKey);
};

const initiateConversation = (partner: ConversationPartner) => {
  if (authStore.principal) {
    wsStore.initiateConversation(partner);
  }
};
</script>
