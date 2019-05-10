<template>
  <div class="stats">
    <div class="custom-tabs">
      <div class="custom-tab-item" :class="{active:active === 0}" @click="active = 0">客流特征</div>
      <div class="custom-tab-item" :class="{active:active === 1}" @click="active = 1">实时客流</div>
      <!--<div class="custom-tab-item" :class="{active:active === 2}" @click="active = 2">通知</div>-->
    </div>
    <div class="custom-tab-content" v-show="active === 0">
      <people-stat v-on:toggleRealPeople="active = 1"/>
    </div>
    <div class="custom-tab-content" v-show="active === 1">
      <real-people/>
    </div>
    <!--<div class="custom-tab-content" v-show="active === 2">-->
      <!--<notification/>-->
    <!--</div>-->
  </div>
</template>
<script>
export default {
  name: "index",
  components: {
    peopleStat: function(resolve) {
      require(["./peopleStat.vue"], resolve);
    },
    realPeople: function(resolve) {
      require(["./realPeople.vue"], resolve);
    }
    // notification: function(resolve) {
    //   require(["./notification.vue"], resolve);
    // }
  },
  data() {
    return {
      active: 0
    };
  },
  mounted() {
    if (this.$route.params.activeId) {
      this.active = this.$route.params.activeId;
    }
  }
  // watch: {
  //   active: function (newVal, oldVal) {
  //     console.log('监听active');
  //     console.log(newVal, oldVal);
  //     if (this.$route.params.activeId) {
  //       newVal = this.$route.params.activeId;
  //     }
  //   }
  // }
};
</script>
<style scoped>
.custom-tabs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
  background: #fff;
  z-index: 100;
  padding: 0 20px;
  border-bottom: 0.5px solid #f6f6f6;
}

.custom-tab-item {
  display: inline-block;
  line-height: 44px;
  height: 44px;
  font-size: 14px;
  margin-right: 10px;
  margin-top: 10px;
  color: #333;
  cursor: pointer;
}

.custom-tab-item.active {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #4588d4;
}

.custom-tab-content {
  padding-top: 60px;
  height: 100%;
  /* position: relative; */
}
</style>


