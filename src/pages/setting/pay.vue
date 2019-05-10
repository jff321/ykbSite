<template>
  <div>
    <van-nav-bar
      title="在线支付"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
    />
    <div style="margin: 66px 0px 20px 0px">
      <van-cell-group>
        <van-field input-align="center" type="number" v-model="money" placeholder="请输入充值金额" />
      </van-cell-group>
    </div>
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell clickable @click="radio = '1'">
          <template slot="title">
            <div style="display: inline-block;">
              <img src="./imgs/微信支付.png" alt="" style="width: 20px;height: 20px;vertical-align:middle;">
              <span>微信支付</span>
            </div>
          </template>
          <van-radio name="1" />
        </van-cell>
        <van-cell title="支付宝支付" clickable @click="radio = '2'">
          <template slot="title">
            <div style="display: inline-block;">
              <img src="./imgs/payment1.png" alt="" style="width: 20px;height: 20px;vertical-align:middle;">
              <span>快捷支付</span>
            </div>
          </template>
          <van-radio name="2" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div style="padding: 20px 10px 10px;">
      <van-button type="primary" block @click="confirmPay">确认支付</van-button>
    </div>
    <div class="explain">
      <p>充值说明：</p>
      <p>1、在线支付银行收取相应手续费，以界面提示为准（实时到费用余额），微信支付手续费千分之六。快捷支付需绑定储蓄卡，手续费千分之三。</p>
      <p>2、人工充值可以选择：（需要人工充值，等待时间60分钟内）</p>
      <p>微信转帐免手续费（微信17324481763）</p>
      <p>银行转帐免手续费：</p>
      <p>公司名称：优客宝实业发展（深圳）有限公司</p>
      <p>开户行及账号：民生银行深圳蛇口支行  158403099</p>
      <p>法人收款帐户：陈欣然</p>
      <p>开户行：民生银行深圳蛇口支行</p>
      <p>账   号：62262206385347833</p>
      <p>如果有任何问题致电4006335185或17324481763（微信同号）</p>
    </div>
  </div>
</template>

<script>
  import {
    NavBar,
    Cell,
    CellGroup,
    RadioGroup,
    Radio,
    Button,
    Field,
    Toast
  } from 'vant';
  export default {
    name: "pay",
    components: {
      [NavBar.name]: NavBar,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [Field.name]: Field,
      [Toast.name]: Toast,
    },
    data() {
      return {
        radio: '1',
        money: ''
      }
    },
    methods: {
      onClickLeft() {
        this.$router.push({path: 'setting'});
      },
      confirmPay(){
        if(!isNaN(this.money) && !this.money){
          Toast('请输入金额');
        }
      }
    }
  }
</script>

<style scoped>
.explain{
  font-size: 12px;
  padding: 10px 10px 10px;
}
</style>
