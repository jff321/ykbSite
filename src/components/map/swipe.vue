<template>
    <div class="swipe" v-if='isShowSearch'>
      <van-swipe :touchable="true">
        <van-swipe-item v-for="index1 in listNumber" :key="index1">
          <van-row>
            <van-col :span="3" v-for="(items,index2) in probelist[index1-1]" :key="index2" style="padding-bottom: 5px">
              <div class="list">
                <div class="list-header"><img :src="headImg[0]" alt="" ></div>
                <div class="list-content">{{items.updated_at | dateFrm}}</div>
                <div  class="list-content ellipsis">{{items.distance}}</div>
                <div class="list-content ellipsis">{{items.type?items.type:'无'}}</div>
              </div>
            </van-col>
          </van-row>
        </van-swipe-item>
      </van-swipe>
    </div>
</template>

<script>
  import moment from 'moment';
  import { Row, Col, Icon, Dialog, Swipe, SwipeItem } from 'vant';
    export default {
      name: 'swipe',
      props: ['sorttype', 'tabtype', 'binding'],
      components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Dialog.name]: Dialog,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
      },
      data() {
        return {
          listNumber: 0,
          isShowSearch: false,
          probelist: [],
          headImg: [
            'http://p98adskah.bkt.clouddn.com/images/2018-06-27/cziGrJMpW5TTjVPmdE4iIFzsBW4VcPTLf88V8uqI.png?imageView2/0/w/1000/h/1000',
            'http://p98adskah.bkt.clouddn.com/images/2018-06-27/UaXh6sWKygFbZQBB9EUfCdjgfbqx8hHHkRJmLyyP.png?imageView2/0/w/1000/h/1000'
          ],
          type: '',
          selectDate: '',
          bindSelect: '',
          beginTimes: '',
          endTimes: ''
        };
      },
      watch: {
        // isshowswipe: function (newValue) {
        //   console.info('变化的切换开关', newValue);
        //   if (newValue) {
        //     this.isShowSearch = newValue;
        //     this.getDataList();
        //   }
        // },
        sorttype: function (newValue) {
          console.info('排序方式', newValue);
          this.selectDate = newValue;
          this.getDataList();
        },
        tabtype: function (newValue) {
          console.info('导航切换', newValue);
          this.type = newValue;
          this.getDataList();
        },
        binding: function (newValue) {
          console.info('盒子切换', newValue);
          this.bindSelect = newValue;
          this.getDataList();
        }
      },
      filters: {
        dateFrm: function (el) {
          return moment(el).format('HH:mm');
        }
      },
      mounted() {
        this.selectDate = this.sorttype;
        this.bindSelect = this.binding;
        this.type = this.tabtype;
        this.getTodayDate();
        this.getDataList();
      },
      methods: {
        getTodayDate() {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
          this.transferDate([start, end]);
        },
        transferDate(value) {
          this.beginTimes = value[0].getFullYear() + '-' + (value[0].getMonth() + 1) + '-' + value[0].getDate();
          this.endTimes = value[1].getFullYear() + '-' + (value[1].getMonth() + 1) + '-' + (value[1].getDate() + 1);
          console.info(this.beginTimes, this.endTimes);
        },
        getDataList() {
          this.probelist = [];
          let valuetitle;
          let valueDate;
          let value;
          if (this.type === '1') {
            value = '';
          } else if (this.type === '2') {
            value = 'new=1&';
          } else if (this.type === '3') {
            value = 'return=1&';
          } else if (this.type === '4') {
            value = 'phone$=>0&';
          }
          if (this.selectDate === '1') {
            valueDate = '&@sort=updated_at.desc';
          } else if (this.selectDate === '2') {
            valueDate = '&@sort=rssi.desc';
          } else if (this.selectDate === '3') {
            valueDate = '&@sort=time.desc';
          }
          if (this.bindSelect === 'all') {
            valuetitle = '';
          } else {
            valuetitle = '&mid$=' + this.bindSelect;
          }
          let updated = 'updated_at$' + '=>=' + this.beginTimes + ',<=' + this.endTimes;
          console.info('搜索条件', 'media/mac/?' + value + updated + '&pageSize=50' + valuetitle + valueDate);
          this.$get('media/mac/?' + value + updated + '&pageSize=50' + valuetitle + valueDate, '', (res) => {
            console.info('swiper数据', res.data.data);
            if (res.data.status === 1) {
              if (!res.data.mate.total) {
                this.isShowSearch = false;
              } else {
                this.isShowSearch = true;
                // this.total = res.data.mate.total;
                this.listNumber = Math.ceil(res.data.data.length / 8);
                for (let i = 0; i <= this.listNumber - 1; i++) {
                  this.probelist.push(res.data.data.slice(8 * i, 8 * (i + 1)));
                }
              }
            } else {
              console.info('数据获取失败');
            }
          });
        }
      }
    };
</script>
<style>
  .van-swipe__indicators{
    bottom: 0px;
  }
 .ellipsis{
   overflow:hidden;
   text-overflow:ellipsis;
   white-space:nowrap
 }
</style>
<style scoped>
.swipe{
  width: 100%;
  height: 100px;
}
.list-header{
  display: flex;
  justify-content: center;
}
.list-header img{
  width:30px;
  height:38px;
}
  .list-content{
    text-align:center;
    color: #333;
    font-size: 10px
  }
</style>
