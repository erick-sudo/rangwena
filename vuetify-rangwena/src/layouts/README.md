# Layouts

Layouts are reusable components that wrap around pages. They are used to provide a consistent look and feel across multiple pages.

Full documentation for this feature can be found in the Official [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) repository.

```vue
<template>
  <v-card loading variant="tonal" color="primary" class="m-4" elevation="8">
    <template #append>
      <v-icon>mdi-clipboard-text</v-icon>
    </template>

    <template #prepend>
      <v-icon>mdi-plane-car</v-icon>
    </template>

    <v-toolbar class="w-full" color="primaryContainer" extended light>
      <v-app-bar-nav-icon color="white" variant="tonal"></v-app-bar-nav-icon>
      <v-toolbar-title>My files</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="grey-darken-4" icon="mdi-magnify"></v-btn>

      <v-btn color="grey-darken-4" icon="mdi-view-module"></v-btn>

      <template #extension>
        <v-fab
          class="ms-4"
          color="primary"
          icon="mdi-plus"
          location="bottom left"
          size="40"
          absolute
          offset
          @click="dialog = !dialog"
        ></v-fab>
      </template>
    </v-toolbar>

    <v-list subheader lines="two">
      <v-list-subheader inset title="Folders"></v-list-subheader>

      <v-list-item v-for="item in items">
        <template #prepend>
          <v-avatar icon="mdi-folder" class="border bg-secondary"></v-avatar>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

        <template #append>
          <v-list-item-action>
            <v-btn
              icon="mdi-information"
              variant="text"
              color="secondary"
            ></v-btn>
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-subheader inset title="Files"></v-list-subheader>

      <v-list-item v-for="item in items2">
        <template #prepend>
          <v-avatar :icon="item.icon" :class="item.iconClass"></v-avatar>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

        <template #append>
          <v-list-item-action>
            <v-btn
              icon="mdi-information"
              variant="text"
              color="secondary"
            ></v-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <small class="text-grey">* This doesn't actually save.</small>
          <v-text-field label="File name"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="tonal" @click="dialog = false">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
const dialog = ref(false);
const items = ref([
  {
    title: "Photos",
    subtitle: "Jan 9, 2014",
  },
  {
    title: "Recipes",
    subtitle: "Jan 17, 2014",
  },
  {
    title: "Work",
    subtitle: "Jan 28, 2014",
  },
]);
const items2 = ref([
  {
    icon: "mdi-clipboard-text",
    iconClass: "bg-info text-white",
    title: "Vacation itinerary",
    subtitle: "Jan 20, 2014",
  },
  {
    icon: "mdi-gesture-tap-button",
    iconClass: "bg-warning text-white",
    title: "Kitchen remodel",
    subtitle: "Jan 10, 2014",
  },
]);
</script>
```
