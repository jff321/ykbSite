<template>
  <div class="people">
    <van-nav-bar title="客户详情" left-arrow @click-left="onClickLeft"/>
    <div class="people-box">
      <div class="people-header">
        <div class="header-img">
          <img src="./imgs/head.png" alt>
        </div>
        <div class="header-tel">{{dataList.phone?tel(dataList.phone):'***********'}}</div>
        <div>
          <div class="header-date">最后探测 {{dataList.updated_at}}</div>
        </div>
        <div class="icon-telephone" @click="getTelephone()">
          <icon name="phone" scale="1.6"/>
        </div>
      </div>
    </div>
    <div class="equipment-list-box">
      <div class="equipment-list" style="border-radius: 3px 3px 0px 0px;">
        <div>使用设备</div>
        <div>{{dataList.phone_name}}</div>
      </div>
      <div class="equipment-list">
        <div>IMEI</div>
        <div>{{dataList.imei | hackIMEI}}</div>
      </div>
      <div class="equipment-list" style="border-radius: 0px 0px 3px 3px;">
        <div>Mac号</div>
        <div>{{dataList.mac}}</div>
      </div>
    </div>
    <!--基本信息-->
    <div v-if="$route.params.tel" class="focus-online">
      <div class="focus-title">基本信息</div>
      <div class="focus-list">
        <span
          v-for="(items,index) in basic"
          :key="index"
          v-if="items.value!==''"
          v-bind:style="{backgroundColor:bgcolor[Math.floor(Math.random() * 8)]}"
        >{{items.value}}</span>
      </div>
    </div>
    <!--应用偏好-->
    <div class="focus-online">
      <div class="focus-title">应用偏好</div>
      <div class="focus-list">
        <span
          v-for="(items,index) in application"
          :key="index"
          v-if="items.name!==''"
          v-bind:style="{backgroundColor:bgcolor[Math.floor(Math.random() * 8)]}"
        >{{items.name}}</span>
      </div>
    </div>
    <!--行为偏好-->
    <div class="focus-online">
      <div class="focus-title">行为偏好</div>
      <div class="focus-list">
        <span
          v-for="(items,index) in behaviour"
          :key="index"
          v-if="items.name!==''"
          v-bind:style="{backgroundColor:bgcolor[Math.floor(Math.random() * 8)]}"
        >{{items.name}}</span>
      </div>
    </div>
    <!--常用app-->
    <div class="focus-online">
      <div class="focus-title">常用app</div>
      <div class="focus-list">
        <span
          v-for="(items,index) in focus"
          :key="index"
          v-if="items.name!==''"
          v-bind:style="{backgroundColor:bgcolor[Math.floor(Math.random() * 8)]}"
        >{{items.name}}</span>
      </div>
    </div>
    <!--用户标记-->
    <div class="showUserTag" style="overflow: hidden;">
      <van-popup v-model="isShowUserTag" position="right" :overlay="false">
        <user-tag :mac="userMac" :showbiaoji="isShowUserTag"></user-tag>
      </van-popup>
    </div>
    <!--电话-->
    <div class="popus" v-if="isShowPopus">
      <div class="popus-center">
        <div class="telephone">&nbsp;{{telephone}}</div>
        <div class="popus-btn">
          <div @click="cancel">取消</div>
          <a :href="'tel:' + telephone">拨打</a>
        </div>
      </div>
    </div>
    <div class="popus" v-if="isShowTip">
      <div class="popus-center" style="width: 280px;">
        <div
          class="telephone"
          style="font-size: 12px;padding: 20px 12px;"
        >为了保护通话隐私和安全，已自动转拨随机号码通话将产生本机话费，亲知悉。</div>
        <div class="popus-btn">
          <div @click="confirmToTel" style="width: 100%;background-color: #eee">确定</div>
        </div>
      </div>
    </div>
    <!--电话-->
    <!--<tel :tel="telephone"></tel>-->
  </div>
