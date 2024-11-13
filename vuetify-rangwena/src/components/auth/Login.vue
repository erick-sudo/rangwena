<template>
  <div>
    <div></div>
    <div class="">
      <v-form
        ref="form"
        v-model="valid"
        validate-on="input lazy"
        @submit.prevent="handleSubmit"
        class="d-flex flex-column"
      >
        <v-icon color="rgb(219 39 119)" icon="$vuetify" size="64"></v-icon>
        <h1 class="">Welcome back!</h1>
        <h3 class="">Log into your account</h3>

        <v-text-field
          rounded="lg"
          class="mt-4"
          color="rgb(219 39 119)"
          clearable
          label="Username, Email, or Phone"
          variant="solo-filled"
          v-model="identity"
          :counter="75"
          :rules="[
            (v) =>
              !!v ||
              'Atleast a username, an email, or a phone number is required.',
          ]"
        ></v-text-field>

        <v-text-field
          type="password"
          rounded="lg"
          class="mt-2"
          color="rgb(219 39 119)"
          clearable
          label="Password"
          variant="solo-filled"
          v-model="password"
          :rules="[(v) => !!v || 'Please enter your password.']"
        ></v-text-field>

        <RouterLink
          color="rgb(219 39 119)"
          class="align-self-end"
          to="/request-password-reset"
          >Forgot password?</RouterLink
        >

        <v-btn
          class="mt-4 text-white"
          color="rgb(219 39 119)"
          variant="elevated"
          rounded="lg"
          type="submit"
        >
          Sign in
        </v-btn>

        <div class="d-flex mt-4 align-center">
          <span class="flex-grow-1 border-b"></span>
          <span class="">or continue with</span>
          <span class="flex-grow-1 border-b"></span>
        </div>

        <v-btn
          class="mt-4 border"
          variant="elevated"
          rounded="lg"
          type="button"
        >
          Google
        </v-btn>

        <v-btn
          class="mt-4 border"
          variant="elevated"
          rounded="lg"
          type="button"
        >
          Facebook
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const authStore = useAuthStore();
const { pushAlert } = useAlertStore();

const valid = ref(false);
const identity = ref("admin@example.com");
const password = ref("Password123@");
const submitting = ref(false);
const form = useTemplateRef("form");

const handleSubmit = async () => {
  if (valid.value) {
    // Validation passed
    submitting.value = true;
    authStore
      .login({ identity: identity.value, password: password.value })
      .then((res) => {
        pushAlert({ alert: res });

        // Clear form on success
        if (res.status === "success") {
          form.value?.reset();
        }
      })
      .finally(() => {
        submitting.value = false;
      });
  }
};
</script>
