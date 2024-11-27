<template>
  <div class="mx-auto max-w-lg p-2">
    <v-card :loading="submitting">
      <v-toolbar color="primary">
        <v-toolbar-title>Member Registration Request</v-toolbar-title>
        <v-toolbar-items class="pt-1 pe-2 gap-2">
          <v-chip
            size="small"
            variant="tonal"
            @click="$router.push('/')"
            prepend-icon="mdi-home-outline"
            >Home</v-chip
          >
          <v-menu v-if="authStore.loggedIn">
            <template #activator="{ props }">
              <v-avatar
                border="2"
                v-bind="props"
                size="24"
                image="http://localhost:8000/erick.jpg"
              ></v-avatar>
            </template>
            <v-list nav density="compact" class="pa-0">
              <v-list-item
                rounded="0"
                density="compact"
                subtitle="Sign out"
                variant="text"
                @click="handleSignout"
                ><template #prepend>
                  <v-icon size="tiny">mdi-logout</v-icon>
                </template></v-list-item
              >
            </v-list>
          </v-menu>
          <v-chip
            v-else
            size="small"
            variant="tonal"
            @click="$router.push('/sign-in')"
            prepend-icon="mdi-login"
            >Login</v-chip
          >
        </v-toolbar-items>

        <template #extension>
          <v-tabs v-model="tab">
            <v-tab value="register" text="Register"></v-tab>
            <v-tab value="registered" text="Registered Members"></v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="register">
          <div class="p-4">
            <v-form
              @submit.prevent="handleSubmit"
              class="grid"
              v-model="valid"
              ref="form"
            >
              <v-text-field
                prepend-inner-icon="mdi-account"
                rounded="lg"
                clearable
                prefix="@"
                label="Username"
                variant="solo"
                v-model="newMember.username"
                :counter="75"
                :rules="[
                  (v) => !!v || 'a username is required',
                  (v) => !!!`${v}`.match(/\s+/) || 'this value contains spaces',
                  (v) =>
                    checkConflict('username', v + '', 'username already taken'),
                ]"
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-email-outline"
                rounded="lg"
                type="email"
                density="comfortable"
                clearable
                label="Email Address"
                variant="solo"
                v-model="newMember.email"
                :counter="75"
                :rules="[
                  (v) => !!v || 'an email address is required',
                  (v) =>
                    checkConflict(
                      'email',
                      v + '',
                      'email address already taken'
                    ),
                ]"
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-phone-plus-outline"
                rounded="lg"
                type="phone"
                density="comfortable"
                clearable
                label="Phone Number"
                variant="solo"
                v-model="newMember.phoneNumber"
                :counter="75"
                :rules="[
                  (v) => !!v || 'phone number is required',
                  (v) =>
                    checkConflict(
                      'phoneNumber',
                      v + '',
                      'phone number already taken'
                    ),
                ]"
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                density="comfortable"
                rounded="lg"
                clearable
                label="Password"
                variant="solo"
                v-model="newMember.password"
                :rules="[(v) => !!v || 'Please enter your password.']"
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                density="comfortable"
                rounded="lg"
                clearable
                label="Confirm Password"
                variant="solo"
                v-model="newMember.confirmPassword"
                :rules="[
                  (v) => !!v || 'Please enter your password.',
                  (v) => v === newMember.password || 'Passwords do not match.',
                ]"
              ></v-text-field>

              <div class="mb-2 ms-2">
                <span class="text-xs"
                  >Password strength: <em>{{ passwordStrength.desc }}</em
                  ><span v-if="passwordStrength.strength">, </span
                  ><em v-if="newMember.password?.length < 8" class="text-error"
                    >too short</em
                  ></span
                >
                <div class="w-48">
                  <v-progress-linear
                    rounded="lg"
                    rounded-bar
                    :color="strengthColor"
                    :model-value="passwordStrength.strength"
                    :max="5"
                  ></v-progress-linear>
                </div>
              </div>

              <v-btn
                type="submit"
                :loading="submitting"
                size="large"
                rounded="lg"
                color="primary"
                block
                >Submit</v-btn
              >
            </v-form>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="registered">
          <v-btn
            icon="mdi-arrow-left-thin"
            color="primary"
            density="comfortable"
            class="m-2"
            variant="tonal"
            @click="tab = 'register'"
          ></v-btn>
          <v-list v-if="members.length > 0">
            <template v-for="(member, index) in members" :key="index">
              <v-divider></v-divider>
              <init-member-list-item
                :member
                @edit="handleEdit"
                @delete="handleDelete"
                @approve="(id) => handleApproval(id, true)"
                @revoke="(id) => handleApproval(id, false)"
              ></init-member-list-item>
            </template>
          </v-list>
          <div v-else class="p-2">
            <div class="p-12 border rounded flex flex-col gap-4">
              <v-img src="/svg/undraw_empty.svg"></v-img>
              <p>No members yet...</p>
              <v-btn @click="tab = 'register'" variant="tonal" color="primary">
                Be the first to register
              </v-btn>
            </div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "@/lib/lib.axios";
