<template>
  <div class="aui-mask aui-mask-in alert" v-show="isShow">
    <div class="aui-dialog aui-dialog-in" style="margin-top: -65px;">
      <div class="aui-dialog-header">提示信息!</div>
      <div class="aui-dialog-body">{{msg}}</div>
      <div class="aui-dialog-footer">
        <!--<div class="aui-dialog-btn" @click="hidealert()">取消</div>-->
        <div class="aui-dialog-btn" @click="hidedialog()">确定</div>
      </div>
    </div>
  </div>
  <!-- this.$refs.dialog.aert();
    <Alert :params="alertInfo" ref='dialog'></Alert>-->
</template>
<script>
  export default {
    name: 'dialog',
    data() {
      return {
        isShow: false,
        msg: null // 提示信息
      };
    },
    methods: {
      hidedialog() { // 隐藏
        this.isShow = false;
        this.msg = null;
      },
      alert(msg) { // 显示对话框
        this.isShow = true;
        this.msg = msg;
      }
    }
  };
</script>
<style scoped>
  .alert{
    z-index: 11111111111111;
  }
</style>
