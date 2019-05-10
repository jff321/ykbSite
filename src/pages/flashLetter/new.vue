<template>
  <div class="form-wrap">
    <van-nav-bar
      :title="Number(this.$route.params.id) === 1 ? '创建短信模板' : '创建闪信模板'"
      @click-left="onClickLeft"
      left-arrow
    />
    <van-cell-group>
      <van-field
        v-model="packageName"
        maxlength="20"
        required
        clearable
        label="标题"
        placeholder="请输入标题，小于20字"
      />
      <van-field
        v-model="signName"
        maxlength="8"
        required
        clearable
        label="签名"
        readonly
        placeholder="请前往我的-个人中心设置,只能设置一次"
      />
      <van-field
        v-model="packageContent"
        required
        clearable
        label="内容"
        :placeholder="'请输入内容，小于' + maxLength + '字'"
        type="textarea"
        rows="3"
        :maxlength="maxLength"
        autosize
      />
      <div class="rest-word-tip">还可输入: {{restWords}}字</div>
    </van-cell-group>
    <div class="preview-wrap">
      <div class="label-text">演示:</div>
      <div class="content-wrap">
        <p class="content">
          <van-field
            v-model="calcPackageContent"
            type="textarea"
            rows="1"
            :maxlength="$route.params.id === 1 ? 500 : 67"
            autosize
            disabled
            style="padding:0 10px; margin: 0; width: 90%;font-size: 14px; color: #333;"
          />
        </p>
      </div>
    </div>
    <div class="preview-wrap">
      <div class="label-text">示例:</div>
      <div class="content-wrap">
        <p class="content">
          <span class="auto-text">【xxx旗舰店】</span>
          <span class="text">偷偷告诉您！10月狂欢将于10月10日，火爆开启！更有定金膨胀。</span>
          <br>
          <span class="auto-text">{{suffixName}}</span>
        </p>
        <p v-if="$route.params.id === 1" class="warning">注: 灰色部分不用填写，系统自动添加。普通短信70字符，长短信67字符为一条计费。</p>
        <p v-else class="warning">注: 灰色部分不用填写，系统自动添加。每条闪信内容不能超过67个字符，67个字符（含以下）为一条计费。</p>
      </div>
    </div>
    <div class="create-wrap">
      <span class="custom-bg-color" @click="createComfirm">创建</span>
    </div>
  </div>
</template>
<script>
import { NavBar, CellGroup, Field, Button, Dialog, Toast } from "vant";
export default {
  name: "new-template",
  components: {
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast
  },
  data() {
    return {
      user: {
        telId: localStorage.getItem("telId")
      },
      packageName: "",
      signName: "",
      packageContent: "",
      countLength: 0,
      maxLength: null,
      restWords: null,
      suffixName: null
    };
  },
  // mounted() {
  //
  // },
  watch: {
    packageContent: function(newValue) {
      var num;
      num = this.countLength  - this.signName.length - 2 - this.packageContent.length - this.suffixName.length;
      this.restWords = num < 0 ? 0 : num;
    }
  },
  computed: {
    calcPackageContent() {
      let calcSN = this.signName ? `【${this.signName}】` : "";
      if (!calcSN && !this.packageContent) {
        return "";
      }
      return `${calcSN}${this.packageContent}${this.suffixName}`;
    }
  },
  mounted() {
    this.$get("client/myinfo", "", res => {
      // console.log('res:', res);
      if (res.status === 200) {
        this.signName = res.data.sign;
        if (Number(this.$route.params.id) === 1) {
          // 短信
          this.countLength = 500;
          this.suffixName = "退订回复T。";
          this.maxLength = 500 - 8 - this.signName.length - this.suffixName.length;
          this.restWords = 500 - 8 - this.signName.length - this.suffixName.length;
        } else {
          //闪信
          this.countLength = 67;
          this.suffixName = "";
          this.maxLength = 67 - 2 - this.signName.length - this.suffixName.length;
          this.restWords = 67 - 2 - this.signName.length - this.suffixName.length;
        }
      }
    });
  },
  methods: {
    onClickLeft: function() {
      this.$emit("closeMe");
    },
    createComfirm() {
      let that = this;
      if (!this.signName) {
        Toast({
          message: "签名不能为空",
          position: "top"
        });
        return false;
      }
      if (!this.packageName || !this.packageContent) {
        Toast({
          message: "标题内容不能为空",
          position: "top"
        });
        return;
      }
      this.disabled = true;
      var lletter = null;
      if (Number(this.$route.params.id) === 1) {
        lletter = "退订回复T。";
      } else {
        lletter = "";
      }
      let params = {
        title: this.packageName,
        sign: this.signName,
        content:  this.packageContent + lletter,
        // type: this.activeModel + 1
        types: this.$route.params.id
      };
      // console.info(params);
      this.$post("client/dotemp", params, res => {
        console.info(res);
        if (res.data.code === 200) {
          Dialog.alert({
            title: "提示",
            message: "创建成功"
          }).then(() => {
            that.$emit("createSuccess");
            this.packageName = '';
            this.packageContent = '';
          });
        } else {
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          }).then(() => {});
        }
        // that.disabled = false;
      });
    } //  确定创建
  }
};
</script>
<style lang="scss" scoped>
.form-wrap {
  .van-cell-group {
    position: relative;
  }

  .create-wrap {
    padding: 15px;
    .custom-bg-color {
      display: inline-block;
      background: linear-gradient(to right, #92c5e7, #4588d4);
      //   border: 0 !important;
      color: white;
      text-align: center;
      height: 50px;
      line-height: 50px;
      width: 100%;
      vertical-align: middle;
    }
  }
  .rest-word-tip {
    position: absolute;
    right: 15px;
    bottom: -1px;
    font-size: 14px;
    color: #333;
  }
  .preview-wrap {
    margin-top: 15px;
    display: flex;
    padding: 10px 15px;
    .label-text {
      flex: 0 1 80px;
      width: 80px;
      font-size: 14px;
    }
    .content-wrap {
      flex: 1;
      width: calc(100% - 80px);
      .content {
        color: #333;
        font-size: 0;
        margin-bottom: 10px;
        .auto-text {
          font-size: 14px;
          color: #ccc;
          &.black {
            color: #333;
          }
        }
        .text {
          font-size: 14px;
        }
      }
      .warning {
        font-size: 12px;
        color: red;
      }
    }
  }
}
</style>


