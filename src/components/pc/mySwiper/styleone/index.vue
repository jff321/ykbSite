<template>
    <Carousel
      v-model="indexvalue"
      :autoplay="setting.autoplay"
      :autoplay-speed="setting.autoplaySpeed"
      :dots="setting.dots"
      :trigger="setting.trigger"
      :arrow="setting.arrow"
      :on-change="change()"
      :class="setting.dotsstyle">
      <template v-if="this.isdemo == 1">
        <CarouselItem>
            <img src="../images/banner1.jpg" alt="" />
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">
            <img src="../images/banner2.jpg" alt="" />
          </div>
        </CarouselItem>
        <CarouselItem>
            <img src="../images/banner3.jpg" alt="" />
        </CarouselItem>
        <CarouselItem>
            <img src="../images/banner1.jpg" alt="" />
        </CarouselItem>
      </template>
      <template v-else>
        <CarouselItem v-for="">
          <img src="../images/banner1.jpg" alt="" />
        </CarouselItem>
      </template>
    </Carousel>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'mySwiper',
    props: ['speed', 'autoplay', 'dotsstyle', 'isdemo', 'apiurl'],
    data () {
      return {
        indexvalue: 0,
        setting: {
          autoplay: this.autoplay ? this.autoplay : true,
          autoplaySpeed: this.speed ? this.speed : 3000,
          dots: 'inside',
          trigger: 'hover',
          arrow: 'hover',
          dotsstyle: this.dotsstyle ? 'myswiper-rectangle' : 'myswiper-circle',
          imgurls: null
        }
      };
    },
    methods: {
      change() {}
    },
    created() {
      this.askGetData(this.apiurl, {id: 1}, function (data) {
        console.info(data);
        this.imgurls = data.data;
      });
    }
  };
</script>
<style>
  .ivu-carousel-dots li button{
    opacity: .6;
  }
  .myswiper-circle img{
    display: block;
  }
  .myswiper-circle .ivu-carousel-dots li button{ /*圆形dot*/
      width: 12px !important;
      height: 12px !important;
      border-radius: 100%;
      margin-top: -25px;
      background-color: #4c4c4c;
  }
  .myswiper-rectangle .ivu-carousel-dots li button{ /*矩形dot*/
     height: 5px;
     border-radius: 20px;
     background-color: #4c4c4c;
     margin-top:-20px;
  }
</style>
