import Vue from 'vue';
import axios from 'axios';
import './interceptors';
Vue.prototype.$axios = axios;
export default{
  install(Vue, options) {
    Vue.prototype.allConfig = {
      apihttp: 'http://dj.100jv.com/',  // http://1344e952.ap.ngrok.io/ http://laravel.dev/
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
    Vue.prototype.haha = function (url, params, callback, isloading = false) {
      console.info(1111111);
    };
  }
};
