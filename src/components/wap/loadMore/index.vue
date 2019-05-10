<template>
  <scroller :on-refresh="refresh" :on-infinite="infinite" class="loadMoreBox">
    <slot :backdata="dataResult">
      <!--内容加载中-->
    </slot>
    <p class="aui-padded-10 aui-font-size-14 loadmoretxt" v-show="!hasData && page != 1 && !ishidden">上拉加载更多</p>
  </scroller>
</template>
<script>
  export default {
    name: 'loadMore',
    props: ['api'],
    data() {
      return {
        page: 1,
        pageSize: 4,
        hasData: null,
        dataResult: [],
        ishidden: false // 是否隐藏 上拉加载更多
      };
    },
    methods: {
      getData() { // 活动列表
        let url = this.api + 'pageSize=' + this.pageSize + '&page=' + this.page;
        this.askGetData(url, '', (result) => { // 获取活动
          if (this.page === 1) {
            this.dataResult = [];
          }
          if (result.data.data.length !== 0) {
            for (let key in result.data.data) {
              this.dataResult.push(result.data.data[key]);
            }
          } else {
            this.hasData = 1; // 返回没有数据
          }
          console.info(this.dataResult);
        }, true);
      },
      refresh(done) {
        setTimeout(() => {
          this.page = 1;
          this.getData();
          done();
        }, 1500);
      },
      infinite(done) { // 加载更多插件
        if (this.hasData) { // 代表没有 更多数据了
          done(true);
        } else {
          setTimeout(() => {
            this.getData();
            setTimeout(() => {
              done();
              this.page++;
            }, 400);
          }, 1500);
        }
      }
    }
  };
</script>
<style scoped>
  .loadMoreBox{
    min-height: 6rem;
    position: relative;
  }
  .loadmoretxt{
    color: rgb(170, 170, 170);
  }
</style>
