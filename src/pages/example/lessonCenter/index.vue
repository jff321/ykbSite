<template>
  <div class="activity" v-title="$route.meta.title">
    <scroller :on-infinite="infinite">
    <div class="aui-content banner">
      <wapSwiper :isdemo=0 :speed=3000 :json=imgJson ></wapSwiper>
    </div>
    <div class="aui-content aui-padded-t-10 aui-padded-b-10 nav" v-if="navList !== []">
      <div class="row">
        <template v-for="items in navList">
        <router-link :to="{name: 'lessoncont', params:{id: items.id}}" class="aui-col-xs-2">
        <img :src="items.icon_small" alt="">
        <p class="aui-text-center word-theme">{{items.name}}</p>
        </router-link>
        </template>
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/shengyue.png" alt="">-->
          <!--<p class="aui-text-center word-theme">声乐</p>-->
        <!--</div>-->
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/write.png" alt="">-->
          <!--<p class="aui-text-center word-theme">写作</p>-->
        <!--</div>-->
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/guqing.png" alt="">-->
          <!--<p class="aui-text-center word-theme">古琴</p>-->
        <!--</div>-->
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/tuoguan.png" alt="">-->
          <!--<p class="aui-text-center word-theme">托管</p>-->
        <!--</div>-->
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/jiaoyu.png" alt="">-->
          <!--<p class="aui-text-center word-theme">十德</p>-->
        <!--</div>-->
        <!--<div class="aui-col-xs-2">-->
          <!--<img src="./imgs/tiqing.png" alt="">-->
          <!--<p class="aui-text-center word-theme">古筝</p>-->
        <!--</div>-->
      </div>
    </div>
    <template v-for="items in activityList">
      <router-link :to="{name: 'actioncont', params:{id: items.id}}" tag="div" class="aui-content aui-padded-b-10 lessonlist" >
        <img :src="imgCropp(items.picture_origin,1,756,323)" alt=""/>
        <div class="aui-padded-10">
          <div class="aui-pull-left">
            <h3>{{items.id}}{{items.name}}</h3>
            <p><span class="aui-iconfont aui-icon-date"></span>活动时间：{{dateDeal(items.gettime,'MM-dd hh:mm')}}</p>
          </div>
          <div class="aui-pull-right aui-padded-t-5">
            <span class="aui-btn aui-btn-warning">
              <span class="aui-iconfont aui-icon-display"></span>立即查看
            </span>
          </div>
        </div>
      </router-link>
    </template>
    </scroller>
  </div>
</template>
<script>
  const pageSize = 4;
  export default {
    name: 'lessoncenter', // 课程中心 也包含 轻中医
    data() {
      return {
        imgJson: [{}],
        navList: '',
        activityList: [],
        page: 1,
        type: null,
        typeid: 1, // 这个代表培训 和 2养生
        hasData: 0
      };
    },
    created() {
      this.typeid = this.$route.params.id;
      this.getBanner();
      this.getNav();
    },
    mounted() {
    },
    methods: {
      getBanner() {
        let _this = this;
        this.askGetData('api/slide?type=' + _this.typeid, '', function (result) { // 获取banner
          _this.imgJson = result.data.data;
        }, true);
      },
      getNav() {
        let _this = this;
        this.askGetData('api/course?type=' + _this.typeid, '', function (result) { // 获取栏目
          _this.navList = result.data.data;
        }, true);
      },
      getactivity() { // 活动列表
        let _this = this;
        this.askGetData('api/activity?type=' + _this.typeid + '&pageSize=' + pageSize + '&page=' + _this.page, '', function (result) { // 获取活动
          if (result.data.data.length !== 0) {
            for (let key in result.data.data) {
              _this.activityList.push(result.data.data[key]);
            }
          } else {
            _this.hasData = 1; // 返回没有数据
          }
        }, true);
      },
      infinite(done) { // 加载更多插件
        if (this.hasData) { // 代表没有 更多数据了
          done(true);
        } else {
          setTimeout(() => {
            this.getactivity();
            setTimeout(() => {
              done();
              this.page++;
            }, 400);
          }, 1500);
        }
      }
    },
    components: {
      wapSwiper: function (resolve) {
        // 异步组件写法
        require(['@/components/wap/mySwiper/index.vue'], resolve);
      }
    }
  };
</script>
<style scoped>
  .word-theme{
    color: #e6cd9b;
  }
  .nav{
    background-color: #fff;
  }
  .nav img{
    width:75%;
    margin: 0 auto;
  }
  .lessonlist{
    border-top:8px solid rgba(230,205,155,0.3);
    background-color: #fff;
  }
  .aui-btn-warning{
    border-radius: 0;
    background-color: #e6cd9b !important;
  }
  .banner{
    min-height: 8rem;
  }
  .activity{
    background-color: #fff;
    height: 100%;
  }
</style>
