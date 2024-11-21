/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

import colors from "vuetify/util/colors";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          primary: colors.deepOrange.accent3,
          primaryContainer: colors.deepOrange.darken3,
          primaryVariant: colors.deepOrange.lighten3,
          onPrimaryContainer: colors.deepOrange.lighten4,
          secondary: colors.grey.darken2
        },
      },
    },
  },
});