</template>
<script>
  // import Cookies from 'js-cookie';
  import {
    NavBar,
    Row,
    Col,
    Icon,
    Cell,
    CellGroup,
    Dialog,
    Toast,
    Popup
  } from "vant";
  export default {
    name: "detail",
    props: ["id", "routing"],
    components: {
      tel: function(resolve) {
        require(["./telephone.vue"], resolve);
      },
      userTag: function(resolve) {
        require(["./endconversation/index.vue"], resolve);
      },
      [NavBar.name]: NavBar,
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Popup.name]: Popup,
      [Toast.name]: Toast,
      [Dialog.name]: Dialog
    },
    filters: {
      hackIMEI: function(value) {
        if (!value) return "";
        const size = value.length;
        const prefix = value.substr(0, 5);
        const suffix = value.substr(size - 5, 5);
        // console.info(prefix, suffix);
        let symbols = "";
        for (let i = 0; i < size - 10; i++) {
          symbols += "*";
        }
        return `${prefix}${symbols}${suffix}`;
      }
    },
    data() {
      return {
        isShowUserTag: false,
        showIcon: true,
        showUserDetail: false,
        userMac: "",
        userId: null,
        bgcolor: [
          "rgb(233,217,242)",
          "rgb(207,237,254)",
          "rgb(251,220,207)",
          "rgb(246,253,216)",
          "rgb(209,234,254)",
          "rgb(204,234,231)",
          "rgb(222,222,248)",
          "rgb(255,241,205)",
          "rgb(254,237,196)"

        ],
        focus: [],
        behaviour: [],
        application: [],
        dataList: "",
        lastTance: null,
        telephone: null,
        extension: null,
        isShowTelephone: true,
        isShowPopus: false,
        isShowTip: false,
        activeId: 1
      };
    },
    mounted() {
      console.log('this.$route.params.tel:', this.$route.params.tel);
      this.getDataList();
    },
    // watch: {
    //   id: function(newValue) {
    //     console.info("userID111111111111111111", newValue);
    //     // if (newValue == null) {
    //     // } else {
    //     this.userId = newValue;
    //     // }
    //     // setTimeout(this.getDataList(), 5000);
    //     this.getDataList();
    //   },
    //   $route(to, from) {
    //     console.info("详情页面路由变化", to, from);
    //     if (to.query.id && to.query.mac) {
    //       this.isShowUserTag = true;
    //       this.isShowTip = true;
    //       setTimeout(() => {
    //         this.userMac = to.query.mac;
    //       }, 30);
    //     } else {
    //       this.userMac = "";
    //       this.isShowUserTag = false;
    //     }
    //   }
    // },
    methods: {
      onClickLeft() {
        // history.back();
        console.log(this.routing);
        // if (!this.routing.name && !this.routing.path) {
        //   this.$emit("hideDetail");
        //   return;
        // }
        console.info("返回时的路由", this.$route);
        this.$router.push({
          name: 'home',
          params: {
            activeId: this.activeId
          }
        });
        // if () {}
      },
      getTelephone() {
        let params;
        if(this.$store.state.dailedPhone === "undefined"){
          params = {
            id: this.$route.params.id,
            phone: localStorage.getItem('telephone')
          };
        } else {
          params = {
            id: this.$route.params.id,
            phone: this.$store.state.dailedPhone
          };
        }

        this.$post("client/docall", params, result => {
          if (result.data.code === 200) {
            console.log('result:', result);
            this.telephone = result.data.data.phone;
            this.isShowTip = true;
            // console.log('this.telephone:', this.telephone);
            if (this.routing.name === "peoplelistpackage") {
              this.$router.push(
                this.routing.path +
                "?id=" +
                this.userId +
                "&mac=" +
                this.dataList.mac
              );
            } else if (this.routing.name === "peoplelist") {
              this.$router.push(
                this.routing.path +
                "?id=" +
                this.userId +
                "&mac=" +
                this.dataList.mac
              );
            }
          } else {
            this.isShowTip = false;
            Dialog.alert({
              title: "提示",
              message: result.data.msg
            });
          }
        });
      },
      getDataList() {
        this.$get("client/macinfo?id=" + this.$route.params.id, "", result => {
          if (result.data.code === 200) {
            console.info("获取this.dataList", result);
            this.dataList = result.data.data;
            setTimeout(this.getHobbiesList(this.dataList.mac), 1000);
          } else {
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        });
      },
      getHobbiesList(value) {
        // console.log('value111111111:', value);
        if (value !== undefined) {
          this.$get("client/mactags?mac=" + value, "", result => {
            if (result.data.code === 200) {
              // console.info("获取爱好", result.data);
              this.basic = result.data.data.basic;
              this.behaviour = result.data.data.behaviour;
              this.focus = result.data.data.app;
              this.application = result.data.data.application;
            } else {
              Dialog.alert({
                title: "提示",
                message: result.data.msg
              });
            }
          });
        }
      },
      popup() {
        this.isShowPopus = true;
      },
      cancel() {
        this.isShowPopus = false;
      },
      confirmToTel() {
        this.isShowTip = false;
        setTimeout(() => {
          this.isShowPopus = true;
        }, 500);
      },
      expand() {
        this.showUserDetail = !this.showUserDetail;
        this.showIcon = !this.showIcon;
      }
    }
  };
