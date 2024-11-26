<template>
  <div class="w-full p-2">
    <v-form
      @submit.prevent="handleSubmit"
      class="max-w-sm mx-auto flex flex-col gap-2"
    >
      <v-text-field
        prepend-inner-icon="mdi-account"
        density="comfortable"
        rounded="lg"
        class=""
        color="primary"
        clearable
        label="First Name"
        variant="solo-filled"
        :counter="75"
        :rules="[
          (v) =>
            !!v ||
            'Atleast a username, an email, or a phone number is required.',
        ]"
      ></v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-account"
        density="comfortable"
        rounded="lg"
        class=""
        color="primary"
        clearable
        label="Last Name"
        variant="solo-filled"
        :counter="75"
        :rules="[
          (v) =>
            !!v ||
            'Atleast a username, an email, or a phone number is required.',
        ]"
      ></v-text-field>

      <div class="flex flex-col items-center border rounded-lg py-2 relative">
        <div
          v-if="timeoutWindow < 31 && timeoutWindow > -1"
          class="absolute top-2 left-2"
        >
          <v-chip
            class="w-16"
            prepend-icon="mdi-clock-outline"
            variant="tonal"
            color="success"
            >{{ timeoutWindow }}s</v-chip
          >
        </div>

        <v-label class="">Verification Code</v-label>
        <v-otp-input
          v-model="otp"
          :error="otpError"
          :disabled="submitting"
          type="text"
          variant="solo-filled"
          :loading="submitting"
          class=""
          height="72"
        ></v-otp-input>
        <div class="relative w-full flex justify-center">
          <v-btn
            :loading="requestingNewCode"
            color="primary"
            class=""
            type="button"
            variant="tonal"
            rounded="lg"
            @click="handleRequestNewCode"
            >Request new code</v-btn
          >
        </div>
      </div>

      <v-btn block color="primary" class="" type="submit" rounded="lg"
        >Proceed</v-btn
      >
    </v-form>
  </div>
</template>
<script setup lang="ts">
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosPost } from "@/lib/lib.axios";
import { useAlertStore } from "@/stores/store.alerts";

const { pushAlert } = useAlertStore();
const otp = ref("");
const otpError = ref(false);
const submitting = ref(false);
const requestingNewCode = ref(false);
const handleRequest = useAPI();
const initials = ref<{ firstName: string; lastName: string }>({
  firstName: "",
  lastName: "",
});
const timeoutWindow = ref(31);

const handleRequestNewCode = async () => {
  requestingNewCode.value = true;
  await handleRequest({
    func: axiosPost,
    args: [
      APIS.account.requestAuthenticatedOtp,
      {
        reason: "account-approval",
      },
    ],
  })
    .then((res) => {
      if (res.status === "ok") {
        pushAlert({
          alert: {
            status: "success",
            message: "An OTP has been sent to your email.",
          },
        });
        const interval = setInterval(() => {
          if (timeoutWindow.value === 0) {
            timeoutWindow.value = 31;
            clearInterval(interval);
          } else {
            timeoutWindow.value--;
          }
        }, 1000);
      } else {
        pushAlert({
          alert: {
            status: "error",
            message:
              res.errors?.message ||
              "Sorry! An error occured while processing your OTP request.",
          },
        });
      }
    })
    .finally(() => (requestingNewCode.value = false));
};

const handleSubmit = () => {
  submitting.value = true;
  handleRequest({
    func: axiosPost,
    args: [
      APIS.account.requestAuthenticatedOtp,
      {
        otp: otp.value,
        firstName: initials.value.firstName,
        lastName: initials.value.lastName,
      },
    ],
  }).finally(() => (submitting.value = false));
};
</script>
