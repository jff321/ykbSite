<template>
    <div class="customer">
      <div class="customer-header">
        <div class="customer-type">
          <van-row>
            <van-col :span="8">
              <div class="tab-box" :class="{active:currentType === 0}" @click="selectCustomType(0);">
                <span class="name1">全部客户</span>
                <!-- <div class="indicator"></div> -->
              </div>
            </van-col>
            <van-col :span="8">
              <div class="tab-box" :class="{active:currentType === 1}" @click="selectCustomType(1);">
                <span class="name1">新客户</span>
                <!-- <div class="indicator"></div> -->
              </div>
            </van-col>
            <van-col :span="8">
              <div class="tab-box" :class="{active:currentType === 2}" @click="selectCustomType(2);">
                <span class="name1">老客户</span>
                <!-- <div class="indicator"></div> -->
              </div>
            </van-col>
          </van-row>
        </div>
        <!-- 搜索 -->
        <div class="searchbar">
          <van-row>
            <van-col :span="21">
              <van-search placeholder="请输入客户或手机后四位" type="tel" v-model="searchphone">
              </van-search>
            </van-col>
            <van-col :span="3">
              <div @click="onSearch" style="line-height:46px;color: #666; font-size: 14px;">搜索</div>
            </van-col>
          </van-row>
        </div>
      </div>

      <scroller style='padding-top:96px;' :on-refresh="refresh" :on-infinite="infinite"  noDataText='我是有底线的'>
        <div class="content">
          <customer-list :lists="list" :isshow="true" v-on:showModel="showModel" v-on:showmac="showMac"></customer-list>
        </div>
      </scroller>
      <!--<div style="padding: 100px 0;"></div>-->
      <div class="sendflash">
        <van-popup v-model="isShowModel" :overlay="true" >
          <!--<van-loading  color="black"  v-if="loading" style="text-align: center;margin: 0 auto"/>-->
          <div style="text-align: center;padding: 10px 0;" v-if="isModelType === 1">闪信模板</div>
          <div style="text-align: center;padding: 10px 0;" v-if="isModelType === 2">短信模板</div>
          <div style="" class="contentS">
            <van-radio-group v-model="modelIndex">
              <van-cell-group>
                <van-cell clickable @click="modelIndex = items.id" v-for="(items, index) in modelList" :key="index">
                  <div style="padding-left: 30px">标题: <span  style="color: rgba(0,0,0,1)">{{items.title}}</span></div>
                  <div style="padding-left: 30px">内容: <span  style="color: rgba(0,0,0,0.6)">{{items.content}}</span></div>
                  <van-radio :name="items.id" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <van-row style="position: absolute;bottom: 0px;width: 100%;">
            <van-col :span="24" class="pt5">
              <van-col :span="12"><van-button type="default" class="createBtn" @click="isShowModel = false" style="width: 100%;height: 100%;border-right: none">取消</van-button></van-col>
              <van-col :span="12"><van-button class="createBtn" :disabled="disabled"  @click="createComfirm"  style="width: 100%;height: 100%;">发送</van-button></van-col>
            </van-col>
          </van-row>
        </van-popup>
      </div>
      <!--用户标记-->
      <div class="showUserTag"  style="overflow: hidden;">
        <van-popup v-model="isShowUserTag" position="right" :overlay="false">
          <user-tag v-on:showUserTagPopus="showUserTagPopus" :mac="userMac" :showbiaoji="isShowUserTag"></user-tag>
        </van-popup>
      </div>
      <!--用户标记-->
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
    </div>
</template>

