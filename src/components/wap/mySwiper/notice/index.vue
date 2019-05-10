<template>
  <div id='my-noctice'>
    <ul class='con1' ref='con1' :class='{flash:animate==true}'>
      <!--<li  v-if="noticeData" v-for='item in noticeData' @click="turnUrl(item.href)" class="t-ellipsis-1">{{item.name}}</li>-->
      <li v-for='item in items' @click="turnUrl(item.url)" class="t-ellipsis-1">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: ['autotime', 'noticeData'],
    data() {
      return {
        animate: false,
        items: [  // 消息列表对应的数组
          {name: '无数据展示', url: 'http://www.baidu.com'},
          {name: '无数据展示', url: 'http://www.baidu.com'},
          {name: '无数据展示', url: 'http://www.baidu.com'}
        ],
        timer: null
      };
    },
    created() {
      if (this.noticeData) {
        this.items = this.noticeData;
      }
      this.timer = setInterval(this.scroll, this.autotime ? this.autotime : 3000); // 在钩子函数中调用我在method 里面写的scroll()方法，注意此处不要忘记加this,我在这个位置掉了好几次坑，都是因为忘记写this。
    },
    methods: {
      scroll() {
        let con1 = this.$refs.con1;
        con1.style.marginTop = '-30px';
        this.animate = !this.animate;
        var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
        setTimeout(function() {
          that.items.push(that.items[0]);
          that.items.shift();
          con1.style.marginTop = '0px';
          that.animate = !that.animate;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        }, 500);
      },
      turnUrl(href) {
        window.location = href;
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  };
</script>
<style lang="less" scoped>
  #my-noctice{
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    width: 100%;
    transition: all 0.5s;
    .flash{
      transition: all 0.5s;
    }
    .con1 li{
      list-style: none;
      line-height: 30px;
      height: 30px;
    }
  }
</style>
