import Vue from 'vue';
import App from './App';
import store from './store'; // 数据仓库
import router from './router/m';
import ajax from './utils/ajax'; // 公共函数
import cfuncs from './utils/funcs.js'; // 自定义公共函数
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/vant-css/index.css';
import '@/assets/common/m/css/public.less';
import VueScroller from 'vue-scroller';
// 仅引入用到的图标以减小打包体积
// import 'vue-awesome/icons/flag'
import 'vue-awesome/icons';
// 或者在不关心打包体积时一次引入全部图标
import Icon from 'vue-awesome/components/Icon';
// 全局注册（在 `main .js` 文件中）
Vue.component('icon', Icon);

// import vConsole from 'vconsole'; // 手机版的 console
/* wap css */
Vue.config.productionTip = false;
// 注册全局 指令 改变标题
Vue.directive('title', {
  inserted: function (el, binding) {
    if (binding.value) {
      document.title = binding.value;
    }
  }
});
/* eslint-disable no-new */
Vue.use(ajax);
Vue.use(cfuncs);
Vue.use(VueScroller); // 上拉加载
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  store,
  ajax,
  VueScroller,
  cfuncs,
  // vConsole,
  template: '<App/>',
  components: {App}
});
