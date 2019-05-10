<template>
  <div class="peoplelist">
    <van-row class="peoplelist-tab" style="margin-top: 46px;padding-top: 10px;">
      <van-col span="24" style="font-size: 14px;">
        <van-row>
          <van-col :span="21">
            <van-search
              type="tel"
              v-model="searchphone"
              placeholder="请输入手机号后四位"
              background="#fff"
              @search="onSearch"
            ></van-search>
          </van-col>
          <van-col :span="3">
            <div @click="onSearch" style="line-height:38px;color: #666;">搜索</div>
          </van-col>
        </van-row>
        <van-row style="padding-top: 10px;margin: 0px 15px;">
          <van-col :span="24">
            <div class="dropdown-menu">
              <select name id="type" v-model="selectPhone" @change="submitSelectPhone">
                <option  v-for="(item, index) in phoneList" :value="index">{{item}}</option>
              </select>
            </div>
          </van-col>
        </van-row>
      </van-col>
    </van-row>
    <scroller
      style="padding-top: 200px;"
      :on-refresh="refresh"
      :on-infinite="infinite"
      noDataText="我是有底线的"
    >
      <van-row class="peoplelist-content">
        <template v-for="(items,index) in list">
          <van-col :span="24" style="padding: 5px 0;" :key="index">
            <van-col :span="5" style="padding-left: 10px;padding-right: 2px;">
              <div class="content-img" style="color:#CACED4">
                <icon name="user-circle" scale="3.4"/>
                <span class="icon-telephone">
                  <icon name="phone" scale="0.8"/>
                </span>
              </div>
            </van-col>
            <van-col :span="19" style="border-bottom: 1px solid #eee;padding-bottom: 10px;">
              <a @click="openDetail(items.mac_id)">
                <van-col :span="20">
                  <div class="telephones">
                    <span>{{items.phone}}</span>
                    <!--<span class="label labelbgcolorno">无意向</span>-->
                    <!--<span class="label labelbgcolorhave">有意向</span>-->
                    <!--<span class="label labelbgcolornonet">未接通</span>-->
                    <!--<span class="label labelbgcolornull">空号</span>-->
                  </div>
                  <div class="ages">
                    <!--<span>&nbsp;20-30岁</span>-->
                    <span>&nbsp;到店{{items.nums}}次</span>
                    <span>
                      <span style="color: rgba(0,0,0,0.2);vertical-align: -4px">
                        <icon name="mobile"/>
                      </span>
                      <span style="color: rgba(0,0,0,0.6)">{{items.phone_name?items.phone_name:''}}</span>
                    </span>
                    <!--<div style="float: right;color: #eee;position: relative;top: -5px;"><icon name="angle-right" scale="1.5"/></div>-->
                  </div>
                  <div class="lastdate">&nbsp;最后到店&nbsp;{{items.times}}</div>
                </van-col>
              </a>
              <van-col :span="4">
                <div
                  v-if="items.is_call"
                  class="i-telephone"
                  style="background-color:#999"
                  @click="getTelephone(items.mac_id)"
                >
                  <icon name="phone" scale="1.6"/>
                </div>
                <div
                  v-else
                  class="i-telephone"
                  @click="getTelephone(items.mac_id)"
                >
                  <icon name="phone" scale="1.6"/>
                </div>
              </van-col>
            </van-col>
          </van-col>
        </template>
      </van-row>
    </scroller>
    <!--用户标记-->
    <div class="showUserTag" style="overflow: hidden;">
      <van-popup v-model="isShowUserTag" position="right" :overlay="false">
        <user-tag
          v-on:showUserTagPopus="showUserTagPopus"
          :mac="userMac"
          :showbiaoji="isShowUserTag"
        ></user-tag>
      </van-popup>
    </div>
    <!--用户详情-->
    <div class="showDetailList">
      <van-popup v-model="isShowDetail" position="right" :overlay="false">
        <detail-list v-on:showDetailListPopus="showDetailListPopus" :id="userId" :routing="routing"></detail-list>
      </van-popup>
    </div>
    <!--用户详情-->
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
  </div>
