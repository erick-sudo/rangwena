<template>
  <v-layout full-height>
    <template v-if="!authStore.pendingApproval">
      <account-approval></account-approval>
    </template>

    <template v-else-if="authStore.loggedIn">
      <application-bar
        @sign-out="handleSignout"
        @toggle-drawer="drawer = !drawer"
      ></application-bar>

      <left-navigation-drawer
        @sign-out="handleSignout"
        v-model="drawer"
      ></left-navigation-drawer>

      <v-main class="min-h-screen">
        <router-view />
      </v-main>
    </template>

    <template v-else>
      <sign-in-form></sign-in-form>
    </template>

    <!-- <AppFooter /> -->

    <AlertsHost />
  </v-layout>
</template>

<script lang="ts" setup>
import AlertsHost from "@/components/AlertsHost.vue";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const drawer = ref(null);

const authStore = useAuthStore();

const signingOut = ref(false);
const { signout } = useAuthStore();
const { pushAlert } = useAlertStore();

const handleSignout = async () => {
  signingOut.value = true;
  await signout().then((res) => {
    signingOut.value = false;
    pushAlert({ alert: res });
  });
};
</script>
