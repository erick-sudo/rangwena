<template>
  <v-list-item class="pa-2 ps-6 pe-6">
    <template v-if="authStore.isAdmin" #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            density="compact"
            size="small"
            icon
            variant="text"
            ><v-icon size="tiny">mdi-dots-vertical</v-icon></v-btn
          >
        </template>

        <v-card rounded="xl" class="pa-2">
          <div class="flex gap-2">
            <v-chip
              v-if="!editting"
              @click="startEdit('email')"
              size="small"
              color="primary"
              variant="tonal"
              icon
            >
              <template #prepend>
                <v-icon size="tiny">mdi-pencil-outline</v-icon>
              </template>
              edit
            </v-chip>
            <v-chip
              v-else
              class=""
              size="small"
              color="primary"
              variant="tonal"
              @click="handleEdit"
            >
              <template #prepend>
                <v-icon class="me-1" size="tiny"
                  >mdi-content-save-outline</v-icon
                >
              </template>
              save
            </v-chip>
            <v-chip
              @click="emit('delete', member.id)"
              size="small"
              color="error"
              variant="tonal"
              icon
            >
              <template #prepend>
                <v-icon size="tiny">mdi-trash-can-outline</v-icon>
              </template>
              delete
            </v-chip>
            <v-chip
              v-if="!member.approved"
              @click="emit('approve', member.id)"
              size="small"
              color="success"
              variant="tonal"
              icon
            >
              approve
            </v-chip>
            <v-chip
              v-else
              @click="emit('revoke', member.id)"
              size="small"
              color="error"
              variant="tonal"
              icon
            >
              revoke
            </v-chip>
          </div>
        </v-card>
      </v-menu>
    </template>

    <!-- Title -->
    <v-list-item-title class="mb-1">@{{ member.username }}</v-list-item-title>

    <!-- Subtitle -->
    <v-text-field
      class="text-gray-400 font-semibold caret-orange-600"
      autofocus
      v-model="edittingValue"
      placeholder="New Email Address"
      density="compact"
      variant="plain"
      :rules="[(v) => !!v || 'an email address is required']"
      v-if="editting === 'email'"
    ></v-text-field>
    <v-list-item-subtitle v-else>{{ member.email }}</v-list-item-subtitle>

    <v-list-item-action v-if="!authStore.isAdmin" class="mt-1">
      <v-chip
        v-if="member.approved"
        variant="tonal"
        color="success"
        density="comfortable"
        prepend-icon="mdi-check-decagram-outline"
        >Approved</v-chip
      >
      <v-chip
        v-else
        variant="tonal"
        color="secondary"
        density="comfortable"
        prepend-icon="mdi-clock-outline"
        >Pending Approval</v-chip
      >
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import { MemberRegistration } from "@/lib/types";
import { useAuthStore } from "@/stores/store.auth";
import { Editable } from "./InitMemberRegistration.vue";

const authStore = useAuthStore();

const editting = ref<Editable>(null);
const edittingValue = ref("");

const props = defineProps<{
  member: MemberRegistration;
}>();

const emit = defineEmits<{
  (e: "approve", id: any): void;
  (e: "revoke", id: any): void;
  (e: "delete", id: any): void;
  (e: "edit", id: any, payload: any): void;
}>();

const startEdit = (editable: Editable) => {
  editting.value = editable;
  edittingValue.value =
    editable === "username" ? props.member.username : props.member.email;
};

const handleEdit = () => {
  emit("edit", props.member.id, { email: edittingValue.value });
};
</script>
