<template>
  <div>
    <van-nav-bar
      :title="navTitle"
      left-arrow
      right-text="发送明细"
      :fixed="true"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="content">
      {{msg.content}}
      <div class="remark">
        {{numCount(msg.content)}}字（{{Math.ceil(numCount(msg.content) / 70)}}条）
      </div>
    </div>
    <div style="margin-top: 15px">
      <van-cell-group>
        <!--<van-cell title="接收号码" :value="msg.phone.replace(msg.phone.substring(3,7), '****')"/>-->
        <van-cell title="状态" :value="msg.status === 1 ? '发送完成' : '发送失败'"/>
        <van-cell :title="template" :value="msg.title"/>
        <van-cell title="单位价格" :value="msg.price + '元 / 条'"/>
        <van-cell title="触达人数" :value="msg.ren + '人'"/>
        <van-cell :title="countName" :value="msg.nums + '条'"/>
        <van-cell title="创建时间" :value="turnTime(msg.create_time)"/>
        <van-cell title="发送时间" :value="turnTime(msg.update_time)"/>
      </van-cell-group>
    </div>
    <van-popup v-model="showPopup" :overlay="false" position="right" class="detail">
      <van-nav-bar
        title="发送明细"
        @click-left="toLeft"
        left-arrow
      />
      <div class="custom-tabs" style="margin-top: 46px;">
        <div class="custom-tab-item" :class="{active:active === 1}" @click="successClick">
          <p style="padding-bottom: 5px;">{{success}}</p>
          <p style="font-size: 12px;margin-bottom: 5px;">发送成功</p>
        </div>
        <div class="custom-tab-item" :class="{active:active === 2}" @click="failClick">
          <p style="padding-bottom: 5px;">{{failed}}</p>
          <p style="font-size: 12px;margin-bottom: 5px;">发送失败</p>
        </div>
      </div>
      <div class="custom-tab-content" v-show="active === 1">
        <scroller
          style="padding-top: 106px;"
          :on-refresh="refresh"
          :on-infinite="infinite"
          noDataText="我是有底线的"
        >
          <van-row style="padding: 0px 15px">
            <template v-for="(items,index) in list">
              <van-col
                :span="24"
                style="padding: 15px 0; border-bottom: 0.5px solid #eee;"
                :key="index"
              >
                <van-col span="4">
                  <img src="./imgs/通讯录.png" alt="" style="width: 40px;border-radius: 50%">
                </van-col>
                <van-col span="20" style="padding: 5px 0px;">
                  <p style="font-size: 14px;color: #000;">{{items.phone}}</p>
                  <p style="font-size: 12px;color: gray;">{{items.times}}</p>
                </van-col>
              </van-col>
            </template>
          </van-row>
        </scroller>
      </div>
      <div class="custom-tab-content" v-show="active === 2">
        <!--<van-row type="flex" align="center" style="border-bottom: 1px solid #eee;">-->
          <!--<van-col span="4" style="padding: 10px 12px;">-->
            <!--<img src="./imgs/通讯录.png" alt="" style="width: 40px;border-radius: 50%">-->
          <!--</van-col>-->
          <!--<van-col span="20">-->
            <!--<p style="font-size: 14px;color: #000;">133****2331</p>-->
            <!--<p style="font-size: 12px;color: gray;">2019-03-12 12:37</p>-->
          <!--</van-col>-->
        <!--</van-row>-->
        <scroller
          style="padding-top: 106px;"
          :on-refresh="refresh"
          :on-infinite="infinite"
          noDataText="我是有底线的"
        >
          <van-row style="padding: 0px 15px">
            <template v-for="(items,index) in list">
              <van-col
                :span="24"
                style="padding: 15px 0; border-bottom: 0.5px solid #eee;"
                :key="index"
              >
                <van-col span="4">
                  <img src="./imgs/通讯录.png" alt="" style="width: 40px;border-radius: 50%">
                </van-col>
                <van-col span="20" style="padding: 5px 0px;">
                  <p style="font-size: 14px;color: #000;">{{items.phone}}</p>
                  <p style="font-size: 12px;color: gray;">{{items.times}}</p>
                </van-col>
              </van-col>
            </template>
          </van-row>
        </scroller>

      </div>
    </van-popup>
  </div>
