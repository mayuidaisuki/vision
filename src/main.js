import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/global.less";
import "@/assets/font/iconfont.css";

Vue.config.productionTip = false;

Vue.prototype.$echarts = window.echarts;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