<script>
  import { NavBar, Row, Col, Icon, Dialog, Button, Search, Popup, Toast, Loading, Radio, RadioGroup, Cell, CellGroup } from 'vant';
    export default {
      name: 'index',
      components: {
        customerList: function (resolve) {
          require(['./list.vue'], resolve);
        },
        userTag: function (resolve) {
          require(['../peoplelist/endconversation/index.vue'], resolve);
        },
        [NavBar.name]: NavBar,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
        [Row.name]: Row,
        [Col.name]: Col,
        [Toast.name]: Toast,
        [Loading.name]: Loading,
        [Icon.name]: Icon,
        [Dialog.name]: Dialog,
        [Search.name]: Search,
        [Button.name]: Button,
        [Popup.name]: Popup
      },
      data() {
          return {
            currentType: 0,
            loadinglayer: '',
            telephone: null,
            isShowUserTag: false,   // 标记窗口
            isShowModel: false, // 模板窗口
            loading: false,
            disabled: false,
            modelIndex: '',
            isModelType: '',
            searchphone: '',
            page: 1,
            hasData: 0,
            userMac: '',
            list: [],
            modelList: [],
            selectType: '0',
            selectStatus: '0',
            isShowPopus: false, // 是否显示拨打电话
            isShowTip: false // 是否显示拨打电话
          };
      },
      mounted() {
        console.info();
        this.loadinglayer = document.getElementsByClassName('loading-layer');
        this.getDataList();
      },
      watch: {
        '$route' (to, from) {
          console.info('客户页面路由变化', to, from);
          if (to.query.mac) {
            this.isShowUserTag = true;
            setTimeout(() => {
              this.userMac = to.query.mac;
            }, 30);
          } else {
            this.userMac = '';
            this.isShowUserTag = false;
          }
        },
        list: function (newValue) {
          if (newValue.length <= 5) {
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
      methods: {
        selectCustomType(type) {
          this.currentType = type;
        },
        createComfirm() {
          if (!this.modelIndex) {
            Toast({
              message: '请先创建模板！'
            });
            return;
          } else {
            let params = {
              phone: this.telephone,
              letter_id: this.modelIndex,
              where: this.isModelType
            };
            console.info('发送短信/闪信');
            console.info('要传递的参数', params);
            this.$post('letter/phone', params, (res) => {
              if (res.data.status === 1) {
                Toast('发送成功');
                // this.loading = false;
              } else {
                // this.loading = false;
                Toast(res.data.msg);
              }
            });
          }
        },
        getModelList(value) {
          this.modelList = [];
          this.loading = true;
          this.$get('group/letter?type=' + value + '&status=1', '', (res) => {
            console.info('模板列表', res);
            if (res.data.status === 1) {
              this.modelIndex = res.data.data[0] ? res.data.data[0].id : '';
              this.modelList = res.data.data;
              // this.loading = false;
            } else {
              // this.loading = false;
              Toast(res.data.msg);
            }
          });
        }, // 获取模板
        getOnlyTelephone(value) {
          let params = {
            phone: value
          };
          this.$post('md5/phonebyaliaxb', params, (result) => {
            console.info('获取到的数据ssss', result);
            if (result.data.status === 1) {
              this.telephone = result.data.data.phone;
            } else {
              Dialog.alert({
                title: '提示',
                message: result.data.msg
              });
            }
          });
        },
        showModel(value) {   // 打开popup层
          console.info('传出来的', value);
          this.isModelType = value.type;
          this.isShowModel = value.isShowFlash;
          this.getModelList(value.type);
          this.telephone = value.phone;
          // this.getOnlyTelephone(value.phone);
        },
        showMac(value) {
          // console.log('###############');
          console.info('传出来的', value);
          if (value.phone) {
            this.isShowTip = true;
            this.getTelephone(value.phone);
          }

          if (!value.phone) {
            this.$router.push('/customer/?mac=' + value.mac);
          }
        },
        getTelephone(value) {
          let params = {
            phone: value
          };
          this.$post('md5/phonebyaliaxb', params, (result) => {
            console.info('获取到的数据ssss', result);
            if (result.data.status === 1) {
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
        cancel() {
          this.isShowPopus = false;
        },
        confirmToTel() {
          this.isShowTip = false;
          setTimeout(() => {
            this.isShowPopus = true;
          }, 500);
        },
        showUserTagPopus(value) {
          if (!value) {
            this.page = 1;
            this.getDataList();
          }
          this.isShowUserTag = value;
        },
        submitSearchType(value) {
          this.page = 1;
          this.getDataList();
        },
        submitSearchStatus(value) {
          this.page = 1;
          this.getDataList();
        },
        onSearch() {
          this.page = 1;
          this.getDataList();
        },
        getDataList() {
          let type;
          let status;
          let searchp;
          if (this.searchphone) {
            searchp = '&phone$=%25' + this.searchphone;
          } else {
            searchp = '';
          }
          if (this.selectType === '0') {
            type = '';
          } else {
            type = '&customer_type=' + this.selectType;
          }
          if (this.selectStatus === '0') {
            status = '';
          } else {
            status = '&type_status=' + this.selectStatus;
          }
          this.$get('customer/remarks?status=1&pageSize=8&page=' + this.page + type + status + searchp, '', (res) => {
            // console.info('adfasdfasdfasdfasd', res.data.data);
            if (res.data.status === 1) {
              if (this.page === 1) {
                this.list = [];
              }
              if (res.data.data.length === 0) {
                this.hasData = 1;
              } else {
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
              // this.hasData = 1;
              Dialog.alert(
                {
                  title: '提示',
                  message: res.data.msg
                });
            }
            console.info('页数', this.list);
          });
        },
        refresh(done) {
          setTimeout(() => {
            this.page = 1;
            this.list = [];
            this.hasData = 0;
            this.getDataList();
            done(true);
          }, 1500);
        },
        infinite(done) { // 加载更多插件
          console.info(this.hasData, this.page);
          if (this.hasData) { // 代表没有 更多数据了
            done(true);
          } else {
            setTimeout(() => {
              this.getDataList();
              setTimeout(() => {
                done();
                this.page++;
              }, 500);
            }, 1000);
          }
        }
      }
    };
</script>
<style>

  .sendflash .van-radio{
    position: absolute;
    top: 8px;
    left: 15px;
  }
  .sendflash .van-popup{
    width: 100%;
    height: 60%;
  }
  .showUserTag{
    width: 100% !important;
    height: 100% !important;
  }
  .showUserTag .van-popup{
    width: 100% !important;
    height: 100% !important;
    z-index: 100 !important;
    overflow-x: visible;
    overflow-y: scroll;
  }
  .search .van-search{
    background: transparent !important;
  }
  .search .van-field__control{
    height: 30px !important;
  }
  .search select{
    width: 100%;
    height: 30px;
    border: none;
    text-align: center;
    text-align-last: center;
    padding: 0 2%;
    margin: 0;
    outline: none;
    color: #4396AE;
    font-size: 12px;
  }
</style>
<style scoped>
  .customer-header {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 96px;
    border-bottom: 1px solid #e6e6e6;
    background: white;
  }

  .customer-type {
    height: 50px;
    /* line-height: 50px; */
    background: white;
    /* border-bottom: 1px solid #e6e6e6; */

    /* color: #333; */
  }

  .tab-box {
    text-align: center;
    /* padding: 10px; */
    height: 50px;
    /* line-height: 50px; */
    position: relative;
  }

  .tab-box.active::after {
    content: '';
    display: block;
    width: 18px;
    height: 2px;
    position: absolute;
    left: calc(50% - 9px);
    bottom: 0;
    background: #4B7FBD;
  }

  .tab-box .name1 {
    font-size: 14px;
    color: #333;
    margin-top: 8px;
    height: 40px;
    line-height: 40px;
    vertical-align: top;
    display: inline-block;
  }

  .tab-box.active .name1 {
    color: #4B7FBD;
  }

  .searchbar {
    width: 100%;
    /* border-bottom: 1px solid #e6e6e6; */
  }

  .searchbar .van-search {
    background: white!important;
  }

  .searchbar .van-cell {
    background: #f3f3f3!important;
  }

  .contentS{
    width: 100%;
    height: 80%;
    overflow: scroll
  }
  .contentS::-webkit-scrollbar{
    display: none;
  }
  .pt5{
    padding-top: 8px;
  }
  .createBtn{
    height:40px;
    line-height:40px;
    text-align: center;
    border:1px solid #eee
  }
  .people{
    overflow: hidden;
  }
  /*.content{*/
    /*p-bottom: 100px;*/
  /*}*/

  .borderBarT{
    width: 100%;
    height: 5px;
    background-color:#ECECEC ;
  }
  .borderBarB{
    width: 100%;
    height: 8px;
    background-color:#ECECEC ;
  }

  .pr5{
    padding-right: 5px;
  }
  .title{
    font-size: 16px;
    color: #fff;
    text-align: center;
    padding: 5px 0 10px 0;
  }
  /* .search{
    position: fixed;
    z-index: 100;
    width: 100%;
  } */

  .search-top{
    width: 100%;
    padding:10px 0 6px 0;
    background-image:linear-gradient(to right, #92C5E7, #5394D4);
    /*background-image: -webkit-linear-gradient(#5394D4, #92C5E7);*/
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
