<template>
  <div class="real-people">
    <scroller :on-infinite="infinite" style="padding-top: 55px;" noDataText="我是有底线的">
      <!-- 地图、排序、过滤 -->
      <div class="real-people-wrap">
        <!-- 地图 -->
        <wap-map
          :markerlist="markers"
          :recomendlist="saveBinding"
          :totals="peopleList.total_count"
          :number="1"
        ></wap-map>

        <div class="topbar-wrap">
          <div class="topbar-content">
            <div class="device-select-wrap" @click="showDevicePicker = true;">
              <span v-html="device.label" class="device-select">
                <span class="device-select">{{device.label}}</span>
              </span>
              <span class="icon-wrap">
                <icon name="caret-down"/>
              </span>
            </div>
            <div
              class="tab-box"
              v-for="(item,index) in peopleTabs"
              @click="selectTab(index);"
              :class="{active:tabActive === index}"
              :key="index"
            >
              <div class="name">{{item.name}}</div>
              <div class="digit">{{item.value}}</div>
            </div>
          </div>
        </div>

        <!-- 排序搜索 -->
        <div class="search-order-box">
          <div class="search-order-wrap">
            <div class="order-wrap" @click="showOrderPicker = true">
              <span class="order-select">{{orderBy.label}}</span>
              <span class="icon-wrap">
                <icon name="caret-down"/>
              </span>
            </div>
            <div class="search-wrap">
              <form action=".">
                <van-search
                  v-model="keyword"
                  placeholder="搜索mac地址"
                  background="#fff"
                  show-action
                  @search="onSearch(keyword)"
                  @cancel="onCancel"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <!--列表-->
      <div class="people-list">
        <div
          class="people-item"
          v-for="(item,index) in list"
          :key="index"
          @click="openDetail(item)"
        >
          <div class="user-avatar-wrap">
            <div class="user-avatar">
              <icon name="user-circle" scale="3.4" style="color: rgba(0,0,0,0.2);"/>
              <span class="icon-telephone">
                <icon name="phone" scale="0.8"/>
              </span>
            </div>
          </div>
          <div class="people-info-wrap">
            <p class="mobile">{{item.phone}}</p>
            <p class="listItem">mac {{item.mac}}</p>
            <!--<p class="other-info">-->
            <p>
              <span class="times">到店{{item.nums}}次</span>&nbsp;&nbsp;&nbsp;
              <span class="device-type">
                <span style="color: rgba(0,0,0,0.2);vertical-align: -4px">
                  <icon name="mobile"/>
                </span>
                <span style="color: rgba(0,0,0,0.6)">{{item.phone_name}}</span>
              </span>
            </p>
            <p class="listItem">
              <span class="distance">距离{{item.range}}</span>
            </p>
            <!--</p>-->
            <p class="time">最后到店&nbsp;{{item.update_time}}</p>
            <!--<p class="time">驻留时间&nbsp;{{parseInt(item.time / 3600)}}h</p>-->
          </div>
        </div>
      </div>
    </scroller>
    <!-- 选择盒子 -->
    <van-actionsheet v-model="showDevicePicker">
      <van-picker
        show-toolbar
        value-key="label"
        title="选择盒子"
        :columns="devices"
        @cancel="showDevicePicker = false;"
        @confirm="confirmDeviceSelect"
      />
    </van-actionsheet>
    <!-- 选择排序 -->
    <van-actionsheet v-model="showOrderPicker">
      <van-picker
        show-toolbar
        value-key="label"
        title="选择排序字段"
        :columns="orderbyItems"
        @cancel="showOrderPicker = false;"
        @confirm="confirmOrderSelect"
      />
    </van-actionsheet>
    <!--下载mac-->
    <div class="download" @click="openDialog">
      <img src="./imgs/download.png" style="width: 45px;height: 45px;" alt="">
    </div>
    <div class="popus" v-if="isShowTip">
      <div class="popus-center">
        <div class="telephone">{{macInfo}}</div>
        <div class="popus-btn">
          <div @click="isShowTip=false">取消</div>
          <a :href="exportLink" ref="exportA">
            <sapn v-if="exportLink" @click="isShowTip=false">确定</sapn>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Icon, Picker, Actionsheet, Popup, Search, List, Button } from "vant";

