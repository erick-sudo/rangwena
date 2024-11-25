<template>
  <v-app-bar name="app-bar" density="compact" elevation="0" class="border-b">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click="emit('toggle-drawer')"
        color="primary"
        height="36"
        width="36"
        rounded="lg"
      ></v-app-bar-nav-icon>
    </template>

    <template>
      <v-speed-dial
        location-strategy="connected"
        location="bottom left"
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab
            color="primary"
            offset
            absolute
            v-bind="activatorProps"
            size="small"
            icon="$vuetify"
          ></v-fab>
        </template>

        <v-btn color="primary" key="1" icon="mdi-seal-variant"></v-btn>
        <v-btn color="primary" key="2" icon="mdi-message-outline"></v-btn>
        <v-btn color="primary" key="3" icon="mdi-star-outline"></v-btn>
        <v-btn color="primary" key="4" icon="mdi-wrench-outline"></v-btn>
      </v-speed-dial>
    </template>

    <v-app-bar-title>Rangwena Class of 2013</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-badge
      dot
      inline
      :color="wsStore.online ? 'primary' : 'undefined'"
    ></v-badge>

    <v-btn
      class="ms-2 me-2"
      density="comfortable"
      size="small"
      icon="mdi-ballot-recount"
    ></v-btn>

    <v-menu>
      <template #activator="{ props }">
        <v-avatar
          border
          :color="wsStore.online ? 'primary' : 'undefined'"
          class="me-4"
          v-bind="props"
          size="small"
          image="http://localhost:8000/erick.jpg"
        ></v-avatar>
      </template>

      <v-card rounded="lg" elevation="8">
        <template #title>
          <v-list-item
            prepend-avatar="http://localhost:8000/erick.jpg"
            :title="`${initials?.firstName} ${initials?.lastName}`"
            :subtitle="principal?.email"
          ></v-list-item>
        </template>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-account-details-outline"
            subtitle="View Profile"
            value="profile"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-creation-outline"
            subtitle="Constitution"
            value="constitution"
          ></v-list-item>
          <v-list-item
            @click="emit('sign-out')"
            prepend-icon="mdi-logout"
            subtitle="Logout"
            value="logout"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>
<script setup lang="ts">
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const { principal, initials } = useAuthStore();
const {} = useAlertStore();
const wsStore = useWsStore();

const emit = defineEmits<{
  (e: "toggle-drawer"): void;
  (e: "sign-out"): void;
}>();
</script>
