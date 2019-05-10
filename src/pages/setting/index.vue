<template>
  <div class="setting-wrap">
    <div class="caption">
      <div class="user-box">
        <img v-if="user.company_photo_url" :src="user.company_photo_url" class="avatar" @click="triggerUpload">
        <img v-else src="./imgs/head.png" class="avatar" @click="triggerUpload">
        <!--<input id="files" type="file" accept="image/*" style="display: none" ref="inputer" @change="uploadFile">-->
        <!--<el-upload-->
          <!--style="display: none;"-->
          <!--class="upload-demo"-->
          <!--ref="upload"-->
          <!--action="http://c.adbpx.com/api/manager/upload/files"-->
          <!--:on-success="uploadSuccess"-->
          <!--limit=1-->
          <!--:on-exceed="handleExceed"-->
          <!--accept="image/*"-->
          <!--:file-list="fileList">-->
          <!--<div class="buttonDiv">-->
            <!--<el-button id="files" size="small" type="primary">点击上传</el-button>-->
          <!--</div>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传txt文件，一次一个</div>-->
        <!--</el-upload>-->
        <p class="mobile">{{user.phone}}</p>
        <p class="mobile">{{user.company_name}}</p>
      </div>
      <!-- <div class="money-wrap">
                <van-row>
                    <van-col :span="8" v-for="(item,index) in moneys" :key="index">
                        <div class="money">
                            <p class="digit"><span class="unit">¥</span><span>{{item.value}}</span></p>
                            <p class="name">{{item.label}}</p>
                        </div>
                    </van-col>
                </van-row>
      </div>-->
    </div>

    <div class="splitor"></div>

    <div class="settings">
      <van-cell-group>
        <!-- <van-cell value="内容" icon="shop" is-link>
                    <span class="van-cell-text">单元格</span>
        </van-cell>-->
        <van-cell
          title="短信管理"
          icon="pending-evaluate"
          is-link
          @click="href('flashletter', {id: 1})"
        />
        <!--<van-cell-->
          <!--title="短信发送记录"-->
          <!--icon="pending-evaluate"-->
          <!--is-link-->
          <!--@click="href('flashletterRecord', {id: 1})"-->
        <!--/>-->
        <van-cell title="闪信管理" icon="chat" is-link @click="href('flashletter', {id: 2})"/>
        <!--<van-cell-->
          <!--title="闪信发送记录"-->
          <!--icon="chat"-->
          <!--is-link-->
          <!--@click="href('flashletterRecord', {id: 2})"-->
        <!--/>-->
        <van-cell title="个人中心" icon="contact" is-link to="personalCenter"/>
        <van-cell title="盒子管理" icon="aim" is-link to="probe"/>
        <van-cell title="费用中心" icon="pending-orders" to="/moneydetail" is-link />
        <van-cell title="在线支付" icon="pending-deliver" is-link to="/pay" />
      </van-cell-group>
    </div>

    <div class="splitor"></div>
    <div class="settings">
      <van-cell-group>
        <van-cell title="退出登录" style="color: #4588d4; text-align:center;" @click="logout();"/>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { Row, Col, Cell, CellGroup, Dialog } from "vant";
export default {
  name: "setting",
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  data() {
    return {
      user: {
        // telId: localStorage.getItem("uid"),
        phone: localStorage.getItem("telephone"),
        company_name: localStorage.getItem("company_name"),
        company_photo_url: localStorage.getItem("company_photo"),
        company_photo_name: ''
      },
      moneys: [
        {
          label: "余额",
          value: "305.98"
        },
        {
          label: "红包",
          value: "694.02"
        },
        {
          label: "今日花费",
          value: "13.66"
        }
      ]
    };
  },
  mounted() {
    if (this.user.company_name === 'null') {
      this.user.company_name = '公司名称';
    }
    if (this.user.company_photo_url === 'null') {
      this.user.company_photo_url = this.$route.params.logo_url;
    }
  },
  methods: {
    logout() {
      Dialog.confirm({
        title: "提示",
        message: "您确定要退出登录吗？"
      })
        .then(() => {
          // on confirm
          this.$post('client/logout', localStorage.getItem('token'), (result) => {
            console.log('result:', result);
            if (result.data.code === 200) {
              localStorage.removeItem('token');
              this.$router.push("/login/index");
            } else {
              this.$status(result.data.msg);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    triggerUpload() {
      console.log('触发上传');
      document.getElementById('files').click();
    },
    uploadSuccess(file) {
      console.log('上传');
      this.user.company_photo_name = file.data.name; // 公司名字
      this.user.company_photo_url = file.data.url; // 公司头像路径
      let params = {
        id: this.user.telId,
        user_type: this.user.telId,
        picture: this.user.company_photo_name
      };
      this.$put("common/user/" + this.user.telId, params, res => {
        if (res.data.status === 1) {
          this.$message({
            message: '上传成功！',
            type: 'success'
          });
        } else {
          Dialog.alert({
            title: "提示",
            message: res.data.msg
          });
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.caption {
  text-align: center;
  padding: 30px 10px 10px;
  /* background: #5d80fa; */
  background: linear-gradient(to right, #92c5e7, #4588d4);
  font-family: "PingFang SC", Arial, Helvetica, sans-serif;
}

.mobile {
  color: white;
  font-size: 14px;
  margin-top: 2px;
}

.user-box {
  margin: 15px 0;
  /* margin-bottom: 20px; */
}
.avatar {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.money {
  font-size: 14px;

  padding: 10px 0;
}

.digit {
  font-size: 18px;
  /* font-weight: 700; */
  /* color: #333; */
  color: white;
}

.digit .unit {
  font-size: 10px;
  padding-right: 5px;
}
.name {
  font-size: 12px;
  color: white;
  /* color: #999; */
}
</style>


