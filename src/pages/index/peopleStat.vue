<template>
  <div class="people-stat-wrap">
    <!--<div style="display: flex;justify-content: center">-->
      <!--<van-notice-bar-->
        <!--text="尊敬的客户您好，春节将至，本公司于2019年1月26日-2019年2月11日放假。2019年2月12日（正月初八）正常上班。如给您带来不便，敬请谅解！"-->
        <!--style="width: calc(100% - 30px);border-radius: 5px;"-->
      <!--/>-->
    <!--</div>-->
    <div class="people-stat">
      <div class="people-card">
        <div class="today-stat">
          <p class="name">今日访客（人）</p>
          <p class="lg-digit">{{globalStats.total_count | formatWan}}</p>
          <span class="real-man-btn" @click="toggleRealPeople();">实时客流</span>
        </div>
        <div class="other-stats">
          <!--<div class="stat-item total">-->
            <!--<p class="xl-name">总客流</p>-->
            <!--<p class="digit">{{globalStats.totalCount | formatWan}}</p>-->
          <!--</div>-->
          <div class="stat-item new">
            <p class="xl-name">新客户</p>
            <p class="digit">{{globalStats.new_count | formatWan}}</p>
          </div>
          <div class="stat-item">
            <p class="xl-name">老客户</p>
            <p class="digit">{{globalStats.back_count | formatWan}}</p>
          </div>
        </div>
      </div>
      <div class="dropdown-menu">
        <van-row class="pr5">
          <van-col :span="24">
            <div class="select">
              <select name id="type" v-model="myVal" @change="searchDay(myVal)">
                <option v-for="item in options" :value="item.value">{{item.name}}</option>
              </select>
            </div>
          </van-col>
        </van-row>
      </div>
      <!--<div class="people-graph box">-->
        <!--<h2 class="title">近7天新老客户对比分析</h2>-->
        <!--<ve-line :data="chartData" :extend="lineExtend"></ve-line>-->
      <!--</div>-->
    </div>
    <!--<div class="splitor"></div>-->
    <!--<div class="df-times box">-->
      <!--<h2 class="title">近7天客户到访次数</h2>-->
      <!--<ve-line :data="dfTimesData" :settings="lineSettings" :extend="lineExtend2"></ve-line>-->
    <!--</div>-->
    <!--<div class="splitor"></div>-->
    <!--<div class="zd-duration box">-->
      <!--<h2 class="title">近7天新老客户驻店时长对比分析</h2>-->
      <!--<ve-histogram :data="zdChartData" :extend="barExtend"></ve-histogram>-->
    <!--</div>-->
    <div class="chartBox">
      <p class="tag">性别比例</p>
      <ve-ring :data="sexRatioData" :extend="sexRatio"></ve-ring>
    </div>
    <div class="chartBox">
      <p class="tag">年龄比例</p>
      <ve-histogram :data="ageRatioData" :extend="ageRatio"></ve-histogram>
    </div>
    <div class="chartBox">
      <p class="tag">汽车</p>
      <ve-ring :data="carData" :extend="car"></ve-ring>
    </div>
    <div class="chartBox">
      <p class="tag">子女状况</p>
      <ve-pie :data="kidsData" :extend="kids"></ve-pie>
    </div>
    <div class="chartBox">
      <p class="tag">手机品牌占比</p>
      <ve-pie :data="phoneData" :extend="phone"></ve-pie>
    </div>
    <div class="chartBox">
      <p class="tag">设备特性</p>
      <ve-histogram :data="equipmentData" :extend="equipment"></ve-histogram>
    </div>
    <div class="chartBox" style="padding-left: 1px;">
      <p class="tag">设备价格</p>
      <ve-pie :data="priceData" :extend="price"></ve-pie>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import VeLine from "v-charts/lib/line.common";
import VeHistogram from "v-charts/lib/histogram.common";
import VeRing from "v-charts/lib/ring.common";
import VePie from "v-charts/lib/pie.common";
import { Toast, Row, Col, NoticeBar } from "vant";
Vue.use(Row).use(Col);
Vue.use(NoticeBar);

