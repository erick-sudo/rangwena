<template>
  <!-- Screen = XS layout -->
  <div class="" v-if="$vuetify.display.smAndDown">
    <v-card variant="text" :loading="working" rounded="0" density="compact">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title>Activities</v-toolbar-title>

        <v-toolbar-items class="">
          <v-text-field
            v-if="tab === 'planned' || tab === 'previous'"
            color="secondary"
            width="200"
            density="compact"
            v-model="search"
            placeholder="Search activities"
            clearable
            prepend-inner-icon="mdi-text-search-variant"
            variant="plain"
          >
          </v-text-field>
        </v-toolbar-items>

        <template #extension>
          <v-tabs density="compact" v-model="tab" align-tabs="title">
            <v-tab text="planned" value="planned"></v-tab>
            <v-tab text="previous" value="previous"></v-tab>
            <v-tab
              :disabled="!authstore.isAdmin"
              text="new"
              value="new"
            ></v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="new">
          <new-activity-form></new-activity-form>
        </v-tabs-window-item>
        <v-tabs-window-item value="planned">
          <planned-activities
            @delete="deleteActivity"
            @edit="editActivity"
            @toggle="toggle"
          ></planned-activities>
        </v-tabs-window-item>
        <v-tabs-window-item value="previous">
          <previous-activities
            @delete="deleteActivity"
            @edit="editActivity"
            @toggle="toggle"
          ></previous-activities>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>

  <!-- SM >= Screen <=  MD layout -->
  <div
    class="grid grid-cols-5 items-start"
    v-else-if="$vuetify.display.sm || $vuetify.display.md"
  >
    <new-activity-form class="col-span-2"></new-activity-form>
    <div class="col-span-3 border-s">
      <v-card
        variant="text"
        :loading="working"
        rounded="0"
        elevation="0"
        density="compact"
      >
        <v-card-title class="pa-0">
          <v-tabs
            class=""
            density="compact"
            v-model="tab"
            align-tabs="start"
            color="primary"
          >
            <v-tab text="planned" value="planned"></v-tab>
            <v-tab text="previous" value="previous"></v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-subtitle>
          <v-text-field
            v-if="tab === 'planned' || tab === 'previous'"
            color="secondary"
            density="compact"
            v-model="search"
            placeholder="Search activities"
            clearable
            prepend-inner-icon="mdi-text-search-variant"
            variant="plain"
          >
          </v-text-field>
        </v-card-subtitle>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="planned">
            <planned-activities
              @delete="deleteActivity"
              @edit="editActivity"
              @toggle="toggle"
            ></planned-activities>
          </v-tabs-window-item>
          <v-tabs-window-item value="previous">
            <previous-activities
              @delete="deleteActivity"
              @edit="editActivity"
              @toggle="toggle"
            >
            </previous-activities>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </div>
  </div>

  <!-- LG screen layout -->
  <div v-else class="relative h-full">
    <div class="absolute inset-0 grid grid-cols-3">
      <!-- Add New Activity Section -->
      <div class="zero-size-vertical-scrollbar">
        <new-activity-form :loading="working" class=""></new-activity-form>
      </div>

      <!-- Planned Activities Section -->
      <div class="border-s border-e zero-size-vertical-scrollbar">
        <planned-activities
          @delete="deleteActivity"
          @edit="editActivity"
          @toggle="toggle"
          class=""
          :loading="working"
        >
          <template #subtitle>
            <v-text-field
              class="h-10"
              color="secondary"
              density="compact"
              v-model="search"
              placeholder="Search planned activities..."
              clearable
              prepend-inner-icon="mdi-text-search-variant"
              variant="plain"
            >
            </v-text-field>
          </template>
        </planned-activities>
      </div>

      <!-- Previous Activities Section -->
      <div class="zero-size-vertical-scrollbar">
        <previous-activities
          @delete="deleteActivity"
          @edit="editActivity"
          @toggle="toggle"
          :loading="working"
          class=""
        >
          <template #subtitle>
            <v-text-field
              class="h-10"
              color="secondary"
              density="compact"
              v-model="search"
              placeholder="Search previous activities..."
              clearable
              prepend-inner-icon="mdi-text-search-variant"
              variant="plain"
            >
            </v-text-field>
          </template>
        </previous-activities>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Activity } from "@/lib/types";
import { useActivityStore } from "@/stores/store.activities";
import { useAlertStore } from "@/stores/store.alerts";
import { useAuthStore } from "@/stores/store.auth";

const activitiesStore = useActivityStore();
const authstore = useAuthStore();
const { pushAlert } = useAlertStore();

const tab = ref(null);
const search = ref("");

const working = ref(false);

const toggle = async (activity: Activity, completed: boolean) => {
  await activitiesStore.update(activity.id, { completed, title: "Title" });
};

const deleteActivity = async (activity: Activity) => {
  working.value = true;
  const res = await activitiesStore.delete(activity.id);
  working.value = false;
  pushAlert({
    alert: res,
  });
};

const editActivity = async (activity: Activity) => {};

onMounted(async () => {
  await activitiesStore.fetchActivities();
});
</script>

<route lang="yaml">
meta:
  layout: index
</route>
