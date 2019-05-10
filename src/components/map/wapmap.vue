<template>
    <div class="map-waps">
      <van-row>
        <van-col :span="24" style="height: 200px;background-color: #fff">
          <div class="maps">
            <map-list :showBusiness="false" :showSearchBox="false" :model="false" :makers="markers" :number="num"></map-list>
            <div class="maptop"></div>
            <div class="radar">
              <div class="radartext">{{total}}</div>
              <transition-group tag="ul" name="fade">
                <li  v-for="(items,index) in dataset" :key="index">
                  <div class="dot" :style="{left: items.left + 'px', top: items.right + 'px'}"></div>
                </li>
              </transition-group>
              <div class="circleone circle">
                <div class="circletwo circle"></div>
              </div>
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
</template>

<script>
  import { Row, Col, Icon, Dialog } from 'vant';
    export default {
      name: 'map-waps',
      props: ['markerlist', 'number', 'totals'],
      components: {
        mapList: function (resolve) {
          require(['../../components/map/maps.vue'], resolve);
        },
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Dialog.name]: Dialog
      },
      data() {
          return {
            interval: null,
            interval1: null,
            circleNumber: null,
            circlenumbers: null,
            total: 0,
            num: null,
            saveBinding: [],  // 首次显示的标记值
            dataset: [], // 扫描点
            markers: [] // 地图多点标记
          };
      },
      watch: {
        totals: function (newValue) {
          this.total = newValue;
        },
        markerlist: function (newValue) {
          // console.info(newValue);
          this.markers = newValue;
        }
      },
      mounted() {
        this.num = this.number;
        this.interval = setInterval(() => {
          this.setRondom();
        }, 3000);
        this.interval1 = setInterval(() => {
          this.deleteCircle();
        }, 5000);
      },
      methods: {
        setRondom() {
          // 随机出现扫描的盒子点
          this.circleNumber = Math.floor((Math.random() * 10) + 10);
          this.circlenumbers += this.circleNumber;
          for (let i = 0; i <= this.circleNumber; i++) {
            this.dataset.push({left: Math.floor(Math.random() * 200), right: Math.floor(Math.random() * 200)});
          }
        },
        deleteCircle() {
          this.dataset.splice(0, this.circlenumbers + 3);
          this.circlenumbers = null;
        }
      }
    };
</script>

<style scoped>
  /*地图 */
  .maps{
    width:100%;
    height: 200px;
    /*padding: 10px 0;*/
    /*background-color:#EEEDDB ;*/
    /*background：url("http://picuser.city8.com/news/image/20141014/%B3%C9%B6%BC%BD%BB%CD%A8%B5%D8%CD%BC2014%B0%E6.jpg");*/
    /*overflow: hidden;*/
    position: relative;
  }
  .maptop{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  .dot{
    position: absolute;
    z-index: 14;
    /*top: 100px;*/
    /*left: 100px;*/
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #29ea26;
  }
  .circleone{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    margin: -70px 0 0 -70px;

  }
  .circletwo{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;

  }
  .circle{
    border: 2px solid #169414;
    border-radius: 50%;
  }
  .radar {
    box-shadow: 0px 0px 20px #00ff33;
    background:-webkit-linear-gradient(90deg, rgba(12, 77, 11, 0.5) 49.5%, #4CA44B 50%, #4CA44B 50%, rgba(12, 77, 11, 0.5) 50.2%), -webkit-linear-gradient(0deg, rgba(12, 77, 11, 0.5) 49.5%, #29ea26 50%, #29ea26 50%, rgba(12, 77, 11, 0.5) 50.2%);
    /*background: linear-gradient(90deg, rgba(0, 128, 0, 0.6) 49.5%, #fff 50%, #fff 50%, rgba(0, 128, 0, 0.6) 50.2%), linear-gradient(0deg, rgba(0, 128, 0, 0.6) 49.5%, #fff 50%, #fff 50%, rgba(0, 128, 0, 0.6) 50.2%);*/
    width: 200px;
    height: 200px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    overflow: hidden;
  }
  .radartext{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 15;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 200px;
    color: #fff;
    font-size: 30px;

  }
  .radar:after {
    content: ' ';
    display: block;
    background-image: linear-gradient(50deg, rgba(0, 255, 51, 0) 50%, #00ff33 100%);
    width: 50%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
    animation: radar-beam 5s infinite;
    animation-timing-function: linear;
    transform-origin: bottom right;
    border-radius: 100% 0 0 0;
    z-index: 16;
  }

  @keyframes radar-beam {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes blips {
    14% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    14.0002% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    25% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    26% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
      opacity: 1;
    }
    100% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
      opacity: 0;
    }
  }
  /*地图 */
</style>