</template>

<script>
  import {
    Row,
    Col,
    NavBar,
    Field,
    Cell,
    CellGroup,
    Popup
  } from "vant";

  export default {
    name: "listDetail",
    data() {
      return {
        active: 1,
        success: 0,
        failed: 0,
        navTitle: '',
        template: '',
        countName: '',
        msg: {
          // content: '短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容',
          // num: 44,
          // count: 1,
          // phone: '17711545233',
          // status: 1,
          // title: '短信标题',
          // price: '0.10元 / 条',
          // unum: 22,
          // start_date: '2019-05-09 16:22',
          // end_date: '2019-05-10 12:39'
        },
        showPopup: false,
        loadinglayer: "",
        page: 1,
        hasData: 0,
        list: [],
      }
    },
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      [NavBar.name]: NavBar,
      [Field.name]: Field,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Popup.name]: Popup
    },
    watch: {
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
      if (Number(this.$route.query.type) === 1) {
        this.navTitle = '短信详情';
        this.template = '短信模板';
        this.countName = '短信条数';
      } else {
        this.navTitle = '闪信详情';
        this.template = '闪信模板';
        this.countName = '闪信条数';
      }

      this.$get(`client/smsinfo?id=${this.$route.query.id}`, '', res => {
        if (res.data.code === 200) {
          this.msg = res.data.data;
        } else {
          this.$status(res.data.msg)
        }
      })
    },
    methods: {
      getDataList(){
        this.showPopup = true;
        this.$get(`client/smsitem?id=${this.$route.query.id}&types=${this.active}&page=${this.page}`, '', result => {
          if(result.data.code === 200){
            this.success = result.data.data.success;
            this.failed = result.data.data.failed;
            if (result.data.data.list.length === 0) {
              this.hasData = 1;
              if (this.loadinglayer.length) {
                // console.log('打印一下this.loadinglayer：', this.loadinglayer);
                // console.log('打印一下this.loadinglayer.length：', this.loadinglayer.length);
                this.loadinglayer[0].style.opacity = 1;
              }
            } else {
              if (this.page === 1) {
                // console.log('page等于1的时候发生page等于1的时候发生');
                this.list = result.data.data.list;
              } else {
                // console.log('page大于1的时候发生');
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
        })
      },
      onClickLeft() {
        this.$router.back()
      },
      onClickRight() {
        this.active = 1;
        this.page = 1;
        this.list = [];
        this.getDataList();
      },
      toLeft() {
        this.showPopup = false;
      },
      successClick(){
        this.active = 1;
        this.page = 1;
        this.list = [];
        this.getDataList()
      },
      failClick(){
        this.active = 2;
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
        console.log('加载！！！');
        // 加载更多插件
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
    }
  }
</script>

<style scoped>
  .content {
    border: 0.5px solid rgb(242, 242, 242);
    padding: 10px;
    font-size: 14px;
    background-color: #F8F8FF;
    margin-top: 61px;
    margin-left: 15px;
    margin-right: 15px;
    width: calc(100% - 30px);
    height: 130px;
    position: relative;
  }

  .remark {
    text-align: right;
    font-size: 12px;
    color: gray;
    position: absolute;
    bottom: 8px;
    right: 15px;
  }

  .detail {
    width: 100vw;
    height: 100vh;
  }

  .custom-tabs {
    position: fixed;
    display: flex;
    justify-content: space-around;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    z-index: 100;
    padding: 0 20px;
    border-bottom: 0.5px solid #f6f6f6;
  }

  .custom-tab-item {
    display: inline-block;
    /*line-height: 44px;*/
    /*height: 44px;*/
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
    margin-top: 10px;
    color: #333;
    cursor: pointer;
    text-align: center;
  }

  .custom-tab-item.active {
    font-size: 16px;
    font-weight: 700;
    color: red;
    border-bottom: 2px solid #4588d4;
  }

  .custom-tab-content {
    padding-top: 65px;
    height: 100%;
    /* position: relative; */
  }
</style>
