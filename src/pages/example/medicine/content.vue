<template>
  <div class="lessoncontent" v-title="$route.meta.title">
    <div class="aui-content aui-padded-10" v-show="lessonCont">
      <h3 class="aui-padded-b-5">{{lessonCont.name}}</h3>
      <p>价格：<span class="aui-text-warning">{{lessonCont.price}}</span></p>
      <div class="aui-content aui-padded-t-10 aui-padded-b-15 aui-font-size-14">
        介绍：<div  v-html="lessonCont.content" class="aui-padded-t-5"> </div>
      </div>
    </div>
    <div class="aui-content">
      <ul class="aui-list aui-form-list">
        <li class="aui-list-header">课程预约</li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              姓名
            </div>
            <div class="aui-list-item-input">
              <input type="text" v-model="name" class="aui-font-size-14" placeholder="请输入你的姓名！">
            </div>
          </div>
        </li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner">
            <div class="aui-list-item-label aui-font-size-14">
              电话
            </div>
            <div class="aui-list-item-input">
              <input type="text" v-model="phone" class="aui-font-size-14" placeholder="请输入你的电话！">
            </div>
          </div>
        </li>
        <li class="aui-list-item">
          <div class="aui-list-item-inner aui-list-item-center aui-list-item-btn" >
            <span class="aui-btn aui-btn-warning submit" @click="sendApply()">确认提交</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'medicinnecont',  // 活动内容
    data() {
      return {
        lessonCont: [],
        name: null,
        phone: null
      };
    },
    created() {
      this.getActivityCont();
    },
    methods: {
      getActivityCont() { // 介绍详情
        let _this = this;
        this.askGetData('api/course/' + _this.$route.params.id, '', function (result) { // 获取活动
          _this.lessonCont = result.data.data;
        }, true);
      },
      sendApply() { //  发送申请
        let _this = this;
        if (!_this.name) {
          MessageBox({
            title: '提示',
            message: '请填写姓名!',
            showCancelButton: false
          });
        } else if (!_this.isPhone(_this.phone)) {
          MessageBox({
            title: '提示',
            message: '请输入正确手机号！',
            showCancelButton: false
          });
        } else {
          let params = {name: _this.name, phone: _this.phone, course_id: _this.$route.params.id};
          let _this = this;
          this.askPostData('api/reserve/', params, function (result) { // 发送报名
            MessageBox.alert(result.data.data.msg).then(action => {
              if (status * 1 > 0) { // 修改成功
                _this.name = null;
                _this.phone = null;
              }
            });
          }, true);
        }
      }
    }
  };
</script>
<style scoped>
  .aui-list .aui-list-header{
    background-color: #f8f0e1;
  }
  .submit{
    border: 0;
    width:100%;
    border-radius: 30px;
    height: 2rem;
    line-height:2rem;
  }
  .lessoncontent{
    background-color: #fff;
    height: 100%;
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
</style>