export default {
  name: "real-people",
  components: {
    wapMap: function(resolve) {
      require(["../../components/map/wapmap.vue"], resolve);
    },
    detailList: function(resolve) {
      require(["../peoplelist/detail.vue"], resolve);
    },
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Actionsheet.name]: Actionsheet,
    [Dialog.name]: Dialog,
    [Search.name]: Search,
    [List.name]: List,
    [Button.name]: Button
  },
  data() {
    return {
      markers: [],
      saveBinding: [],
      binding: [],
      list: [],
      searchList: [],
      isSearch: false,
      loadinglayer: "",
      tabActive: 0,
      routing: {
        name: "",
        path: ""
      },
      total: 0,
      page: 1,
      times: null,
      hasData: true,
      isShowDetail: false,
      userId: "",
      peopleList: {},
      peopleTabs: [],
      keyword: "",
      showDevicePicker: false,
      showOrderPicker: false,
      device: {
        label: "全部",
        value: "",
      },
      devices: [
        {
          label: "全部",
          value: "",
        }
      ],
      orderBy: {
        label: "最后时间降序",
        value: "1"
      },
      orderbyItems: [
        {
          label: "最后时间降序",
          value: "1"
        },
        {
          label: "最后时间升序",
          value: "2"
        },
        {
          label: "距离降序",
          value: "3"
        },
        {
          label: "距离升序",
          value: "4"
        },
        {
          label: "驻留时间降序",
          value: "5"
        },
        {
          label: "驻留时间升序",
          value: "6"
        }
      ],
      isShowTip: false,
      macInfo: '数据获取中...',
      exportLink: ''
    };
  },
  mounted() {
    this.loadinglayer = document.getElementsByClassName("loading-layer");

    this.getTodayDate();
    // 获取设备盒子
    this.getProbeList();
    // 获取统计数据
    this.getCountList();
    // 加载人员数据
    this.getDataList(null);

    if (!this.times) {
      this.times = setInterval(() => {
        this.getCountList();
        this.getDataList(null);
      }, 5000);
    }
    this.device = this.$store.state.device;
  },
  beforeDestroy() {
    clearInterval(this.times);
    this.times = null;

    // this.hasLoadedRealData = false;
  },
  watch: {
    // $route(to, from) {
    //   this.routing.name = to.name;
    //   this.routing.path = to.path;
    //
    //   if (to.query.id && !to.query.mac) {
    //     this.isShowDetail = true;
    //     setTimeout(() => {
    //       this.userId = to.query.id;
    //     }, 300);
    //   } else if (to.query.id && to.query.mac) {
    //     this.isShowDetail = true;
    //     setTimeout(() => {
    //       this.userId = to.query.id;
    //     }, 300);
    //   } else {
    //     this.userId = "";
    //     this.isShowDetail = false;
    //   }
    // },
    tabActive: function(value) {
      this.page = 1;
      this.hasData = true;
      this.list = [];
      this.getDataList(null);
    },
    orderBy: function(value) {
      this.page = 1;
      this.hasData = true;
      this.list = [];
      this.getDataList(null);
    },
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
    },
    device: function(newValue) {
      // console.log('newValue:', newValue);
      this.$store.state.device = newValue;
      this.page = 1;
      this.hasData = true;
      this.list = [];

      this.getCountList();
      this.getDataList(null);

      if (newValue.value === "") {
        this.markers = this.saveBinding;
      }
      for (let key in this.binding) {
        if (newValue === this.binding[key].number_id) {
          this.markers = [];
          this.markers.push({
            position: [this.binding[key].lng, this.binding[key].lat]
          });
        }
      }
    }
  },
  methods: {
    getTodayDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
      this.transferDate([start, end]);
    },
    confirmDeviceSelect(value) {
      this.device = value;
      this.$store.state.device = value;
      this.showDevicePicker = false;
    },
    confirmOrderSelect(value) {
      this.orderBy = value;
      this.showOrderPicker = false;
    },
    onSearch(keyword) {
      // console.log('搜索11111111111111111', keyword);
      if (keyword !== '') {
        clearInterval(this.times);
        // this.$get('media/mac/?mac$=%25' + `${keyword}%`, '', res => {
        //   if (res.data.status === 1) {
        //     this.searchList = res.data.data;
        //     this.isSearch = true;
        //     this.list = this.searchList;
        //   }
        // });
        this.$get(
          "client/reallist?page=1" + "&keys=" + this.keyword + "&box_id=" + this.device.value + "&sort=" + this.orderBy.value,
          "",
          res => {
            this.searchList = res.data.data.list;
            this.isSearch = true;
            this.list = this.searchList;
          });
      } else {
        this.isSearch = false;
        this.loadinglayer = document.getElementsByClassName("loading-layer");

        this.getTodayDate();
        // 获取设备盒子
        this.getProbeList();
        // 获取统计数据
        this.getCountList();
        // 加载人员数据
        this.getDataList(null);

        if (!this.times) {
          this.times = setInterval(() => {
            this.getCountList();
            this.getDataList(null);
          }, 5000);
        }
      }
    },
    onCancel() {
      // console.log('取消');
      this.isSearch = false;
      this.loadinglayer = document.getElementsByClassName("loading-layer");

      this.getTodayDate();
      // 获取设备盒子
      this.getProbeList();
      // 获取统计数据
      this.getCountList();
      // 加载人员数据
      this.getDataList(null);

      if (!this.times) {
        this.times = setInterval(() => {
          this.getCountList();
          this.getDataList(null);
        }, 5000);
      }
    },
    add0(m) {
      return m < 10 ? '0' + m : m;
    },
    transferDate(value) {
      this.beginTime =
        value[0].getFullYear() +
        "-" +
        this.add0((value[0].getMonth() + 1)) +
        "-" +
        this.add0(value[0].getDate());
      this.endTime =
        value[1].getFullYear() +
        "-" +
        this.add0((value[1].getMonth() + 1)) +
        "-" +
        this.add0((value[1].getDate() + 1));
    },
    getProbeList() {
      this.$get("client/getbox", "", res => {
        if (res.data.code === 200) {
          // for (let key in res.data.data) {
            // console.log(key);
            this.markers.push({
              // position: [res.data.data[key].lng, res.data.data[key].lat]
              position: [114.085947,22.547]
            });
            this.saveBinding.push({
              // position: [res.data.data[key].lng, res.data.data[key].lat]
              position: [114.085947,22.547]
            });
          // }
          this.binding = res.data.data;
          this.binding.forEach(ele => {
            this.devices.push({
              label: ele.name + "&nbsp;&nbsp;&nbsp;"+ (ele.online ? '<span style="display: inline-block;width: 10px;height: 10px;background-color: #65B7AC;border-radius: 50%"></span>' : '<span style="display: inline-block;width: 10px;height: 10px;background-color: #999;border-radius: 50%"></span>'),
              value: ele.code
            });
          });
        } else if(res.data.code === 403){
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          });
        } else {
          this.$status(res.data.msg);
        }
      });
    },
    showDetailListPopus(value) {
      this.isShowDetail = value;
    }, // 改变详情页popups状态
    getCountList() {
      // console.log('this.device.value1111111:', this.device.value);
      // let mid;
      // if (!this.device.value) {
      //   mid = "";
      // } else {
      //   mid = "&mid=" + this.device.value;
      // }
      // let updated =
      //   "updated_at$" + "=>=" + this.beginTime + ",<=" + this.endTime;
      this.$get("client/count?box_id=" + this.device.value, "", res => {
        if (res.data.code === 200) {
          this.peopleList = res.data.data;
          let temp = [];
          temp.push({
            name: "全部",
            value: this.peopleList.total_count ? this.peopleList.total_count : 0
          });
          temp.push({
            name: "新访客",
            value: this.peopleList.new_count ? this.peopleList.new_count : 0
          });
          temp.push({
            name: "回头客",
            value: this.peopleList.back_count ? this.peopleList.back_count : 0
          });
          temp.push({
            name: "匹配",
            value: this.peopleList.match_total ? this.peopleList.match_total : 0
          });
          this.peopleTabs = temp;
        } else if(res.data.code === 403){
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          });
        } else {
          this.$status(res.data.msg);
        }
      });
    },
    openDetail(item) {
      //   setTimeout(() => {
      //     this.userId = item.id;
      //   }, 500);
      //   this.isShowDetail = true;
      // this.$router.push("/index/?id=" + item.id + "&mac=");
      // this.$router.push("/index/?id=" + item.id);
      // console.log('item.phone:', item.phone);
      if (item.mac) {
        this.$router.push({
          name: 'realPeopleDetail',
          params: {
            id: item.id,
            tel: item.phone
          }
        });
      } else {
        Dialog.alert({
          title: "提示",
          message: '未获取到mac地址'
        });
      }
    },
    // 获取列表数据
    getDataList(done) {
      let value;
      let valuetitle;
      let valueDate;
      // 根据不同的参数切换tab
      if (this.tabActive === 0) {
        value = "";
      } else if (this.tabActive === 1) {
        value = "new=1&";
      } else if (this.tabActive === 2) {
        value = "return=1&";
      } else if (this.tabActive === 3) {
        value = "phone$=>0&";
      }
      valueDate = `&@sort=${this.orderBy.value}`;

      if (!this.device.value) {
        valuetitle = "";
      } else {
        valuetitle = "&mid$=" + this.device.value;
      }
      let updated =
        "&updated_at$" + "=>=" + this.beginTime + ",<=" + this.endTime;
      this.$get(
        "client/reallist?page=" + this.page + "&keys=" + this.keyword + "&box_id=" + this.device.value + "&sort=" + this.orderBy.value,
          // value +
          // "pageSize=10&page=" +
          // this.page +
          // valuetitle +
          // valueDate +
          // updated,
        "",
        res => {
          // console.log('RES!!!!!!!', res);
          if (res.data.code === 200) {
            if (res.data.data.list.length === 0) {
              // this.hasData = 1;
              this.hasData = false;
              if (done) {
                done(true);
              }
            } else {
              this.hasData = true;

              // this.total = res.data.mate.total;
              if (this.page === 1) {
                this.list = res.data.data.list;
              } else {
                if (this.list[0] && this.list[0].id === res.data.data.list[0].id) {
                  this.list = res.data.data.list;
                } else {
                  for (let key in res.data.data.list) {
                    this.list.push(res.data.data.list[key]);
                  }
                }
                // this.list = this.list.concat(res.data.data);
              }

              done && done();
            }
           console.log('this.list:', this,list);
          } else if(res.data.code === 403 ) {
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            }).then(() => {
              this.$router.push({
                name: 'login'
              })
            });
          } else {
            // this.hasData = 1;
            this.hasData = false;
            // clearInterval(this.times);
            done && done();
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        }
      );
    },
    // 上拉加载
    infinite(done) {
      // 加载更多插件
      if (this.isSearch) {
      } else {
        if (this.hasData) {
          this.page++;
          this.getDataList(done);
        }
      }
    },
    selectTab(index) {
      this.tabActive = index;
      // console.log('this.tabActive:', this.tabActive);
    },
    openDialog(){
      this.isShowTip = true;
      this.$nextTick(() => {
        this.$refs.exportA.onclick = function(ev){
          ev.preventDefault();
        };
      });

      this.$get(`client/outmac?box_id=${this.device.value}&keys=${this.keyword}`, '', res => {
        if(res.data.code === 200){
          this.macInfo = '数据获取完毕';
          this.exportLink = res.data.data;
          this.$refs.exportA.onclick = function(ev){
            ev.returnValue = true;
          };
        } else {
          this.$status(res.data.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-color: #4588d4;

.real-people-wrap {
  width: 100%;
  background: #fff;

  .topbar-wrap {
    padding: 0 10px;
    height: 51px;

    .topbar-content {
      display: flex;

      .device-select-wrap {
        flex: 0 1 120px;
        width: 120px;

        .device-select,
        .icon-wrap {
          display: inline-block;
          font-size: 14px;
          line-height: 14px;
          vertical-align: middle;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $theme-color;
          margin-top: 18px;
          margin-left: 5px;
        }

        .device-select {
          margin-top: 15px;
        }
      }

      .tab-box {
        flex: 1;
        text-align: center;
        font-size: 12px;
        padding: 10px 0;
        &.active {
          //   position: relative;
          color: $theme-color;
        }
      }
    }
  }

  .search-order-box {
    padding: 0 10px 10px;

    .search-order-wrap {
      display: flex;
      border: 0.5px solid #eee;

      .order-wrap {
        flex: 0 1 120px;
        width: 120px;
        border-right: 0.5px solid #eee;
        font-size: 14px;
        /* padding: 5px 0; */
        padding: 10px;

        .order-select,
        .icon-wrap {
          display: inline-block;
          font-size: 14px;
          line-height: 14px;
          vertical-align: middle;
        }

        .icon-wrap {
          margin-top: 3px;
          color: #999;
        }
      }
    }

    .search-wrap {
      flex: 1;
      width: 100%;
      padding: 5px;
      .van-search {
        padding: 0;
      }
    }
  }
}

.people-list {
  .people-item {
    display: flex;

    .user-avatar-wrap {
      flex: 0 1 80px;

      .user-avatar {
        width: 50px;
        height: 50px;
        margin: 19px auto 0;
        position: relative;
        top: 20px;

        .icon-telephone {
          /* display: inline-block; */
          position: absolute;
          bottom: -5px;
          z-index: 10;
          right: -5px;
          color: #fff;
          display: block;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 20px;
          background-color: #65b7ac;
          border-radius: 50%;
          transform: rotateY(180deg);
        }
      }
    }

    .people-info-wrap {
      flex: 1;
      border-bottom: 0.5px solid #f6f6f6;
      padding: 15px 10px;
      padding-left: 0;
      font-size: 12px;
      font-family: "PingFang SC";
      color: #999;

      .mobile {
        font-size: 12px;
        color: #333;
      }

      .other-info {
        font-size: 0;

        .times {
          font-size: 10px;
          padding-right: 5px;
        }

        .device-type {
          font-size: 12px;
          padding-right: 5px;
        }

        .distance {
          font-size: 10px;
        }
      }
    }
  }
}
.listItem{
  margin-bottom: 2px;
}
.download{
  position: absolute;
  z-index:10;
  bottom: 50px;
  right: 15px;
}
/*弹出侧*/
.popus {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.popus-center {
  width: 230px;
  /*height: 130px;*/
  border-radius: 5px;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
}
.popus-btn {
  display: flex;
  width: 100%;
  /*position: absolute;*/
  /*bottom: 0;*/
  /*left: 0;*/
  color: rgba(0, 0, 0, 0.6);
}
.popus-btn div,
.popus-btn a {
  height: 40px;
  border-top: 1px solid #eee;
  width: 50%;
  line-height: 40px;
  text-align: center;
}
.telephone {
  font-size: 16px;
  text-align: center;
  padding: 20px 0 20px 0;
  color: #4b8edd;
}
.popus-btn div:nth-child(1) {
  border-right: 1px solid #eee;
}
.popus-btn a {
  display: block;
}
</style>


