<template>
  <div class="sendmsg" style="overflow: scroll;">
    <van-col span="24" style="border-bottom: 1px solid #ccc;font-size: 14px;">
      <van-col span="8" style="text-align: center;padding: 5px 0;">
        <select
          name="bind"
          v-model="kefu"
          style="color: #4588d4;width: 90%;border:none;background-color: #fff;border-right: 1px solid #ccc;"
        >
          <option value="0">类型</option>
          <option value="1">普通客户</option>
          <option value="2">积极客户</option>
          <option value="3">高价值客户</option>
        </select>
      </van-col>
      <van-col span="8" style="text-align: center;padding: 5px 0;">
        <select
          name="bind"
          v-model="yx"
          style="color: #4588d4;width: 90%;border:none;background-color: #fff;border-right: 1px solid #ccc;"
        >
          <option value="0">意向度</option>
          <option value="1">有意向</option>
          <option value="2">无意向</option>
          <option value="3">空号</option>
          <option value="3">未接通</option>
        </select>
      </van-col>
      <van-col span="8" style="text-align: center;padding: 5px 0;">
        <select name="bind" v-model="jindu" style="color: #4588d4;width: 90%;border:none;background-color: #fff;">
          <option value="0">状态</option>
          <option value="1">持续跟进</option>
          <option value="2">暂无印象</option>
          <option value="3">新转入</option>
        </select>
      </van-col>
    </van-col>
    <scroller :on-infinite="infinite" style="top:80px;">
      <van-checkbox-group v-model="result" @change="changeCheck(result)">
        <van-row style="padding: 0px 15px">
          <template v-for="(items,index) in list">
            <van-col :span="24" style="padding: 5px 0" :key="index">
              <van-col :span="4" style="padding: 31px 5px 0;">
                <van-checkbox :name="items.c_id" style="font-size: 15px"></van-checkbox>
              </van-col>
              <van-col :span="19" style="border-bottom: 1px solid #eee;padding-bottom: 3px">
                <!--<a :href="'#' + items.id" @click="openDetail(items.id)">-->
                <van-col :span="20">
                  <div class="time">
                    <!--<span class="title">姓名：{{items.user_id_link.name}}</span>-->
                    <span class="title">姓名：{{items.contact ? items.contact : '无'}}</span>
                    <!--<span class="label labelbgcolorno">无意向</span>-->
                    <!--<span class="label labelbgcolorhave">有意向</span>-->
                    <!--<span class="label labelbgcolornonet">未接通</span>-->
                    <!--<span class="label labelbgcolornull">空号</span>-->
                  </div>
                  <div class="time">
                    <span class="title">电话：{{items.mobile}}</span>
                  </div>
                  <div class="time">
                    <!--<span>&nbsp;20-30岁</span>-->
                    <span v-if="items.types === 1" class="title">类型：普通客户</span>
                    <span v-if="items.types === 2" class="title">类型：积极客户</span>
                    <span v-if="items.types === 3" class="title">类型：高价值客户</span>
                  </div>
                  <div class="time">
                    <span v-if="items.letter === 1" class="title">状态：有意向</span>
                    <span v-if="items.letter === 2" class="title">状态：无意向</span>
                    <span v-if="items.letter === 3" class="title">状态：空号</span>
                    <span v-if="items.letter === 4" class="title">状态：未接通</span>
                  </div>
                  <div class="time">
                    <!--<span>&nbsp;20-30岁</span>-->
                    <span v-if="items.follow === 1" class="title">意向：持续跟进</span>
                    <span v-if="items.follow === 2" class="title">意向：暂无意向</span>
                    <span v-if="items.follow === 3" class="title">意向：新转入</span>
                  </div>
                  <!--<div class="ages">-->
                  <!--&lt;!&ndash;<span>&nbsp;20-30岁</span>&ndash;&gt;-->
                  <!--<span>&nbsp;到店{{items.many}}次</span>-->
                  <!--<span>-->
                  <!--<span style="color: rgba(0,0,0,0.2);vertical-align: -4px"><icon name="mobile"/></span>-->
                  <!--&lt;!&ndash;<span style="color: rgba(0,0,0,0.6)">{{items.type?substrings(items.type):''}}</span>&ndash;&gt;-->
                  <!--</span>-->
                  <!--&lt;!&ndash;<div style="float: right;color: #eee;position: relative;top: -5px;"><icon name="angle-right" scale="1.5"/></div>&ndash;&gt;-->
                  <!--</div>-->
                  <!--<div class="lastdate">&nbsp;最后到店&nbsp;{{items.updated_at}}</div>-->
                </van-col>
                <!--</a>-->
                <van-col :span="4">
                  <div
                    class="i-telephone"
                    @click="getTelephone(items.id, items.mac)"
                    v-if="items.conversation === -1"
                  >
                    <icon name="phone" scale="1.6"/>
                  </div>
                  <div
                    class="i-telephone"
                    style="background-color:#999"
                    @click="getTelephone(items.id, items.mac)"
                    v-if="items.conversation === 1"
                  >
                    <icon name="phone" scale="1.6"/>
                  </div>
                </van-col>
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
          />全选
        </span>
        <span class="custom-cb-btn" @click="toggleSelectAll" v-if="allChecked">
          <van-icon
            name="checked"
            style="vertical-align: -4px;font-size: 18px;padding-right: 3px;color: rgb(107,189,45);"
          />全选
        </span>
        <span v-if="$route.params.id == 1" class="custom-cb-btn">预计: ￥{{(this.amount).toFixed(2)}}</span>
        <span v-if="$route.params.id == 2" class="custom-cb-btn">预计: ￥{{(this.amount).toFixed(2)}}</span>
        <!-- <van-checkbox v-model="allChecked" style="font-size: 15px">全选</van-checkbox> -->
      </van-col>
      <van-col span="6" style="padding: 5px">
        <van-button @click="close" class="sendmsgbtn" size="small" type="default">关闭</van-button>
      </van-col>
      <van-col span="6" style="padding: 5px">
        <van-button class="sendmsgbtn" size="small" @click="send" type="warning">发送({{count * msgpm.msgNumber}})</van-button>
      </van-col>
    </van-col>
  </div>
