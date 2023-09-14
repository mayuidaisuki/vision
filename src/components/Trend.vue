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
    <div
      class="title"
      :style="{
        fontSize: titleFontSize + 'px',
        color: theme === 'chalk' ? 'white' : 'black',
      }"
    >
      <span>丨{{ selectedType.text }}</span>
      <span
        class="iconfont select-icon"
        :style="{
          fontSize: titleFontSize + 'px',
        }"
        @click="selected = !selected"
      >
        &#xe6eb;
      </span>
      <div class="select-container" v-show="selected">
        <div
          class="select-item"
          v-show="selectedType.key !== item.key"
          v-for="item in selectArr"
          :key="item.key"
          @click="handleSelected(item)"
        >
          丨{{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
export default {
  name: "TrendVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      selectedType: {
        key: "",
        text: "",
      },
      selectArr: [],
      selected: false,
      titleFontSize: 66,
      colorArr1: [
        "rgba(11,168,44,0.5)",
        "rgba(44,110,255,0.5)",
        "rgba(22,242,217,0.5)",
        "rgba(254,33,30,0.5)",
        "rgba(250,105,0,0.5)",
      ],
      colorArr2: [
        "rgba(11,168,44,0)",
        "rgba(44,110,255,0)",
        "rgba(22,242,217,0)",
        "rgba(254,33,30,0)",
        "rgba(250,105,0,0)",
      ],
    };
  },
  mounted() {
    this.initCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    ...mapState(["theme"]),
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
      this.myCharts = this.$echarts.init(this.$refs.trend, this.theme);
      const initOption = {
        title: {
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
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          scale: true,
        },
        series: [
          {
            type: "line",
            seriesLayoutBy: "row",
            stack: "all",
          },
        ],
      };
      this.myCharts.setOption(initOption);
      const res = await http.get("trend");
      this.chartsData = res;
      this.selectArr = this.chartsData.type;
      this.selectedType = this.selectArr[0];
      this.updateCharts();
    },
    updateCharts() {
      const type = this.selectedType.key;
      const categoryData = [type, ...this.chartsData.common.month];
      const showData = this.chartsData[type].data.map((item) => [
        item.name,
        ...item.data,
      ]);
      const dataOption = {
        dataset: {
          source: [categoryData, ...showData],
        },
        series: showData.map((item, index) => {
          return {
            name: item[0],
            type: "line",
            seriesLayoutBy: "row",
            stack: "all",
            areaStyle: {
              color: {
                type: "linear",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: this.colorArr1[index],
                  },
                  {
                    offset: 1,
                    color: this.colorArr2[index],
                  },
                ],
              },
            },
          };
        }),
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemHeight: this.titleFontSize / 2,
          itemWidth: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    },
    handleSelected(item) {
      this.selectedType = item;
      this.selected = false;
      this.updateCharts();
    },
  },
};
</script>

<style lang="less" scpoed>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  font-size: 66px;

  .select-icon {
    margin-left: 10px;
    cursor: pointer;
    font-size: 66px;
  }
}
</style>
