<template>
  <div class="p-4 min-h-screen flex flex-col justify-center w-full">
    <div
      class="container mx-auto grid md:grid-cols-2 items-center justify-center gap-4"
    >
      <div class="flex md:justify-end">
        <div class="max-w-sm flex-grow p-6">
          <v-img class="" src="/svg/undraw_secure_login.svg"></v-img>
        </div>
      </div>
      <div class="flex md:justify-start">
        <v-form
          ref="form"
          v-model="valid"
          validate-on="input lazy"
          @submit.prevent="handleSubmit"
          class="flex flex-col max-w-sm min-w-[20rem] flex-grow py-4"
        >
          <RouterLink class="mx-auto" to="/">
            <v-icon color="primary" icon="$vuetify" size="64"></v-icon>
          </RouterLink>
          <h1 class="text-2xl mx-auto">Welcome back!</h1>
          <h3 class="text-xl mx-auto">Log into your account</h3>

          <v-text-field
            prepend-inner-icon="mdi-account-outline"
            density="comfortable"
            rounded="lg"
            class="mt-2"
            color="primary"
            clearable
            label="Username, Email, or Phone"
            variant="solo"
            v-model="identity"
            :counter="75"
            :rules="[
              (v) =>
                !!v ||
                'Atleast a username, an email, or a phone number is required.',
            ]"
          ></v-text-field>

          <v-text-field
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="visibilityIcon"
            @click:append-inner="toggleVisibility"
            :type="seePassword"
            density="comfortable"
            rounded="lg"
            class="mt-2"
            color="primary"
            clearable
            label="Password"
            variant="solo"
            v-model="password"
            :rules="[(v) => !!v || 'Please enter your password.']"
          ></v-text-field>

          <div class="flex justify-between items-center">
            <v-checkbox-btn
              color="primary"
              label="Remember me."
              class=""
              hide-details
              v-model="rememberMe"
            ></v-checkbox-btn>
            <RouterLink class="text-primary" to="/request-password-reset"
              >Forgot password?</RouterLink
            >
          </div>

          <v-btn
            size="large"
            :loading="submitting"
            class="mt-2"
            color="primary"
            variant="elevated"
            rounded="lg"
            type="submit"
          >
            Sign in
          </v-btn>

          <p class="self-center mt-4 text-sm">
            Not yet registered?
            <RouterLink class="text-primary" to="init-reg"
              >Sign up here</RouterLink
            >.
          </p>

          <!-- <div class="flex mt-2 items-center gap-3">
            <span class="flex-grow border-b"></span>
            <span class="">or continue with</span>
            <span class="flex-grow border-b"></span>
          </div>

          <v-btn
            size="large"
            prepend-icon="mdi-google"
            class="mt-4 border"
            variant="tonal"
            rounded="lg"
            type="button"
            color="primary"
          >
            Google
          </v-btn>

          <v-btn
            size="large"
            prepend-icon="mdi-facebook"
            class="mt-4 border"
            variant="tonal"
            rounded="lg"
            type="button"
            color="primary"
          >
            Facebook
          </v-btn> -->
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const authStore = useAuthStore();
const { pushAlert } = useAlertStore();
const router = useRouter();

const valid = ref(false);
const rememberMe = ref(false);
const identity = ref(""); // ref("admin@example.com");
const password = ref(""); // ref("Password123@");
const submitting = ref(false);
const form = useTemplateRef("form");
const seePassword = ref("password");

const toggleVisibility = () =>
  (seePassword.value = seePassword.value === "password" ? "text" : "password");

const visibilityIcon = computed(() =>
  seePassword.value === "password" ? "mdi-eye-outline" : "mdi-eye-off-outline"
);

const handleSubmit = async () => {
  if (valid.value) {
    // Validation passed
    submitting.value = true;
    authStore
      .login({
        identity: identity.value,
        password: password.value,
        rememberMe: rememberMe.value,
      })
      .then((res) => {
        pushAlert({ alert: res });

        // Clear form on success
        if (res.status === "success") {
          form.value?.reset();
          router.push("/");
        }
      })
      .finally(() => {
        submitting.value = false;
      });
  }
};
</script>
