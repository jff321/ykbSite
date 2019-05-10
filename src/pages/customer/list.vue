<template>
  <div class="customers">
    <div class="customer" v-for="(items,index) in list" :key="index" @click="postMac(items.mac_id)">
      <div class="customer-inner">
        <van-row>
          <van-col :span="16">
            <div class="info-wrap">
              <span
                class="custom-type"
                v-if="items.types === 1"
                :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
              >普通客户</span>
              <span
                class="custom-type"
                v-if="items.types === 2"
                :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
              >积极客户</span>
              <span
                class="custom-type"
                v-if="items.types === 3"
                :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
              >高价值客户</span>
              <span
                class="mobile-name"
              >{{items.mobile}}</span>
            </div>
            <p class="other-info">
              <span class="label">负责人:</span>
              <span class="value">{{items.contact || '无'}}</span>
            </p>
            <p class="other-info">
              <span class="label">备&emsp;注:</span>
              <span class="value">{{items.remark || '无'}}</span>
            </p>
            <p class="other-info">
              <span class="label">意&emsp;向:</span>
              <span v-if="items.letter === 1" class="value">意向</span>
              <span v-if="items.letter === 2" class="value">无意向</span>
              <span v-if="items.letter === 3" class="value">空号</span>
              <span v-if="items.letter === 4" class="value">未接通</span>
            </p>
          </van-col>
          <van-col :span="8">
            <div
              v-if="items.follow === 1"
              class="follow-state"
              :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
            >持续跟进</div>
            <div
              v-if="items.follow === 2"
              class="follow-state"
              :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
            >暂无意向</div>
            <div
              v-if="items.follow === 3"
              class="follow-state"
              :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
            >新转入</div>
            <div class="actions">
              <span @click.stop="sendFlash(items.phone)" v-if="isShow" class="icon-wrap">
                <img src="./imgs/flash.png" alt style="width: 20px;height: 20px;">
              </span>
              <span @click.stop="sendMessage(items.phone)" class="icon-wrap" v-if="isShow">
                <img src="./imgs/message.png" style="width: 20px;height: 20px;" alt>
              </span>
              <span
                @click.stop="getTelephone(items.phone, items.c_id)"
                class="icon-wrap"
                v-if="isShow"
              >
                <img src="./imgs/telephone.png" style="width: 20px;height: 20px;" alt>
              </span>
              <span class="create-time" v-if="!isShow">{{items.created_at}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- <table class="table">
      <tr v-for="(items,index) in list" :key="index" class="customer">
        <td class="avatar-wrap">
          <div class="avatar"></div>
        </td>
        <td class="content-wrap" @click="postMac(items.mac)">
          <van-row>
            <van-col :span="16">
              <div class="info-wrap">
                <p class="mobile">{{tel(items.phone?items.phone:'********')}}</p>
                <p class="summary"><span class="dd-times">到店次数 4</span><span class="device">HUAWEI</span></p>
                <p class="time">到店时间 2018-11-12 21:35:38</p>
              </div>
            </van-col>
            <van-col :span="8">
              <div class="actions">
                <span @click.stop="sendFlash(items.phone)"
                  v-if="isShow" class="icon-wrap"><img src="./imgs/flash.png" alt="" width="20"></span>
                <span @click.stop="sendMessage(items.phone)"
                  class="icon-wrap"
                  v-if="isShow">
                  <img src="./imgs/message.png" width="20" alt=""></span>
                <span @click.stop="getTelephone(items.phone, items.mac)" class="icon-wrap" v-if="isShow">
                  <img src="./imgs/telephone.png" width="20" alt="">
                </span>
              </div>
            </van-col>
          </van-row>
        </td>
      </tr>
    </table>-->
  </div>
  <!-- <div>
      <template v-for="(items, index) in list">
        <van-row>
          <van-col :span="24">
            <div @click="postMac(items.mac)">
              <van-col :span="24" class="customer-title">
                <van-col :span="18"><span class="customer-people">{{items.customer_type_link}}</span><span class="customer-status">{{items.type_status_link}}</span></van-col>
                <van-col :span="6" class="textalignr">
                  <van-icon name="arrow" class="icon-arrow" v-if="isShow"/>
                </van-col>
              </van-col>
            </div>
            <van-col :span="24" class="p18">
              <van-col :span="8">
                <div @click="postMac(items.mac)">
                  <van-col :span="24"  class="commonpadding"><span class="commonattribute-title">客户: </span><span class="commonattribute-name">{{items.user}}</span></van-col>
                  <van-col :span="24"  class="commonpadding"><span class="commonattribute-title">备注: </span><span class="commonattribute-name ellipsis">{{items.remarks}}</span></van-col>
                </div>
              </van-col>
              <van-col :span="9">
                <div @click="postMac(items.mac)">
                  <van-col :span="24"  class="commonpadding"><span class="commonattribute-title">负责人: </span><span class="commonattribute-name">{{items.charge}}</span></van-col>
                  <van-col :span="24"  class="commonpadding"><span class="commonattribute-title">手机号: </span><span class="commonattribute-name">{{tel(items.phone?items.phone:'********')}}</span></van-col>
                </div>
              </van-col>
              <van-col :span="7" style="height: 55px;display: flex;justify-content: space-between;align-items: center;padding-left: 15px">
                <div @click="sendFlash(items.phone)"  v-if="isShow"><img src="./imgs/flash.png" alt="" style="width: 22px;"></div>
                <div @click="sendMessage(items.phone)"  v-if="isShow"><img src="./imgs/message.png" alt="" style="width: 22px;"></div>
                <div @click="getTelephone(items.phone, items.mac)" v-if="isShow"><img src="./imgs/telephone.png" style="width: 22px;" alt=""></div>
              </van-col>
            </van-col>
          </van-col>
        </van-row>
        <div class="borderBar"></div>
      </template>
  </div>-->
</template>

<script>
import { Row, Col, Icon, Popup } from "vant";
export default {
  name: "list",
  props: ["lists", "isshow"],
  data() {
    return {
      list: []
    };
  },
  watch: {
    lists: function(newValue) {
      console.info("传输的list", newValue);
      this.list = newValue;
    }
  },
  methods: {
    sendFlash(value) {
      // console.log(ev);
      this.$emit("showModel", { isShowFlash: true, type: 2, phone: value });
    },
    sendMessage(value) {
      // console.log(ev);
      this.$emit("showModel", { isShowFlash: true, type: 1, phone: value });
    },
    postMac(value) {
      this.$emit("showmac", { id: value });
    },
    getTelephone(value1, value2) {
      this.$emit("showmac", { phone: value1, id: value2 });
    }
  },
  mounted() {
    this.isShow = this.isshow;
  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Icon.name]: Icon
  }
};
</script>

