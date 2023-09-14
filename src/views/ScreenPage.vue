<template>
  <div class="screen-container">
    <header class="screen-header">
      <div class="header-border">
        <img src="/static/img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <router-link to="/trend">趋势</router-link>
        <router-link to="/seller">金额</router-link>
        <router-link to="/map">分布</router-link>
        <router-link to="/rank">排行</router-link>
        <router-link to="/hot">热销</router-link>
        <router-link to="/stock">库存</router-link>
      </span>
      <span class="title">电商监控平台</span>
      <div class="title-right">
        <img
          class="qiehuan"
          @click="changeTheme"
          src="/static/img/qiehuan_dark.png"
          alt=""
        />
        <span class="datetime">{{ nowTime }}</span>
      </div>
      <div class="title-bottom">
        <img class="qiehuan" src="/static/img/qiehuan_dark.png" alt="" />
        <span class="datetime">{{ nowTime }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullScreenStatus.trend }">
          <Trend ref="trend" />
          <div class="resize">
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullScreenStatus.seller }">
          <Seller ref="seller" />
          <div class="resize">
            <span
              @click="changeSize('seller')"
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullScreenStatus.map }">
          <Map ref="map" />
          <div class="resize">
            <span
              @click="changeSize('map')"
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: fullScreenStatus.rank }">
          <Rank ref="rank" />
          <div class="resize">
            <span
              @click="changeSize('rank')"
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullScreenStatus.hot }">
          <Hot ref="hot" />
          <div class="resize">
            <span
              @click="changeSize('hot')"
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullScreenStatus.stock }">
          <Stock ref="stock" />
          <div class="resize">
            <span
              @click="changeSize('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              :style="{ color: theme ? 'white' : 'black' }"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hot from "@/components/Hot.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Stock from "@/components/Stock.vue";
import Trend from "@/components/Trend.vue";
export default {
  name: "ScreenPage",
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  data() {
    return {
      nowTime: "",
      timer: null,
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false,
      },
    };
  },
  mounted() {
    console.log(localStorage.getItem("theme"));
    this.getTime();
    this.startTimer();
  },
  computed: {
    ...mapState(["theme"]),
  },
  methods: {
    getTime() {
      const date = new Date();
      this.nowTime = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }:${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }:${
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`;
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.getTime();
      }, 1000);
    },
    changeTheme() {
      this.$store.commit("changeTheme");
    },
    changeSize(name) {
      if (this.fullScreenStatus[name]) {
        this.fullScreenStatus[name] = false;
      } else {
        this.fullScreenStatus[name] = true;
      }
      this.$refs[name].screenAdapter();
      this.$nextTick(() => {
        this.$refs[name].screenAdapter();
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 32px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .title-bottom {
    display: none;
    align-items: center;
    position: absolute;
    right: 50%;
    top: 100%;
    transform: translateX(50%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 20px;
    margin-left: 10px;
  }
  .logo {
    display: flex;
    justify-content: space-evenly;
    width: 35%;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    a {
      font-size: 24px;
      color: #fff;
      text-decoration: none;
    }
  }
  @media (max-width: 1024px) {
    .header-border {
      display: none;
    }
  }
  @media (max-width: 768px) {
    .title {
      width: 100%;
      text-align: center;
    }
    .title-right {
      display: none;
    }
    .title-bottom {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
    .logo {
      display: none;
    }
    .qiehuan {
      display: none;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
@media (max-width: 1024px) {
  .screen-body {
    display: block;
    margin-top: 40px;
    overflow: auto;
  }
  .screen-left {
    width: 100% !important;
  }
  .screen-middle {
    width: 100% !important;
  }
  .screen-right {
    width: 100% !important;
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
