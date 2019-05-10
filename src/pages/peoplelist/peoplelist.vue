<template>
  <div class="peoplelist fixedcss">
    <van-row class="peoplelist-tab">
      <!--<van-nav-bar-->
        <!--:title="this.$route.meta.title"-->
      <!--/>-->
      <van-col span="24" style="border-bottom: 1px solid #ccc;">
        <van-col span="6" :class="{selecttab:type == 1}" style="text-align: center">
          <div  v-on:click="selectTab(1)">
            <div class="peoplelist-tab-title">全部</div>
            <div class="peoplelist-tab-num">{{peopleList.total_count}}</div>
            <div><div class="box" :class="{bgcolor:type == 1}"></div></div>
          </div>
        </van-col>
        <van-col span="6"  :class="{selecttab:type == 2}" style="text-align: center">
          <div v-on:click="selectTab(2)">
            <div class="peoplelist-tab-title">新访客</div>
            <div class="peoplelist-tab-num">{{peopleList.new_count}}</div>
            <div><div class="box" :class="{bgcolor:type == 2}"></div></div>
          </div>
        </van-col>
        <van-col span="6"  :class="{selecttab:type == 3}" style="text-align: center" >
          <div v-on:click="selectTab(3)">
            <div class="peoplelist-tab-title">回头客</div>
            <div class="peoplelist-tab-num">{{peopleList.back_count}}</div>
            <div><div class="box" :class="{bgcolor:type == 3}"></div></div>
          </div>
        </van-col>
        <van-col span="6" :class="{selecttab:type == 4}" style="text-align: center" >
          <div  v-on:click="selectTab(4)">
            <div class="peoplelist-tab-title">匹配</div>
            <div class="peoplelist-tab-num">
              &nbsp;{{peopleList.match_total}}
            </div>
            <div><div class="box" :class="{bgcolor:type == 4}"></div></div>
          </div>
        </van-col>
      </van-col>
      <van-col span="24" style="border-bottom: 1px solid #ccc;font-size: 14px;">
        <van-col span="6" style="text-align: center;border-right: 1px solid #ccc;padding: 5px 0;"><div :class="{selecttab: selectDate == 1}" @click="selectDates(1)">最后时间</div></van-col>
        <van-col span="6" style="text-align: center;border-right: 1px solid #ccc;padding: 5px 0;" ><div :class="{selecttab: selectDate == 2}"  @click="selectDates(2)">距离</div></van-col>
        <van-col span="6" style="text-align: center;border-right: 1px solid #ccc;padding: 5px 0;" ><div :class="{selecttab: selectDate == 3}"  @click="selectDates(3)">驻留时间</div></van-col>
        <van-col span="6" style="text-align: center;padding: 5px 0;">
          <select name="bind" id="bind"  v-model="bindSelect" @change="submitSearch" style="width: 90%;border:none;background-color: #fff;">
            <option value="all" >全部盒子</option>
            <option :value="items.number_id" v-for="(items,index) in binding">{{items.name}}</option>
          </select>
        </van-col>
      </van-col>
    </van-row>
    <scroller style="padding-top: 86px" :on-infinite="infinite" noDataText='我是有底线的'>
      <van-row class="peoplelist-content">
        <template>
          <wap-map :markerlist="markers" :recomendlist="saveBinding" :totals="total" :number="1" style="padding-bottom: 10px"></wap-map>
          <swiper-list :sorttype="selectDate" :tabtype="type" :binding="bindSelect" ></swiper-list>
          <template v-for="(items,index) in list">
            <van-col :span="24" style="padding: 5px 10px 5px 0">
              <van-col :span="5">
                <div class="content-img" style="color:#CACED4">
                  <icon name="user-circle" scale="3.4"/>
                  <span class="icon-telephone"><icon name="phone" scale="0.8"/></span>
                </div>
              </van-col>
            <van-col :span="19" style="border-bottom: 1px solid #eee;padding-bottom: 10px">
              <a :href="'#' + items.id" @click="openDetail(items.id)">
                <van-col :span="20">
                  <div class="telephones">
                    <span>&nbsp;{{tel(items.phone?items.phone:'***********')}}</span>
                    <!--<span class="label labelbgcolorno">无意向</span>-->
                    <!--<span class="label labelbgcolorhave">有意向</span>-->
                    <!--<span class="label labelbgcolornonet">未接通</span>-->
                    <!--<span class="label labelbgcolornull">空号</span>-->
                  </div>
                  <div class="ages  t-padded-b-4">
                    <span class="t-padded-l-4" style="color: rgba(0,0,0,0.6)">mac：{{items.mac}} </span>
                  </div>
                  <div class="ages">
                    <!--<span>&nbsp;20-30岁</span>-->
                    <span>&nbsp;到店{{items.many}}次</span>
                    <span>
                      <span style="color: rgba(0,0,0,0.2);vertical-align: -4px"><icon name="mobile"/></span>
                      <span style="color: rgba(0,0,0,0.6)">{{items.type?substrings(items.type):''}}</span>
                    </span>
                    <span>&nbsp;距离{{items.distance}}</span>
                    <!--<div style="float: right;color: #eee;position: relative;top: -5px;"><icon name="angle-right" scale="1.5"/></div>-->
                  </div>
                  <div class="lastdate">&nbsp;最后到店&nbsp;{{items.updated_at}}</div>
                </van-col>
              </a>
              <van-col :span="4">
                <div class="i-telephone" @click="getTelephone(items.id, items.mac)" v-if="items.phone && items.conversation === -1"><icon name="phone" scale="1.6" /></div>
                <div class="i-telephone" style="background-color: #999" @click="getTelephone(items.id, items.mac)" v-if="items.phone && items.conversation === 1"><icon name="phone" scale="1.6" /></div>
                <!--<div class="textPhone" @click="getTelephone(items.id, items.mac)" v-if="!items.phone && items.status == 0">没匹配</div>-->
                <!--<div  class="textPhone" @click="getTelephone(items.id, items.mac)" v-if="items.status == 2">匹配中</div>-->
              </van-col>
            </van-col>
          </van-col>
          </template>
        </template>
      </van-row>
    </scroller>
    <!--用户标记-->
    <div class="showUserTag"  style="overflow: hidden;">
      <van-popup v-model="isShowUserTag" position="right" :overlay="false">
        <user-tag v-on:showUserTagPopus="showUserTagPopus" :mac="userMac"  :showbiaoji="isShowUserTag"></user-tag>
      </van-popup>
    </div>
    <!--用户标记-->
    <!--用户详情-->
    <div class="showDetailList" >
      <van-popup v-model="isShowDetail" position="right" :overlay="false">
        <detail-list v-on:showDetailListPopus="showDetailListPopus" :id="userId" :routing="routing"></detail-list>
      </van-popup>
    </div>
    <!--用户详情-->
    <!--电话拨打-->
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
      <div class="popus-center"  style="width: 280px;">
        <div class="telephone" style="font-size: 12px;padding: 20px 12px;">为了保护通话隐私和安全，已自动转拨随机号码通话将产生本机话费，亲知悉。</div>
        <div class="popus-btn">
          <div @click="confirmToTel" style="width: 100%;background-color: #eee">确定</div>
        </div>
      </div>
    </div>
    <!--电话拨打-->
    <!--搜索-->
    <div class="searchBox" v-show="isshowsearch">
      <van-search
        v-model="skwd"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="cont">
        <template v-for="(items,index) in searchResult">
          <van-col :span="24" style="padding: 5px 10px 5px 0">
            <van-col :span="5">
              <div class="content-img" style="color:#CACED4">
                <icon name="user-circle" scale="3.4"/>
                <span class="icon-telephone"><icon name="phone" scale="0.8"/></span>
              </div>
            </van-col>
            <van-col :span="19" style="border-bottom: 1px solid #eee;padding-bottom: 3px">
              <a :href="'#' + items.id" @click="openDetail(items.id)">
                <van-col :span="20">
                  <div class="telephones">
                    <span>&nbsp;{{tel(items.phone?items.phone:'***********')}}</span>
                    <!--<span class="label labelbgcolorno">无意向</span>-->
                    <!--<span class="label labelbgcolorhave">有意向</span>-->
                    <!--<span class="label labelbgcolornonet">未接通</span>-->
                    <!--<span class="label labelbgcolornull">空号</span>-->
                  </div>
                  <div class="ages  t-padded-b-4">
                    <span class="t-padded-l-4" style="color: rgba(0,0,0,0.6)">mac：{{items.mac}} </span>
                  </div>
                  <div class="ages">
                    <!--<span>&nbsp;20-30岁</span>-->
                    <span>&nbsp;到店{{items.many}}次</span>
                    <span>
                      <span style="color: rgba(0,0,0,0.2);vertical-align: -4px"><icon name="mobile"/></span>
                      <span style="color: rgba(0,0,0,0.6)">{{items.type?substrings(items.type):''}}</span>
                    </span>
                    <span>&nbsp;距离{{items.distance}}</span>
                    <!--<div style="float: right;color: #eee;position: relative;top: -5px;"><icon name="angle-right" scale="1.5"/></div>-->
                  </div>
                  <div class="lastdate">&nbsp;最后到店&nbsp;{{items.updated_at}}</div>
                </van-col>
              </a>
              <van-col :span="4">
                <div class="i-telephone" @click="getTelephone(items.id, items.mac)" v-if="items.phone && items.conversation === -1"><icon name="phone" scale="1.6" /></div>
                <div class="i-telephone" style="background-color: #999" @click="getTelephone(items.id, items.mac)" v-if="items.phone && items.conversation === 1"><icon name="phone" scale="1.6" /></div>
                <!--<div class="textPhone" @click="getTelephone(items.id, items.mac)" v-if="!items.phone && items.status == 0">没匹配</div>-->
                <!--<div  class="textPhone" @click="getTelephone(items.id, items.mac)" v-if="items.status == 2">匹配中</div>-->
              </van-col>
            </van-col>
          </van-col>
        </template>
      </div>
    </div>
    <van-icon name="search" v-show="isShowSearchIcon" @click="isshowsearch = !isshowsearch" style="font-size: 20px;position: absolute;z-index: 1111;right:0;bottom:60px;padding:10px;background-color: #fff" />
  </div>