<style scoped>
.customer {
  padding-left: 15px;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
}

.customer-inner {
  border-bottom: 0.5px solid #eee;
  padding: 10px 15px 10px 0;
}

.info-wrap {
  margin-bottom: 5px;
}

.info-wrap .custom-type {
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  vertical-align: middle;
  color: white;
  border-radius: 2px;
  padding: 5px;
}

.info-wrap .custom-type.typecolor1 {
  background: rgb(120, 120, 120);
}

.info-wrap .custom-type.typecolor2 {
  background: #f6a623;
}

.info-wrap .custom-type.typecolor3 {
  background: #d0011b;
}

.info-wrap .mobile-name {
  display: inline-block;
  font-size: 14px;
  color: #333;
  line-height: 18px;
  vertical-align: middle;
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.other-info {
  font-size: 0px;
  /* color: #999; */
}

.other-info .label {
  font-size: 12px;
  color: #999;
}
.other-info .value {
  font-size: 12px;
  padding-left: 5px;
  color: #666;
}

.follow-state {
  font-size: 14px;
  font-weight: 700;
  text-align: right;
  margin: 3px 0 15px;
}

.follow-state.statecolor1 {
  color: #4588d4;
}

.follow-state.statecolor2 {
  color: #d0011b;
}

.follow-state.statecolor3 {
  color: #7fb762;
}

/* .customer .table {
  width: 100%;
}

.customer .table tr {
  margin: 0;
  padding: 0;
}

.customer .table td {
  vertical-align: middle;
}

.customer .avatar-wrap {
  width: 70px;
  /* text-align: center; */
/*}*/
/*.customer .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url("./imgs/head.png");
  background-repeat: no-repeat;
  background-origin: center center;
  background-size: 100% 100%;
  margin: 0 auto;
}

.customer .content-wrap {
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
}

.info-wrap .mobile {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.info-wrap .summary,
.info-wrap .time {
  font-size: 10px;
  color: #999;
}

.summary .dd-times {
  padding-right: 5px;
} */

.customer .actions {
  font-size: 0;
  /* padding-right: 15px; */
  text-align: right;
  /* margin-top: 18px; */
  /* height: 58px; */
  /* line-height: 58px; */
}

.actions .icon-wrap {
  display: inline-block;
  padding-left: 5px;
  /* margin-top: 19px; */
  /* line-height: 30px; */
}

/* .borderBar {
  width: 100%;
  height: 5px;
  background-color: #ececec;
  border-top: 1px solid #ccc;
}
.p18 {
  padding: 0 18px 0 28px;
}
.textalignr {
  text-align: right;
}
.i-telephone {
  position: absolute;
  top: 15px;
  right: 0;
  color: #fff;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 46px;
  color: rgba(255, 255, 255, 0.8);
  background-color: #65b7ac;
  border-radius: 50%;
  transform: rotateY(180deg);
}
.customer-title {
  padding: 0 18px;
  line-height: 32px;
  border-bottom: 1px solid #dfdfdf;
}
.customer-people {
  font-size: 15px;
  color: #333;
}
.customer-status {
  padding-left: 10px;
  font-size: 12px;
  color: #999;
}
.icon-arrow {
  font-size: 12px;
  vertical-align: -1px;
  color: #999;
}
.commonattribute-name {
  color: #999;
  font-size: 12px;
}
.commonattribute-title {
  color: #000;
  font-size: 12px;
}
.commonpadding {
  padding: 4px 0;
} */
</style>
