<template>
  <div class="stats">
    <van-nav-bar
      :title="this.$route.meta.title"
      right-text="按钮"
    >
      <div slot="right" class="setIcon" style="padding-top: 16px;" @click="create">
        <img src="./imgs/setting.png" alt style="width: 25px;height: 25px;">
      </div>
      <!--<img  src="./imgs/set.png" alt width="40">-->
    </van-nav-bar>
    <van-popup v-model="showPopup" :overlay="false" position="right">
      <new-package v-on:hidePopup="showPopup = false" v-on:pkgCreated="reloadData"></new-package>
    </van-popup>
    <div class="custom-tabs" style="margin-top: 46px;">
      <div class="custom-tab-item" :class="{active:active === 0}" @click="active = 0">匹配</div>
      <div class="custom-tab-item" :class="{active:active === 1}" @click="active = 1">手机号</div>
    </div>
    <div class="custom-tab-content" v-show="active === 0">
      <scroller
        style="padding-top: 111px;"
        :on-refresh="refresh"
        :on-infinite="infinite"
        noDataText="我是有底线的"
      >
        <van-row style="padding: 0px 15px">
          <template v-for="(items,index) in list">
            <router-link :to="{name:'peoplelistpackage',params:{id:items.id}}">
              <van-col
                :span="24"
                style="padding: 15px 0; border-bottom: 0.5px solid #eee;"
                :key="index"
              >
                <van-col :span="16">
                  <h2 class="title">{{items.name}}</h2>
                  <p class="time-wrap">
                    <span class="time">创建时间 {{items.times}}</span>
                  </p>

                  <span
                    class="state"
                    :class="{success:items.status, fail:!items.status}"
                    v-if="items.status === 1"
                  >计算完成</span>
                  <span
                    class="state"
                    :class="{success:items.status, fail:!items.status}"
                    v-else
                  >计算中</span>

                  <!-- <div class="telephone">
                    <span class="label labelbgcolorno" v-if="!items.status">{{items.status_link}}</span>
                    <span class="label labelbgcolorhave" v-if="items.status">{{items.status_link}}</span>
                  </div>-->
                </van-col>
                <van-col :span="8">
                  <div class="item-right">
                    <p class="quantity">
                      <span class="value">{{items.t_nums}}</span>
                      <br>
                      <span class="name">可用人数</span>
                    </p>
                  </div>
                </van-col>
              </van-col>
            </router-link>
          </template>
        </van-row>
      </scroller>
    </div>
    <div class="custom-tab-content" v-show="active === 1">
     <all-mate-phone></all-mate-phone>
    </div>
    <!--创建匹配，短信管理，闪信管理-->
    <van-popup v-model="isSet" position="top" style="height: 80px;">
      <div style="display: flex;justify-content:center;padding-top: 10px;">
        <!--<div style="display: flex;align-items:center;width: 150px;">-->
        <div class="icon" @click="onClickRight">
          <img src="./imgs/create2.png" alt width="40">
          <p style="font-size: 12px;text-align: center">创建匹配</p>
        </div>
        <div class="icon" @click="toFlashLetter2">
          <img src="./imgs/message2.png" alt width="40">
          <p style="font-size: 12px;text-align: center">短信管理</p>
        </div>
        <div class="icon" @click="toFlashLetter1">
          <img src="./imgs/flash2.png" alt width="40">
          <p style="">闪信管理</p>
        </div>
        <!--</div>-->
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  Row,
  Col,
  Icon,
  Cell,
  CellGroup,
  Button,
  Popup,
  // Actionsheet,
  // DatetimePicker,
  Toast,
  Dialog,
  NavBar,
  Tab,
  Tabs
} from "vant";
export default {
  name: "index",
  components: {
    newPackage: function(resolve) {
      require(["./new.vue"], resolve);
    },
    allMatePhone: function(resolve) {
      require(["./allMatePhone.vue"], resolve);
    },
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Popup.name]: Popup,
    // [Actionsheet.name]: Actionsheet,
    // [DatetimePicker.name]: DatetimePicker,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab
  },
  data() {
    return {
      active: 0,
      disabled: false,
      loadinglayer: "",
      packageName: "", // 人群包名称
      shortTime: 0, // 最短驻留时间
      longTime: "不限", // 最长驻留时间
      showPopup: false,
      showDate: false,
      notRepeat: true, // 匹配过不重复出现
      beginshowdatelist: false,
      endshowdatelist: false,
      total: null,
      beginDateTime: "",
      endDateTime: "",
      begincurrentDate: new Date(),
      endcurrentDate: new Date(),
      bindSelect: null,
      distanceSelect: null,
      binding: [],
      distance: [
        {
          label: "不限",
          value: "0"
        },
        {
          label: "50米内",
          value: "10"
        },
        {
          label: "30米内",
          value: "30"
        },
        {
          label: "10米内",
          value: "50"
        },
        {
          label: "5米内",
          value: "80"
        }
      ],
      page: 1,
      hasData: 0,
      list: [],
      desShow: false,
      fixHeight: 0,
      iconIsAppear: "none",
      back: 'peoplepackage',
      isSet: false
    };
  },
  computed: {
    allDate() {
      const { beginDateTime, endDateTime } = this;
      return {
        beginDateTime,
        endDateTime
      };
    }
  },
  watch: {
    // shortTime: "getTotal",
    // longTime: "getTotal",
    // allDate: {
    //   handler: function(val) {
    //     console.log("allDate change: ", val);
    //     if (val.beginDateTime && val.endDateTime) {
    //       this.getTotal();
    //     }
    //   },
    //   deep: true
    // },
    list: function(newValue) {
      if (newValue.length <= 7) {
        if (this.loadinglayer.length) {
          this.loadinglayer[0].style.opacity = 0;
        }
      } else {
        if (this.loadinglayer.length) {
          this.loadinglayer[0].style.opacity = 1;
        }
      }
    }
  },
  // 获取屏幕高度
  beforeMount(height) {
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.fixHeight = h - 110; // 减去页面上固定高度height
    // console.log(this.fixHeight);
  },
  mounted() {
    this.loadinglayer = document.getElementsByClassName("loading-layer");
    this.bindSelect = "all";
    this.distanceSelect = "0";
    // this.getDataList();
  },
  methods: {
    onClickRight() {
      this.showPopup = !this.showPopup;
      this.isSet = false;
    },
    getTotal() {
      let time;
      let mid;
      if (this.bindSelect === "all") {
        mid = "";
        // mid = 'all';
      } else {
        mid = "&mid$=" + this.bindSelect;
      }
      let updated =
        "&updated_at$" + "=>=" + this.beginDateTime + ",<=" + this.endDateTime;
      let rssi = "&rssi$=>=" + this.distanceSelect;
      // if (this.maxtime > 0) {
      //    time = '&time$=>=' + this.shortTime * 60 + ',<=' + this.maxtime;
      // } else {
      //    time = '&time$=>=' + this.shortTime * 60;
      // }
      let sTime = parseFloat(this.shortTime);
      let lTime = parseFloat(this.longTime);
      // console.log(sTime);
      // console.log(lTime);

      if (isNaN(sTime) && !isNaN(lTime)) {
        time = "&time$=<=" + lTime * 60;
      } else if (!isNaN(sTime) && isNaN(lTime)) {
        time = "&time$=>=" + sTime * 60;
      } else if (!isNaN(sTime) && !isNaN(lTime)) {
        time = "&time$=>=" + sTime * 60 + ",<=" + lTime * 60;
      }

      console.log(time);

      console.info(
        "获取数量" + "media/mac/?" + updated + rssi + time + mid + "&pageSize=1"
      );
      this.$get(
        "media/mac/?" + updated + rssi + time + mid + "&pageSize=1",
        "",
        res => {
          console.info("返回的total", res);
          this.total = res.data.mate.total;
        }
      );
    },
    // getProbeList() {
    //   this.$get("probe/binding", "", res => {
    //     if (res.data.status === 1) {
    //       console.info("总数据", res.data.data);
    //       this.binding = res.data.data;
    //       // this.bindSelect = res.data.data[0].id;
    //     } else {
    //       Dialog.alert({
    //         title: "提示",
    //         message: res.data.msg
    //       });
    //     }
    //   });
    // },
    getDataList() {
      this.$get("client/matelist?page=" + this.page, "", result => {
        // console.log('result22222222222:', result);
        if(result.data.code === 200){
          if (result.data.data.list.length === 0) {
            this.hasData = 1;
            if (this.loadinglayer.length) {
              // console.log('打印一下this.loadinglayer：', this.loadinglayer);
              // console.log('打印一下this.loadinglayer.length：', this.loadinglayer.length);
              this.loadinglayer[0].style.opacity = 1;
            }
          } else {
            if (this.page === 1) {
              this.list = result.data.data.list;
            } else {
              if (this.list[0] && this.list[0].id === result.data.data.list[0].id) {
                this.list = result.data.data.list;
              } else {
                for (let key in result.data.data.list) {
                  this.list.push(result.data.data.list[key]);
                }
              }
            }
            // this.hasData = 1; // 返回没有数据
          }
          if (this.list.length === 0) {
            if (this.loadinglayer.length) {
              this.loadinglayer[0].style.opacity = 0;
            }
          }
        } else if (result.data.code === 403){
          // console.log('else打印res.data.data.msg：', res.data.data.msg);
          Dialog.alert({
            title: "提示",
            message: result.data.msg
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          });
        } else {
          Dialog.alert({
            title: "提示",
            message: result.data.msg
          })
        }
        // console.log('this.list:', this.list)
      });
    },
    // beginselectDate() {
    //   this.beginshowdatelist = true;
    // },
    // begincancelDate() {
    //   this.beginshowdatelist = false;
    // },
    // beginconfirmDate() {
    //   this.beginDateTime = this.stampToDate(this.begincurrentDate / 1000);
    //   this.beginshowdatelist = false;
    // },
    // endselectDate() {
    //   this.endshowdatelist = true;
    // },
    // endcancelDate() {
    //   this.endshowdatelist = false;
    // },
    // endconfirmDate() {
    //   this.endDateTime = this.stampToDate(this.endcurrentDate / 1000);
    //   this.endshowdatelist = false;
    // },
    createCancel() {
      this.showPopup = false;
    }, //  取消创建人群包
    createComfirm() {
      let that = this;
      console.log(this.notRepeat);
      if (!this.packageName || !this.beginDateTime || !this.endDateTime) {
        Toast({
          message: "人群包名称与开始结束时间不能为空",
          position: "top"
        });
        return;
      }
      if (!this.total) {
        Toast({
          message: "匹配数量不够！不能创建",
          position: "top"
        });
        return;
      }
      this.disabled = true;
      let params = {
        start_time: this.beginDateTime,
        end_time: this.endDateTime,
        name: this.packageName,
        mid: this.bindSelect,
        rssi: this.distanceSelect,
        mintime: this.shortTime * 60,
        maxtime: this.longTime === "不限" ? this.longTime : this.longTime * 60,
        not_repeat: this.notRepeat ? 1 : 0
      };
      // console.info(params);
      this.$post("media/mac", params, res => {
        console.info(res);
        if (res.data.status === 1) {
          Dialog.alert({
            title: "提示",
            message: "创建成功"
          }).then(() => {
            that.disabled = false;
            that.showPopup = false;
            that.page = 1;
            that.list = [];
            that.getDataList();
          });
        } else {
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            that.disabled = false;
          });
        }
      });
    }, //  确定创建人群包
    reloadData() {
      this.page = 1;
      this.list = [];
      this.getDataList();
    },
    refresh(done) {
      setTimeout(() => {
        this.page = 1;
        this.list = [];
        this.hasData = 0;
        this.getDataList();
        done();
      }, 1500);
    },
    infinite(done) {
      // 加载更多插件
      console.info(this.hasData, this.page);
      if (this.hasData) {
        // 代表没有 更多数据了
        done(true);
      } else {
        setTimeout(() => {
          this.getDataList();
          setTimeout(() => {
            done();
            this.page++;
          }, 400);
        }, 1000);
      }
    },
    create() {
      this.isSet = true;
      // if (this.list.length > 0) {
      //   for (let key in this.list) {
      //     if (this.list[key].status === 0) {
      //       Dialog.alert({
      //         title: "提示",
      //         message: "人群正在计算中，请稍后创建"
      //       });
      //       return false;
      //     } else {
      //       this.isSet = true;
      //     }
      //   }
      // } else {
      //   this.isSet = true;
      // }
    },
    toFlashLetter2() {
      // 短信
      this.$router.push({
        name: 'flashletter',
        params: {
          id: 1,
          back: this.back
        }
      });
    },
    toFlashLetter1() {
      // 闪信
      this.$router.push({
        name: 'flashletter',
        params: {
          id: 2,
          back: this.back
        }
      });
    }
  }
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
.peoplepackage .van-popup {
  width: 100%;
  height: 100%;
}
.pt5 {
  padding-top: 8px;
}
.createBtn {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #eee;
}
.labelTitle {
  font-size: 13px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  padding-top: 5px;
  display: inline-block;
}
select {
  width: 90% !important;
  height: 30px;
  border: 1px solid #eee !important;
}
.bagInput {
  width: 90%;
  border: 1px solid #eee;
  border-radius: 3px;
  padding-left: 10px;
  height: 30px;
  font-size: 12px;
}
.bagDiv {
  border: 1px solid #eee;
  width: 90%;
  height: 30px;
  font-size: 12px;
  padding-left: 10px;
  border-radius: 3px;
  line-height: 30px;
}

