/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../stores";
import router from "../router";
import { VueMasonryPlugin } from "vue-masonry";

import "@/styles/tailwind.css";

import "@/styles/index.css";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(vuetify).use(VueMasonryPlugin).use(router).use(pinia);
}
