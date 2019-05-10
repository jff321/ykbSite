<template>
  <div class="new-peoplepackage">
    <van-nav-bar title="创建匹配" @click-left="onClickLeft" left-arrow/>
    <div class="hor-form">
      <van-row>
        <van-col :span="24" class="form-group">
          <van-col :span="8">
            <span class="form-label">匹配名称</span>
          </van-col>
          <van-col :span="16" class="from-control">
            <input
              type="text"
              style="width:100%!important;text-align:right;line-height: 26px;border:none;"
              placeholder="输入"
              v-model="packageName"
            >
          </van-col>
        </van-col>
        <van-col :span="24" class="form-group">
          <div @click="showDevicePicker = true">
            <van-col :span="8">
              <span class="form-label">盒子</span>
            </van-col>
            <van-col :span="16" class="from-control">
              <span v-html="device.label">
                <span class="select-value">{{device.label || '请选择'}}</span>
              </span>
              <van-icon name="arrow" class="icon-wrap"/>
            </van-col>
          </div>
        </van-col>
        <van-col :span="24" class="form-group">
          <div @click="showDistancePicker = true">
            <van-col :span="8">
              <span class="form-label">距离范围</span>
            </van-col>
            <van-col :span="16" class="from-control">
              <span class="select-value">{{distance.label || '请选择'}}</span>
              <van-icon name="arrow" class="icon-wrap"/>
            </van-col>
          </div>
        </van-col>
        <van-col :span="24" class="form-group">
          <van-col :span="12">
            <span class="form-label">最短驻留时间 (分)</span>
          </van-col>
          <van-col :span="12" class="from-control">
            <input
              type="tel"
              style="width:100%!important;text-align:right;line-height: 26px;;border:none;"
              placeholder="0"
              value="0"
              v-model="shortMinutes"
            >
            <!-- <span class="select-value">选择</span>
            <van-icon name="arrow" class="icon-wrap"/>-->
          </van-col>
        </van-col>
        <van-col :span="24" class="form-group">
          <van-col :span="12">
            <span class="form-label">最长驻留时间 (分)</span>
          </van-col>
          <van-col :span="12" class="from-control">
            <input
              type="tel"
              style="width:100%!important;text-align:right;line-height: 26px;;border:none;"
              placeholder="不限"
              v-model="longMinutes"
            >
            <!-- <span class="select-value">选择</span>
            <van-icon name="arrow" class="icon-wrap"/>-->
          </van-col>
        </van-col>
        <van-col :span="24" class="form-group">
          <div @click="showBeginDatePicker = true;">
            <van-col :span="12">
              <span class="form-label">筛选日期 (起始)</span>
            </van-col>
            <van-col :span="12" class="from-control">
              <span class="select-value">{{beginDate || '请选择'}}</span>
              <van-icon name="arrow" class="icon-wrap"/>
            </van-col>
          </div>
        </van-col>
        <van-col :span="24" class="form-group">
          <div @click="showEndDatePicker = true;">
            <van-col :span="12">
              <span class="form-label">筛选日期 (结束)</span>
            </van-col>
            <van-col :span="12" class="from-control">
              <span class="select-value">{{endDate || '请选择'}}</span>
              <van-icon name="arrow" class="icon-wrap"/>
            </van-col>
          </div>
        </van-col>
        <van-col :span="24" class="form-group">
          <van-col :span="12">
            <span class="form-label">匹配过不再重复出现</span>
          </van-col>
          <van-col :span="12" class="from-control">
            <van-switch size="24px" active-color="#5d80fa" v-model="noRepeat"/>
          </van-col>
        </van-col>
      </van-row>
      <!-- <div class="match-result" v-show="!!calcMoney">
        <p class="pair-box">
          <span class="name">匹配数量:</span>
          <span class="value">{{calcTotal}}</span>
        </p>
        <p class="pair-box">
          <span class="name">预计扣费:</span>
          <span class="value">{{calcMoney}}</span>
        </p>
      </div>-->
    </div>
    <div class="bottom-bar">
      <van-row>
        <van-col :span="16">
          <!-- <div class="cancel-btn" @click="onClickLeft">取消</div> -->
          <div class="match-result">
            <p class="pair-box" style="margin-top: 3px;">
              <span class="name">匹配数量(约):</span>
              <span class="value">{{calcTotal}}</span>
            </p>
            <p class="pair-box" style="margin-top: 3px;">
              <span class="name">预计扣费:</span>
              <span class="value">{{calcMoney}}元</span>
            </p>
          </div>
        </van-col>
        <van-col :span="8">
          <!--<div class="confirm-btn" @click="create" :class="{disabled:!allowCreate}">创建</div>-->
          <van-button class="confirm-btn" @click="create" type="default" :disabled="isDisabled">创建</van-button>
        </van-col>
      </van-row>
    </div>

    <!-- 选择盒子 -->
    <van-actionsheet v-model="showDevicePicker">
      <van-picker
        ref="pickerDevice"
        id="pickerDevice"
        show-toolbar
        value-key="label"
        title="选择盒子"
        :columns="deviceData"
        @cancel="showDevicePicker = false;"
        @confirm="confirmDeviceSelect"
      />
    </van-actionsheet>

    <!-- 选择距离 -->
    <van-actionsheet v-model="showDistancePicker">
      <van-picker
        show-toolbar
        value-key="label"
        title="选择距离"
        :columns="distanceData"
        @cancel="showDistancePicker = false;"
        @confirm="confirmDistanceSelect"
      />
    </van-actionsheet>

    <van-actionsheet v-model="showBeginDatePicker">
      <van-datetime-picker
        v-model="beginCurrentDate"
        type="datetime"
        @cancel="showBeginDatePicker = false;"
        @confirm="confirmBeginDate"
      />
    </van-actionsheet>
    <van-actionsheet v-model="showEndDatePicker">
      <van-datetime-picker
        v-model="endCurrentDate"
        type="datetime"
        @cancel="showEndDatePicker = false"
        @confirm="confirmEndDate"
      />
    </van-actionsheet>
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
  Toast,
  Actionsheet,
  DatetimePicker,
  Picker,
  Switch,
  Popup,
  Button
} from "vant";

