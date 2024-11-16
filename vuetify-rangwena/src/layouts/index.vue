<template>
  <v-layout class="h-full">
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

      <v-app-bar-title>Rangwena Class of 2013</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn slim icon="mdi-human-male-board-poll"></v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            color="primary"
            variant="text"
            width="24"
            height="36"
            rounded="lg"
            class="ml-2"
            icon
            v-bind="props"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card rounded="lg" elevation="8">
          <template #title>
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              title="Sandra Adams"
              subtitle="sandra_a88@gmailcom"
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
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          subtitle="sandra_a88@gmailcom"
          title="Sandra Adams"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-seal-variant"
          title="Membership"
          value="membership"
          to="membership"
          active-color="primary"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-message-outline"
          title="Suggestion Box"
          value="suggestion-box"
          to="suggestion-box"
          active-color="primary"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-chat-processing-outline"
          title="Chat"
          value="chat"
          to="chat"
          active-color="primary"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-star-outline"
          title="Activities"
          value="activities"
          to="activities"
          active-color="primary"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-wrench-outline"
          title="Settings"
          value="settings"
          to="settings"
          active-color="primary"
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

    <div class="absolute bottom-8 right-12">
      <v-speed-dial
        :offset="[36]"
        location="top center"
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab
            color="primary"
            offset
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
    </div>

    <v-main class="" scrollable>
      <router-view #default="{ Component, route }">
        <transition>
          <component :is="Component" :key="route" />
        </transition>
      </router-view>
    </v-main>

    <AlertsHost />
  </v-layout>
</template>

<script lang="ts" setup>
import AlertsHost from "@/components/AlertsHost.vue";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const signingOut = ref(false);
const { signout } = useAuthStore();
const { pushAlert } = useAlertStore();
const drawer = ref(null);

const more = ["News", "Maps", "Books", "Flights", "Apps"];

const handleSignout = async () => {
  signingOut.value = true;
  await signout().then((res) => {
    signingOut.value = false;
    pushAlert({ alert: res });
  });
};
</script>
