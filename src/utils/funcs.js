// 公共函数
import router from '../router/m';
import { Dialog } from 'vant'; // 手机端提示框
export default{
  install(Vue, options) {
    // print_r  常用函数
    Vue.prototype.print_r = function (obj) {
      alert(JSON.stringify(obj));
    };
    // 返回上一级的
    Vue.prototype.goback = () => {
      router.go(-1);
    };
    // 路由跳转
    Vue.prototype.href = (name, params) => {
      if (params) {
        router.push({name: name, params: params});
      } else {
        router.push({name: name});
      }
    };
    // 截取字符串
    Vue.prototype.substrings = (value) => {
        return value.substr(0, 12);
    };
    // url 跳转 isVueRouter 这个是判断是否是路由跳转还是 URL跳转
    Vue.prototype.redUrl = (isVueRouter, other = {name: '', params: {}, url: ''}) => {
      if (isVueRouter) {
        router.push({name: other.name, params: other.params});
      } else {
        window.location = other.url;
      }
    };
    // 手机号格式化
    Vue.prototype.tel = function (val) {
      if (val) { // 是否设置为json
        // let value = val.substr(0, 3);
        return val.replace(/(\d{0})\d{4}(\d{3})/, '*******');
      }
    };
    // 日期格式化
    Vue.prototype.dateDeal = function (fdate, fmt) { //  {{dateDeal(items.created_at, 'YY-M-d')}} Y-m-d 大写的年
      let timesstamp = new Date(Date.parse(fdate.replace(/-/g, '/')));
      timesstamp = new Date(timesstamp.getTime());
      let o = {
        'Y+': new Date(timesstamp).getFullYear(), // 年份
        'M+': (new Date(timesstamp).getMonth() + 1) < 10 ? '0' + (new Date(timesstamp).getMonth() + 1) : new Date(timesstamp).getMonth() + 1, // 月份
        'd+': new Date(timesstamp).getDate() < 10 ? '0' + new Date(timesstamp).getDate() : new Date(timesstamp).getDate(), // 日
        'h+': new Date(timesstamp).getHours(), // 小时
        'm+': new Date(timesstamp).getMinutes(), // 分
        's+': new Date(timesstamp).getSeconds(), // 秒
        'q+': Math.floor((timesstamp.getMonth() + 3) / 3), // 季度
        'S': new Date(timesstamp).getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
      return fmt;
    };
    Vue.prototype.countDown = (endStamp) => { // 倒计时  startStamp 开始时间cuo endStamp 时间错
      // 当前时间
      let nowTimeStamp = Date.parse(new Date()); // 当前时间挫
      // 相差的时间
      let countTime = endStamp - nowTimeStamp; // 结束时间cuo
      if (!endStamp) {
        alert('开始时间不能为空！');
        return false;
      }
      let days = Math.floor(countTime / 1000 / 60 / 60 / 24);
      let hours = Math.floor(countTime / 1000 / 60 / 60 % 24);
      let muites = Math.floor(countTime / 1000 / 60 % 60);
      let second = Math.floor(countTime / 1000 % 60);
      return {d: days, h: hours, m: muites, s: second};
    };
    Vue.prototype.locaDate = (date) => { // 获取当前日期
      const formatNumber = n => {
        n = n.toString();
        return n[1] ? n : '0' + n;
      };
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [year, month, day].map(formatNumber).join('-');
    };
    Vue.prototype.stampToDate = (format) => { // 时间戳转 时间
      var date = new Date(format * 1000); // 如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    };
    Vue.prototype.locaDateTime = (date) => { // 获取当前时间
      const formatNumber = n => {
        n = n.toString();
        return n[1] ? n : '0' + n;
      };
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    };
    Vue.prototype.loginOut = function (urlname) { // 退出登录
      this.clearLStorage();
      this.$router.push({name: urlname});
    };
    Vue.prototype.isNumber = function (data, isfloat = false) { // isfloat 是否包含小数
      let reg;
      if (!isfloat) {
        reg = new RegExp('^[0-9]*$');
      } else {
        reg = /^[0-9](\.\d{1,2})?$/; // 小数后两位
      }
      if (!reg.test(data)) {
        return false;
      } else {
        return true;
      }
    };
    Vue.prototype.isPhone = function (phone) {
      // if (!(/^1[34578]\d{9}$/.test(phone))) {
      if (!(/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    };
    Vue.prototype.isNull = function (obj, alertMsg) {  // obj 判断对象 alertMsg 提示信息
      if (!obj) {
        Dialog.alert({
          title: '提示',
          message: alertMsg
        });
        return false;
      }
    };
    Vue.prototype.whatDevice = () => {
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') !== -1;
      let isAndroid = ua.indexOf('android') !== -1;
      let isIos = (ua.indexOf('iphone') !== -1) || (ua.indexOf('ipad') !== -1);
      if (isWeixin) {
        return 'weixin';
      } else if (isAndroid) {
        return 'android';
      } else if (isIos) {
        return 'android';
      } else {
        return '无法获取设备类型！';
      }
    };
    Vue.prototype.isInArray = (arr, obj) => { // 判断是否在数组中
      let i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    };
    Vue.prototype.imgCrop = (imgurl, type, w, h) => { // 图片插件 type 模式 0 适合移动设备 12345
      return imgurl + '?imageView2/' + type + '/w/' + w + '/h/' + h;
    };
    Vue.prototype.removeArrVal = function (arr, val) { // 删除数组指定值
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1);
          break;
        }
      }
    };
    // 本地存储相关
    Vue.prototype.setLStorage = (name, val, isjson) => { // 设置本地storage
      if (isjson) { // 是否设置为json
        localStorage.setItem(name, JSON.stringify(val));
      } else {
        localStorage.setItem(name, val);
      }
    };
    Vue.prototype.getLStorage = (name, isjson) => { // 获取本地storage
      if (isjson) {
        return JSON.parse(localStorage.getItem(name));
      } else {
        return localStorage.getItem(name);
      }
    };
    // 设置sessionstorage
    Vue.prototype.setSStorage = function (name, val, isjson) {
      if (isjson) { // 是否设置为json
        sessionStorage.setItem(name, JSON.stringify(val));
      } else {
        sessionStorage.setItem(name, val);
      }
    };
    Vue.prototype.clearLStorage = function () {
      localStorage.clear();
    };
    Vue.prototype.getSStorage = function (name, isjson) { // 设置sessionstorage
      if (isjson) {
        return JSON.parse(sessionStorage.getItem(name));
      } else {
        return JSON.parse(sessionStorage.getItem(name));
      }
    };
    Vue.prototype.weiPay = function (params, obj, other) { // 微信支付
      // if (this.whatDevice === 'weixin') { // 微信环境
      console.log(params, 'pay');
      WeixinJSBridge.invoke('getBrandWCPayRequest', params, (res) => {
          console.log(res, 'pay');
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            ({
              title: '提示',
              message: '支付成功'
            }).then(() => {
              if (other) {
                this.href(other.name, other.params);
              }
            });
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            this.$dialog.alert({
              title: '提示',
              message: '用户取消支付'
            });
          } else {
            this.$dialog.alert({
              title: '提示',
              message: '支付失败'
            });
          }
        }
      );
      // }
    };
    Vue.prototype.$status = function (msg) {
      Dialog.alert({
        title: '提示',
        message: msg
      });
      return false;
    };
    // 统计字数
    Vue.prototype.numCount = function (str) {
      if(str){
        return str.length
      }
    };
    // 将时间戳转换为年月日
    Vue.prototype.turnTime = function (time) {
      let date = new Date(parseInt(time) * 1000);
      let Y = date.getFullYear() + '-';
      let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y+M+D+h+m+s;
    };
  }
};
