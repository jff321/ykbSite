<template>
  <div class="people">
    <van-nav-bar title="客户标记" left-arrow @click-left="onClickLeft"/>
    <div class="people-header">
      <div class="header-img" style="color:#CACED4">
        <icon name="user-circle" scale="4.5"/>
      </div>
      <div class="header-tel">{{tel(phone?phone:'*******')}}</div>
      <!--<div class="header-date">到店7次</div>-->
      <div class="header-date">最后探测 {{update}}</div>
    </div>
    <div style="text-align: center" v-if="!showAdd">
      <button class="confirmBtn" @click="addCustomer">添加标记</button>
    </div>
    <div class="equipment" v-if="showAdd">
      <div class="equipment-list">
        <div>意向</div>
        <div style="display: flex;position: absolute;right: 0px;bottom: 5px;">
          <div @click="selectRadio(1)">
            <div>
              <span class="label labelbgcolorhave">有意向</span>
            </div>
            <div class="singleradio radiobgcolor" :class="{radioselect:type == 1}">
              <div class="circle circlebgcolor" :class="{circleselect:type == 1}"></div>
            </div>
          </div>
          <div @click="selectRadio(2)">
            <div>
              <span class="label labelbgcolorno">无意向</span>
            </div>
            <div class="singleradio radiobgcolor" :class="{radioselect:type == 2}">
              <div class="circle circlebgcolor" :class="{circleselect:type == 2}"></div>
            </div>
          </div>
          <div @click="selectRadio(3)">
            <div>
              <span class="label labelbgcolornull">空号</span>
            </div>
            <div class="singleradio radiobgcolor" :class="{radioselect:type == 3}">
              <div class="circle circlebgcolor" :class="{circleselect:type == 3}"></div>
            </div>
          </div>
          <div @click="selectRadio(4)">
            <div>
              <span class="label labelbgcolornonet">未接通</span>
            </div>
            <div class="singleradio radiobgcolor" :class="{radioselect:type == 4}">
              <div class="circle circlebgcolor" :class="{circleselect:type == 4}"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="equipment-list" style="justify-content: normal">
        <div>客户姓名</div>
        <div class="equipment-input">
          <input type="text" placeholder="输入客户姓名" v-model="customerName">
        </div>
      </div>
      <div class="equipment-list" style="justify-content: normal">
        <div>负责人</div>
        <div class="equipment-input">
          <input type="text" placeholder="输入负责人姓名" v-model="headerName">
        </div>
      </div>
      <div class="equipment-list" style="justify-content: normal">
        <div style="line-height: 30px">类型:</div>
        <div class="equipment-input">
          <select name id="stype" v-model="selectType">
            <!--<option value="0" disabled>全部客户类型</option>-->
            <option value="1">普通客户</option>
            <option value="2">积极客户</option>
            <option value="3">高价值客户</option>
          </select>
        </div>
      </div>
      <div class="equipment-list" style="justify-content: normal;">
        <div style="line-height: 30px">跟进状态:</div>
        <div class="equipment-input">
          <select name id="sstatus" v-model="selectStatus">
            <!--<option value="0" disabled>全部跟进状态</option>-->
            <option value="1">持续跟进</option>
            <option value="2">暂无意向</option>
            <option value="3">新转入</option>
          </select>
        </div>
      </div>
      <div class="equipment-list" style="justify-content: normal">
        <div>备注</div>
        <div class="equipment-input">
          <input type="text" placeholder="输入备注信息" v-model="note">
        </div>
      </div>
      <div style="text-align: center;padding-bottom: 20px">
        <button class="confirmBtn" @click="submitForm">确定</button>
      </div>
    </div>
    <div style="font-size: 16px;text-align: center;padding-top: 20px" v-if="list.length">
      <strong>历史标记</strong>
    </div>
    <customer-list :lists="list" :isshow="false"></customer-list>
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
      console.info("mac", newValue);
      this.usermac = newValue;
      if (this.usermac.length > 0) {
        this.getDataList();
      }
    }
  },
  methods: {
    onClickLeft() {
      console.log("11111111########");
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
      this.$get("customer/remarks?mac=" + this.usermac, "", res => {
        console.info("信息详情", res);
        if (res.data.status === 1) {
          if (res.data.data.length === 0) {
            console.log("没有历史");
            this.showAdd = true;
            this.list = [];
            this.phone = null;
            this.update = null;
          } else {
            this.showAdd = false;
            this.list = res.data.data;
            this.type = res.data.data[0].type;
            this.customerName = res.data.data[0].user;
            this.headerName = res.data.data[0].charge;
            this.selectType = res.data.data[0].customer_type;
            this.selectStatus = res.data.data[0].type_status;
            this.note = res.data.data[0].remarks;
            this.phone = res.data.data[0].phone;
            this.update = res.data.data[0].updated_at;
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
      let params = {
        user: this.customerName,
        charge: this.headerName,
        remarks: this.note,
        customer_type: this.selectType,
        type_status: this.selectStatus,
        mac: this.usermac,
        type: this.type
      };
      console.info("传的参数", params);
      this.$post("customer/remarks", params, res => {
        if (res.data.status === 1) {
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
  border: 1px solid #eee;
  margin-left: 50px;
  border-radius: 5px;
  background-color: #fff;
}
</style>
<style scoped>
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
  margin-top: 2px;
  padding: 10px 0px;
  display: flex;
  /*background-color: #fff;*/
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.equipment-input {
  flex: 1;
}
.equipment-input input {
  position: relative;
  top: -1px;
  width: 100%;
  margin-left: 20px;
  padding-right: 20px;
  border: none;
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
</style>