.not-repeat-config {
  /* background: red; */
  display: block;
  margin-left: -8px;
  position: relative;
  padding-left: 15px;
}

.not-repeat-config #is-repeat-data {
  /* margin-top: 5px; */
  display: inline-block;
  position: absolute;
  left: 0;
  top: 9px;
}

.createBag {
  width: 100%;
  height: 50px;
  position: fixed;
  top: 46px;
  left: 0px;
  z-index: 2000;
  background-color: #fff;
}
.content-img {
  width: 60px;
  height: 60px;
  /*background-color: #eee;*/
  position: relative;
  border-radius: 50%;
  margin: 0 auto;
}
/* .icon-telephone{
    position: absolute;
    bottom: 5px;
    z-index: 10;
    right: 0px;
    color: #fff;
    display: block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 20px;
    background-color: #65B7AC;
    border-radius: 50%;
    transform: rotateY(180deg);
  } */
.peoplelist-content {
  padding-right: 10px;
}
/* .telephone{
    color: rgba(0,0,0,0.8);
    font-size: 14px;
  }
  .ages{
    font-size: 11px;
    color: rgba(0,0,0,0.6);
  } */
.label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  padding: 3px;
  border-radius: 2px;
  position: relative;
  top: -2px;
  margin-left: 10px;
}
.labelbgcolorhave {
  background-color: #4588d4;
}
.labelbgcolorno {
  background-color: #e8988e;
}
.labelbgcolornonet {
  background-color: #93af47;
}
.labelbgcolornull {
  background-color: #d9a338;
}
/* .lastdate{
    font-size: 12px;
    color: rgba(0,0,0,0.6);
  } */

