<template>
  <!--上传作品-->
  <div class="myworks" v-title="$route.meta.title">
    <div class="aui-padded-15 myweixincode">
      <img :src="isUploadSuc" class="uploadimg" v-show="isUploadSuc" alt="">
      <img :src="lastUpimg" class="uploadimg" v-show="!isUploadSuc && lastUpimg" alt="" alt="">
      <div class="aui-padded-t-15 aui-font-size-14 aui-text-success" v-show="uploading"><i class="aui-iconfont aui-icon-info"></i>上传中，请稍后...</div>
      <div class="aui-padded-t-15">
        <vue-core-image-upload
          :crop="false"
          @imageuploaded="imageuploaded"
          @imagechanged="imagechanged"
          :max-file-size='maxsize'
          :credentials="false"
          :inputOfFile="'file'"
          :inputAccept="'image/*'"
          :extensions="'png,jpg,gif'"
          :url="allConfig.apihttp+'api/upload/images'" >
          <div class="aui-padded-15 upload">
            <i class="aui-iconfont aui-icon-plus"></i>
            <p>点击上传作品</p>
          </div>
        </vue-core-image-upload>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'pending', // 待处理
    data() {
      return {
        isShow: false,
        isUploadSuc: false,
        money: null,
        imgname: localStorage.getItem('lastimgurl'),
        myInfo: {},
        data: {},
        uploading: false,
        maxsize: 4194304,
        lastUpimg: localStorage.getItem('getcashowimg')
      };
    },
    methods: {
      imageuploaded(res) {
        this.isUploadSuc = res.data.small_url;
        this.imgname = res.data.name;
        this.$refs.dialog.alert(res.data.msg);
        this.uploading = false;
        localStorage.setItem('getcashowimg', res.data.small_url);
        localStorage.setItem('lastimgurl', res.data.name); // 上次的 url 需要保持
      },
      imagechanged(res) {
        if (res.size > this.maxsize) { // 上传文件过大
          this.$refs.dialog.alert('上传文件最大为4MB！');
        } else {
          this.uploading = true;
        }
      },
      submitMsg() {
        let _this = this;
        if (!this.money) {
          this.$refs.dialog.alert('请输入金额！');
        } else if (!this.imgname) {
          this.$refs.dialog.alert('请上传收款码！');
        } else {
          this.askPostData('api/money/cash', {money: _this.money, picture: _this.imgname}, function (result) {
            _this.$refs.dialog.alert(result.data.data.msg);
            _this.commGetInfo(); // 成功就刷新金额
          }, true);
        }
      }
    },
    components: {
      VueCoreImageUpload: function (resolve) {
        // 上传插件
        require(['vue-core-image-upload'], resolve);
      }
    }
  };
</script>
<style scoped>
  .myworks{
    height: 100%;
    background-color: #fdf9f1;
  }
  .upload{
    border:1px #ddd dashed;
    text-align: center;
    border-radius: 5px;
  }
</style>
