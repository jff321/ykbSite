<template>
  <footer class="aui-bar aui-bar-tab aui-border-t">
    <div v-if="params">
      <template v-for="items in params">
        <router-link :to="{name: items.router.name,params:{id:items.router.params.id}}" tag="div" class="aui-bar-tab-item">
          <template v-if="items.class">
            <img :src="items.src" class="icon" :class="items.class"  />
          </template>
          <template v-else>
            <img :src="items.src" class="icon default"  />
            <img :src="items.activesrc" class="icon active" />
          </template>
          <p class="aui-font-size-12">{{items.name}}</p>
        </router-link>
      </template>
    </div>
    <!--没有参数-->
    <div v-else>
      <div class="aui-bar-tab-item" v-for="items in getparams">
        <img :src="items.src" class="icon" />
        <p class="aui-font-size-12">{{items.name}}</p>
      </div>
    </div>
  </footer>
</template>
<script>
  import defaulticon from '@/components/wap/tabBar/imgs/img.png';
  export default {
    name: 'mfooter', // img 的footer
    props: ['params'],
    data() {
      return {
        getparams: [
          {
            name: '请配置',
            src: defaulticon,
            class: 'shome', // 单独配置
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            src: defaulticon,
            class: 'shome',
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            src: defaulticon,
            class: 'shome',
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            src: defaulticon,
            class: 'shome',
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            src: defaulticon,
            class: 'shome',
            router: {
              name: 'null',
              params: {id: 1}
            }
          }
        ]
      };
    }
  };
</script>
<style scoped>
  /*底部选项卡图标*/
  footer{
    padding-top:.3rem;
  }
  footer .icon{
    margin: 0 auto;
    width: 1.3rem;
  }
  .active{
    display: none;
  }
  .aui-active .default{
    display: none;
  }
  .aui-active .active{
    display: block;
  }
</style>