export default {
  name: "people-stat",
  components: {
    [VeLine.name]: VeLine,
    [VeHistogram.name]: VeHistogram,
    [VeRing.name]: VeRing,
    [VePie.name]: VePie
  },
  filters: {
    formatWan: function(value) {
      // console.log('value:', value);
      if (!value || value === "NULL") return "--";
      value = parseInt(value);
      if (isNaN(value)) return "--";

      if (value < 10000) return value;
      if (value >= 100000000) return `${(value / 100000000.0).toFixed(2)}亿`;
      return `${(value / 10000.0).toFixed(1)}万`;
    }
  },
  data() {
    this.lineExtend = {
      series: {
        smooth: false
      },
      legend: {
        // orient: 'vertical',
        left: "left",
        formatter: function(name) {
          // console.log(name);
          if (name === "new") return "新客户";
          if (name === "old") return "老客户";
          return name;
        }
      },
      tooltip: {
        formatter: function(params, ticket, callback) {
          let date = params[0].value[0];

          let content = `${date}<br />新客户: ${
            params[0].value[1]
          }<br/>老客户: ${params[1].value[1]}`;
          // callback(ticket, content);
          return content;
        }
      },
      axisPointer: {
        lineStyle: {
          type: "dashed"
        }
      },
      color: ["rgb(93,157,205)", "rgb(165,182,90)"],
      yAxis: {
        position: "right",
        splitLine: {
          lineStyle: {
            type: "dashed"
          }
        }
      }
    };
    this.lineExtend2 = {
      legend: {
        // orient: 'vertical',
        left: "left",
        formatter: function(name) {
          if (name === "count") return "到访次数";
          return name;
        }
      },
      axisPointer: {
        lineStyle: {
          type: "dashed"
        }
      },
      tooltip: {
        formatter: function(params, ticket, callback) {
          // console.log(name);
          // console.log(params);
          // return name;
          let date = params[0].value[0];

          let content = `${date}<br />到访次数: ${params[0].value[1]}`;
          // callback(ticket, content);
          return content;
        }
      },
      areaStyle: {
        color: "rgb(167,55,52)"
      },
      color: ["rgb(203,73,120)"],
      yAxis: {
        position: "right",
        splitLine: {
          lineStyle: {
            type: "dashed"
          }
        }
      }
    };
    this.lineSettings = {
      area: true
    };
    this.barExtend = {
      series: {
        barWidth: 10
      },
      axisPointer: {
        lineStyle: {
          type: "dashed"
        }
      },
      tooltip: {
        formatter: function(params, ticket, callback) {
          let name = params[0].axisValue;

          let content = `${name} 分钟<br />新客户: ${
            params[0].value
          }<br/>老客户: ${params[1].value}`;
          // callback(ticket, content);
          return content;
        }
      },
      color: ["rgb(93,157,205)", "rgb(165,182,90)"],
      legend: {
        // orient: 'vertical',
        left: "left",
        formatter: function(name) {
          // console.log(name);
          if (name === "new") return "新客户";
          if (name === "old") return "老客户";
          return name;
        }
      },
      yAxis: {
        position: "right",
        splitLine: {
          lineStyle: {
            type: "dashed"
          }
        }
      },
      xAxis: {
        axisLabel: {
          formatter: function(value, index) {
            return value + " 分钟";
          }
        }
      }
    };
    this.sexRatio = {
      legend: {
        data: ['男', '女']
      },
      color: ['#87CEFA', '#fa6e86'],
      series: {
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{c}%' // 百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      },
      tooltip: {
        formatter: '{c}%'
      }
  };
    this.ageRatio = {
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'// 这是关键，在需要的地方加上就行了
      },
      legend: {
        data: []
      },
      color: ['#87CEFA'],
      yAxis: {
        axisLabel: {
          formatter: function(value, index) {
            return value + "%";
          }
        }
      }
    };
    this.car = {
      legend: {
        data: ['有', '无']
      },
      color: ['#87CEFA', '#fa6e86'],
      series: {
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{c}%' // 百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      },
      tooltip: {
        formatter: '{c}%'
      }
    };
    this.kids = {
      series: {
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{c}%' // 百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      },
      tooltip: {
        formatter: '{c}%'
      }
    };
    this.phone = {
      series: {
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{c}%' // 百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      },
      tooltip: {
        formatter: '{c}%'
      }
    };
    this.price = {
      series: {
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{c}%' // 百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      },
      tooltip: {
        formatter: '{c}%'
      }
    };
    this.equipment = {
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'// 这是关键，在需要的地方加上就行了
      },
      legend: {
        data: []
      },
      color: ['#87CEFA'],
      yAxis: {
        axisLabel: {
          formatter: function(value, index) {
            return value + "%";
          }
        }
      }
    };
    return {
      apiToken: localStorage.getItem('token'),
      beginTime: '',
      endTime: '',
      device: {
        label: "选择盒子",
        value: ""
      },
      globalStats: {
        // todayCount: "0",
        // newCount: "0",
        // totalCount: "0",
        // oldCount: "0"
      },
      chartData: {
        columns: ["date", "new", "old"],
        rows: []
      },
      dfTimesData: {
        columns: ["date", "count"],
        rows: []
      },
      zdChartData: {
        columns: ["name", "new", "old"],
        rows: []
      },
      myVal: 1,
      options: [
        {
          name: '近一天访客数据',
          value: 1
        },
        {
          name: '近一周访客数据',
          value: 7
        },
        {
          name: '近一月访客数据',
          value: 30
        }
      ],
      day: 1,
      sexRatioData: {
        columns: ['name', 'value'],
        rows: []
      },
      ageRatioData: {
        columns: ['name', 'value'],
        rows: []
      },
      carData: {
        columns: ['name', 'value'],
        rows: []
      },
      kidsData: {
        columns: ['name', 'value'],
        rows: []
      },
      phoneData: {
        columns: ['name', 'value'],
        rows: []
      },
      equipmentData: {
        columns: ['name', 'value'],
        rows: []
      },
      priceData: {
        columns: ['name', 'value'],
        rows: []
      }
    };
  },
  mounted() {
    // this.loadHomeStats();
    this.getEchartsData();
    this.getCardData();
  },
  methods: {
    toggleRealPeople() {
      this.$emit("toggleRealPeople");
    },
    // loadHomeStats() {
    //   Toast.loading({
    //     mask: true,
    //     message: "正在加载"
    //   });
    //   this.$axios
    //     .get(this.allConfig.apihttp + "home_stat", null, true)
    //     .then(result => {
    //       // callback(result);
    //       if (result.data.status === 1) {
    //         // console.log(result.data.data);
    //         const res = result.data.data;
    //         this.globalStats = res;
    //         // console.log('res:', res);
    //         // this.globalStats.todayCount = res.todayCount; // 今日访客
    //         // this.globalStats.totalCount = res.totalCount; // 总客流
    //         // this.globalStats.newCount = res.newCount; // 新访客
    //         // this.globalStats.oldCount = res.oldCount; // 老访客
    //         // console.log('this.globalStats:', this.globalStats);
    //
    //         this.chartData.rows = res.newComparOld.reverse();
    //         this.dfTimesData.rows = res.sevenDayAnalysis.reverse();
    //         this.zdChartData.rows = res.newComparOldTime;
    //       }
    //       // console.log(result);
    //       Toast.clear();
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //       Toast.clear();
    //     });
    // },
    add0(m) {
      return m < 10 ? '0' + m : m;
    },
    getCardData() {
      // console.log('获取卡片数据');
      // const end = new Date();
      // const start = new Date();
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
      // this.beginTime =
      //   start.getFullYear() +
      //   "-" +
      //   this.add0((start.getMonth() + 1)) +
      //   "-" +
      //   this.add0(start.getDate());
      // this.endTime =
      //   end.getFullYear() +
      //   "-" +
      //   this.add0((end.getMonth() + 1)) +
      //   "-" +
      //   this.add0((end.getDate() + 1));
      // let updated =
      //   "updated_at$" + "=>=" + this.beginTime + ",<=" + this.endTime;
      this.$get('client/count', '', res => {
        // console.log('res*************', res);
        if(res.data.code === 200){
          this.globalStats.total_count = res.data.data.new_count;
          this.globalStats.new_count = res.data.data.onehour_count;
          this.globalStats.back_count = res.data.data.back_count;
        } else if(res.data.code === 403){
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          });
        } else {
          this.$status(res.data.msg);
        }
        // this.globalStats = res.data.data;
      });
    },
    searchDay (value) {
      this.day = value;
      this.getEchartsData();
    },
    getEchartsData() {
      Toast.loading({
        mask: true,
        message: "正在加载"
      });
      // let params = {
      //   api_token: this.apiToken,
      //   day: this.day
      // };
      let temp = [];
      let sexTemp = [];
      let carTemp = [];
      let kidsTemp = [];
      let phoneTemp = [];
      let priceTemp = [];
      this.$get('client/passenger/' + this.day, '', res => {
        if (res.data.code === 200) {
          // this.sexRatioData.rows = res.data.data.sex_scale.data;
          // 性别比例
          sexTemp = res.data.data.sex_scale.data;
          let sexCount = 0;
          for (let i in sexTemp) {
            sexCount = sexCount + sexTemp[i].value;
          }
          this.sexRatioData.rows = [];
          for (let i in sexTemp) {
            this.sexRatioData.rows.push({
              name: sexTemp[i].name,
              value: ((sexTemp[i].value * 100) / sexCount).toFixed(2)
            });
          }
          // 汽车比例
          // this.carData.rows = res.data.data.car_scale.data;
          carTemp = res.data.data.car_scale.data;
          let carCount = 0;
          for (let i in carTemp) {
            carCount = carCount + carTemp[i].value;
          }
          this.carData.rows = [];
          for (let i in carTemp) {
            this.carData.rows.push({
              name: carTemp[i].name,
              value: ((carTemp[i].value * 100) / carCount).toFixed(2)
            });
          }
          // 年龄比例
          temp = res.data.data.age_scale.data;
          let ageCount = 0;
          for (let i in temp) {
            ageCount = ageCount + temp[i].value;
          }
          this.ageRatioData.rows = [];
          for (let i in temp) {
            this.ageRatioData.rows.push({
              name: temp[i].name,
              value: ((temp[i].value * 100) / ageCount).toFixed(2)
            });
          }
          // 子女情况
          // this.kidsData.rows = res.data.data.children_scale.data;
          kidsTemp = res.data.data.children_scale.data;
          let kidsCount = 0;
          for (let i in kidsTemp) {
            kidsCount = kidsCount + kidsTemp[i].value;
          }
          this.kidsData.rows = [];
          for (let i in kidsTemp) {
            this.kidsData.rows.push({
              name: kidsTemp[i].name,
              value: ((kidsTemp[i].value * 100) / kidsCount).toFixed(2)
            });
          }
          // 手机品牌
          // this.phoneData.rows = res.data.data.mobile_scale.data;
          phoneTemp = res.data.data.mobile_scale.data;
          let phoneCount = 0;
          for (let i in phoneTemp) {
            phoneCount = phoneCount + phoneTemp[i].value;
          }
          this.phoneData.rows = [];
          for (let i in phoneTemp) {
            this.phoneData.rows.push({
              name: phoneTemp[i].name,
              value: ((phoneTemp[i].value * 100) / phoneCount).toFixed(2)
            });
          }
          // this.equipmentData.rows = res.data.data.facility_peculiarity.data;
          let equipmentTemp = res.data.data.facility_peculiarity.data;
          let count = 0;
          for (let i in equipmentTemp) {
            count = count + equipmentTemp[i].value;
          }
          this.equipmentData.rows = [];
          for (let j in equipmentTemp) {
            this.equipmentData.rows.push({
              name: equipmentTemp[j].name,
              value: ((equipmentTemp[j].value * 100) / count).toFixed(2)
            });
          }
          // this.priceData.rows = res.data.data.facility_price.data;
          priceTemp = res.data.data.facility_price.data;
          let priceCount = 0;
          for (let i in priceTemp) {
            priceCount = priceCount + priceTemp[i].value;
          }
          this.priceData.rows = [];
          for (let i in priceTemp) {
            this.priceData.rows.push({
              name: priceTemp[i].name,
              value: ((priceTemp[i].value * 100) / priceCount).toFixed(2)
            });
          }
        } else if(res.data.code === 403){
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          });
        } else {
          this.$status(res.data.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.people-card {
  width: calc(100% - 30px);
  margin: 10px auto 0 auto;
  padding: 15px 20px 0;
  border-radius: 8px;
  box-shadow: 0 0 2px rgba(37, 88, 155, 0.8);
  background: linear-gradient(to right, #4588d4, #92c5e7);
  color: white;
}

.people-card p {
  color: #fff !important;
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
}

.today-stat {
  position: relative;
  margin-bottom: 15px;
}

.today-stat .real-man-btn {
  position: absolute;
  right: 0;
  bottom: 6px;
  display: block;
  height: 24px;
  line-height: 22px;
  width: 80px;
  border: 0.55px solid rgba(255, 255, 255, 0.5);
  text-align: center;
  border-radius: 15px;
  font-size: 12px;
}

.today-stat .name {
  font-size: 16px;
  font-weight: normal;
}

.today-stat .lg-digit {
  font-size: 32px;
  letter-spacing: 3px;
  /* font-weight: 700; */
}

.other-stats {
  display: flex;
  border-top: 0.55px solid rgba(255, 255, 255, 0.5);
  padding: 20px 0;
  /* align-items: center;
    flex: 1; */
}

.other-stats .stat-item {
  flex: 1;
  /* border-right: 1px solid #fff; */
  /* margin-right: 15px; */
  /* background: red; */
  padding-left: 20px;
  position: relative;
  /* padding-left: 30px; */
}

.other-stats .stat-item.total::after,
.other-stats .stat-item.new::after {
  display: block;
  content: "";
  width: 1px;
  height: 24px;
  position: absolute;
  right: 0;
  top: 10px;
  /* background: rgba(255,255,255,0.4); */
  border-right: 0.55px solid rgba(255, 255, 255, 0.5);
}

.other-stats .stat-item:first-child {
  padding-left: 0;
}

.other-stats .xl-name {
  font-size: 10px;
}

.other-stats .digit {
  font-size: 18px;
  letter-spacing: 2px;
}
.people-graph {
  width: 100%;
}

.box {
  padding: 15px;
}

.box .van-row {
  /* border: 1px solid #ccc; */
  box-shadow: 0 0 1px #ccc;
  margin: 15px 0;
}

.box .title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
}

.box .small-title {
  font-size: 14px;
  color: #333;
  font-weight: normal;
  margin-bottom: 15px;
}

.splitor {
  width: 100%;
  height: 10px;
  background: rgb(242, 244, 245);
}
.dropdown-menu {
  margin-top: 10px;
  padding: 0px 12px;
  background: #fff;
}

.dropdown-menu select {
  width: 100%;
  height: 30px;
  border: 0.5px solid #eee;
  text-align: center;
  text-align-last: center;
  margin: 0;
  outline: none;
  color: #4588d4;
  font-size: 12px;
  background: #fff;
}
.chartBox{
  border: 1px solid #F5F5F5;
  margin: 10px;
  padding-top: 15px;
  border-radius: 8px;
}
.tag{
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: black;
  font-size: 14px;
  margin-bottom: 20px;
}
.tag:before{
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: grey;
  margin-right: 5px;
  border-radius: 10px;
}
</style>


