<template>
  <div class="messagedetail">
    <van-nav-bar
      :title="navTitle"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <scroller style="top:51px" :on-refresh="refresh" :on-infinite="infinite" noDataText="我是有底线的">
      <div class="tpl-panel" v-for="(item,index) in list" :key="index">
        <van-row>
          <van-col :span="20">
            <span class="title">发送内容(手机号: {{item.phone}})</span>
          </van-col>
          <van-col :span="4" style="text-align: right;">
            <van-tag plain :style="{'color':item.status ? '#59b0a2' : 'rgb(245, 108, 108)'}">{{item.status ? '成功' : '失败'}}</van-tag>
          </van-col>
        </van-row>
        <div class="content">{{item.content}}</div>
        <van-row>
          <van-col :span="12">
            <span class="time">提交时间: {{item.times}}</span>
          </van-col>
          <van-col :span="12" style="text-align: right">
            <span class="time">总字数为{{numCount(item.content)}}, 共计{{Math.ceil((numCount(item.content)) / 70)}}条</span>
          </van-col>
        </van-row>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {
    NavBar,
    Row,
    Col,
    Icon,
    Dialog,
    Popup,
    Button,
    Toast,
    Tab,
    Field,
    Tabs,
    RadioGroup,
    Radio,
    Tag,
    Checkbox,
    CheckboxGroup
  } from "vant";
  export default {
    name: "money-detail",
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [NavBar.name]: NavBar,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Tag.name]: Tag,
      [Popup.name]: Popup,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Dialog.name]: Dialog,
    },
    data() {
      return {
        masgactive: 0,
        packageAnli: "",
        signName: "", // 签名
        navTitle: "", // 名字
        messageOrflashId: "", // 短信还是闪信  2短信 1闪信
        loadinglayer: "",
        packageContent: "",
        packageName: "",
        list: [],
        page: 1,
        showPopup: false,
        hasData: 0,
        msgCont: null, // 群发 信息内容
        isShowMsgBox: false,
        disabled: false,
        activeModel: "0", // 模板类型（短信还是闪信）
        msgpm: {}, // 模板信息
        restWord: null,
        sLen: 0
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
      if (Number(this.$route.params.id) === 1) {
        this.messageOrflashId = "type=1";
        this.navTitle = "短信发送记录";
      } else if (Number(this.$route.params.id) === 2) {
        this.messageOrflashId = "type=2";
        this.navTitle = "闪信发送记录";
      }
      this.loadinglayer = document.getElementsByClassName("loading-layer");
      this.getModelList();
    },
    methods: {
      onClickLeft() {
        // console.log('this.$route.params.back:', this.$route.params.back);
        if (this.$route.params.back === 'peoplepackage') {
          this.$router.push("/peoplepackage");
        } else {
          this.$router.push("/setting");
        }
      },

      getModelList() {
        // this.
        this.$get(
          `client/smslog?types=${this.$route.params.id}&page=${this.page}` ,
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
          done();
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
      }
    }
  };
</script>
<style scoped>
  .tpl-panel {
    padding: 15px;
    border-bottom: 0.5px solid #eee;
  }

  .tpl-panel .time {
    font-size: 12px;
    line-height: 12px;
    vertical-align: middle;
    color: #999;
  }

  .tpl-panel .title {
    font-size: 14px;
    color: #333;
  }

  .tpl-panel .custom-btn {
    display: inline-block;
    padding: 5px;
    font-size: 0;
    border: 0.5px solid #eee;
    border-radius: 2px;
    margin-left: 10px;
  }

  .tpl-panel .custom-btn .van-icon {
    vertical-align: -6px;
    font-size: 12px;
  }

  .tpl-panel .custom-btn .text {
    font-size: 12px;
    line-height: 12px;
    vertical-align: middle;
    padding-left: 3px;
  }

  .tpl-panel .custom-btn img {
    vertical-align: -7px;
    height: 14px;
  }

  .tpl-panel .custom-btn.delete-btn {
    color: rgb(221, 70, 70);
    border-color: rgb(221, 70, 70);
    padding: 6px 5px;
  }

  .tpl-panel .custom-btn.send-btn {
    color: rgb(133, 182, 173);
    border-color: rgb(133, 182, 173);
  }

  .tpl-panel .content {
    padding: 5px;
    background-color: #f5f5f5;
    border-radius: 5px;
    font-size: 14px;
    line-height: 22px;
    margin: 10px 0;
  }

  .title {
    font-size: 15px;
  }
</style>
