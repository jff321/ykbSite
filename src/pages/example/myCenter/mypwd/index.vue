<template>
  <div class="aui-content">
    <div class="aui-content aui-margin-b-15">
      <img src="./imgs/loginlogo.png" class="imglogo" alt="">
      <h3 class="aui-text-center aui-padded-b-15">修改密码</h3>
      <div class="bar"></div>
      <ul class="aui-list aui-form-list">
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              旧密码
            </div>
            <div class="aui-list-item-input">
              <input type="password" v-model="oldpassword" class="aui-font-size-14" placeholder="请输入原登陆密码！">
            </div>
          </div>
        </li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              新密码
            </div>
            <div class="aui-list-item-input">
              <input type="password" v-model="password" class="aui-font-size-14" placeholder="请输入新密码！">
            </div>
          </div>
        </li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              确认密码
            </div>
            <div class="aui-list-item-input">
              <input type="password" v-model="ageinpwd" class="aui-font-size-14" placeholder="请再次确认新密码！">
            </div>
          </div>
        </li>
        <li class="aui-list-item aui-margin-t-15 aui-padded-t-15">
          <div class="aui-list-item-inner aui-list-item-center aui-list-item-btn">
            <span class="aui-btn aui-btn-warning submit" @click="login()">确认修改</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'mypwd', // 密码修改
    data() {
      return {
        oldpassword: null,
        password: null, // 新密码
        ageinpwd: null
      };
    },
    created() {
      if (!localStorage.getItem('token')) { // 判断是否登陆
        let _this = this;
        MessageBox.alert('请先登陆！').then(action => {
          _this.againLogin();
        });
      }
    },
    methods: {
      login() {
        if (!this.oldpassword) {
          MessageBox({
            title: '提示',
            message: '请输入旧密码！',
            showCancelButton: false
          });
        } else if (!this.password) {
          MessageBox({
            title: '提示',
            message: '请输入新密码！',
            showCancelButton: false
          });
        } else if (this.ageinpwd !== this.password) {
          MessageBox({
            title: '提示',
            message: '两次密码不一样，请重新输入！',
            showCancelButton: false
          });
        } else {
          let _this = this;
          let params = {oldpassword: this.oldpassword, password: this.password};
          this.askPutData('api/user/update_password', params, function (result) { // 发起修改
            let status = result.data.status;
            MessageBox.alert(result.data.data.msg).then(action => {
              if (status * 1 > 0) { // 修改成功
                localStorage.setItem('token', '');
                _this.againLogin();
              }
            });
          }, true);
        }
      },
      againLogin() {
        this.$router.push({name: 'login'});
      }
    }
  };
</script>
<style scoped>
  .submit{
    border: 0;
    width:100%;
    border-radius: 30px;
    height: 2rem;
    line-height:2rem;
  }
  .aui-content{
    height: 100%;
    background-color: #fff;
  }
  @media screen and (-webkit-min-device-pixel-ratio: 1.5){
    .aui-list .aui-list-item:last-child {
      border: none;
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: bottom;
      background-image: none;
    }
  }
  .bar{
    height: .3rem;
    width:100%;
    background-color: #f8f0e1;
  }
  .imglogo{
    margin: 0 auto;
    width:200px;
  }
</style>
