<template>
  <div class="sendmsg" style="overflow: scroll;">
    <!--<van-tabs type="card" class="t-margin-t-10">-->
    <!--<van-tab title="意向"></van-tab>-->
    <!--<van-tab title="状态"></van-tab>-->
    <!--<van-tab title="类型"></van-tab>-->
    <!--</van-tabs>-->
    <scroller :on-infinite="infinite" style="top:50px">
      <van-checkbox-group v-model="result" @change="changeCheck(result)">
        <van-row style="padding: 0px 15px">
          <template v-for="(item, key) in list">
            <van-col :span="24" style="padding: 5px 0" :key="key">
              <van-col :span="4" style="padding: 18px 5px 0;">
                <van-checkbox :name="item.id" style="font-size: 15px"></van-checkbox>
              </van-col>
              <van-col :span="20" style="border-bottom: 0.5px solid #eee;padding-bottom: 3px">
                <div class="time">
                  <span class="title">名称 {{item.name}}</span>
                  <!--<span class="label labelbgcolorno">大萨达</span>-->
                  <!--<span class="label labelbgcolorhave">实打实</span>-->
                </div>
                <div class="time" style="padding:3px 0;">
                  <span class="title">数量 {{item.t_nums}}</span>
                </div>
                <div class="time">创建时间 {{item.times}}</div>
              </van-col>
            </van-col>
          </template>
        </van-row>
      </van-checkbox-group>
    </scroller>
    <van-col
      span="24"
      class="van-hairline--top footerTab"
      style="padding: 5px 0;background-color: #fff"
    >
      <van-col span="12" style="padding:10px 20px 10px;">
        <span class="custom-cb-btn" @click="toggleSelectAll" v-if="!allChecked">
          <van-icon
            style="vertical-align: -4px;font-size: 18px;padding-right: 3px;color: rgb(178,178,178);"
            name="check"
          />
          全选
        </span>
        <span class="custom-cb-btn" @click="toggleSelectAll" v-if="allChecked">
          <van-icon
            name="checked"
            style="vertical-align: -4px;font-size: 18px;padding-right: 3px;color: rgb(107,189,45);"
          />
         全选
        </span>
        <span v-if="$route.params.id == 1" class="custom-cb-btn">预计: ￥{{(this.amount).toFixed(2)}}</span>
        <span v-if="$route.params.id == 2" class="custom-cb-btn">预计: ￥{{(this.amount).toFixed(2)}}</span>
        <!-- <van-checkbox v-model="allChecked" style="font-size: 15px" @change="changeCB">全选</van-checkbox> -->
      </van-col>
      <van-col span="6" style="padding: 5px">
        <van-button @click="close" class="sendmsgbtn" size="small" type="default">关闭</van-button>
      </van-col>
      <van-col span="6" style="padding: 5px;">
        <van-button class="sendmsgbtn" size="small" @click="send" type="warning">发送({{this.nums * msgpm.msgNumber}})</van-button>
      </van-col>
    </van-col>
  </div>
