<template>
  <div class="p-4 min-h-screen flex flex-col justify-center">
    <div
      class="container mx-auto flex flex-col lg:flex-row-reverse items-center justify-center gap-8"
    >
      <div class="max-w-lg h-44 lg:h-64">
        <img
          class="w-full h-full object-contain"
          src="/svg/undraw_my_password.svg"
        />
      </div>
      <v-form
        :disabled="submitting"
        ref="form"
        class="flex flex-col grow max-w-sm min-w-[20rem]"
        v-model="valid"
        @submit.prevent="handleSubmit"
      >
        <div>
          <v-chip
            @click="$router.push('/sign-in')"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-arrow-left-thin"
            >Back to sign in</v-chip
          >
        </div>
        <h3 class="text-2xl font-semibold">Create a new password</h3>
        <v-text-field
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="visibilityIcon"
          @click:append-inner="toggleVisibility"
          density="comfortable"
          :type="seePassword"
          rounded="lg"
          class="mt-2"
          color="primary"
          clearable
          label="New Password"
          variant="solo"
          v-model="newPassword"
          :rules="[
            (v) => !!v || 'Please enter your password.',
            (v) =>
              isStrongPassword(v) ||
              'Weak password, use uppercase, lowercase, numbers and special characters(e.g !#@?)',
            (v) => v.length >= 8 || 'Password too short.',
          ]"
        ></v-text-field>
        <v-text-field
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="visibilityIcon"
          @click:append-inner="toggleVisibility"
          density="comfortable"
          :type="seePassword"
          rounded="lg"
          class="mt-2"
          color="primary"
          clearable
          label="Confirm New Password"
          variant="solo"
          v-model="confirmNewPassword"
          :rules="[
            (v) => !!v || 'Password confirmation is required.',
            (v) => newPassword === v || 'Passwords do not match.',
            (v) => v.length >= 8 || 'Password too short.',
          ]"
        ></v-text-field>

        <div class="d-flex flex-column">
          <v-label class="align-self-center">Verification code</v-label>
          <v-otp-input
            v-model="otp"
            :error="otpError"
            :disabled="submitting"
            type="text"
            variant="solo"
            :loading="submitting"
            class="otp-input-custom"
            height="60"
          ></v-otp-input>
          <v-btn
            @click="$router.push('/request-password-reset')"
            block
            color="primary"
            class="mx-auto mb-2"
            type="button"
            variant="tonal"
            rounded="lg"
            >Request new code</v-btn
          >
        </div>

        <v-btn
          :loading="submitting"
          color="primary"
          class=""
          variant="elevated"
          rounded="lg"
          type="submit"
        >
          Submit
        </v-btn>
      </v-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isStrongPassword } from "@/lib/utils";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const form = useTemplateRef("form");
const valid = ref(false);
const newPassword = ref("");
const confirmNewPassword = ref("");
const otp = ref("");
const otpError = ref(false);
const submitting = ref(false);
const authStore = useAuthStore();
const { pushAlert } = useAlertStore();
const seePassword = ref("password");

const toggleVisibility = () =>
  (seePassword.value = seePassword.value === "password" ? "text" : "password");

const visibilityIcon = computed(() =>
  seePassword.value === "password" ? "mdi-eye-outline" : "mdi-eye-off-outline"
);

const handleSubmit = async () => {
  if (valid.value) {
    submitting.value = true;
    await authStore
      .resetPassword({
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
        otp: otp.value,
      })
      .then((res) => {
        if (res.status === "success") {
          // Show success for 20 seconds
          pushAlert({ alert: res, delayMs: 20000 });
          form.value?.reset();
          return;
        }

        pushAlert({ alert: res });
      })
      .finally(() => {
        submitting.value = false;
      });
  }
};

watch(otp, (newValue) => {
  if (newValue) {
    otpError.value = newValue.length < 6;
  }
});
</script>

<style lang="scss" scoped>
$otp-focused-border-width: 8px;
</style>
