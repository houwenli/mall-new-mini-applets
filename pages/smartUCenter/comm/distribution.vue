<template>
  <view class="distribution flex">
    <!-- 佣金 -->
    <view
      v-for="(item, key) in modulesList"
      :key="key"
      class="distribution-item"
      @click="navigationTo(item.sceneName)"
    >
      <view class="distribution-item--name">{{ item.text }}</view>
      <view class="distribution-item--data">
        {{ data[item.valName] }}
      </view>
    </view>
    <!-- 分割线 -->
    <view class="distribution-segment">
      <image :src="`${smartImg}/me/pro-order-line.png`"></image>
    </view>
    <!-- 推广订单 -->
    <view class="distribution-arrow flex" @tap="toDistributionOrder">
      <image class="icon" :src="`${smartImg}/me/pro-order.png`" />
      <text class="text">推广订单</text>
      <image class="next" :src="`${smartImg}/me/order-next.png`" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        settledAmount: 0,//已结算佣金
        unsettledAmount: 0,//待结算佣金
      },
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      // 分销模块
      modulesList: [
        {
          text: "已结算佣金(元)", //模块名称
          valName: "settledAmount", //模块数值字段
          sceneName: "smartAccount", // 跳转页面
        },
        {
          text: "待结算佣金(元)",
          valName: "unsettledAmount",
          sceneName: "",
        },
      ],
    };
  },
  methods: {
    // 页面跳转
    navigationTo(sceneName, params) {
      this.$emit("navigationTo", sceneName, params);
    },
    // 去分销订单列表
    toDistributionOrder() {
      this.$smart.go("DistributionOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
/* 分销佣金 */
.distribution {
  justify-content: space-between;
  margin-top: 16rpx;
  padding: 16rpx 0 !important;
  height: 120rpx;
  border-radius: 24rpx;
  background: linear-gradient(90deg, #f7976c 0%, #ff2c51 79%, #ff0b89 100%);
  background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/me/pro-order-bg.png");
  background-size: 100% 100%;
  &-item {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 76rpx;
    padding-left: 24rpx;
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 22rpx;
      left: 0;
      width: 2rpx;
      height: 32rpx;
      background: #eeeeee;
    }
    &:first-child::before {
      display: none;
    }
  }
  &-item--name {
    font-size: 22rpx;
    line-height: 30rpx;
    color: #ffffff;
  }
  &-item--data {
    color: #ffffff;
    font-weight: 600;
    font-family: Arial-BoldMT, Arial;
    font-size: 36rpx;
    line-height: 34rpx;
  }
  &-segment {
    margin-right: 12rpx;
    width: 10rpx;
    height: 88rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-arrow {
    padding: 0 12rpx;
    margin-right: 24rpx;
    height: 76rpx;
    background: #fff;
    border-radius: 38rpx;
    .icon {
      width: 38rpx;
      height: 36rpx;
    }
    .text {
      margin-left: 8rpx;
      line-height: 34rpx;
      font-size: 26rpx;
      font-weight: 600;
      color: #111111;
    }
    .next {
      margin-left: 4rpx;
      width: 16rpx;
      height: 16rpx;
    }
  }
}
</style>