</template>
<script>
import {
  Row,
  Col,
  Checkbox,
  CheckboxGroup,
  Button,
  Dialog,
  Tab,
  Icon,
  Tabs
} from "vant";
export default {
  props: ["msgpm", "masgactive"],
  name: "sendMsgTpl",
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Dialog.name]: Dialog,
    [Tab.name]: Tab,
    [Icon.name]: Icon,
    [Tabs.name]: Tabs,
    [CheckboxGroup.name]: CheckboxGroup
  },
  data() {
    return {
      hasData: 0,
      list: [],
      select: null,
      page: 1,
      result: [],
      isShowMsgBox: false,
      allChecked: false,
      count: 0,
      setting: {},
      allResult: [], // 所有的,
      amount: 0,
      nums: 0
    };
  },
  watch: {
    result: function(newValue, oldValue) {
      console.log('newValue:', newValue);
      console.log('oldValue:', oldValue);
      this.allChecked = newValue.length >= this.allResult.length;
      if(!this.allChecked){
        this.nums = 0;
        this.amount = 0;
      }
      this.count = newValue.length;
    },
    // allChecked: function(newValue, oldValue) {
    //   // if (newValue) {
    //   //   this.amount =
    //   // } else {
    //   //   this.result = [];
    //   // }
    // },
    list: function (newValue, oldValue) {
      console.info("new", newValue);
      console.info("old", oldValue);
    }
  },
  mounted(){
    this.$get("client/myinfo", '', res => {
      this.setting = res.data.setting;
    });
  },
  methods: {
    changeCheck(result){
      if(result.length>0){
        this.nums = 0;
        this.amount = 0;
        for(var i=0;i<result.length;i++){
          this.nums += Number(this.list.find(x => x.id === result[i]).t_nums);
        }
      }
      if(Number(this.$route.params.id) === 1){
        this.amount += this.nums * this.setting.sms * this.msgpm.msgNumber;
      } else if (Number(this.$route.params.id) === 2){
        this.amount += this.nums * this.setting.fms * this.msgpm.msgNumber;
      }
    },
    toggleSelectAll() {
      this.allChecked = !this.allChecked;
      if (this.allChecked) {
        this.result = this.allResult;
      } else {
        this.result = [];
      }
    },
    send() {
      // console.info('***********************', this.msgpm);
      if (!this.msgpm.id || !this.msgpm.type) {
        Dialog.alert({
          title: "提示",
          message: "参数出错！"
        });
        return;
      }
      if (this.result.length === 0) {
        Dialog.alert({
          title: "提示",
          message: "请选择人群包！"
        });
      } else {
        let params = {
          id: this.msgpm.id,
          sort: this.masgactive,
          ids: (this.result).join(','),
          types: this.$route.params.id
        };
        this.$post("client/dosms", params, res => {
          if(res.data.code === 200){
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          } else {
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        });
      }
    },
    close() {
      this.$emit("close", false);
    },
    getPepoleBag() {
      // 获取人群包
      this.$get("client/matelist?page=" + this.page, "", res => {
        // console.info("page", this.page);
        if (res.data.code === 200) {
          // console.info(0);
          if (this.page === 1) {
            this.list = [];
          }
          if (res.data.data.list.length === 0) {
            this.hasData = 1;
          } else {
            for (let key in res.data.data.list) {
              this.list.push(res.data.data.list[key]);
              this.allResult.push(res.data.data.list[key].id);
            }
            // console.info(this.list);
            // this.hasData = 1;
          }
        } else {
          this.hasData = 1;
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          });
        }
      });
    },
    refresh(done) {
      setTimeout(() => {
        this.page = 1;
        this.list = [];
        this.hasData = 0;
        this.getPepoleBag();
        done();
      }, 1500);
    },
    infinite(done) {
      // 加载更多插件
      if (this.hasData) {
        // 代表没有 更多数据了
        done(true);
      } else {
        setTimeout(() => {
          this.getPepoleBag();
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
<style lang="scss">
.custom-cb-btn {
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
}
</style>

<style scoped>
/* .messagedetail .van-popup {
  width: 100%;
} */
.sendmsg {
  /*height: 500px;*/
  min-height: 500px;
  overflow: scroll;
  padding-bottom: 50px;
}
.footerTab {
  position: fixed;
  bottom: 0;
}
.msgbox {
  height: 430px;
}
.sendmsgbtn {
  width: 100%;
}
.title {
  /*font-size: 14px;*/
  /*font-weight: normal;*/
  color: #666;
  /* margin-top: 10px; */
  /*padding: 2px 0;*/
  /*text-overflow: ellipsis;*/
  /*white-space: nowrap;*/
  /*overflow: hidden;*/
}
.time {
  font-size: 12px;
  line-height: 12px;
  vertical-align: middle;
  color: #999;
  margin-bottom: 5px;
}
</style>
