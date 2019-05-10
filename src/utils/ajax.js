import Vue from 'vue';
import axios from 'axios';
import './interceptors'; // 拦截器
import { Toast } from 'vant';

Vue.use(Toast);

Vue.prototype.$axios = axios;
// var agin = true;
export default {
  install(Vue, options) {
    Vue.prototype.allConfig = {
      apihttp: 'http://api.51miaozhuan.com/',
      sysTipsMsg: {
        error: '数据加载失败，请重试！'
      },
      token: 'xxxxxxxxxxxxxxx',
      code: -10, // 登陆验证
      intevalTime: 4,
      data: null,
      isDebug: false // 是否开启数据调试模式
    };
    /*
     * url 请求url 地址 不包含 网址
     * params 参数 为一个json 对象
     * callback  返回函数
     * isloading 是否显示loading
     * isneedLogin 是否需要登陆
     */
    Vue.prototype.$get = function (url, params, callback, isloading = false, loadingText = '正在加载') {
      let _this = this;
      let URI = this.allConfig.apihttp + url;
      // this.askBefore(isloading); // header 验证
      if (isloading) {
        Toast.loading({
          mask: true,
          message: loadingText
        });
      }
      this.$axios.get(URI, params).then(function (result) {
        callback(result);
        if (_this.allConfig.isDebug) {
          console.info(result);
        }
        Toast.clear();
      }).catch(function (error) {
        console.log(error);
        Toast.clear();
      });
    };
    Vue.prototype.$delete = function (url, params, callback, isloading = false) {
      let _this = this;
      let URI = this.allConfig.apihttp + url;
      // this.askBefore(isloading); // header 验证
      this.$axios.delete(URI, params).then(function (result) {
        callback(result);
        if (_this.allConfig.isDebug) {
          console.info(result);
        }
      }).catch(function (error) {
        console.log(error);
      });
    };
    Vue.prototype.$post = function (url, params, callback, isloading = false, loadingText = '正在加载') {
      let _this = this;
      let URI = this.allConfig.apihttp + url;
      // this.askBefore(isloading); // header 验证
      if (isloading) {
        Toast.loading({
          mask: true,
          message: loadingText
        });
      }
      // if (agin) {
      this.$axios.post(URI, params).then(function (result) {
        callback(result);
        if (_this.allConfig.isDebug) {
          console.info(result);
          // agin = false;
        }
        Toast.clear();
      }).catch(function (error) {
        console.log(error);
        Toast.clear();
      });
      // } else {
      //   return;
      // }
    };
    Vue.prototype.$put = function (url, params, callback, isloading = false) {
      let _this = this;
      let URI = this.allConfig.apihttp + url;
      // this.askBefore(isloading); // header 验证
      this.$axios.put(URI, params).then(function (result) {
        callback(result);
        if (_this.allConfig.isDebug) {
          console.info(result);
        }
      }).catch(function (error) {
        console.log(error);
      });
    };
    // header 信息验证
    Vue.prototype.askBefore = function (isloading) {
      // let _this = this;
      // 数据请求前
      this.$axios.interceptors.request.use(function (config) {
        return config;
      }, function (error) { // 此处可以进行 刷新加载跳转
        return Promise.reject(error);
      });
    };
  }
};
