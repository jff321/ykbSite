import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    dailedPhone: '',
    device: {
      label: "全部",
      value: ""
    },
    type: 1
  },
  // modules: {
  //   uinfo: userinfo
  // }
});
