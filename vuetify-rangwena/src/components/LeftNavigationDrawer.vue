<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        :title="`${authStore.initials?.firstName} ${authStore.initials?.lastName}`"
        :subtitle="authStore.principal?.email"
      >
        <template #prepend>
          <v-icon size="large">mdi-account-outline</v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-outline"
        title="Home"
        value="home"
        to="/"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-seal-variant"
        title="Membership"
        value="membership"
        to="membership"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-vote-outline"
        title="Polls"
        value="polls"
        to="polls"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-message-outline"
        title="Suggestion Box"
        value="suggestion-box"
        to="suggestion-box"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chat-processing-outline"
        title="Chat"
        value="chat"
        to="chat"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-star-outline"
        title="Activities"
        value="activities"
        to="activities"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-wrench-outline"
        title="Settings"
        value="settings"
        to="settings"
        color="primary"
      ></v-list-item>
    </v-list>

    <template #append>
      <v-list density="compact" nav>
        <v-list-item
          @click="emit('sign-out')"
          prepend-icon="mdi-logout"
          title="Sign Out"
          value="myfiles"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const authStore = useAuthStore();

const wsStore = useWsStore();

const emit = defineEmits<{
  (e: "toggle-drawer"): void;
  (e: "sign-out"): void;
}>();
</script>
<style lang=""></style>
