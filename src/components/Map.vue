<template>
  <div class="com-container" @dblclick="returnChina">
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
    <div class="com-chart" ref="map"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import http from "@/utils/http";
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils.js";
export default {
  name: "MapVue",
  data() {
    return {
      myCharts: null,
      chartsData: null,
      titleFontSize: 66,
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
      this.myCharts = this.$echarts.init(this.$refs.map, this.theme);
      const { data: chinaMap } = await axios.get(
        "http://localhost:8080/static/map/china.json"
      );
      this.$echarts.registerMap("china", chinaMap);
      const initOption = {
        title: {
          text: "丨商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        legend: {
          bottom: "15%",
          left: "5%",
          icon: "circle",
          orient: "vertical",
        },
      };
      this.myCharts.setOption(initOption);
      this.myCharts.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!provinceInfo.key) {
          ("出错了");
        } else {
          const { data: provinceMap } = await axios(
            `http://localhost:8080${provinceInfo.path}`
          );
          this.$echarts.registerMap(provinceInfo.key, provinceMap);
          this.myCharts.setOption({
            geo: {
              type: "map",
              map: provinceInfo.key,
            },
          });
        }
      });
      const res = await http.get("map");
      this.chartsData = res;
      this.updateCharts();
    },
    updateCharts() {
      const scatterData = this.chartsData.map((item) => {
        return {
          name: item.name,
          data: item.children,
          type: "effectScatter",
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 10,
            brushType: "stroke",
          },
        };
      });
      const dataOption = {
        series: scatterData,
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.map.offsetWidth / 100) * 3.6;
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
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    },
    returnChina() {
      this.myCharts.setOption({
        geo: {
          type: "map",
          map: "china",
        },
      });
    },
  },
};
</script>

<style></style>
