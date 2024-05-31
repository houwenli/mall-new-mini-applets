<template>
  <!-- 合并订单 -->
  <wsf-popup v-model="show" mode="bottom" height="1200" @close="cancel">
    <view class="popup-container" v-if="show">
      <view class="title"> 温馨提示 </view>
      <view class="hint">以下订单一起提交，需合并支付</view>
      <view class="hint">如不想一起支付可以先取消不需要的订单再付款</view>
      <scroll-view scroll-y="true" class="order-scroll-view">
        <view
          class="order-card"
          v-for="(item, index) in data.orderInfoVos"
          :key="index"
          @tap="goOrderDetail(item)"
        >
          <view class="order-card-header">
            <text>订单号：{{ item.orderCode }}</text>
            <text class="num">（共{{ item.num }}件）</text>
          </view>
          <image
            class="order-card-img"
            v-for="(n, i) in item.skuImgUrls"
            :src="n"
          />
          <view class="price"> <text>￥</text>{{ item.price }} </view>
        </view>
      </scroll-view>
			<view class="bottom-box">
				<view class="fqz-column" v-if="data.fqzPrice && Number(data.fqzPrice) > 0">
					福气值已抵扣：<text class="light" style="margin-right: 32rpx">¥{{data.fqzPrice ? data.fqzPrice.toFixed(2) : '0.00'}}</text>
					仍需支付：<text class="light">¥{{data.orderFqzAmount ? data.orderFqzAmount.toFixed(2) : '0.00'}}</text>
				</view>
				<view class="button-box">
      	  <button class="button cancel-btn" @tap="cancel()">再想想</button>
      	  <button class="button confirm-btn" @tap="confirm()">确认支付</button>
      	</view>
			</view>
    </view>
  </wsf-popup>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {
        return {
          wsOrderCode: "",
          totalAmount: 0,
          orderFqzAmount: 0,
					fqzPrice: 0,
          orderInfoVos: [],
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //提交合并支付
    confirm() {
      let orderMoney = this.data.fqzPrice ? this.data.orderFqzAmount : this.data.totalAmount,
        orderCode = this.data.wsOrderCode;
      this.$wsf.go("Pay", { orderMoney, orderCode, businessType: 100,
        paySceneType: 101 //电商订单
      });
    },
    cancel() {
      this.$emit("close");
    },
    //去订单详情
    goOrderDetail(item) {
      this.$wsf.go("PendingPayment", { orderId: item.orderId });
    },
  },
};
</script>

<style scoped lang="scss">
.popup-container {
  margin-bottom: env(safe-area-inset-bottom);
  padding: 40rpx 36rpx 0;
  ::-webkit-scrollbar {
    display: none;
  }
  .title {
    text-align: center;
    line-height: 48rpx;
    font-weight: bold;
    color: #000;
    margin-bottom: 16rpx;
    font-size: 40rpx;
  }
  .hint {
    color: #90969e;
    line-height: 36rpx;
    font-size: 28rpx;
    text-align: center;
  }
  .order-scroll-view {
    height: 788rpx;
    margin-top: 48rpx;
    .order-card {
      padding: 0 12rpx 32rpx;
      .order-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #000;
        .num {
          color: #999;
          font-size: 24rpx;
        }
      }
      .order-card-img {
        width: 148rpx;
        height: 148rpx;
        margin-top: 22rpx;
        margin-right: 20rpx;
        &:nth-child(4n + 1) {
          margin-right: 0;
        }
      }
      .price {
        text-align: right;
        color: #de3a38;
        font-weight: bold;
        line-height: 34rpx;
        margin-top: 14rpx;
        font-size: 36rpx;
        .yuan {
          font-size: 28rpx;
        }
      }
    }
  }
  .bottom-box {
    padding: 20rpx 0 40rpx;
		position: relative;
    &::before {
      content: " ";
      height: 1rpx;
      background-color: #d5d5d5;
      width: 100vw;
      position: absolute;
      top: 0;
      left: -34rpx;
    }
    &::after {
      content: " ";
      width: 100vw;
      position: absolute;
      top: -60rpx;
      left: -34rpx;
      height: 60rpx;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 100%
      );
    }
    .fqz-column {
      text-align: center;
      font-size: 24rpx;
      color: #000;
      padding-bottom: 20rpx;
      .light {
        color: #e60113;
        font-size: 24rpx;
      }
    }
    .button-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .button {
        width: 326rpx;
        height: 80rpx;
        border-radius: 40rpx;
        text-align: center;
        line-height: 80rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        margin: 0;
      }
      .cancel-btn {
        border: 1px solid #e60113;
        color: #e60113;
        background-color: #fff;
      }
      .confirm-btn {
        background: #e60113;
        color: #fff;
      }
    }
  }
}
</style>
