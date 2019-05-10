<template>
  <div class="login">
    <!-- <img src="http://p98adskah.bkt.clouddn.com/images/2018-07-05/lbw5plHvxn2C70qHXGv4TCysgRNwbievtGIiKrS4.png?imageView2/0/w/200/h/200" alt=""> -->
    <img :src="avator" class="logo-icon" />
    <!--<img src="../../../../static/jukebao.png" class="logo-icon" />-->
    <van-cell-group>
      <van-field v-model="phone" type="tel" required clearable label="手机号" placeholder="请输入手机号"/>

      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required/>
    </van-cell-group>
    <van-button size="large" @click="login" style="border: none;">登录</van-button>
  </div>
</template>
<script>
import { Field, Cell, CellGroup, Button, Toast, Dialog } from "vant";
export default {
  name: "login",
  components: {
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog
  },
  data() {
    return {
      phone: null,
      password: null,
      avator: ''
    };
  },
  created() {
  },
  mounted() {
    this.$get('client/logo?domain='+ document.domain + '&type=1', '', res => {
      if(res.data.code === 200){
        this.avator = res.data.data.logo.logo_url;
      } else {
        this.$status(res.data.msg);
      }
    });
    if (localStorage.getItem("telephone")) {
      this.phone = localStorage.getItem("telephone");
    } else {
      this.phone = "";
    }
  },
  methods: {
    login() {
      if (!this.isPhone(this.phone)) {
        Toast("请输入正确手机号！");
      } else if (!this.password) {
        Toast("请输入密码！");
      } else {
        let _this = this;
        let params = { phone: this.phone, password: this.password };
        this.$post(
          "client/login",
          params,
          function(result) {
            // 发起登录
            console.info("登陆返回数据", result);
            if (result.data.code === 200) {
              localStorage.setItem("token", result.data.data.auth_token);
              localStorage.setItem("telephone", _this.phone);

              // localStorage.setItem("uid", result.data.data.user.uid);
              // localStorage.setItem("user_type", result.data.data.user_type);
              // console.log('result:', result);
              localStorage.setItem("company_name", result.data.data.user.company);
              localStorage.setItem("company_photo", result.data.data.user.logo_url);
              _this.$router.push({ name: "home" });
            } else {
              Dialog.alert({
                title: "提示",
                message: result.data.msg
              });
            }
          },
          true,
          "登录中..."
        );
      }
    }
  }
};
</script>
<style lang="less">
.logo-icon {
  height: 80px;
  width: 80px;
  border-radius:50%;
}
.login .van-button--large {
  /*width: 90%;*/
  height: 40px;
  line-height: 38px;
}
.login .van-button {
  margin-top: 30px;
  /* background-color: #7FB6E3; */
  background: linear-gradient(to right, #92c5e7, #4588d4);
  color: #fff;
}
</style>
<style scoped>
.login {
  padding: 0 20px;
  height: 100%;
}
.login img {
  display: block;
  margin: 50px auto;
}
</style>
