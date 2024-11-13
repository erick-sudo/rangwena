<template>
  <div>
    <v-form
      :disabled="submitting"
      ref="form"
      class="d-flex flex-column"
      v-model="valid"
      @submit.prevent="handleSubmit"
    >
      <h3 class="">Create a new password.</h3>
      <v-text-field
        type="password"
        rounded="lg"
        class="mt-2"
        color="rgb(219 39 119)"
        clearable
        label="New Password"
        variant="solo-filled"
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
        type="password"
        rounded="lg"
        class="mt-2"
        color="rgb(219 39 119)"
        clearable
        label="Confirm New Password"
        variant="solo-filled"
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
          :loading="submitting"
          class="align-self-center"
        ></v-otp-input>
      </div>

      <v-btn
        :disabled="!otp.length || otpError || submitting"
        class="mt-4 text-white border"
        color="rgb(219 39 119)"
        variant="elevated"
        rounded="lg"
        type="submit"
      >
        Submit
      </v-btn>
    </v-form>
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
