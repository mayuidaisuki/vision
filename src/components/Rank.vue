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
    <div class="com-chart" ref="rank"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
export default {
  name: "RankVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      currentPage: 0,
      pageSize: 11,
      titleFontSize: 66,
      timer: null,
      targetColor: [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ],
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
        this.currentPage =
          this.currentPage % (this.chartsData.length - this.pageSize + 1);
      }, 2000);
    },
    async initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.rank, this.theme);
      const initOption = {
        title: {
          text: "丨地区销量排行",
          textStyle: {
            fontSize: this.titleFontSize,
          },
          left: 20,
          top: 20,
        },
        grid: {
          left: "3%",
          right: "6%",
          top: "25%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {},
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
                0,
              ],
              color: (arg) => {
                let colorData = [];
                if (arg.data[1] > 300) {
                  colorData = this.targetColor[0];
                } else if (arg.data[1] > 200) {
                  colorData = this.targetColor[1];
                } else {
                  colorData = this.targetColor[2];
                }
                return {
                  type: "linear",
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: colorData[0],
                    },
                    {
                      offset: 1,
                      color: colorData[1],
                    },
                  ],
                };
              },
            },
          },
        ],
      };
      this.myCharts.setOption(initOption);
      const res = await http.get("rank");
      this.chartsData = res.sort((a, b) => b.value - a.value);
      this.updateCharts();
      this.myCharts.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.myCharts.on("mouseout", () => {
        this.startTimer();
      });
    },
    updateCharts() {
      const dataOption = {
        dataZoom: {
          show: false,
          startValue: this.currentPage,
          endValue: this.currentPage + this.pageSize,
        },
        dataset: {
          source: this.chartsData.map((item) => [item.name, item.value]),
        },
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.rank.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
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
