<template>
  <div class="activity" v-title="$route.meta.title">
    <scroller :on-infinite="infinite">
    <div class="aui-content banner">
      <wapSwiper :isdemo=0 :speed=3000 :json=imgJson ></wapSwiper>
    </div>
    <div class="aui-content aui-padded-t-10 aui-padded-b-10 nav">
      <div class="row">
        <template v-for="items in navList">
        <router-link :to="{name: 'medicinecont', params:{id: items.id}}" tag="div" class="aui-col-xs-2">
        <img :src="items.icon_small" alt="">
        <p class="aui-text-center word-theme">{{items.name}}</p>
        </router-link>
        </template>
      </div>
    </div>
    <template v-for="items in activityList">
      <router-link :to="{name: 'actioncont', params:{id: items.id}}" tag="div" class="aui-content aui-padded-b-10 lessonlist" >
        <img :src="imgCropp(items.picture_origin,3,756,323)" alt=""/>
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
    name: 'medicine', // 轻中医
    data() {
      return {
        imgJson: [{}],
        navList: '',
        activityList: [],
        page: 1,
        type: null,
        typeid: 2, // 2 代表轻中医活动
        hasData: 0,
        banerid: 2 // 代表轻中医中心
      };
    },
    created() {
      this.getBanner();
      this.getNav();
    },
    mounted() {
    },
    methods: {
      getBanner() { // banner
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
      getactivity() { // 轻中医活动列表
        let _this = this;
        this.askGetData('api/activity?type=' + _this.typeid + '&pageSize=' + pageSize + '&page=' + _this.page, '', function (result) { // 获取活动
          if (result.data.data.length) {
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
  .nav .aui-col-xs-2{
    width:20%;
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
