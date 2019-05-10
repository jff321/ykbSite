<template>
  <div class="people">
    <van-nav-bar
      title="客户标记"
      left-arrow
      @click-left="onClickLeft"
    />
    <scroller style="padding-top: 50px;">
      <div class="people-header">
        <div class="header-img" style="color:#CACED4">
          <icon name="user-circle" scale="4.5"/>
        </div>
        <div class="header-tel">{{tel(phone?phone:'*******')}}</div>
        <!--<div class="header-date">到店7次</div>-->
        <div class="header-date">最后探测 {{update}}</div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;" v-if="!showAdd">
        <button class="confirmBtn" @click="addCustomer">添加标记</button>
      </div>

      <div class="box-wrap" v-if="showAdd">
        <div class="splitor"></div>
        <h2 class="title">添加标记</h2>
        <div class="tag-form-wrap">
          <div class="equipment-list">
            <div class="fixed-label">意向</div>
            <div class="equipment-input flex-buttons">
              <div
                class="custom-single-button"
                :class="{active:type == 1}"
                @click="selectRadio(1)"
              >有意向</div>
              <div
                class="custom-single-button"
                :class="{active:type == 2}"
                @click="selectRadio(2)"
              >无意向</div>
              <div
                class="custom-single-button"
                :class="{active:type == 3}"
                @click="selectRadio(3)"
              >空号</div>
              <div
                class="custom-single-button"
                :class="{active:type == 4}"
                @click="selectRadio(4)"
              >未接通</div>
            </div>
          </div>
          <div class="equipment-list">
            <div class="fixed-label">客户姓名</div>
            <div class="equipment-input">
              <input type="text" placeholder="输入客户姓名" v-model="customerName">
            </div>
          </div>
          <div class="equipment-list">
            <div class="fixed-label">负责人</div>
            <div class="equipment-input">
              <input type="text" placeholder="输入负责人姓名" v-model="headerName">
            </div>
          </div>
          <div class="equipment-list">
            <div class="fixed-label">客户类型</div>
            <div class="equipment-input">
              <select name id="stype" v-model="selectType">
                <option value="1">普通客户</option>
                <option value="2">积极客户</option>
                <option value="3">高价值客户</option>
              </select>
            </div>
          </div>
          <div class="equipment-list">
            <div class="fixed-label">跟进状态</div>
            <div class="equipment-input">
              <select name id="sstatus" v-model="selectStatus">
                <option value="1">持续跟进</option>
                <option value="2">暂无意向</option>
                <option value="3">新转入</option>
              </select>
            </div>
          </div>
          <div class="equipment-list" style="justify-content: normal">
            <div class="fixed-label">备注</div>
            <div class="equipment-input">
              <input type="text" placeholder="输入备注信息" v-model="note">
            </div>
          </div>
          <div style="text-align: center;padding-bottom: 20px">
            <button class="confirmBtn" @click="submitForm">确定</button>
          </div>
        </div>
      </div>

      <div class="splitor"></div>
      <div class="box-wrap">
        <h2 class="title">历史标记</h2>
        <div class="tag-histories">
          <div class="tag-wrap" v-for="(items,index) in list" :key="index">
            <div class="tag">
              <div class="time">{{items.create_time}}</div>
              <van-row>
                <van-col :span="12">
                  <div class="info-box">
                    <span
                      v-if="items.types === 1"
                      class="customer-type"
                      :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
                    >普通客户</span>
                    <span
                      v-if="items.types === 2"
                      class="customer-type"
                      :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
                    >积极客户</span>
                    <span
                      v-if="items.types === 3"
                      class="customer-type"
                      :class="{typecolor1:items.types === 1, typecolor2:items.types === 2, typecolor3:items.types === 3}"
                    >高价值客户</span>
                    <p class="key-value">
                      <span class="label">客户姓名</span>
                      <span class="value">{{items.uname || '无'}}</span>
                    </p>
                  </div>
                </van-col>
                <van-col :span="12">
                  <div class="info-box right">
                    <span
                      v-if="items.follow === 1"
                      class="follow-type"
                      :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
                    >持续跟进</span>
                    <span
                      v-if="items.follow === 2"
                      class="follow-type"
                      :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
                    >暂无意向</span>
                    <span
                      v-if="items.follow === 3"
                      class="follow-type"
                      :class="{statecolor1:items.follow === 1,statecolor2:items.follow === 2,statecolor3:items.follow === 3}"
                    >新转入</span>
                    <p class="key-value">
                      <span class="label">负责人</span>
                      <span class="value">{{items.contact || '无'}}</span>
                    </p>
                  </div>
                </van-col>
              </van-row>
              <div class="memo-wrap">备注:&nbsp;{{items.remark || '无'}}</div>
            </div>
          </div>
          <!-- <customer-list :lists="list" :isshow="false"></customer-list> -->
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Col, Row, Icon, Field, NavBar, Dialog } from "vant";
export default {
  name: "detail",
  props: ["mac", "showbiaoji"],
  data() {
    return {
      showAdd: false,
      list: [],
      selectType: "1", // 客户类型
      selectStatus: "1", // 跟进状态
      usermac: "", // 客户mac值
      type: "1", // 有无意向
      note: "", // 备注
      customerName: "", // 客户名
      headerName: "", // 负责人
      phone: null, // 手机号
      many: null, // 到店次数
      update: null // 最后探测时间
    };
  },
  watch: {
    mac: function(newValue) {
      console.info("mac111111", newValue);
      this.usermac = newValue;
      if (this.usermac.length > 0) {
        this.getDataList();
      }
    }
  },
  mounted(){
  },
  methods: {
    onClickLeft() {
      // console.log("11111111########");
      history.back();
      this.customerName = "";
      this.headerName = "";
      this.note = "";
      this.list = [];
      this.showAdd = false;
      this.phone = null;
      this.update = null;
    },
    getDataList() {
      // if(this.usermac === 0){
      //   return false
      // }
      this.$get("client/cinfo?id=" + this.usermac, "", res => {
        // console.info("信息详情", res);
        if (res.data.code === 200) {
          if (res.data.data.length === 0) {
            // console.log("没有历史");
            this.showAdd = true;
            this.list = [];
            this.phone = null;
            this.update = null;
          } else {
            this.showAdd = false;
            this.list = res.data.data.list;
            this.type = res.data.data.list[0].letter;
            this.customerName = res.data.data.list[0].uname;
            this.headerName = res.data.data.list[0].contact;
            this.selectType = res.data.data.list[0].types;
            this.selectStatus = res.data.data.list[0].follow;
            this.note = res.data.data.list[0].remark;
            this.phone = res.data.data.info.mobile;
            this.update = res.data.data.list[0].create_time;
          }
        } else {
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          });
        }
      });
    },
    addCustomer() {
      this.showAdd = true;
    },
    submitForm() {
      let phone;
      if(this.$store.state.dialedPhone === 'null'){
        phone = localStorage.getItem('telephone')
      } else {
        phone = this.$store.state.dialedPhone
      }
      let params = {
        id: Number(this.usermac),
        types: this.selectType,
        letter: this.type,
        uname: this.customerName,
        contact: this.headerName,
        follow: this.selectStatus,
        remark: this.note,
        phone: phone
      };
      // console.info("传的参数", params);
      this.$post("client/dotags", params, res => {
        if (res.data.code === 200) {
          // console.log('*********************************');
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.getDataList();
          });
          // this.$emit('showUserTagPopus', false);
        } else {
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          });
        }
      });
    },
    selectRadio(value) {
      switch (value) {
        case 1:
          this.type = "1";
          break;
        case 2:
          this.type = "2";
          break;
        case 3:
          this.type = "3";
          break;
        case 4:
          this.type = "4";
          break;
      }
    }
  },
  components: {
    customerList: function(resolve) {
      require(["../../customer/list.vue"], resolve);
    },
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Row.name]: Row,
    [Col.name]: Col,
    [Dialog.name]: Dialog,
    [NavBar.name]: NavBar
  }
};
</script>
<style>
.people select {
  /*-webkit-appearance: none;*/
  /*appearance: none;*/
  height: 30px;
  line-height: 30px;
  text-align: center;
  text-align-last: center;
  width: 60%;
  padding: 0 2%;
  color: #666;
  /* border: 1px solid #eee; */
  border: none;
  margin-left: 50px;
  border-radius: 5px;
  background-color: #fff;
}
</style>
<style scoped>
.splitor {
  height: 10px;
  background: rgb(247, 247, 247);
}
.box-wrap .title {
  font-size: 16px;
  color: #333;
  text-align: center;
  padding: 10px;
  border-bottom: 0.5px solid #eee;
}
.people {
  overflow: hidden;
}
input::-ms-input-placeholder {
  text-align: right;
}
input::-webkit-input-placeholder {
  text-align: right;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tel-label {
  font-size: 15px;
  padding: 10px 0 20px;
  text-align: center;
}
.people-header {
  width: 100%;
  padding-bottom: 10px;
  overflow: hidden;
}
.header-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  padding: 8px;
  text-align: center;
  overflow: hidden;
  margin: 0px auto;
  background-color: rgba(255, 255, 255, 0.1);
}
.header-tel {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
}
.header-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin: 3px 0 5px;
  text-align: center;
}
.equipment {
  padding: 0 10px;
}
.equipment-list {
  /* margin-top: 2px; */
  padding: 15px;
  display: flex;
  background-color: #fff;
  /* justify-content: space-between; */
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  /* position: relative; */
}