.title {
  font-size: 14px;
  font-weight: normal;
  color: #666;
  /* margin-top: 10px; */
  padding: 3px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.time {
  font-size: 12px;
  line-height: 12px;
  vertical-align: middle;
  color: #999;
  /* margin-top: 3px; */
}

.item-right {
  text-align: right;
  /* padding: 10px; */
}
.quantity {
  padding: 0;
  margin: 0;
  font-size: 0;
  /* margin-bottom: 5px; */
  margin-top: 8px;
  color: #666;
  font-family: "PingFang SC";
}

.quantity .name {
  color: #999;
  font-size: 12px;
}

.state {
  display: inline-block;
  font-size: 12px;
  /* background: red; */
  color: #999;
  line-height: 12px;
  vertical-align: middle;
  /* padding: 4px; */
  /* border-radius: 2px; */
  /* margin-left: 3px; */
}

.state.success {
  color: #4588d4;
}

.state.fail {
  color: #e8988e;
}

.quantity .value {
  color: #333;
  font-size: 16px;
  /* padding-left: 5px; */
}
.float{
  width: 40px;
  height: 40px;
  border-radius: 35px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin-left:auto;
  margin-right:auto;
}
/*.floatTop{*/
  /*width: 20px;*/
  /*height:73px;*/
  /*!*border: 1px solid red;*!*/
  /*!*border-radius: 20px;*!*/
  /*position: fixed;*/
  /*top: 66px;*/
  /*right: 40px;*/
  /*bottom: 0px;*/
/*}*/
.setIcon{
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}
.icon {
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 12px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}
</style>
