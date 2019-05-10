import Vue from 'vue';
import router from '../router/m/index';
import axios from 'axios';
Vue.use(router);
Vue.prototype.$axios = axios;
// 拦截器配置
const myconfig = {
  code: -10,
  type: 'Bearer',
  yzUrl: 'http://game.54blues.com/wechatLogin/?url=', // 登陆验证跳转
  loginurl: 'http://game.54blues.com/red.html#/login', // 成功返回登陆
  header: {
    token: sessionStorage.getItem('token')
  }
};
axios.interceptors.request.use((config) => {
  // config.headers.ispc = 1;
  if (localStorage.getItem('token')) {
    config.headers.Authorization = myconfig.type + ' ' + localStorage.getItem('token');
  } else { // 登录过验证token
    loginRedirect();
  }
  return config;
}, err => {
  return Promise.reject(err);
});
// 请求后拦截器
axios.interceptors.response.use((result) => {
  if (result.data.status === myconfig.code) { // 未登录
    loginRedirect();
  }
  return result;
}, (err) => {
  return Promise.reject(err);
});
function loginRedirect () { // 跳转
  router.replace({name: 'login'});
}
// function weiXinLogin () {
//   router.replace({
//     path: '/login/index',
//     query: {redirect: router.currentRoute.fullPath}
//   });
// };

