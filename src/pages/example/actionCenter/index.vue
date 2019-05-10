<template>
  <div class="actionBg" v-title="$route.meta.title">
    <scroller :on-infinite="infinite">
    <div class="aui-content">
      <wapSwiper :isdemo=0 :speed=3000 :json=imgJson ></wapSwiper>
    </div>
    <div class="aui-content aui-padded-t-10 aui-clearfix aui-padded-b-15 middleline">
      <div class="aui-font-size-14 thistitle">
活动中心
      </div>
    </div>
    <template v-for="items in activityList">
    <router-link :to="{name: 'actioncont', params:{id: items.id}}" tag="div" class="actionList aui-margin-b-15" >
      <img :src="imgCropp(items.picture_origin,1,756,323)" class="imgbg" alt="">
      <div class="aui-padded-15 box">
          <div class="aui-padded-10 content">
            <div class="aui-padded-10 bg">
              <h3>{{items.name}}</h3>
              <p class="aui-text-wrap aui-padded-t-5"><i class="aui-iconfont aui-icon-location"></i> 地点：{{items.address}}</p>
              <div class="aui-clearfix g-height-auto aui-padded-t-5">
                <div class="aui-pull-left aui-font-size-14" style="color: #757575">
                  <img src="./imgs/money.png" style="width: .75rem;display: inline-block;vertical-align: -2px" alt="">
                  <template v-if="items.price">金额：{{items.price}}</template><template v-else><span class="aui-text-success">免费</span></template>
                </div>
                <div class="aui-pull-right aui-font-size-14" style="color: #757575">
                  <img src="./imgs/people.png" style="width: .9rem;display: inline-block;vertical-align: -3px" alt="">
                  人数：{{items.has_num}}/{{items.num}}
                </div>
              </div>
              <p class="aui-text-wrap aui-padded-t-5"><i class="aui-iconfont aui-icon-date"></i> 开始时间：{{items.gettime}}</p>
              <div class="aui-content aui-padded-b-10">
                <span class="aui-btn aui-btn-warning aui-pull-right">
                  <img src="./imgs/baoming.png" class="btnimg" alt="">立即报名
                </span>
              </div>
            </div>
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
    name: 'lessoncenter',
    data() {
      return {
        imgJson: [{}],
        page: 1,
        activityList: [],
        typeid: 1, // 这个代表3培训 和 4养生 活动 这个地方针对banner
        type: this.$route.params.id,
        hasData: 0
      };
    },
    created() {
      this.getBanner();
    },
    methods: {
      getBanner() {
        switch (this.$route.params.id) { // 这个只对banner 处理
          case 1:
            this.type = 3;  // 课程banner
            break;
          case 2:
            this.type = 4; // 轻中医banner
            break;
        }
        let _this = this;
        this.askGetData('api/slide?type=' + _this.type, '', function (result) { // 获取banner
          _this.imgJson = result.data.data;
        }, true);
      },
      getactivity() { // 活动列表
        let _this = this;
        this.askGetData('api/activity?type=' + _this.$route.params.id + '&pageSize=' + pageSize + '&page=' + _this.page, '', function (result) { // 获取活动
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
  .actionBg{
    height: 100%;
    background-color: #fff;
  }
  .nav img{
    width:75%;
    margin: 0 auto;
  }
  .lessonlist{
    border-top:8px solid rgba(230,205,155,0.3);
  }
  .aui-btn-warning{
    border-radius: 0;
    background-color: #e6cd9b !important;
  }
  .thistitle{
    border:1px #dcc89f solid;
    width:5rem;
    height: 1.5rem;
    line-height:1.5rem;
    text-align: center;
    margin: 0 auto;
    color: #dcc89f;
    background-color: #fff;
    position: relative;
    z-index: 11;
  }
  .middleline{
    position: relative;
  }
  .middleline:after{
    content: ' ';
    position: absolute;
    width:100%;
    height: 100%;
    top:60%;
    border-top:1px #f5f4f4 solid;
  }
  .actionList{
    height: auto;
    overflow: hidden;
    clear: both;
    margin-bottom:20px;
    position: relative;
  }
  .actionList img.imgbg{
    position: relative;
    height: 10.4rem;
  }
  .actionList .box{
    height: 100%;
    width:100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  .actionList .box .content{
    background-color: #fff;
    width:100%;
    height: 100%;
    background-color: rgba(239,239,239,.48);
  }
  .actionList .box .content .bg{
    height: 100%;
    background-color: rgba(255,255,255,.9);
    padding-bottom:.75rem;
  }
  .actionList .box .content .btnimg{
    width:1rem;
    height: 1rem;
    display: inline-block;
    vertical-align: -.3rem;
  }
</style>
