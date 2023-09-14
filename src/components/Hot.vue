<template>
  <div class="com-container">
    <router-link
      :style="{
        fontSize: titleFontSize + 'px',
        display: $route.path === '/screen' ? 'none' : 'block',
        color: theme === 'chalk' ? 'white' : 'black',
      }"
      class="go-home"
      to="/"
    >
      返回首页
    </router-link>
    <div class="com-chart" ref="hot"></div>
    <span
      :style="{
        fontSize: titleFontSize + 'px',
        color: theme === 'chalk' ? 'white' : 'black',
      }"
      class="iconfont arr-left"
      @click="changeCharts(-1)"
      >&#xe6ef;</span
    >
    <span
      :style="{
        fontSize: titleFontSize + 'px',
        color: theme === 'chalk' ? 'white' : 'black',
      }"
      class="iconfont arr-right"
      @click="changeCharts(1)"
      >&#xe6ed;</span
    >
    <span
      :style="{
        fontSize: titleFontSize + 'px',
        color: theme === 'chalk' ? 'white' : 'black',
      }"
      class="hot-title"
      >{{ pieTitle }}</span
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
export default {
  name: "HotVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      titleFontSize: 66,
      activeIndex: 0,
      activeData: null,
    };
  },
  computed: {
    pieTitle() {
      if (!this.activeData) {
        return "";
      } else {
        return this.activeData.name;
      }
    },
    ...mapState(["theme"]),
  },
  mounted() {
    console.log("theme", this.theme);
    this.initCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  watch: {
    theme() {
      this.myCharts.dispose();
      this.initCharts();
      this.screenAdapter();
    },
  },
  methods: {
    async initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.hot, this.theme);
      const initOption = {
        title: {
          text: "丨热销商品销售金额占比统计",
          left: 20,
          top: 20,
        },
        legend: {
          top: "12%",
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
          },
        ],
      };
      this.myCharts.setOption(initOption);
      const res = await http.get("hotproduct");
      this.chartsData = res;
      this.activeData = this.chartsData[this.activeIndex];
      this.activeData;
      this.updateCharts();
    },
    updateCharts() {
      const dataOption = {
        dataset: {
          source: this.activeData.children.map((item) => [
            item.name,
            item.value,
          ]),
        },
        tooltip: {
          formatter: (arg) => {
            const formatData = this.activeData.children.find(
              (item) => item.name === arg.name
            );
            formatData;
            const tip = formatData.children
              .map((item) => {
                return `${item.name}  ${(
                  (item.value / formatData.value) *
                  100
                ).toFixed(2)}%`;
              })
              .join("<br/>");
            return tip;
          },
          textStyle: {
            fontStyle: "italic",
          },
        },
        series: [
          {
            name: this.activeData.name,
          },
        ],
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemHeight: this.titleFontSize / 2,
          itemWidth: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "55%"],
          },
        ],
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    },
    changeCharts(val) {
      this.activeIndex = this.activeIndex + val;
      if (this.activeIndex < 0) {
        this.activeIndex = 2;
      }
      if (this.activeIndex > 2) {
        this.activeIndex = 0;
      }
      this.activeData = this.chartsData[this.activeIndex];
      this.updateCharts();
    },
  },
};
</script>

<style lang="less" scpoed>
.arr-left {
  position: absolute;
  color: white;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arr-right {
  position: absolute;
  color: white;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  cursor: pointer;
}
.hot-title {
  position: absolute;
  color: white;
  top: 80%;
  right: 10%;
}
</style>
