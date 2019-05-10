<template>
  <div id="home">
    <!--<keep-alive>-->
    <!--<router-view v-if="$route.meta.keepAlive"  v-title="$route.meta.title"></router-view>-->
    <!--</keep-alive>-->
    <!--<router-view v-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>-->
    <router-view v-title="$route.meta.title"></router-view>
    <van-tabbar v-model="active" v-show="$route.meta.isShowBar" class="g-z-index-10">
      <van-tabbar-item icon="wap-home" :to="{name:'home'}">首页</van-tabbar-item>
      <van-tabbar-item icon="pending-deliver" :to="{name:'peoplepackage'}">营销</van-tabbar-item>
      <van-tabbar-item icon="contact" :to="{name:'customer'}">客户</van-tabbar-item>
      <van-tabbar-item icon="setting" :to="{name:'setting'}">账户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);
export default {
  name: "Home",
  data() {
    return {
      active: 0,
      // icon: {
      //   normal: require('@/assets/wap/images/type.png'),
      //   active: require('@/assets/wap/images/typeactive.png')
      // },
      routeName: [
        { name: "home", index: 0 },
        { name: "peoplepackage", index: 1 },
        { name: "customer", index: 2 },
        { name: "peoplelist", index: 3 }
      ]
    };
  },
  watch: {
    $route: "changeActive"
  },
  methods: {
    changeActive({ name }) {
      this.setActive(name);
    },
    setActive(name) {
      this.routeName.forEach((tab, i) => {
        if (tab.name === name) {
          this.active = i;
          return false;
        }
      });
    }
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body,
html {
  background-color: #fff;
  padding-bottom: 50px !important;
}
._v-container > ._v-content {
  padding-bottom: 120px !important;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
_v-content {
  padding-bottom: 150px !important;
}
</style>
<style scoped>
/*最大宽度限制*/

#home {
  height: 100%;
  /* overflow: hidden;
    max-width: 40rem; */
  margin: 0 auto;
}
</style>
