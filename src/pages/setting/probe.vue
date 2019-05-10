<template>
  <div>
    <van-nav-bar
      title="盒子管理"
      left-arrow
      @click-left="onClickLeft"
      right-text="添加"
      :fixed="true"
      @click-right="onClickRight"
    />
    <scroller
      style="padding-top:0px"
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="myscroller"
      noDataText="我是有底线的"
    >
      <van-row style="padding: 45px 15px 0px 15px">
      <template v-if="list.length > 0" v-for="(items,index) in list">
        <van-col
          :span="24"
          style="padding: 10px 0; border-bottom: 0.5px solid #eee;"
          :key="index"
        >
          <van-col :span="16">
            <h2 class="title">盒子名称 {{items.name}}</h2>
            <p class="time-wrap">
              <span class="time">盒子ID {{items.code}}</span>
            </p>
            <p class="time-wrap">
              <span class="time">盒子SIM {{items.sim}}</span>
            </p>
          </van-col>
          <van-col :span="8" style="font-size: 14px;text-align: right;">
            <div>
              <div>
                <span v-if="items.online === 0" style="color: #999;">离线</span>
                <span v-if="items.online === 1" style="color: #65B7AC;">在线</span>
              </div>
              <div style="padding-top: 5px;padding-right: 3px;">
                <img src="./imgs/delete.png" alt="" style="width: 20px;height: 20px;" @click="deleteBox(index, items.id)">
              </div>
            </div>
          </van-col>
        </van-col>
      </template>
    </van-row>
    </scroller>
    <van-popup v-model="isShow" style="width: 100%;">
      <van-cell-group>
        <van-field
          v-model="name"
          required
          clearable
          label="名称"
          placeholder="请输入盒子名称"
        />

        <van-field
          v-model="probeId"
          required
          clearable
          label="盒子ID"
          placeholder="请输入盒子ID"
        />
        <van-field
          v-model="probeSim"
          required
          clearable
          label="盒子SIM"
          placeholder="请输入盒子SIM"
        />
        <div class="area" @click="clickAreas">
          <span style="display: inline-block;width: 90px;">所属地区</span>
          <span>{{area}}</span>
        </div>
      </van-cell-group>
      <div class="create-wrap" @click="commitProbe">
        <span class="custom-bg-color">提交</span>
      </div>
    </van-popup>
    <!-- 所属地区 -->
    <van-actionsheet v-model="showAreaPicker">
      <van-area
        :area-list="areaList"
        :value="areaValue"
        @cancel="showAreaPicker = false;"
        @confirm="confirmAreaSelect"
        :columns-num="2"
        title="选择城市" />
    </van-actionsheet>
  </div>
</template>