</template>
<script>
  import { NavBar, Row, Col, Icon, Cell, CellGroup, Dialog, Button, Popup, Search, Toast } from 'vant';
  export default {
    name: 'index',
    components: {
      tel: function (resolve) {
        require(['./telephone.vue'], resolve);
      },
      wapMap: function (resolve) {
        require(['../../components/map/wapmap.vue'], resolve);
      },
      swiperList: function (resolve) {
        require(['../../components/map/swipe.vue'], resolve);
      },
      userTag: function (resolve) {
        require(['./endconversation/index.vue'], resolve);
      },
      detailList: function (resolve) {
        require(['./detail.vue'], resolve);
      },
      [NavBar.name]: NavBar,
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Dialog.name]: Dialog,
      [Button.name]: Button,
      [CellGroup.name]: CellGroup,
      [Popup.name]: Popup,
      [Toast.name]: Toast,
      [Search.name]: Search
  },
    data() {
      return {
        isshowsearch: false,
        isShowSearchIcon: true,
        routing: {}, // 临时存储的识别路由name,与path
        loadinglayer: '',
        userId: null,  // 传到详情页的id
        isShowDetail: false,  // 是否显示详情页面
        mac: '', // : '', // 临时存储获取电话的时候传过来的mac
        userMac: '', // : '', // 临时存储获取电话的时候传过来的mac
        isShowUserTag: false, // 是否显示标记页面
        total: 0,
        markers: [],
        saveBinding: [],
        isShowSwipe: false,   // 是否打开swipe
        isShowPopus: false, // 是否显示拨打电话
        isShowTip: false, // 是否显示拨打电话
        type: '1',
        selectDate: '1',
        list: [],
        binding: [],
        bindSelect: 'all',
        loading: false,
        finished: false,
        telephone: null,
        page: 1,
        hasData: 0,
        peopleList: [],
        isShowBag: false,
        times: null,
        beginTime: '',
        endTime: '',
        id: '',
        dataList: [],
        skwd: '',
        searchResult: {}
      };
    },
    watch: {
      list: function (newValue) {
        // console.info('list的变化', newValue);
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
      bindSelect: function (newValue, oldValue) {
        if (newValue === 'all') {
          this.markers = this.saveBinding;
        }
        for (let key in this.binding) {
          if (newValue === this.binding[key].number_id) {
            this.markers = [];
            this.markers.push({position: [this.binding[key].lng, this.binding[key].lat]});
          }
        }
      },
      '$route' (to, from) {
        console.info('路由变化', to, from);
        this.routing.name = to.name;
        this.routing.path = to.path;
        if (to.query.id) {
          this.isShowSearchIcon = false;
        } else {
          this.isShowSearchIcon = true;
        }

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
          this.userId = '';
          this.isShowDetail = false;
        }
        if (!to.query.id && to.query.mac) {
          this.isShowUserTag = true;
          setTimeout(() => {
            this.userMac = to.query.mac;
          }, 30);
        } else {
          this.userMac = '';
          this.isShowUserTag = false;
        }
      }
    },
    mounted() {
      this.loadinglayer = document.getElementsByClassName('loading-layer');
      this.isShowSwipe = true;
      this.getTodayDate();
      this.getProbeList();
      this.getCountList();
      this.times = setInterval(() => {
        this.page = 1;
        this.hasData = 0;
        this.getDataList();
        this.getCountList();
      }, 5000);
    },
    beforeDestroy() {
      clearInterval(this.times);
      this.times = null;
    },
    methods: {
      onSearch() {
        if (this.skwd) {
          this.$get('media/mac?mac$=%25' + this.skwd + '%', '', (res) => {
            console.info(res.data.data);
            this.searchResult = res.data.data;
          });
        } else {
          alert('请输入搜索内容！');
        }
      },
      openDetail(id) {
        // this.isshowsearch = false;
        this.$router.push('/peoplelist/?id=' + id + '&mac=');
      },  // 是否打开详情页
      showUserTagPopus(value) {
        this.isShowUserTag = value;
      }, // 改变标记页popups状态
      showDetailListPopus(value) {
        this.isShowDetail = value;
      }, // 改变详情页popups状态
      cancel() {
        this.isShowPopus = false;
      },
      confirmToTel() {
        this.isShowTip = false;
        setTimeout(() => {
          this.isShowPopus = true;
          this.$router.push('/peoplelist/?id=&mac=' + this.mac);
        }, 500);
      },
      getTelephone(value, mac) {
        let params = {
          id: value
        };
        this.$post('media/mac_phone', params, (result) => {
          if (result.data.status === 1) {
            this.mac = mac;
            this.telephone = result.data.data.phone;
            this.isShowTip = true;
          } else {
            Dialog.alert({
              title: '提示',
              message: result.data.msg
            });
          }
        });
      },
      getTodayDate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
        this.transferDate([start, end]);
      },
      transferDate(value) {
        this.beginTime = value[0].getFullYear() + '-' + (value[0].getMonth() + 1) + '-' + value[0].getDate();
        this.endTime = value[1].getFullYear() + '-' + (value[1].getMonth() + 1) + '-' + (value[1].getDate() + 1);
        console.info(this.beginTime, this.endTime);
      },
      submitSearch() {
        this.getCountList();
        this.page = 1;
        this.list = [];
        let valuetitle;
        let valueDate;
        let value;
        // this.hasData = 0;
        if (this.type === '1') {
          value = '';
        } else if (this.type === '2') {
          value = 'new=1&';
        } else if (this.type === '3') {
          value = 'return=1&';
        } else if (this.type === '4') {
          value = 'phone$=>0&';
        }
        if (this.selectDate === '1') {
          valueDate = '&@sort=updated_at.desc';
        } else if (this.selectDate === '2') {
          valueDate = '&@sort=rssi.desc';
        } else if (this.selectDate === '3') {
          valueDate = '&@sort=time.desc';
        }
        if (this.bindSelect === 'all') {
          valuetitle = '';
        } else {
          valuetitle = '&mid$=' + this.bindSelect;
        }
        let updated = 'updated_at$' + '=>=' + this.beginTime + ',<=' + this.endTime;
        // console.log('切换盒子地址', 'media/mac/?' + updated + '&' + value + 'pageSize=10&page=' + this.page + valuetitle);
          this.$get('media/mac/?' + value + updated + '&pageSize=10&page=' + this.page + valuetitle + valueDate, '', (res) => {
            // this.$get('media/mac/?pageSize=10', '', (res) => {
            if (res.data.status === 1) {
              this.total = res.data.mate.total;
              if (this.page === 1) {
                this.list = [];
              }
              if (res.data.data.length === 0) {
                this.hasData = 1;
              } else {
                if (this.list[0] && this.list[0].id === res.data.data[0].id) {
                  this.list = res.data.data;
                } else {
                  for (let key in res.data.data) {
                    this.list.push(res.data.data[key]);
                  }
                }
              }
            } else {
              console.info('数据请求失败');
            }
            console.info('切换时获取的值', this.page);
          });
      },
      getProbeList() {
        this.$get('probe/binding', '', (res) => {
          console.log(res);
          if (res.data.status === 1) {
            // console.info('总数据', res.data.data);
            for (let key in res.data.data) {
              this.markers.push({position: [res.data.data[key].lng, res.data.data[key].lat]});
              this.saveBinding.push({position: [res.data.data[key].lng, res.data.data[key].lat]});
            }
            this.binding = res.data.data;
            // this.bindSelect = res.data.data[0].id;
          } else {
            console.info('数据获取失败');
          }
        });
      },
      getCountList() {
        let mid;
        if (this.bindSelect === 'all') {
          mid = '';
        } else {
          mid = '&mid=' + this.bindSelect;
        }
        let updated = 'updated_at$' + '=>=' + this.beginTime + ',<=' + this.endTime;
        this.$get('mac/count/?' + updated + mid, '', (res) => {
          if (res.data.status === 1) {
            this.peopleList = res.data.data;
          } else {
            Dialog.alert(
              {
                title: '提示',
                message: res.data.msg
              });
          }
        });
      },
      selectTab(value) {
        switch (value) {
          case 1:
            this.type = '1';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
          case 2:
            this.type = '2';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
          case 3:
            this.type = '3';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
          case 4:
            this.type = '4';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
        }
        this.getDataList();
      },
      selectDates(value) {
        switch (value) {
          case 1:
            this.selectDate = '1';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
          case 2:
            this.selectDate = '2';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
          case 3:
            this.selectDate = '3';
            this.list = [];
            this.page = 1;
            this.hasData = 0;
            break;
        }
      },
      getDataList() {
        let value;
        let valuetitle;
        let valueDate;
        // 根据不同的参数切换tab
        if (this.type === '1') {
          value = '';
        } else if (this.type === '2') {
          value = 'new=1&';
        } else if (this.type === '3') {
          value = 'return=1&';
        } else if (this.type === '4') {
          value = 'phone$=>0&';
        }
        if (this.selectDate === '1') {
          valueDate = '&@sort=updated_at.desc';
        } else if (this.selectDate === '2') {
          valueDate = '&@sort=rssi.desc';
        } else if (this.selectDate === '3') {
          valueDate = '&@sort=time.desc';
        }
        if (this.bindSelect === 'all') {
          valuetitle = '';
        } else {
          valuetitle = '&mid$=' + this.bindSelect;
        }
        let updated = '&updated_at$' + '=>=' + this.beginTime + ',<=' + this.endTime;
        this.$get('media/mac/?' + value + 'pageSize=10&page=' + this.page + valuetitle + valueDate + updated, '', (res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) {
              this.hasData = 1;
            } else {
              this.total = res.data.mate.total;
              if (this.page === 1) {
                this.list = res.data.data;
              } else {
                if (this.list[0] && this.list[0].id === res.data.data[0].id) {
                  this.list = res.data.data;
                } else {
                  for (let key in res.data.data) {
                    this.list.push(res.data.data[key]);
                  }
                }
              }
            }
            if (this.list.length === 0) {
              if (this.loadinglayer.length) {
                this.loadinglayer[0].style.opacity = 0;
              }
            }
          } else {
            this.hasData = 1;
            clearInterval(this.times);
            Dialog.alert(
              {
                title: '提示',
                message: res.data.msg
              });
          }

          // console.info('获取到的值', this.list);
        });
      },
      infinite(done) { // 加载更多插件
        console.info('加载更多', this.hasData, this.page);
        if (this.hasData) { // 代表没有 更多数据了
          done(true);
        } else {
          setTimeout(() => {
            this.getDataList();
            setTimeout(() => {
              done();
              this.page++;
            }, 300);
          }, 600);
        }
      }
    }
  };
