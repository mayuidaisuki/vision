<!-- 商家销量横向柱状统计图 -->
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
    <div class="com-chart" ref="seller"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
export default {
  name: "SellerVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      currentPage: 0,
      totalPage: null,
      timer: null,
      titleFontSize: 66,
    };
  },
  mounted() {
    this.initCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    this.startTimer();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    currentPage() {
      this.updateCharts();
    },
    theme() {
      this.myCharts.dispose();
      this.initCharts();
      this.screenAdapter();
    },
  },
  methods: {
    startTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;
        this.currentPage = this.currentPage % this.totalPage;
      }, 3000);
    },
    async initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.seller, this.theme);
      const initOption = {
        title: {
          text: "丨商家销量统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          left: "3%",
          right: "6%",
          top: "20%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "category",
        },
        xAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: {
                type: "linear",
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#5052EE",
                  },
                  {
                    offset: 1,
                    color: "#AB6EE5",
                  },
                ],
              },
            },
          },
        ],
      };
      this.myCharts.setOption(initOption);
      const res = await http.get("seller");
      this.chartsData = res.sort((a, b) => b.value - a.value);
      this.totalPage = Math.ceil(this.chartsData.length / 5);
      this.updateCharts();
      this.myCharts.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.myCharts.on("mouseout", () => {
        this.startTimer();
      });
    },
    updateCharts() {
      const showData = this.chartsData.slice(
        5 * this.currentPage,
        5 * this.currentPage + 5
      );
      const dataOption = {
        dataset: {
          source: showData.map((item) => [item.name, item.value]),
        },
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.seller.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: this.titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                0,
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
              ],
            },
          },
        ],
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    },
  },
};
</script>

<style></style>
