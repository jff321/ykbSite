<template>
    <div class="telephone">
      <div class="popus" v-if="isShowPopus">
        <div class="popus-center">
          <div class="telephone">&nbsp;{{telephone}}</div>
          <div class="popus-btn">
            <div @click="cancel">取消</div>
            <a :href="'tel:' + telephone">拨打</a>
          </div>
        </div>
      </div>
      <div class="popus" v-if="isShowTip">
        <div class="popus-center"  style="width: 280px;">
          <div class="telephone" style="font-size: 12px;padding: 20px 12px;">为了保护通话隐私和安全，已自动转拨随机号码通话将产生本机话费，亲知悉。</div>
          <div class="popus-btn">
            <div @click="confirmToTel" style="width: 100%;background-color: #eee">确定</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'telephone',
      props: ['tel'],
      data() {
          return {
            telephone: null,
            isShowPopus: false,
            isShowTip: false
          };
      },
      watch: {
        tel: function (value) {
          console.info('传进去的值', value);
          if (value) {
            this.telephone = value;
            this.isShowTip = true;
          }
        }
      },
      methods: {
        cancel() {
          this.isShowPopus = false;
        },
        confirmToTel() {
          this.isShowTip = false;
          setTimeout(() => {
            this.isShowPopus = true;
          }, 500);
        }
      }
    };
</script>

<style scoped>
  .popus{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
  }
  .popus-center{
    width: 230px;
    /*height: 130px;*/
    border-radius: 5px;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
  }
  .popus-btn{
    display: flex;
    width: 100%;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    font-size: 14px;
    color: rgba(0,0,0,0.6);
  }
  .popus-btn div,.popus-btn a{
    height: 40px;
    border-top: 1px solid #eee;
    width:50% ;
    line-height: 40px;
    text-align: center;
  }
  .popus-title{
    text-align: center;
  }
  .popus-extension{
    text-align: center;
    color: red;
    padding: 2px 5px;
    font-size: 22px;
  }
  .telephone{
    font-size:20px;
    text-align: center;
    padding: 20px 0 20px 0;
    color: #4B8EDD;
  }
  .popus-btn div:nth-child(1){
    border-right:1px solid #eee;
  }
  .popus-btn a{
    display: block;
  }
</style>