</script>
<style>
  .fixedcss .van-modal{
    background: transparent;
    /*height: 100%;*/
  }
  a:link{
    color: #000;
  }
  a:visited{
    color: #DCDCDC;
  }
  .showUserTag, .showDetailList{
    width: 100% !important;
    height: 100% !important;
  }
  .showDetailList .van-popup, .showUserTag .van-popup{
    width: 100% !important;
    height: 100% !important;
    z-index: 100 !important;
    overflow-x: visible;
    overflow-y: scroll;
  }
  .showSelect .van-popup{
    z-index: 3000 !important;
    height: auto !important;
    overflow-x: visible;
  }
  .peoplelist-tab select{
    -webkit-appearance: none;
    appearance: none;
    text-align: center;
    text-align-last: center;
    width: auto;
    padding: 0 2%;
    margin: 0;
  }
</style>
<style scoped>
  .searchBox{
    position: fixed;
    bottom: 0;
    height: 60%;
    background-color: #fff;
    width: 100% !important;
    border-bottom: 1px #eee solid;
    /*margin-top: 300px !important;*/
  }
  .searchBox .cont{
    height: 320px;
    overflow-y: scroll;
    padding-bottom: 100px;
  }
  .people{
    overflow: hidden;
  }
  .textPhone{
    color: #65B7AC;
    padding-top: 15px;
    text-align:center;
    font-size: 14px;
  }
  .i-telephone{
    position: relative;
    top: 10px;
    color: #fff;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 46px;
    color: rgba(255,255,255,.8);
    background-color: #65B7AC;
    border-radius: 50%;
    transform: rotateY(180deg);
  }
  /*}*/
  .peoplelist{
    height: 100%;
  }
  .peoplelist-tab{
    width: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 100;
    background-color: #fff;
  }
  .peoplelist-tab-title{
    font-size: 14px;
    padding-top: 5px;
  }
  .peoplelist-tab-num{
    padding: 3px 0 5px 0;
    font-size: 13px;
  }
  .box{
    width: 10px;
    height: 2px;

    margin:0 auto;
  }
  .bgcolor{
    background-color: #4B7FBD;
  }
