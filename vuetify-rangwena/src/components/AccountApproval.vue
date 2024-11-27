<template>
  <div class="w-full p-2">
    <v-form
      ref="form"
      validate-on="input lazy"
      v-model="valid"
      @submit.prevent="handleSubmit"
      class="max-w-sm mx-auto flex flex-col gap-2"
    >
      <h2 class="text-lg">
        Account
        <span class="text-primary font-bold">Activation</span>
      </h2>
      <div class="flex gap-2">
        <v-chip
          @click="$router.push('/init-reg')"
          density="comfortable"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-arrow-left-thin"
          >Back to sign up</v-chip
        >
        <v-chip
          @click="$router.push('/sign-in')"
          density="comfortable"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-login"
          >Sign in</v-chip
        >
        <v-chip
          @click="$router.push('/')"
          density="comfortable"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-home-outline"
          >Home</v-chip
        >
      </div>
      <h3 class="text-sm">
        You have not yet activated your account. Please insert your initals
        below to activate. A verification code was sent to your email at initial
        registration. Request for a new one if you didn&apos;t receive it or
        request for a new one.
      </h3>
      <v-text-field
        v-model="initials.firstName"
        prepend-inner-icon="mdi-account"
        density="comfortable"
        rounded="lg"
        class=""
        color="primary"
        clearable
        label="First Name"
        variant="solo-filled"
        :counter="75"
        :rules="[(v) => !!v || 'first name is required.']"
      ></v-text-field>
      <v-text-field
        v-model="initials.lastName"
        prepend-inner-icon="mdi-account"
        density="comfortable"
        rounded="lg"
        class=""
        color="primary"
        clearable
        label="Last Name"
        variant="solo-filled"
        :counter="75"
        :rules="[(v) => !!v || 'last name is required.']"
      ></v-text-field>

      <div class="flex flex-col items-center border rounded-lg py-2 relative">
        <div
          v-if="timeoutWindow < 60 && timeoutWindow > -1"
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
          variant="outlined"
          :loading="submitting"
          class="border-primary"
        ></v-otp-input>
        <div class="relative w-full flex justify-center">
          <v-btn
            @click="drawer = !drawer"
            :loading="requestingNewCode"
            color="primary"
            type="button"
            variant="tonal"
            rounded="lg"
            >Request new code</v-btn
          >
        </div>
      </div>

      <v-btn
        :disabled="!valid"
        :color="valid && otp.length >= 6 ? 'primary' : 'secondary'"
        block
        :variant="valid && otp.length >= 6 ? 'elevated' : 'tonal'"
        class=""
        type="submit"
        rounded="lg"
        >Proceed</v-btn
      >
    </v-form>

    <v-navigation-drawer
      class="rounded-t-xl nav-drawer"
      location="bottom"
      floating
      mobile
      v-model="drawer"
    >
      <div class="max-w-sm mx-auto flex flex-col items-center p-2 gap-2">
        <v-btn
          size="tiny"
          @click="drawer = false"
          icon
          variant="tonal"
          color="primary"
        >
          <v-icon size="tiny">mdi-chevron-down</v-icon>
        </v-btn>

        <h3 class="text-secondary">Use your initials to request for an otp.</h3>

        <v-text-field
          v-model="identity"
          prepend-inner-icon="mdi-account-outline"
          rounded="xl"
          class="w-full"
          color="primary"
          clearable
          placeholder="Username, Email, or Phone number"
          variant="solo-filled"
          :rules="[
            (v) => !!v || 'please provide a username, email, or phone number',
          ]"
        >
          <template #append-inner>
            <v-btn
              :disabled="!identity"
              :loading="requestingNewCode"
              @click="handleRequestNewCode"
              :color="
                !!identity && timeoutWindow === 60 ? 'primary' : 'secondary'
              "
              :variant="
                !!identity && timeoutWindow === 60 ? 'elevated' : 'tonal'
              "
              class=""
              rounded="xl"
              >Send</v-btn
            >
          </template>
        </v-text-field>
      </div>
    </v-navigation-drawer>
  </div>
</template>
<script setup lang="ts">
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosPost } from "@/lib/lib.axios";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const drawer = ref(false);
const authStore = useAuthStore();
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
const valid = ref(false);
const timeoutWindow = ref(60);

const form = useTemplateRef("form");

const identity = ref("");

const handleRequestNewCode = async () => {
  requestingNewCode.value = true;
  await handleRequest({
    func: axiosPost,
    args: [
      APIS.account.requestPublicOtp,
      {
        reason: "account-activation",
        identity: identity.value,
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
            timeoutWindow.value = 60;
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
  handleRequest<any>({
    func: axiosPost,
    args: [
      APIS.account.activateAccount,
      {
        otp: otp.value,
        firstName: initials.value.firstName,
        lastName: initials.value.lastName,
      },
    ],
  })
    .then(async (res) => {
      if (res.status === "ok" && res.result) {
        pushAlert({
          alert: {
            status: "success",
            message: res.result.message || "Account activated successfully.",
          },
        });
        form.value?.reset();
        otp.value = "";
        await authStore.fetchCurrentUser();
      } else {
        pushAlert({
          alert: {
            status: "error",
            message: res.errors?.message || "Could not activate account.",
          },
        });
      }
    })
    .finally(() => (submitting.value = false));
};
</script>
<style lang="css" scoped></style>