import { CreateMemberRegistration, MemberRegistration } from "@/lib/types";
import { gradePassword } from "@/lib/utils";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const passwordStrengthColors: Record<string, string> = {
  "0": "secondary",
  "1": "error",
  "2": "error",
  "3": "warning",
  "4": "info",
  "5": "success",
};

const authStore = useAuthStore();

export type Editable = "username" | "email" | null;

const { pushAlert } = useAlertStore();

const handleRequest = useAPI();

const form = useTemplateRef("form");

const valid = ref(false);

const submitting = ref(false);

const handleSignout = async () => {
  submitting.value = true;
  await authStore.signout().then((res) => {
    submitting.value = false;
    pushAlert({ alert: res });
  });
};

const newMember = ref<CreateMemberRegistration>({
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const passwordStrength = computed(() => {
  const grade = gradePassword(newMember.value.password);
  if (grade.strength === 4 && newMember.value.password.length >= 8) {
    grade.strength = 5;
  }
  return grade;
});

const strengthColor = computed(
  () => passwordStrengthColors[`${passwordStrength.value.strength}`]
);

const members = ref<MemberRegistration[]>([]);

const tab = ref<string | null>(null);

const handleEdit = async (id: any, payload: any) => {
  submitting.value = true;
  await handleRequest<MemberRegistration>({
    func: axiosPatch,
    args: [APIS.init.retrieve.replace("<:id>", `${id}`), payload],
  })
    .then(async (res) => {
      if (res.status === "ok") {
        pushAlert({
          alert: {
            status: "success",
            message: "Registration details updated successfully.",
          },
        });
        await fetchMembers();
      } else {
        pushAlert({
          alert: {
            status: "error",
            message:
              res.errors?.message ||
              "Could not update user details. Please try again later.",
          },
        });
      }
    })
    .finally(() => (submitting.value = false));
};

const handleApproval = async (id: any, approved: boolean) => {
  submitting.value = true;
  await handleRequest<MemberRegistration>({
    func: axiosPatch,
    args: [APIS.init.retrieve.replace("<:id>", `${id}`), { approved }],
  })
    .then(async (res) => {
      if (res.status === "ok") {
        pushAlert({
          alert: {
            status: "success",
            message: `Account ${
              approved ? "approved" : "revoked"
            } successfully.`,
          },
        });
        await fetchMembers();
      } else {
        pushAlert({
          alert: {
            status: "error",
            message:
              res.errors?.message ||
              `Could not ${
                approved ? "approve" : "revoke"
              } account. Please try again later.`,
          },
        });
      }
    })
    .finally(() => (submitting.value = false));
};

const handleDelete = async (id: any) => {
  submitting.value = true;
  await handleRequest<MemberRegistration>({
    func: axiosDelete,
    args: [APIS.init.retrieve.replace("<:id>", `${id}`)],
  })
    .then(async (res) => {
      if (res.status === "ok") {
        pushAlert({
          alert: {
            status: "success",
            message: "Registration removed.",
          },
        });
        await fetchMembers();
      } else {
        pushAlert({
          alert: {
            status: "error",
            message:
              res.errors?.message ||
              "Could not unregister this user. Please try again later.",
          },
        });
      }
    })
    .finally(() => (submitting.value = false));
};

const checkConflict = async (
  field: string,
  value: string,
  errorMessage: string
): Promise<boolean | string> => {
  return await handleRequest<{ exists: boolean }>({
    func: axiosPost,
    args: [APIS.users.checkExists, { field, value }],
  }).then((res) => {
    if (res.status === "ok" && res.result) {
      if (res.result.exists) {
        return errorMessage;
      }
    }
    return true;
  });
};

const handleSubmit = () => {
  if (valid.value) {
    submitting.value = true;
    handleRequest<any>({
      func: axiosPost,
      args: [APIS.init.index, newMember.value],
    })
      .then((res) => {
        if (res.status === "ok" && res.result) {
          members.value.unshift(res.result);
          pushAlert({
            alert: {
              status: "success",
              message: res.result?.message || "Thank you for signing up.",
            },
          });
          form.value?.resetValidation();
          form.value?.reset();
        } else {
          pushAlert({
            alert: {
              status: "error",
              message:
                res.errors?.message ||
                "Could not register your details. Please try again later.",
            },
          });
        }
      })
      .finally(() => (submitting.value = false));
  }
};

const fetchMembers = async () => {
  await handleRequest<MemberRegistration[]>({
    func: axiosGet,
    args: [APIS.init.indexBrief],
  }).then((res) => {
    if (res.status === "ok" && res.result) {
      members.value = res.result;
    }
  });
};

onMounted(async () => {
  await fetchMembers();
});
</script>