export default {
  name: "new",
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Switch.name]: Switch,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [Actionsheet.name]: Actionsheet,
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  data() {
    return {
      packageName: "",
      // device: {
      //   label: "全部",
      //   value: ""
      // },
      device: this.$store.state.device,
      distance: {
        label: "不限",
        value: "0"
      },
      calcTotal: "0",
      calcMoney: "0.00",
      shortMinutes: '',
      longMinutes: "",
      beginDate: "",
      endDate: "",
      beginCurrentDate: new Date(),
      endCurrentDate: new Date(),
      noRepeat: true,
      showBeginDatePicker: false,
      showEndDatePicker: false,
      showDevicePicker: false,
      deviceData: [
        {
          label: "全部",
          value: ""
        }
      ],
      showDistancePicker: false,
      distanceData: [
        {
          label: "不限",
          value: ""
        },
        {
          label: "50米内",
          value: "1"
        },
        {
          label: "30米内",
          value: "2"
        },
        {
          label: "10米内",
          value: "3"
        },
        {
          label: "5米内",
          value: "4"
        }
      ],
      isDisabled: false
    };
  },
  watch: {
    shortMinutes: "getTotal",
    longMinutes: "getTotal",
    device: "getTotal",
    distance: "getTotal",
    noRepeat: "getTotal",
    allDate: {
      handler: function(val) {
        console.log("allDate change: ", val);
        if (val.beginDate && val.endDate) {
          this.getTotal();
        }
      },
      deep: true
    }
  },
  computed: {
    allDate() {
      const { beginDate, endDate } = this;
      return { beginDate, endDate };
    },
    allowCreate() {
      let name = this.packageName.replace(/^\s+|\s+$/g, "");
      return parseInt(this.calcTotal) > 0 && name.length > 0;
    },
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    create() {
      // this.isDisabled = false;
      //   let that = this;
      //   console.log(this.notRepeat);
      if (!this.packageName || !this.beginDate || !this.endDate) {
        Toast({
          message: "匹配名称与开始结束时间不能为空",
          position: "top"
        });
        return;
      }
      if (parseInt(this.calcTotal) <= 0) {
        Toast({
          message: "匹配数量不够！不能创建",
          position: "top"
        });
        return;
      }
      // this.disabled = true;
      let params = {
        name: this.packageName,
        box_id: this.device.value === "-1" ? "" : this.device.value,
        range_id: this.distance.value,
        min_time: this.shortMinutes,
        // maxtime: !this.longMinutes ? "不限" : this.longTime * 60,
        max_time: this.longMinutes ? this.longMinutes : "",
        start_date: this.beginDate,
        end_date: this.endDate,
        repeat: this.noRepeat ? 1 : 0,
        y_nums: this.calcTotal,
        money: this.calcMoney
      };
      // console.log('this.distance.value:', this.distance.value);
      if (this.isDisabled) {
        return;
      }
      this.isDisabled = true;
      this.$post("client/domate", params, res => {
        // console.info(res);
        if (res.data.code === 200) {
          Dialog.alert({
            title: "提示",
            message: "创建成功"
          }).then(() => {
            this.$emit("pkgCreated");
            this.isDisabled = false;
            this.packageName = '';
            this.calcTotal = "0";
            this.calcMoney = "0.00元";
            this.device = {
              label: "全部",
              value: ""
            };
            this.distance = {
              label: "不限",
              value: ""
            };
            this.shortMinutes = 0;
            this.longMinutes = '';
            this.beginDate = '';
            this.endDate = '';
            this.noRepeat = true;
            this.onClickLeft();
          });
        } else {
          // console.log('进入else');
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.isDisabled = false;
          });
        }
      });
    },
    getTotal() {
      // console.log("123");
      this.calcTotal = "正在计算...";
      this.calcMoney = "正在计算...";

      // let time;
      // let mid;
      // if (this.device.value === "-1") {
      //   mid = "";
      // } else {
      //   mid = "&mid$=" + this.device.value;
      // }
      // let updated =
      //   "&updated_at$" + "=>=" + this.beginDate + ",<=" + this.endDate;
      // let rssi = "&rssi$=>=" + this.distance.value;
      //
      // let sTime = parseFloat(this.shortMinutes);
      // let lTime = parseFloat(this.longMinutes);
      // // console.log(sTime);
      // // console.log(lTime);
      //
      // if (isNaN(sTime) && !isNaN(lTime)) {
      //   time = "&time$=<=" + lTime * 60;
      // } else if (!isNaN(sTime) && isNaN(lTime)) {
      //   time = "&time$=>=" + sTime * 60;
      // } else if (!isNaN(sTime) && !isNaN(lTime)) {
      //   time = "&time$=>=" + sTime * 60 + ",<=" + lTime * 60;
      // }
      this.$get(
        "client/matenum?box_id=" + (this.device.value === "" ? "" : this.device.value) + "&range_id=" + this.distance.value + "&min_time=" + this.shortMinutes + "&max_time=" + (this.longMinutes ? this.longMinutes : "") + "&start_date=" + this.beginDate + "&end_date=" + this.endDate + "&repeat=" + (this.noRepeat ? 1 : 0),
        "",
        res => {
          if(res.data.code === 200) {
            this.total = res.data.data.count;
            // let total = res.data.data.count;
            this.calcTotal = res.data.data.count;
            this.calcMoney = res.data.data.total;
          } else {
            this.$status(res.data.msg);
          }
        }
      );
    },
    getDevices() {
      this.$get("client/getbox", "", res => {
        // console.log('RES：', res);
        if (res.data.code === 200) {
          const arr = res.data.data;
          arr.forEach(ele => {
            this.deviceData.push({
              label: ele.name + "&nbsp;&nbsp;&nbsp;"+ (ele.online ? '<span style="display: inline-block;width: 10px;height: 10px;background-color: #65B7AC;border-radius: 50%"></span>' : '<span style="display: inline-block;width: 10px;height: 10px;background-color: #999;border-radius: 50%"></span>'),
              value: ele.code
            });
          });
        } else {
          //   Dialog.alert({
          //     title: "提示",
          //     message: res.data.msg
          //   });
        }
      });
    },
    onClickLeft() {
      this.$emit("hidePopup");
    },
    confirmBeginDate() {
      this.beginDate = this.stampToDate(this.beginCurrentDate / 1000);
      this.showBeginDatePicker = false;
    },
    confirmEndDate() {
      this.endDate = this.stampToDate(this.endCurrentDate / 1000);
      this.showEndDatePicker = false;
    },
    confirmDeviceSelect(value) {
      this.device = value;
      // console.log('this.device:', this.device.label);
      this.$store.state.device = this.device;
      this.showDevicePicker = false;
    },
    confirmDistanceSelect(value) {
      this.distance = value;
      this.showDistancePicker = false;
    }
  }
};
</script>
<style scoped>
.new-peoplepackage {
  width: 100vw;
  height: 100vh;
  background: #fff;
  /*position: absolute;*/
}

