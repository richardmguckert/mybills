import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";
import pt from "vuetify/lib/locale/pt";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { pt },
    current: "pt",
  },
  theme: {
    themes: {
      light: {
        primary: colors.indigo,
      },
      dark: {
        primary: colors.indigo,
      },
    },
  },
});
