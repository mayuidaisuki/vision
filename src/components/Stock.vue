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
    <div class="com-chart" ref="stock"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
export default {
  name: "StockVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      titleFontSize: 66,
      currentPage: 0,
      totalPage: null,
      timer: null,
      centerArr: [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ],
      colorArr: [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
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
        this.currentPage = this.currentPage % this.totalPage;
      }, 3000);
    },
    async initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.stock, this.theme);
      const initOption = {
        title: {
          text: "丨库存销量图",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        tooltip: {
          formatter: (arg) => {
            const text = arg.dataIndex === 0 ? "销量" : "库存";
            return `${text}:${arg.value}`;
          },
        },
      };
      this.myCharts.setOption(initOption);
      const res = await http.get("stock");
      this.chartsData = res;
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
      const startIndex = 5 * this.currentPage;
      const endIndex = startIndex + 5;
      const showData = this.chartsData.slice(startIndex, endIndex);
      const dataOption = {
        series: showData.map((item, index) => {
          return {
            type: "pie",
            radius: [this.titleFontSize * 2, this.titleFontSize * 2.25],
            center: this.centerArr[index],
            data: [
              {
                name: `${item.name}\n\n${item.sales}`,
                value: item.sales,
                itemStyle: {
                  color: {
                    type: "linear",
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: this.colorArr[index][0],
                      },
                      {
                        offset: 1,
                        color: this.colorArr[index][1],
                      },
                    ],
                  },
                },
              },
              {
                value: item.stock,
                itemStyle: {
                  color: "#333843",
                },
              },
            ],
            labelLine: {
              show: false,
            },
            label: {
              position: "center",
              color: this.colorArr[index][0],
              fontSize: this.titleFontSize / 2,
            },
            hoverAnimation: false,
          };
        }),
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.stock.offsetWidth / 100) * 3.6;
      const innerRadius = this.titleFontSize * 2;
      const outterRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: new Array(5).map(() => {
          return {
            type: "pie",
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          };
        }),
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    },
  },
};
</script>

<style></style>