<script>
  import AreaList from '@/area';
  import {
    Field,
    NavBar,
    Cell,
    CellGroup,
    Button,
    Popup,
    Row,
    Col,
    Toast,
    Dialog,
    Picker,
    Actionsheet,
    Area
  } from 'vant';
  export default {
    name: "personalCenter",
    components: {
      [Field.name]: Field,
      [NavBar.name]: NavBar,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Row.name]: Row,
      [Col.name]: Col,
      [Toast.name]: Toast,
      [Dialog.name]: Dialog,
      [Picker.name]: Picker,
      [Actionsheet.name]: Actionsheet,
      [Area.name]: Area
    },
    data() {
      return {
        user: {
          telId: localStorage.getItem("telId")
        },
        name: '',
        probeId: '',
        probeSim: '',
        isShow: false,
        list: [],
        hasData: 0,
        page: 1,
        limit: 10,
        area: '请选择',
        showAreaPicker: false,
        areaList: AreaList,
        areaValue: '110000',
        province_id: '',
        city_id: '',
      };
    },
    watch: {

    },
    mounted() {
      // this.getDataList();
    },
    methods: {
      getDataList() {
        this.$get(`client/boxlist?page=${this.page}&limit=${this.limit}`,
          "",
          result => {
          // console.log('result.data.data.list:', result.data.data.list);
          // if (result.data.data.list.length) {
          //   this.list = result.data.data.list;
          //   // if(result.data.data.list.length > 10){
          //   //   this.hasData = 1
          //   // }
          // } else {
          //   this.hasData = 1; // 返回没有数据
          // }
          // if (this.list.length === 0) {
          //   if (this.loadinglayer.length) {
          //     this.loadinglayer[0].style.opacity = 0;
          //   }
          // }

          if (result.data.code === 200) {
            if (this.page === 1) {
              this.list = [];
            }
            if (result.data.data.list.length === 0) {
              this.hasData = 1;
            } else {
              if (this.page === 1) {
                this.list = result.data.data.list;
              } else {
                if (this.list[0] && this.list[0].id === result.data.data.list[0].id) {
                  this.list = result.data.data.list;
                } else {
                  for (let key in result.data.data.list) {
                    this.list.push(result.data.data.list[key]);
                  }
                }
              }
            }
            if (this.list.length === 0) {
              if (this.loadinglayer.length) {
                this.loadinglayer[0].style.opacity = 0;
              }
            }
          } else {
            // this.hasData = 1;
            Dialog.alert({
              title: "提示",
              message: res.data.msg
            });
          }
        });
      },
      refresh(done) {
        setTimeout(() => {
          this.page = 1;
          this.list = [];
          this.hasData = 0;
          this.getDataList();
          done(true);
        }, 1500);
      },
      infinite(done) {
        // 加载更多插件
        if (this.hasData) {
          // 代表没有 更多数据了
          done(true);
        } else {
          setTimeout(() => {
            this.getDataList();
            setTimeout(() => {
              done();
              this.page++;
            }, 400);
          }, 1000);
        }
      },
      onClickLeft() {
        this.$router.push({path: 'setting'});
      },
      onClickRight() {
        this.isShow = true;
      },
      commitProbe() {
        if(this.name === ''){
          Toast('请输入盒子名称');
          this.isShow = true;
          return false;
        }
        if(this.probeId === ''){
          Toast('请输入盒子ID');
          this.isShow = true;
          return false;
        }
        if(this.probeSim === ''){
          Toast('请输入盒子SIM');
          this.isShow = true;
          return false;
        }
        if(this.area === '请选择' || ''){
          Toast('请选择所属地区');
          this.isShow = true;
          return false;
        }
        this.isShow = false;
        let params = {
          name: this.name,
          code: this.probeId,
          sim: this.probeSim,
          province_id: this.province_id,
          city_id: this.city_id,
        };
        this.$post("client/dobox",
          params,
          res => {
            if (res.data.code === 200) {
              this.page = 1;
              this.getDataList();
            } else {
              this.$status(res.data.msg);
            }
          }
        );
        this.name = '';
        this.probeId = '';
        this.probeSim = '';
        this.province_id = '';
        this.city_id = '';
        this.area = '请选择'
      },
      deleteBox(index, id){
        let params = {
          id: id
        };
        Dialog.confirm({
          title: '删除盒子',
          message: '您确认要删除此盒子吗？'
        }).then(() => {
          this.$post('client/delbox', params, (result) => {
            if(result.data.code === 200){
              this.list.splice(index, 1);
            } else {
              this.$status(result.data.msg);
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      clickAreas(){
        this.showAreaPicker = true;
      },
      confirmAreaSelect(value) {
        this.area= value[0].name + value[1].name;
        this.address= value[0].name + value[1].name;
        this.province_id = value[0].code;
        this.city_id = value[1].code;
        this.showAreaPicker = false;
      },
    }
  };
</script>

<style lang="scss"  scoped>
.imgBox{
  display: flex;
  justify-content: center;
  margin: 10px 0px;
}
.create-wrap {
  padding: 15px;
  .custom-bg-color {
    display: inline-block;
    background: linear-gradient(to right, #92c5e7, #4588d4);
    border-radius: 3px;
    color: white;
    text-align: center;
    height: 50px;
    line-height: 50px;
    width: 100%;
    vertical-align: middle;
  }
}
.title {
  font-size: 14px;
  font-weight: normal;
  color: #666;
  /* margin-top: 10px; */
  padding: 3px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.time {
  font-size: 12px;
  line-height: 12px;
  vertical-align: middle;
  color: #999;
  /* margin-top: 3px; */
}
.area{
  width: 100%;
  padding: 10px 15px;
  line-height: 24px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
}
.area::before{
  content: '*';
  position: absolute;
  left: 7px;
  font-size: 14px;
  color: #f44;
}
</style>
