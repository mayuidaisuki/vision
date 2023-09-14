import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: localStorage.getItem("theme") || "chalk",
  },
  getters: {},
  mutations: {
    changeTheme(state) {
      if (state.theme === "chalk") {
        state.theme = "vintage";
      } else {
        state.theme = "chalk";
      }
      localStorage.setItem("theme", state.theme);
    },
  },
  actions: {},
  modules: {},
});