</template>
<script>
import { Row, Col, Checkbox, CheckboxGroup, Button, Dialog, Icon } from "vant";
export default {
  props: ["msgpm", "masgactive"],
  name: "sendMsgTpl",
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
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
      allResult: [], // 所有的
      kefu: 0,
      yx: 0,
      jindu: 0,
      url: "customer/remarks?",
      urlParmas: {
        customer_type: 0,
        type: 0,
        type_status: 0,
        pageSize: 8
      },
      count: 0,
      setting: {},
      amount: 0
    };
  },
  watch: {
    result: function(newValue, oldValue) {
      // console.info("new", newValue);
      // console.info("old", oldValue);
      this.allChecked = newValue.length >= this.allResult.length;
    },
    kefu: function() {
      this.page = 1;
      this.list = [];
      this.urlParmas.customer_type = this.kefu;
      this.getPepoleBag();
    },
    yx: function() {
      this.page = 1;
      this.list = [];
      this.urlParmas.type = this.yx;
      this.getPepoleBag();
    },
    jindu: function() {
      this.page = 1;
      this.list = [];
      this.urlParmas.type_status = this.jindu;
      this.getPepoleBag();
    }
    // allChecked: function() {
    //   // 监听是否全选
    //   if (this.allChecked) {
    //     this.result = this.allResult;
    //   } else {
    //     this.result = [];
    //   }
    // }
  },
  mounted(){
    this.$get("client/myinfo", '', res => {
      this.setting = res.data.setting;
    });
  },
  methods: {
    changeCheck(result){
      // console.log('result22222222222222222222:', result);
      this.count = result.length;
      // console.log('this.count:', this.count);
      if(Number(this.$route.params.id) === 1){
        this.amount = this.count * this.setting.sms * this.msgpm.msgNumber;
      } else if (Number(this.$route.params.id) === 2){
        this.amount = this.count * this.setting.sms * this.msgpm.msgNumber;
      }
    },
    toggleSelectAll() {
      console.log("1111111");
      this.allChecked = !this.allChecked;

      if (this.allChecked) {
        this.result = this.allResult;
        console.log('this.result:', this.result);
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
          // console.log('res:', res);
          if(res.data.code === 200){
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          } else {
            this.$status(res.data.msg)
          }
        });
      }
    },
    close() {
      this.$emit("close", false);
    },
    httpQuery(params, url) {
      var esc = encodeURIComponent;
      var query = Object.keys(params)
        .map(k => {
          if (Number(params[k]) && JSON.stringify(params[k]) !== "[]") {
            return esc(k) + "=" + esc(params[k]);
          } else {
            return null;
          }
        })
        .filter(function(val) {
          return !(!val || val === "");
        })
        .join("&");
      if (!url) {
        return query;
      } else {
        if (url.indexOf("?") > 0) {
          return url + "&" + query;
        } else {
          return url + "?" + query;
        }
      }
    },
    getPepoleBag() {
      // console.log('获取人群包');
      // 获取人群包
      this.$get(
        // this.httpQuery(this.urlParmas, this.url) + "&page=" + this.page,
        "client/customer?page=" +
        this.page + "&types=" + this.kefu + "&follow=" + this.jindu + "&letter=" + this.yx,
        "",
        res => {
          console.log("RES:", res);
          if (res.data.code === 200) {
            // console.info(0);
            if (this.page === 1) {
              this.list = [];
            }
            if (res.data.data.list.length === 0) {
              // console.info(11);
              this.hasData = 1;
            } else {
              // console.info(2222);
              for (let key in res.data.data.list) {
                this.list.push(res.data.data.list[key]);
                this.allResult.push(res.data.data.list[key].c_id);
              }

              // this.hasData = 1;
            }
          } else {
            this.hasData = 1;
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        }
      );
      // console.log('this.allResult:', this.allResult);
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
<style scoped>
.custom-cb-btn {
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
}

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
.title {
  color: #666;
}
.time {
  font-size: 12px;
  line-height: 12px;
  vertical-align: middle;
  color: #999;
  margin-bottom: 5px;
}
.select {
  color: #4588d4;
}
</style>
