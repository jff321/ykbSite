<template>
  <div class="banner" v-title="$route.meta.title">
    <swiper :options="swiperOption" ref="mySwiperA">
      <!-- 幻灯内容 -->
      <template v-if="!isdemo">
        <template v-for="items in imgsJson">
        <swiper-slide>
          <img :src="imgCropp(items.picture_origin,1,658,400)" @click="turnUrl(items.url)" />
        </swiper-slide>
        </template>
      </template>
      <template v-else>
        <swiper-slide >
          <img src="./imgs/banner1.png" />
        </swiper-slide>
        <swiper-slide >
          <img src="./imgs/banner2.png" />
        </swiper-slide>
        <swiper-slide >
          <img src="./imgs/banner3.png" />
        </swiper-slide>
      </template>
      <!-- 以下控件元素均为可选 -->
      <div class="swiper-pagination" slot="pagination"></div>
      <!--<div class="swiper-button-prev" slot="button-prev"></div>-->
      <!--<div class="swiper-button-next" slot="button-next"></div>-->
      <!--<div class="swiper-scrollbar"  slot="scrollbar"></div>-->
    </swiper>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.min.css';
  export default {
    name: 'wapmyswiper',
    props: ['speed', 'isdemo', 'api'],
    data() {
      return {
        imgsJson: {},
        swiperOption: {
          // 以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，
          // 假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          autoplay: this.speed ? this.speed : 3000,
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
//          prevButton: '.swiper-button-prev', // 上一张
//          nextButton: '.swiper-button-next', // 下一张
//          scrollbar: '.swiper-scrollbar', // 滚动条
          mousewheelControl: true,
          observeParents: true,
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: false
        }
      };
    },
    created() {
      this.getBanner();
    },
    computed: {
      swiper() {
        return this.$refs.mySwiperA.swiper;
      }
    },
    methods: {
      turnUrl(url) {
        self.location = url;
      },
      getBanner() { // 获取banner
        this.askGetData(this.api, '', (result) => { // 获取活动
          this.imgsJson = result.data.data;
        }, true);
      }
    }
  };
</script>
<style>
  .swiper-pagination-bullet-active{
    background-color: #d91517 !important;
  }
</style>
