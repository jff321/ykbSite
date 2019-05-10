<template>
  <div style="padding: 10px;">
    <div class="title">{{title}}</div>
    <div class="content">{{content}}</div>
  </div>
</template>

<script>
    export default {
      name: "notification",
      data() {
        return {
          title: '暂无通知',
          content: ''
        };
      }
    };
</script>

<style scoped>
  .title{
    text-align: center;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
  }
  .content{
    font-size: 14px;
    text-indent: 2em;
  }
</style>
