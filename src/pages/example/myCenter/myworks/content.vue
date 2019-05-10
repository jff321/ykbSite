<template>
  <div class="aui-padded-15 myworks" v-title="$route.meta.title" v-if="workContent != null">
    <h3 class="aui-padded-b-5">{{workContent.uid_link.name}}同学{{workContent.type_link.name}}作品</h3>
    <p>上传时间：{{workContent.updated_at}}</p>
    <p>上传老师：{{workContent.teacher_id_link.name}}</p>
    <div class="aui-content aui-padded-t-15" v-html="workContent.text">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'workscont',
    data() {
      return {
        id: '',
        workContent: null
      };
    },
    created() {
      this.getWorksCont();
    },
    methods: {
      getWorksCont() {
        this.id = this.$route.params.id;
        let _this = this;
        this.askGetData('api/work/' + _this.id, '', function (result) { // 获取banner
          _this.workContent = result.data.data;
        }, true);
      }
    }
  };
</script>
<style scoped>
  .myworks{
    background-color: #fff;
    height: 100%;
  }
</style>