.equipment-list .flex-buttons {
  /* display: flex; */
  text-align: right;
  /* background: red; */
}

.flex-buttons .custom-single-button {
  /* flex: 1; */
  display: inline-block;
  /* width: 80px; */
  width: 50px;
  padding: 5px 0;
  text-align: center;
  margin-left: 5px;
  background: rgb(244, 245, 246);
  /* padding: 5px; */
  font-size: 12px;
  border-radius: 2px;
  color: #666;
}

.flex-buttons .custom-single-button.active {
  background: /*#5d80fa*/ #4588d4;
  color: #fff;
}

.equipment-list .fixed-label {
  flex: 0 1 80px;
  width: 80px;
  line-height: 30px;
}
.equipment-list .equipment-input {
  flex: 1;
  /* padding-left: 15px; */
  width: calc(100% - 80px);
  text-align: right;
}
.equipment-input input,
.equipment-input select {
  text-align: right;
  border: none;
  line-height: 30px;
}
.label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  padding: 0px 8px;
  border-radius: 2px;
  margin: 0 0 0 5px;
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
.singleradio {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin: 5px auto 0;
  overflow: hidden;
}
.radiobgcolor {
  background-color: #ddd;
}
.circlebgcolor {
  background-color: rgba(255, 255, 255, 0.5);
}
.radioselect {
  background-color: #587ecc;
}
.circleselect {
  background-color: rgba(255, 255, 255, 1);
}
.circle {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin: 5px auto 0;
}
.confirmBtn {
  background-color: #4588d4;
  border: none;
  border-radius: 3px;
  height: 35px;
  width: 80%;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 20px;
}

