<template>
    <footer class="aui-bar aui-bar-tab">
      <div v-if="params">
        <template v-for="items in params">
        <router-link :to="{name: items.router.name,params:{id:items.router.params.id}}" tag="div" class="aui-bar-tab-item">
          <i class="aui-iconfont" :class="items.class"></i>
          <div class="aui-bar-tab-label">{{items.name}}{{items.router.id}}</div>
        </router-link>
        </template>
      </div>
      <!--没有参数-->
      <div v-else>
        <div class="aui-bar-tab-item" v-for="items in getparams">
          <i class="aui-iconfont" :class="items.class"></i>
          <div class="aui-bar-tab-label">{{items.name}}</div>
        </div>
      </div>
    </footer>
</template>
<script>
  export default {
    name: 'mfooter', // 页脚
    props: ['params'],
    data() {
      return {
        getparams: [
          {
            name: '请配置',
            class: 'aui-icon-star',
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            class: 'aui-icon-image',
            router: {
              name: 'null',
              params: {id: 1}
            }
          },
          {
            name: '请配置',
            class: 'aui-icon-pencil',
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
</style>
