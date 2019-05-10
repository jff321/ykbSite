<template>
  <div>
    <Menu mode="horizontal" :theme="navskin" active-name="1">
      <div class="my-logo" name>
        <img :src="mylogourl" v-if="logourl">
        <img src="../../../../assets/common/pc/images/logo.png" v-else>
      </div>
      <MenuItem name="1">
        <Icon type="ios-paper"></Icon>
        内容管理
      </MenuItem>
      <MenuItem name="2">
        <Icon type="ios-people"></Icon>
        用户管理
      </MenuItem>
      <Submenu name="3">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          统计分析
        </template>
        <MenuGroup title="使用">
          <MenuItem name="3-1">新增和启动</MenuItem>
          <MenuItem name="3-2">活跃分析</MenuItem>
          <MenuItem name="3-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="留存">
          <MenuItem name="3-4">用户留存</MenuItem>
          <MenuItem name="3-5">流失用户</MenuItem>
        </MenuGroup>
      </Submenu>
      <MenuItem name="4">
        <Icon type="settings"></Icon>
        综合设置
      </MenuItem>
    </Menu>
  </div>
</template>
<script>
  export default {
    name: 'nav',
    props: ['skin', 'api', 'logourl'],
    data () {
      return {
        navskin: 'light',
        mylogourl: null
      };
    },
    created() {
      if (this.skin === 0) {
        this.navskin = 'primary';
      } else if (this.skin === 1) {
        this.navskin = 'dark';
      } else {
        this.navskin = 'light';
      }
    }
  };
</script>
<style scoped>
  .my-logo img{
    height: 100%;
  }
  .my-logo{
    border: 0;
    float: left;
    height: 100%;
    cursor: pointer;
    padding: 5px;
  }
  .my-logo:hover{
    border:0 !important;
  }
</style>