.tag-wrap {
  padding-left: 15px;
}

.tag-wrap .tag {
  border-bottom: 0.5px solid #eee;
  padding: 15px 15px 15px 0;
}

.tag .time {
  font-size: 12px;
  color: #333;
}

.tag .info-box {
  text-align: left;
}

.tag .info-box.right {
  text-align: right;
}

.tag .customer-type,
.tag .follow-type {
  font-size: 12px;
  margin: 5px 0;
  display: inline-block;
  vertical-align: middle;
  line-height: 12px;
  padding: 5px;
  border-radius: 2px;
  /* background: red; */
}

.tag .customer-type.typecolor1 {
  background: rgb(120, 120, 120);
  color: #fff;
}

.tag .customer-type.typecolor2 {
  background: #f6a623;
  color: #fff;
}

.tag .customer-type.typecolor3 {
  background: #d0011b;
  color: #fff;
}

.tag .follow-type.statecolor1 {
  color: /*#5d80fa;*/ #4588d4;
  border: 0.5px solid #5d80fa;
}

.tag .follow-type.statecolor2 {
  color: #d0011b;
  border: 0.5px solid #d0011b;
}

.tag .follow-type.statecolor3 {
  color: #7fb762;
  border: 0.5px solid #7fb762;
}

.key-value {
  font-size: 0;
}

.key-value .label {
  font-size: 12px;
  color: #999;
  padding: 0 !important;
  margin: 0 !important;
}

.key-value .value {
  font-size: 12px;
  color: #666;
  padding-left: 5px;
}

.memo-wrap {
  font-size: 10px;
  background: #f6f6f6;
  padding: 5px;
  color: #999;
  margin-top: 5px;
}
.people .van-nav-bar{
  background-color: #4b8edd;
  color: #fff;
}
.van-icon-arrow::before{
  color: white;
}
</style>
