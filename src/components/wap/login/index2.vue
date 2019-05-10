<template>
  <div class="aui-content">
    <div class="aui-content aui-margin-b-15">
      <div class="bar"></div>
      <ul class="aui-list aui-form-list">
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              手机号
            </div>
            <div class="aui-list-item-input">
              <input type="text" v-model="phone" class="aui-font-size-14" placeholder="请输入手机号！">
            </div>
          </div>
        </li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              密码
            </div>
            <div class="aui-list-item-input">
              <input type="password" v-model="password" class="aui-font-size-14" placeholder="请输入密码">
            </div>
          </div>
        </li>
        <li class="aui-list-item aui-margin-t-15 aui-padded-t-15">
          <div class="aui-list-item-inner aui-list-item-center aui-list-item-btn">
            <span class="aui-btn aui-btn-warning submit" @click="login()">立即登录</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'index',
    data() {
      return {
        phone: null,
        password: null
      };
    },
    created() {
//      localStorage.setItem('token', this.$route.params.token);
//      let _this = this;
//      setTimeout(() => {
//        window.location.href = decodeURIComponent(_this.$route.params.url); // 跳转链接
//      }, 2000);
    },
    methods: {
      login() {
        if (!this.isPhone(this.phone)) {
          alert('请输入正确手机号！');
        } else if (!this.password) {
          alert('请输入密码！');
        } else {
          let _this = this;
          let params = {phone: this.phone, password: this.password};
          this.askPostData('api/login', params, function (result) { // 发起登录
            let status = result.data.status;
            MessageBox.alert(result.data.data.msg).then(action => {
              if (status * 1 > 0) { // 登录成功
                localStorage.setItem('token', result.data.data.data.api_token);
                _this.$router.push({name: 'lesscenter', params: {id: 1}});
              }
            });
          }, true);
        }
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
