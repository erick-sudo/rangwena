<template>
  <div class="p-4 min-h-screen flex flex-col justify-center">
    <div
      class="container mx-auto flex flex-col items-center justify-center gap-4"
    >
      <div class="max-w-lg h-44">
        <img
          class="w-full h-full object-contain"
          src="/svg/undraw_forgot_password.svg"
        />
      </div>
      <v-form
        ref="form"
        class="flex flex-col grow max-w-sm gap-2"
        v-model="valid"
        @submit.prevent="handleSubmit"
      >
        <v-btn
          @click="$router.push('/sign-in')"
          title="Back to sign in"
          variant="tonal"
          color="primary"
          icon="mdi-arrow-left-thin"
        ></v-btn>
        <p class="text">
          Please identify yourself by providing your username, email, or phone
          number and we will send you instructions on how to reset your
          password.
        </p>
        <v-text-field
          prepend-inner-icon="mdi-account-outline"
          density="comfortable"
          :disabled="sending || waitingResetWindow"
          label="Username, Email, or Phone"
          rounded="lg"
          class=""
          color="primary"
          clearable
          variant="solo-filled"
          v-model="identity"
          :counter="75"
          :rules="[
            (v) =>
              !!v ||
              'Atleast a username, an email, or a phone number is required.',
          ]"
        ></v-text-field>

        <div class="flex">
          <span v-if="waitingResetWindow" class="mx-4"
            >{{ waitingTimer }} sec</span
          >
          <span class="flex-grow"></span>
          <RouterLink
            class="text-primary"
            to="/reset-password"
            >I have a reset code?</RouterLink
          >
        </div>

        <v-btn
          size="large"
          rounded="lg"
          block
          :loading="sending"
          :disabled="sending || waitingResetWindow"
          type="submit"
          color="primary"
          class=""
          >{{ sendBtnMessage }}</v-btn
        >
      </v-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const form = useTemplateRef("form");
const valid = ref(false);
const identity = ref("");
const sending = ref(false);
const count = ref(0);
const authStore = useAuthStore();
const { pushAlert } = useAlertStore();
const waitingResetWindow = ref(false);
const waitingTimer = ref(30);

const sendBtnMessage = computed(() => {
  if (sending.value) {
    return count.value > 0 ? "Resending" : "Sending request";
  } else {
    return count.value > 0 ? "Resend" : "Send request";
  }
});

const handleSubmit = async () => {
  if (valid.value) {
    sending.value = true;
    count.value++;
    await authStore
      .requestPasswordReset(identity.value)
      .then((res) => {
        if (res.status === "success") {
          // Show success for 20 seconds
          pushAlert({ alert: res, delayMs: 20000 });
          form.value?.reset();
          waitingResetWindow.value = true;
          return;
        }

        pushAlert({ alert: res });
      })
      .finally(() => {
        sending.value = false;
      });
  }
};

watch(waitingResetWindow, (newValue) => {
  if (newValue) {
    const interval = setInterval(() => {
      waitingTimer.value--;
      if (waitingTimer.value < 0) {
        clearInterval(interval);
        waitingResetWindow.value = false;
      }
    }, 1000);
  }
});
</script>
