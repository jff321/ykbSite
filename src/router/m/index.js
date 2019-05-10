import Vue from 'vue';
import Router from 'vue-router';
import APP from '../../App';
Vue.use(Router);
export default new Router({
  mode: 'history',
  linkActiveClass: 'aui-active',
  routes: [
    {
      path: '/',
      name: 'app',
      redirect: '/index',
      component: APP
    },
    {
      path: '/login/index',
      name: 'login',
      component: () => import('@/pages/my/login/index'),
      meta: {
        title: '登录',
        isShowBar: false // 用于配置是否显示bar
      }
    },
    {
      path: '/index',
      name: 'home',
      component: () => import('@/pages/index/index'),
      meta: {
        title: '客流',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/customer',
      name: 'customer',
      component: () => import('@/pages/customer/index'),
      meta: {
        title: '客户',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/pages/setting/index'),
      meta: {
        title: '我的',
        isShowBar: true
      }
    },
    {
      path: '/moneydetail',
      name: 'moneydetail',
      component: () => import('@/pages/index/moneyDetail'),
      meta: {
        title: '费用中心',
        isShowBar: false // 用于配置是否显示bar
      }
    },
    {
      path: '/peoplepackage',
      name: 'peoplepackage',
      component: () => import('@/pages/peoplepackage/index'),
      meta: {
        title: '匹配列表',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/flashletter/:id',
      name: 'flashletter',
      component: () => import('@/pages/flashletter/index'),
      meta: {
        title: '模板列表',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/flashletterRecord/:id',
      name: 'flashletterRecord',
      component: () => import('@/pages/flashletter/flashletterRecord'),
      meta: {
        title: '发送记录',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/peoplepackage/:id/',
      name: 'peoplelistpackage',
      component: () => import('@/pages/peoplepackage/peoplelistpackage'),
      meta: {
        title: '匹配列表',
        isShowBar: false // 用于配置是否显示bar
        // keepAlive: true
      }
    },
    {
      path: '/peoplelist',
      name: 'peoplelist',
      component: () => import('@/pages/peoplelist/peoplelist'),
      meta: {
        title: '实时感知',
        isShowBar: true // 用于配置是否显示bar
        // keepAlive: true
      }
      // },
      // {
      //   path: '/endconversation/:mac',
      //   name: 'endconversation',
      //   component: () => import('@/pages/peoplelist/endconversation/index'),
      //   meta: {
      //     title: '通话标记',
      //     isShowBar: false // 用于配置是否显示bar
      //   }
      // },
      // {
      //   path: '/list/detail/:id',
      //   name: 'detail',
      //   component: () => import('@/pages/peoplelist/detail'),
      //   meta: {
      //     title: '个人详情',
      //     isShowBar: false // 用于配置是否显示bar
      //   }
    },
    {
      path: '/personalCenter',
      name: 'personalCenter',
      component: () => import('@/pages/setting/personalCenter'),
      meta: {
        title: '个人中心',
        isShowBar: true // 用于配置是否显示bar
        // keepAlive: true
      }
    },
    {
      path: '/probe',
      name: 'probe',
      component: () => import('@/pages/setting/probe'),
      meta: {
        title: '盒子管理',
        isShowBar: true // 用于配置是否显示bar
        // keepAlive: true
      }
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/pages/setting/guide'),
      meta: {
        title: '使用手册',
        isShowBar: true // 用于配置是否显示bar
        // keepAlive: true
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('@/pages/peoplelist/detail'),
      meta: {
        title: '详情',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/realPeopleDetail',
      name: 'realPeopleDetail',
      component: () => import('@/pages/peoplelist/realPeopleDetail'),
      meta: {
        title: '详情',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('@/pages/setting/pay'),
      meta: {
        title: '在线支付',
        isShowBar: true // 用于配置是否显示bar
      }
    },
    {
      path: '/listDetail',
      name: 'listDetail',
      component: () => import('@/pages/flashLetter/listDetail'),
      meta: {
        title: '活动详情',
        isShowBar: true // 用于配置是否显示bar
      }
    }
  ]
});