.selecttab{
  color: #0078D7;
}
  .content-img{
    width: 60px;
    height: 60px;
    /*background-color: #eee;*/
    position: relative;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: 12px;
  }
  .icon-telephone{
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
  }
  .peoplelist-content{
    padding-top:10px;
    /*padding-bottom: 120px;*/
  }
  .telephone{
    color: rgba(0,0,0,0.8);
    font-size: 16px;
  }
  .ages{
    font-size: 11px;
    color: rgba(0,0,0,0.6);
  }
  .label{
    color: rgba(255,255,255,0.9);
    font-size: 11px;
    padding: 0px 5px;
    border-radius: 2px;
    position: relative;
    top: -3px;
    margin-left: 10px;
  }
  .labelbgcolorhave{
    background-color:#59B0A2 ;
  }
  .labelbgcolorno{
    background-color:#E8988E ;
  }
  .labelbgcolornonet{
    background-color:#93AF47 ;
  }
  .labelbgcolornull{
    background-color:#D9A338 ;
  }
  .lastdate{
    font-size: 12px;
    color: rgba(0,0,0,0.6);
  }
  /*弹出侧*/
  .popus{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
  }
  .popus-center{
    width: 230px;
    /*height: 130px;*/
    border-radius: 5px;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
  }
  .popus-btn{
    display: flex;
    width: 100%;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    color: rgba(0,0,0,0.6);
  }
  .popus-btn div,.popus-btn a{
    height: 40px;
    border-top: 1px solid #eee;
    width:50% ;
    line-height: 40px;
    text-align: center;
  }
  .popus-title{
    text-align: center;
  }
  .popus-extension{
    text-align: center;
    color: red;
    padding: 2px 5px;
    font-size: 22px;
  }
  .telephone{
    font-size:20px;
    text-align: center;
    padding: 20px 0 20px 0;
    color: #4B8EDD;
  }
  .popus-btn div:nth-child(1){
    border-right:1px solid #eee;
  }
  .popus-btn a{
    display: block;
  }
  /*弹出侧*/
</style>
