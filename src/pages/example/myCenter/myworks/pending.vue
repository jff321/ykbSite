<template>
  <!--全部作品界面-->
  <div class="myworks" v-title="$route.meta.title">
    <div class="aui-content aui-padded-15 g-fixed-top">
      <div class="aui-bar aui-bar-btn aui-bar-btn-round ">
        <div class="aui-bar-btn-item works-active">全部作品</div>
        <router-link :to="{name:'myworks'}" class="aui-bar-btn-item" tag="div">我的作品</router-link>
        <router-link :to="{name:'myworks'}" class="aui-bar-btn-item" tag="div">待处理</router-link>
      </div>
    </div>
    <scroller :on-infinite="infinite">
    <div class="aui-content aui-padded-15">
      <div class="works-list">
        <div class="aui-content aui-margin-b-15">
          <ul class="aui-list aui-media-list aui-margin-t-15" v-for="items in workList">
            <router-link :to="{name: 'workscontent', params:{id: items.id}}" tag="li" class="aui-list-item">
              <div class="aui-media-list-item-inner">
                <div class="aui-list-item-media">
                  <img :src="imgCropp(items.picture_origin,1,200,200)" />
                </div>
                <div class="aui-list-item-inner">
                  <div class="aui-list-item-text">
                    <div class="aui-list-item-title aui-font-size-15 aui-text-wrap">{{items.id}}课程名称：{{items.type_link.name}}</div>
                  </div>
                  <div class="aui-list-item-text aui-padded-t-5">
                    <div class="aui-info-item">
                      <img src="./imgs/student.png" style="width:1rem" class="aui-img-round student">
                      <span class="aui-margin-l-5 aui-font-size-14 name">学生{{items.uid_link.name}}</span>
                    </div>
                  </div>
                  <div class="aui-padded-t-5 aui-text-right">
                    <span class="aui-btn aui-btn-sm aui-btn-warning  g-btn-radius aui-pull-right">立即查看</span>
                  </div>
                </div>
              </div>
              <div class="aui-info aui-padded-b-5" style="padding-top:0">
                <div class="aui-info-item">
                  <img src="./imgs/teacher.png" style="width:1rem" class="aui-img-round teacher">
                  <span class="aui-margin-l-5 aui-font-size-14 name">{{items.teacher_id_link.name}}老师</span>
                </div>
                <div class="aui-info-item aui-font-size-12">{{items.updated_at}}</div>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    </scroller>
  </div>
</template>
<script>
  const pageSize = 4;
  export default {
    name: 'pending', // 待处理
    data() {
      return {
        type: '',
        workList: [],
        hasData: 0,
        page: 1
      };
    },
    watch: {
//      '$route': 'switchWorks'
    },
    methods: {
      getWorksList() {
        let _this = this;
        this.askGetData('api/work/?pageSize=' + pageSize + '&page=' + _this.page, '', function (result) { // 获取 活动列表
          if (result.data.data.length) {
            for (let key in result.data.data) {
              _this.workList.push(result.data.data[key]);
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
            this.getWorksList();
            setTimeout(() => {
              done();
              this.page++;
            }, 400);
          }, 1500);
        }
      }
    }
  };
</script>
<style scoped>
  .myworks{
    height: 100%;
    background-color: #fdf9f1;
  }
  .works-list{
    padding-top:1.9rem;
  }
  .aui-bar-btn-item{
    background-color: #fff;
  }
  .aui-info-item{
    color: #a8a8a8;
  }
  .aui-list-item-title{
    color: #8a8a8a;
  }
  .teacher,
  .student{
    /*border:1px #8a8a8a solid;*/
    padding: 1px;
    vertical-align: -3px;
  }
  .name{
    vertical-align: -3px;
    padding-top:.2rem;
  }
  .works-list .aui-list-item{
    padding-left:.5rem;
  }
  .aui-btn-warning{
    height: 1.2rem;
    line-height:1.3rem;
    margin-top: -.35rem;
    background-color: #e6cd9b !important;
  }
  @media screen and (-webkit-min-device-pixel-ratio: 1.5){
    .aui-list .aui-list-item {
      border: none;
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: bottom;
      background-image: none;
      background-image: none;
    }
  }
  .works-active{
    background-color: #e6cd9b;
    color: #ffffff;
  }
</style>