.new-peoplepackage .van-popup {
  width: 100%;
  height: 100% !important;
}

.hor-form {
  /*height: calc(100% - 50px);*/
  overflow-y: auto;
  /*padding-bottom: 60px;*/
}

.form-group {
  padding: 15px;
  border-bottom: 0.5px solid #f1f1f1;
  font-size: 14px;
}

.match-result {
  width: 100%;
  padding: 5px 15px;
  font-size: 14px;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
  /* color: #999; */
}

.pair-box .name {
  font-size: 10px;
  color: #666;
}

.pair-box .value {
  color: #4588d4;
}

.form-label {
  color: #333;
}

.from-control {
  text-align: right;
  color: #999;
  font-size: 14px;
}

.form-label {
  line-height: 30px;
  vertical-align: middle;
}

.from-control .select-value,
.from-control .icon-wrap {
  line-height: 30px;
  vertical-align: middle;
}

.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  /*line-height: 40px;*/
  z-index: 100;
  background: rgb(244, 245, 246);
}

.cancel-btn,
.confirm-btn {
  text-align: center;
  font-size: 14px;
  line-height: 50px;
  width: 100%;
  height: 50px;
}
.confirm-btn {
  background: #4588d4;
  color: #fff;
}

.confirm-btn.disabled {
  background: #4588d4;
  opacity: 0.5;
}
</style>


