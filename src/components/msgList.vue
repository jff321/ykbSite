<template>
  <div>
    <scroller style="top:152px" :on-refresh="refresh" :on-infinite="infinite" noDataText="我是有底线的">
      <div v-for="(item,index) in list" :key="index"  @click="listenListDetail(item.id)">
        <van-row type="flex" align="center" class="rowStyle">
          <van-col span="4" class="msgImg" style="">
            <img src="../pages/flashLetter/imgs/信息Message.png" alt="">
          </van-col>
          <van-col span="12">
            <div>
              <p class="title">{{item.title}}</p>
              <p class="time">{{item.times}}</p>
              <p class="time" v-if="item.status === 1">发送成功</p>
              <p class="time" v-if="item.status === 0">发送失败</p>
            </div>
          </van-col>
          <van-col span="8" class="icon">
            <van-icon name="arrow" size="12px" />
          </van-col>
      </van-row>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {
    Row,
    Col,
    Icon
  } from 'vant';
  export default {
    props: {
      titleInput: {
        type: String,
        required: true
      },
      msgpage: {
        type: Number,
        required: true
      }
    },
    name: "msglist",
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
    },
    data() {
      return {
        loadinglayer: "",
        list: [],
        page: this.msgpage,
        hasData: 0,
      };
    },
    watch: {
      list: function(newValue) {
        if (newValue.length <= 5) {
          if (this.loadinglayer.length) {
            this.loadinglayer[0].style.opacity = 0;
          }
        } else {
          if (this.loadinglayer.length) {
            // console.info("总的list", this.loadinglayer);
            // this.loadinglayer.getElementsByClassName('no-data-text')[0].style.opacity = 1;
            this.loadinglayer[0].style.opacity = 1;
          }
        }
      }
    },
    mounted() {
      this.loadinglayer = document.getElementsByClassName("loading-layer");
      // this.getModelList();
    },
    methods: {
      getModelList() {
        this.$get(
          `client/smslog?types=${this.$route.params.id}&page=${this.page}&keys=${this.titleInput}` ,
          "",
          res => {
            if (res.data.code === 200) {
              if (this.page === 1) {
                this.list = [];
              }
              if (res.data.data.list.length === 0) {
                this.hasData = 1;
                if (this.loadinglayer.length) {
                  this.loadinglayer[0].style.opacity = 1;
                }
                // if (this.isSearch === 1) {
                //   Dialog.alert({
                //     title: "提示",
                //     message: "没有搜索到数据"
                //   });
                // }
              } else {
                if (this.page === 1) {
                  // console.log('page等于1的时候发生page等于1的时候发生');
                  this.list = res.data.data.list;
                } else {
                  // console.log('page大于1的时候发生');
                  if (this.list[0] && this.list[0].id === res.data.data.list[0].id) {
                    this.list = res.data.data.list;
                  } else {
                    for (let key in res.data.data.list) {
                      this.list.push(res.data.data.list[key]);
                    }
                  }
                }
              }
              if (this.list.length === 0) {
                // console.log('if (this.list.length === 0的情况下出现');
                if (this.loadinglayer.length) {
                  this.loadinglayer[0].style.opacity = 0;
                }
              }
            } else if (res.data.code === 403){
              // console.log('else打印res.data.data.msg：', res.data.data.msg);
              Dialog.alert({
                title: "提示",
                message: res.data.msg
              }).then(() => {
                this.$router.push({
                  name: 'login'
                })
              });
            } else {
              Dialog.alert({
                title: "提示",
                message: res.data.msg
              })
            }
          }
        );
      },
      refresh(done) {
        setTimeout(() => {
          this.page = 1;
          this.list = [];
          this.hasData = 0;
          this.getModelList();
          done(true);
        }, 1500);
      },
      infinite(done) {
        // 加载更多插件
        // console.info(this.hasData, this.page);
        if (this.hasData) {
          // 代表没有 更多数据了
          done(true);
        } else {
          setTimeout(() => {
            this.getModelList();
            setTimeout(() => {
              done();
              this.page++;
            }, 400);
          }, 1000);
        }
      },
      listenListDetail(msgId){
        this.$emit('toListDetail', msgId)
      }
    }
  }
</script>

<style scoped>
.title{
  font-size: 14px;
  font-weight: 600;
  padding: 5px 0px;
}
.time{
  font-size: 12px;
  padding: 1px 0px;
}
.icon{
  text-align: right;
  padding-right: 15px;
}
.msgImg{
  text-align: center;
  padding-top: 6px;
}
.rowStyle{
  padding-bottom: 5px;
  border-bottom: 0.5px solid #f6f6f6;
}
</style>