</script>
<style>
  .people .van-nav-bar {
    background-color: #4b8edd;
    color: #fff;
  }
  .people .van-nav-bar .van-icon {
    color: #fff !important;
  }
  .people .van-hairline--bottom::after {
    border: none !important;
  }
</style>
<style scoped>
  .people{
    /*position: fixed;*/
    /*width: 100%;*/
    /*height: auto;*/
    /*background-color: rgba(207, 238, 255, 0.5);*/
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
  .popus-title {
    text-align: center;
  }
  .popus-extension {
    text-align: center;
    color: red;
    padding: 2px 5px;
    font-size: 22px;
  }
  .telephone {
    font-size: 20px;
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

  /*弹出侧*/
  .ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .people-box{
    display: flex;
    justify-content: center;
    padding: 20px 0px 20px 0px;
    background-color: rgba(149, 202, 254, 0.3);
    margin-bottom: 20px;
  }
  .people-header {
    /*width: 100%;*/
    width: calc(100% - 30px);
    border-radius: 3px;
    /*background-color: #4b8edd;*/
    box-shadow: 0px 0px 10px rgb(221, 244, 252);
    background: url("imgs/10.jpg") no-repeat center;
    /* background: linear-gradient(to right, #92c5e7, #4588d4); */
    padding: 10px 0 15px 0;
    position: relative;
  }
  .header-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    padding: 8px;
    overflow: hidden;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.1);
  }
  .header-tel {
    font-size: 16px;
    /*color: rgba(255, 255, 255, 0.8);*/
    margin: 5px 0 5px;
    text-align: center;
  }
  .header-date {
    font-size: 12px;
    /*color: rgba(255, 255, 255, 0.5);*/
    /*color: rgba(0, 0, 0, 0.5);*/
    margin: 5px 0 5px;
    text-align: center;
  }
  .telephonetip {
    background-color: #e8c276;
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    text-align: center;
    padding: 8px 0;
  }
  .intentionborder {
    border-left: 1px solid #eee;
    margin-left: 15px;
  }
  .intention {
    width: 100%;
    height: 50px;
    line-height: 42px;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    border-bottom: 12px solid #f3f3f3;
  }
  .circleicon {
    position: relative;
    left: -6px;
    width: 12px;
    height: 12px;
    background-color: #e4a837;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;
  }
  .equipment-list-box{
    width: calc(100% - 30px);
    box-shadow: 0px 0px 10px rgb(221, 244, 252);
    border-radius: 3px;
    margin: auto;
  }
  .equipment-list {
    padding: 5px 10px;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    color: #666;
    font-size: 14px;
    /*border-bottom: 1px solid #f3f3f3;*/
  }
  .focus-online,
  .common-app {
    /*border-top: 12px solid #f3f3f3;*/
    /*padding-bottom: 15px;*/
    background-color: #fff;
    /*overflow: hidden;*/
    width: calc(100% - 30px);
    box-shadow: 0px 0px 10px rgb(221, 244, 252);
    border-radius: 3px;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .focus-title,
  .app-title {
    padding: 10px 10px;
    font-size: 14px;
  }
  .focus-list,
  .app-list {
    padding: 0 10px;
    font-size: 13px;
  }
  .focus-list span {
    font-size: 12px;
    display: inline-block;
    padding: 3px 8px;
    margin: 0 10px 10px 0;
    background-color: #0062cc;
    border-radius: 3px;
    /*color: rgba(255, 255, 255, 0.8);*/
    color: #797780;
  }
  .app {
    width: 52px;
    height: 80px;
    margin: 0 10px 0px 5px;
    float: left;
  }
  .app-img {
    width: 100%;
    height: 52px;
    background-color: red;
    border-radius: 5px;
    overflow: hidden;
  }
  .app-des {
    padding: 3px 0;
    font-size: 12px;
  }
  .icon-telephone {
    display: block;
    position: absolute;
    right: 10px;
    bottom: -10px;
    color: #fff;
    z-index: 10;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 56px;
    color: rgba(255, 255, 255, 0.8);
    background-color: #4B8EDD;
    border-radius: 50%;
    transform: rotateY(180deg);
  }
</style>