</template>
<script>
  import {
    NavBar,
    Row,
    Col,
    Icon,
    Cell,
    CellGroup,
    Dialog,
    Search,
    Popup
  } from "vant";
  export default {
    name: "index",
    components: {
      userTag: function(resolve) {
        require(["../peoplelist/endconversation/index.vue"], resolve);
      },
      detailList: function(resolve) {
        require(["../peoplelist/detail.vue"], resolve);
      },
      [NavBar.name]: NavBar,
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Dialog.name]: Dialog,
      [CellGroup.name]: CellGroup,
      [Search.name]: Search,
      [Popup.name]: Popup
    },
    data() {
      return {
        routing: {},
        loadinglayer: "", // 加载完成获取的我是有底线的节点
        userId: null, // 传到详情页的id
        isShowDetail: false, // 是否显示详情页面
        mac: "", // : '', // 临时存储获取电话的时候传过来的mac
        userMac: "", // : '', // 临时存储获取电话的时候传过来的mac
        isShowUserTag: false, // 是否显示标记页面
        isShowPopus: false, // 是否显示拨打电话
        isShowTip: false, // 是否显示拨打电话
        showPopup: false, // 是否显示属性
        attribute: [], // 人群包属性
        searchphone: "", // 搜索关键字
        type: "1",
        list: [],
        binding: [],
        selectDate: "1",
        bindSelect: "all",
        loading: false,
        finished: false,
        page: 1,
        hasData: 0,
        isSearch: 0, // 控制搜索
        bagID: this.$route.params.id,
        peopleList: [],
        isShowBag: false,
        slideshow: false,
        distanceSelect: null,
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
        selectPhone: 0,
        phoneList: []
      };
    },
    watch: {
      // 是否显示属性下拉框
      showPopup: function(newValue) {
        // console.log('newValue:', newValue);
        // console.log('oldValue:', oldValue);
        if (newValue === false) {
          this.slideshow = false;
        }
      },
      // 进入到详情页
      $route(to, from) {
        console.info("路由变化", to, from);
        this.routing.name = to.name;
        this.routing.path = to.path;
        if (to.query.id && !to.query.mac) {
          this.isShowDetail = true;
          setTimeout(() => {
            this.userId = to.query.id;
          }, 30);
        } else if (to.query.id && to.query.mac) {
          this.isShowDetail = true;
          setTimeout(() => {
            this.userId = to.query.id;
          }, 30);
        } else {
          this.userId = "";
          this.isShowDetail = false;
        }
        if (!to.query.id && to.query.mac) {
          this.isShowUserTag = true;
          setTimeout(() => {
            this.userMac = to.query.mac;
          }, 30);
        } else {
          this.userMac = "";
          this.isShowUserTag = false;
        }
      },
      // 监听list变化
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
    mounted() {
      this.loadinglayer = document.getElementsByClassName("loading-layer");
      this.type = "0";
      this.hasData = 0;
      this.list = [];
      this.bagID = this.$route.params.id;
      // this.getCountList();
      // this.getBagAttribute();
      // this.getBingding();
      // 获取多个手机号，用于拨打电话
      this.$get('client/phonelist', '', res => {
        if(res.data.code === 200){
          this.phoneList = res.data.data;
          this.$store.state.dialedPhone = this.phoneList[this.selectPhone]
        } else {
          this.$status(res.data.msg);
        }
      });
    },
    methods: {
      submitSelectPhone (value) {
        // console.log('this.selectPhone:', this.selectPhone);
        this.$store.state.dailedPhone = this.phoneList[this.selectPhone];
      },
      deletethis() {
        // 删除人群包
        // http://www.adbpx.com/api/manager/probe/crowd/数据id
        // console.log('this.$route.params.id:', this.$route.params.id);
        Dialog.confirm({
          title: "提示",
          message: "确定删除此人群包？"
        })
          .then(() => {
            this.$post("client/delmate?id=" + this.$route.params.id, "", result => {
              // Dialog.alert({
              //   title: "提示",
              //   message: result.data.msg
              // });
              if (result.data.code === 200) {
                this.onClickLeft();
              } else {
                Dialog.alert({
                  title: "提示",
                  message: result.data.msg
                });
              }
            });
          })
          .catch(() => {
            // on cancel
          });
      },
      openDetail(mac_id) {
        this.$router.push(
          "/peoplepackage/" + '' + "?id=" + mac_id
        );
      }, // 是否打开详情页
      showUserTagPopus(value) {
        this.isShowUserTag = value;
      },
      showDetailListPopus(value) {
        this.isShowDetail = value;
      },
      onClickLeft() {
        this.$router.push("/peoplepackage");
        // history.back();
      }, // 后退
      getTelephone(mac_id) {
        let params = {
          id: mac_id,
          phone: this.phoneList[this.selectPhone]
        };
        // console.info("传输的值", params);
        this.$post("client/docall", params, result => {
          // console.info('获取到的数据ssss', result);
          if (result.data.code === 200) {
            this.mac = mac_id;
            this.isShowTip = true;
            this.telephone = result.data.data.phone;
          } else {
            // this.isShowTip = true;
            Dialog.alert({
              title: "提示",
              message: result.data.msg
            });
          }
        });
      },
      cancel() {
        this.isShowPopus = false;
      },
      confirmToTel() {
        this.isShowTip = false;
        setTimeout(() => {
          this.isShowPopus = true;
          this.$router.push(
            "/peoplepackage/" + '' + "?id=&mac=" + this.mac
          );
        }, 500);
      },
      getBingding() {
        this.$get("client/getbox", "", res => {
          if (res.data.code === 200) {
            this.binding = res.data.data;
          } else {
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        });
      },
      getBagAttribute() {
        this.$get("client/mateinfo?id=" + this.bagID, "", res => {
          if (res.data.code === 200) {
            // console.log('res:', res);
            this.attribute = res.data.data;
            // this.attribute.min_time = parseInt(this.attribute.min_time) / 60 ? parseInt(this.attribute.min_time) / 60 : 0;
            // this.attribute.max_time = parseInt(this.attribute.max_time) / 60 ? parseInt(this.attribute.max_time) / 60 : '不限';
            // console.info("人群包属性", this.attribute);
            this.distanceSelect = res.data.data.distance;
            this.bindSelect = res.data.data.mid_link
              ? res.data.data.mid_link.number_id
              : "all";
          } else {
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        });
      },
      slideShow() {
        this.slideshow = !this.slideshow;
        this.showPopup = !this.showPopup;
      },
      // getCountList() {
      //   this.$get("client/maccount?id=" + '', "", res => {
      //     if (res.data.code === 200) {
      //       this.peopleList = res.data.data;
      //       // console.log('this.peopleList:', this.peopleList);
      //     } else if (res.data.code === 403){
      //       Dialog.alert({
      //         title: "提示",
      //         message: res.data.msg
      //       }).then(()=>{
      //         this.$router.push({
      //           name: 'login'
      //         })
      //       });
      //     } else {
      //       this.$status(res.data.msg)
      //     }
      //   });
      // },
      selectTab(value) {
        switch (value) {
          case 0:
            this.type = "0";
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            // this.getDataList();
            break;
          case 1:
            this.type = "1";
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            // this.getDataList();
            break;
          case 2:
            this.type = "2";
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
        }
        this.getDataList();
      },
      getDataList() {
        let value;
        let searchp;
        if (this.searchphone) {
          // console.log('this.searchphone:', this.searchphone);
          searchp = "&phone$=%25" + this.searchphone;
          // console.log('searchp:', searchp);
        } else {
          searchp = "";
        }
        let valueDate;
        if (this.type === "0") {
          // 根据不同的参数切换tab
          value = "";
        } else if (this.type === "1") {
          value = "new=1&";
        } else if (this.type === "2") {
          value = "return=1&";
        }
        let valuetitle = "&probe=" + this.bagID;
        this.$get(
          "client/usermac?keys=" +
          this.searchphone +
          "&page=" +
          this.page,
          "",
          res => {
            console.log('RES匹配列表:', res);
            if (res.data.code === 200) {
              if (res.data.data.list.length === 0) {
                this.hasData = 1;
                // console.log('数组长度为0的情况让this.hasData = 1');
                if (this.loadinglayer.length) {
                  // console.log('打印一下this.loadinglayer：', this.loadinglayer);
                  // console.log('打印一下this.loadinglayer.length：', this.loadinglayer.length);
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
            // console.info("list数据", this.list);
          }
        );
      },
      onSearch() {
        // console.log('搜索');
        // this.isSearch = 1;
        this.page = 1;
        this.getDataList();
      },
      // 下拉刷新
      refresh(done) {
        setTimeout(() => {
          this.page = 1;
          this.list = [];
          this.hasData = 0;
          this.getDataList();
          done(true);
        }, 1500);
      },
      // 上拉加载
      infinite(done) {
        // 加载更多插件
        if (this.hasData) {
          // 代表没有 更多数据了
          // console.log('this.hasData:', this.hasData);
          done(true);
        } else {
          setTimeout(() => {
            // console.log('1111111111111111111');
            this.getDataList();
            setTimeout(() => {
              // done()表示这次异步加载数据完成，加载下一次
              done();
              // if (this.list.length >= 10) {
              this.page++;
              // }
            }, 500);
          }, 1000);
        }
      }
    }
  };
</script>
<style>
  a:link {
    color: #666666;
  }
  a:visited {
    color: #dcdcdc;
  }
  .showUserTag,
  .showDetailList {
    width: 100% !important;
    height: 100% !important;
  }
  .showDetailList .van-popup,
  .showUserTag .van-popup {
    width: 100% !important;
    height: 100% !important;
    z-index: 100 !important;
    overflow-x: visible;
    overflow-y: scroll;
  }
  .showSelect .van-popup {
    z-index: 3000 !important;
    height: auto !important;
    overflow-x: visible;
  }
  .peoplelist .van-search .van-cell {
    border: 1px solid #eee;
  }
  .peoplelist .van-search__action {
    padding: 0 10px;
  }
  .peoplelist .van-search {
    padding: 0px 15px;
    background: transparent !important;
  }
  .peoplelist .van-field__control {
    height: 30px !important;
  }
  .peoplelist select {
    -webkit-appearance: none;
    appearance: none;
    padding-left: 10px;
    outline: none;
  }
</style>
<style scoped>
  .buttons-wrap {
    text-align: right;
  }
  .buttons-wrap .custom-btn {
    display: inline-block;
    font-size: 12px;
    /* margin-left: 10px; */
    color: #666;
    /* padding: 5px; */
    vertical-align: middle;
    /* background: red; */
    padding: 0 5px;
  }

  .buttons-wrap .custom-btn .van-icon {
    vertical-align: -2px;
    margin-right: 3px;
  }

  .people {
    overflow: hidden;
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
    z-index: 5000;
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
  .pt5 {
    padding-top: 8px;
  }
  .labelTitle {
    font-size: 13px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
  }
  .bagDiv {
    width: 90%;
    height: 30px;
    font-size: 13px;
    padding-left: 10px;
    border-radius: 3px;
    line-height: 30px;
  }
  .peoplelist-tab {
    width: 100%;
    position: fixed;
    top: 55px;
    z-index: 100;
    background-color: #fff;
  }
  .peoplelist-tab-title {
    font-size: 14px;
    padding-top: 5px;
  }
  .peoplelist-tab-num {
    padding: 3px 0 5px 0;
    font-size: 13px;
  }
  .line-box {
    width: 10px;
    height: 2px;

    margin: 0 auto;
  }
  .bgcolor {
    background-color: #4b7fbd;
  }
  .selecttab {
    color: #0078d7;
  }
  .content-img {
    width: 60px;
    height: 60px;
    /*background-color: #eee;*/
    position: relative;
    border-radius: 50%;
    margin: 0 auto;
  }
  .icon-telephone {
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
    background-color: #65b7ac;
    border-radius: 50%;
    transform: rotateY(180deg);
  }

  .i-telephone {
    position: relative;
    top: 10px;
    color: #fff;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 46px;
    background-color: #65b7ac;
    border-radius: 50%;
    transform: rotateY(180deg);
  }
  .peoplelist-content {
    padding-right: 10px;
    padding-top: 20px;
    padding-bottom: 30px;
  }
  .telephones {
    /*color: rgba(0,0,0,0.8);*/
    font-size: 16px;
  }
  .ages {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.6);
  }
  .label {
    color: rgba(255, 255, 255, 0.9);
    font-size: 11px;
    padding: 0px 5px;
    border-radius: 2px;
    position: relative;
    top: -3px;
    margin-left: 10px;
  }
  .labelbgcolorhave {
    background-color: #59b0a2;
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
  .lastdate {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }
  .dropdown-menu {
    text-align: center;
    padding: 5px 10px 5px 0px;
    background: #fff;
    /*border-bottom: 0.5px solid #eee;*/
    border: 0.5px solid #eee;
  }

  .dropdown-menu select {
    width: 100%;
    height: 30px;
    border: none;
    text-align: center;
    text-align-last: center;
    /*padding-left: 0px!important;*/
    /* padding: 0 2%; */
    margin: 0;
    outline: none;
    color: #4588d4;
    font-size: 12px;
    background: #fff;
    /*很关键：将默认的select选择框样式清除*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    /*在选择框的最右侧中间显示小箭头图片*/
    background: url("imgs/arrow.png") no-repeat scroll right center transparent;
    background-size: 8px 8px;/
    /*为下拉小箭头留出一点位置，避免被文字覆盖*/
  padding-right: 10px;
  }
</style>
