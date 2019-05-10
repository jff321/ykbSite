<template>
  <div class="moneydetail">
    <van-nav-bar title="费用中心" left-arrow :fixed="true" @click-left="onClickLeft"/>
    <scroller style="top:46px" :on-refresh="refresh" :on-infinite="infinite">
      <div class="money-caption">
        <div class="balance-wrap">
          <div class="balance">
            <span class="symbol">¥</span>
            <span class="digit">{{moneyStat.balance}}</span>
          </div>
          <div class="name">可用余额(元)</div>
        </div>
        <van-row>
          <van-col :span="12">
            <div class="other-money">
              <p class="money">
                <span class="symbol">¥</span>
                {{moneyStat.today}}
              </p>
              <p class="name">今日消费(元)</p>
            </div>
          </van-col>
          <van-col :span="12">
            <div class="other-money">
              <p class="money">
                <span class="symbol">¥</span>
                {{moneyStat.frozen}}
              </p>
              <p class="name">累计消费(元)</p>
            </div>
          </van-col>
        </van-row>
      </div>
      <van-row class="money-subnav">
        <van-col span="24" style="border-bottom: 0.55px solid #ccc;background-color: #fff">
          <van-col span="4" :class="{selecttab:dataType == 1}" style="text-align: center">
            <div v-on:click="selectTab(1)">
              <div class="menu-item">充值</div>
            </div>
          </van-col>
          <van-col span="4" :class="{selecttab:dataType == 2}" style="text-align: center">
            <div v-on:click="selectTab(2)">
              <div class="menu-item">匹配</div>
            </div>
          </van-col>
          <van-col span="4" :class="{selecttab:dataType == 3}" style="text-align: center">
            <div v-on:click="selectTab(3)">
              <div class="menu-item">拨号</div>
            </div>
          </van-col>
          <van-col span="4" :class="{selecttab:dataType == 4}" style="text-align: center">
            <div v-on:click="selectTab(4)">
              <div class="menu-item">短信</div>
            </div>
          </van-col>
          <van-col span="4" :class="{selecttab:dataType == 5}" style="text-align: center">
            <div v-on:click="selectTab(5)">
              <div class="menu-item">闪信</div>
            </div>
          </van-col>
          <van-col span="4" :class="{selecttab:dataType == 6}" style="text-align: center">
            <div v-on:click="selectTab(6)">
              <div class="menu-item">退款</div>
            </div>
          </van-col>
        </van-col>
      </van-row>

      <van-row style="padding: 0px 15px">
        <template v-for="(items,index) in list">
          <van-col :span="24" :key="index" style="border-bottom: 1px solid #eee;padding: 5px 0;">
            <van-col :span="12">
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 1"
              >充值</h4>
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 2"
              >匹配</h4>
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 3"
              >拨号</h4>
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 4"
              >短信</h4>
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 5"
              >闪信</h4>
              <h4
                style="font-size: 14px; color: #666;font-weight: normal; margin-top: 3px;"
                v-if="items.types === 6"
              >退款</h4>
              <p style="font-size: 12px; color: #999;">{{items.times}}</p>
            </van-col>
            <van-col :span="12">
              <!--{{items.price?(Math.floor(items.price * 100) / 100):''}}-->
              <p
                style="text-align: right; font-size: 18px; color:#4588d4;font-family: 'PingFang SC;height: 40px; line-height: 40px;'"
              >{{items.money?items.money:''}}</p>
            </van-col>
            <!-- <van-col :span="24" >
                <div class="telephone"  style="padding:5px 0 2px 0;">
                  <span>金额: {{items.price?(Math.floor(items.price * 100) / 100):''}}</span>
                  <span class="label labelbgcolorhave">{{items.type_link}}</span>
                </div>
                <div class="lastdate"  style="padding:5px 0;">扣费时间: {{items.updated_at}}</div>
            </van-col>-->
          </van-col>
        </template>
      </van-row>
    </scroller>
  </div>
</template>

<script>
import { NavBar, Row, Col, Icon, Dialog } from "vant";
export default {
  name: "money-detail",
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
    [Dialog.name]: Dialog
  },
  data() {
    return {
      loadinglayer: "",
      list: [],
      page: 1,
      dataType: 1,
      moneyStat: {}
    };
  },
  watch: {
    list: function(newValue) {
      console.info("总的list", newValue.length);
      if (newValue.length <= 10) {
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
    // this.getTotalMoney();
    this.getMoneyList();
    // console.log('this.list:', this.list);
  },
  methods: {
    // getTotalMoney() {
    //   this.$get("media/money?count=1", "", res => {
    //     if (res.data.status === 1) {
    //       console.info("获取到的金钱", res.data);
    //       this.moneyStat = res.data.data;
    //     } else {
    //       // Dialog.alert({
    //       //   title: "提示",
    //       //   message: res.data.msg
    //       // });
    //     }
    //   });
    // },
    onClickLeft() {
      this.$router.push("/setting");
    },
    selectTab(type) {
      this.dataType = type;
      this.page = 1;
      // console.log(123);
      this.getMoneyList();
    },
    getMoneyList() {
      // console.log(123);
      this.$get(
        "client/fundlist?limit=12&page=" + this.page + "&types=" + this.dataType,
        "",
        res => {
          console.log('reshahhahah:', res);
          if (res.data.code === 200) {
            this.moneyStat = res.data.data.account;
            if (this.page === 1) {
              this.list = [];
            }
            if (res.data.data.list.length === 0) {
              this.hasData = 1;
            } else {
              if (this.list[0] && this.list[0].id === res.data.data.list[0].id) {
                this.list = res.data.data.list;
              } else {
                for (let key in res.data.data.list) {
                  this.list.push(res.data.data.list[key]);
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
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
          console.info("页数", this.page);
        }
      );
    },
    refresh(done) {
      setTimeout(() => {
        this.page = 1;
        this.list = [];
        this.hasData = 0;
        this.getMoneyList();
        done();
      }, 1500);
    },
    infinite(done) {
      // 加载更多插件
      console.info(this.hasData, this.page);
      if (this.hasData) {
        // 代表没有 更多数据了
        done();
      } else {
        setTimeout(() => {
          this.getMoneyList();
          setTimeout(() => {
            done(true);
            this.page++;
          }, 400);
        }, 1000);
      }
    }
  }
};
</script>

<style scoped>
.telephone {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
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
  top: -2px;
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

.money-caption {
  background: linear-gradient(to right, #92c5e7, #4588d4);
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
  padding: 30px 15px 20px;
  color: #fff;
}

.balance-wrap {
  text-align: center;
}

.balance-wrap .digit {
  font-size: 28px;
}

.money-caption .symbol {
  font-size: 12px;
}

.balance-wrap .name {
  font-size: 14px;
}

.other-money {
  text-align: center;
  margin-top: 15px;
}

.other-money .money {
  font-size: 18px;
  color: #fff;
}

.other-money .symbol {
  font-size: 10px;
}

.other-money .name {
  font-size: 12px;
  color: #fff;
}

.money-subnav {
  /* margin-top: 46px; */
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.money-subnav .selecttab .menu-item {
  /* background: red; */
  color: #4588d4;
  border-bottom: 0.55px solid #4588d4;
}
</style>
