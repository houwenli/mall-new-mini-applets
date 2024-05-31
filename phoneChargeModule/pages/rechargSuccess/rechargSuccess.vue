<template>
  <!-- 支付成功页 -->
  <view class="pay-success">
    <view class="main">
      <image class="image" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/pay_success%402x.png" alt="" />
      <text class="status">支付成功！</text>
      <text class="text">预计10分钟左右到账，请关注短信</text>
      <view class="btn">
        <view class="btn-round mall" @click="onBack"> 商城首页 </view>
        <view class="btn-round onemore" @click="onBuy"> 再次购买</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
			orderCode: '', // 订单编号
			orderType: 0, // 订单状态 1 - 未支付
			orderId: '', // 订单id
      payStatus: 0
    }
  },
  computed:{
    wxzfId(){
      return localStorage.getItem('wxzf_id')
    }
  },
  onLoad(options) {
		this.orderCode = options.orderCode;
	},
  onShow() {
    setTimeout(() => {
			this.loadOrderDetail();
		}, 500);
  },
  methods: {
    // 回到商城首页
    onBack() {
      this.$wsf.go("Index");
    },
    // 再次购买话费
    onBuy() {
      this.$wsf.go('phoneCharge')
    },
    // 查询订单支付状态
		loadOrderDetail() {
			this.$u.api.queryOrderStatus({orderNo: this.orderCode}).then(res => {
				if (res.code == 200) {
					this.payStatus = res.data.payStatus;
				}
			});
		}
  }
}
</script>
<style lang="less" scoped>
.pay-success {
  height: 100%;
  background: #f6f6f6;
  padding: 24rpx;
  .main {
    padding-top: 32rpx;
    background: #ffffff;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .image {
      margin: 32rpx 0 16rpx 0;
      width: 144rpx;
      height: 144rpx;
    }
    .status {
      font-size: 44rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000d1d;
      margin-bottom: 16rpx;
    }
    .text {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c3c3c3;
    }
    .btn {
      margin: 72rpx 0 32rpx 0;
      display: flex;
      align-items: center;
      .btn-round {
        min-width: 260rpx;
        height: 80rpx;
        border-radius: 40rpx;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
      .mall {
        margin-right: 16rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FF0A35;
        border: 2rpx solid #FF1035;
      }
      .onemore {
        color: #fff9e9;
        background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      }
    }
  }
}
</style>