import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/screen",
  },
  {
    path: "/screen",
    component: () => import("@/views/ScreenPage.vue"),
  },
  {
    path: "/seller",
    component: () => import("@/views/SellerPage.vue"),
    name: "seller",
  },
  {
    path: "/trend",
    component: () => import("@/views/TrendPage.vue"),
    name: "trend",
  },
  {
    path: "/map",
    component: () => import("@/views/MapPage.vue"),
    name: "map",
  },
  {
    path: "/rank",
    component: () => import("@/views/RankPage.vue"),
    name: "rank",
  },
  {
    path: "/hot",
    component: () => import("@/views/HotPage.vue"),
    name: "hot",
  },
  {
    path: "/stock",
    component: () => import("@/views/StockPage.vue"),
    name: "stock",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
