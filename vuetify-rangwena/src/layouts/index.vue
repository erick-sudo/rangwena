<template>
  <v-layout full-height>
    <v-app-bar density="compact" elevation="0" class="border-b">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
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

      <v-btn size="small" icon="mdi-human-male-board-poll"></v-btn>

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
              title="Sandra Adams"
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
              prepend-icon="mdi-logout"
              subtitle="Logout"
              value="logout"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="http://192.168.180.148:8000/erick.jpg"
          :subtitle="principal?.email"
          title="Sandra Adams"
        ></v-list-item>
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
            @click="handleSignout"
            prepend-icon="mdi-logout"
            title="Sign Out"
            value="myfiles"
          ></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main class="min-h-screen">
      <router-view #default="{ Component, route }">
        <transition>
          <component :is="Component" :key="route" />
        </transition>
      </router-view>
    </v-main>

    <!-- <AppFooter /> -->

    <AlertsHost />
  </v-layout>
</template>

<script lang="ts" setup>
import AlertsHost from "@/components/AlertsHost.vue";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";
import { useWsStore } from "@/stores/store.ws";

const signingOut = ref(false);
const { signout, principal } = useAuthStore();
const { pushAlert } = useAlertStore();
const drawer = ref(null);
const wsStore = useWsStore();

const handleSignout = async () => {
  signingOut.value = true;
  await signout().then((res) => {
    signingOut.value = false;
    pushAlert({ alert: res });
  });
};
</script>
