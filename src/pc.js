import Vue from 'vue';
import App from './App';
import funcs from './funcs/global'; // 公共函数
import router from './router/pc';
import iView from 'iview';
import 'element-ui/lib/theme-chalk/index.css';
/* pc css */
import 'iview/dist/styles/iview.css';
import '@/assets/common/pc/css/theme.less';
import '@/assets/common/pc/css/common.css';
/* pc css */
// 全局注册 axios
Vue.config.productionTip = false;
// Vue.http.options.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
// };
Vue.use(iView);
Vue.use(funcs);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  funcs,
  template: '<App/>',
  components: { App }
});
