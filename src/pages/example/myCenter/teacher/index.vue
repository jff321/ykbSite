<template>
  <div class="teacher" v-title="$route.meta.title">
    <div class="bar"></div>
    <div class="aui-content aui-padded-15">
        <div class="aui-row aui-padded-t-10">
          <div class="aui-col-xs-3 aui-font-size-14 aui-padded-t-10 aui-padded-b-10">
            选择课程：
          </div>
          <div class="aui-col-xs-9">
            <select v-model="Course_id" class="aui-border select">
              <option >请选择需要</option>
              <template class="aui-col-xs-2" v-for="items in navList">
                <option :value="items.id">{{items.name}}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="aui-row aui-padded-t-15 aui-padded-b-15 aui-margin-t-15">
          <div class="aui-col-xs-3 aui-font-size-14 aui-padded-b-10">
            课程介绍：
          </div>
          <div class="aui-col-xs-9">
            <textarea v-model="content" class="aui-border aui-font-size-14 aui-padded-15 text" placeholder="请输入介绍内容"></textarea>
          </div>
        </div>
    </div>
    <div class="bar"></div>
    <div class="aui-content aui-padded-15">
      <div class="aui-row aui-padded-t-5 aui-padded-b-15">
        <div class="aui-col-xs-12 aui-font-size-14 aui-padded-b-10">
          选择学生：
        </div>
        <div class="aui-col-xs-12 aui-padded-t-5 student">
          <div class="aui-row">
            <div class="aui-col-xs-3 aui-padded-5" v-for="items in stuDentList.own">
              <div class="aui-border selectPeople" :class="{'red': isInArray(failedUid, items.id)}" @click="selectStudent(items.id)">
                <img src="./imgs/active.png" class="activebtn" v-show="isInArray(User_id, items.id)" alt="">
                <!--<img class="stu" :src="items.portrait_small" alt="">-->
                <img class="stu" :src="imgCropp(items.portrait_origin, 1, 100, 100)" alt="">
                <p class="aui-font-size-14 aui-padded-t-5 aui-text-wrap">{{items.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="aui-content aui-padded-15">
      <button class="aui-btn aui-btn-warning submit" @click="askPostLesson()">确认提交</button>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'saolei',
    data() {
      return {
        isShowRedBox: false,
        stuDentList: {},
        navList: {},
        Course_id: null,
        content: null,
        User_id: [],
        failedUid: [] // 判断学生是否 扣课达标  checkUserIsOk[items.id] == true
      };
    },
    created() {
      this.getNav();
      this.getMyStudent();
    },
    components: {
    },
    methods: {
      getMyStudent() {
        this.type = this.$route.params.id;
        let _this = this;
        this.askGetData('api/user/0', '', function (result) { // 获取 我的学生
            _this.stuDentList = result.data.data;
        }, true);
      },
      getNav() {
        let _this = this;
        this.askGetData('api/course?type=1', '', function (result) { // 获取栏目
          _this.navList = result.data.data;
        }, true);
      },
      selectStudent(id) { // 选择学生
          this.failedUid = []; // 清除 失败学生
          if (this.isInArray(this.User_id, id)) { // 在其中 就删除
//            this.User_id.pop(id);
            this.removeArrVal(this.User_id, id);
          } else { // 没有在就添加
            this.User_id.push(id);
          }
      },
      askPostLesson() { // 发起扣课
        if (!this.Course_id) {
          alert('请选择课程');
        } else if (!this.User_id.length) {
          alert('请选择学生');
        } else {
//          console.info(this.Course_id);
//          console.info(this.User_id);
          let _this = this;
          let params = {'course_id': this.Course_id, 'uid': this.User_id, 'content': this.content};
          this.askPostData('api/courserecord/', params, function (result) { // 发起扣课
            _this.failedUid = result.data.data.uid;
            MessageBox.alert(result.data.data.msg);
          }, true);
        }
      }
  }
  };
</script>
<style scoped>
  .teacher{
    height: 100%;
    background-color: #fff;
  }
  .select{
    float: left;
    height: 2rem;
    padding-left:15px;
    font-size:.7rem;
    color: #666;
  }
  .bar{
    height: 8px;
    width:100%;
    background-color: rgba(230,205,155,0.3);
  }
  .text{
    /*border:1px #ddd solid;*/
    width:100%;
    height: 5rem;
  }
  .selectPeople{
    width:100%;
    padding: 5px 5px 0;
    background-color: rgba(230,205,155,0.3);
  }
  .selectPeople img.stu{
    width:100%;
  }
  .student .aui-row{
    margin: 0 -.2rem;
  }
  .activebtn{
    position: absolute;
    left: .6rem;
    top: .6rem;
    width:1rem;
  }
  .submit{
    border: 0;
    width:100%;
    border-radius: 30px;
    height: 2rem;
    line-height:2rem;
  }
  .red{
    background-color: #FF9770;
    border:1px #FF9770 solid;
    color: #fff !important;
  }
  .red p{
    color:#fff;
  }
</style>
