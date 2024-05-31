<template>
  <view class="equity">
    <!-- 标题 -->
    <view class="equity-title flex">
      <text>我的权益</text>
    </view>
    <!-- 内容 -->
    <view class="equity-inner flex">
      <view
        v-for="(item, index) in modulesList"
        :key="index"
        class="equity-inner__every flex"
        @click="navigationTo(item.sceneName,{ luckValue: data.luckValue})"
      >
        <view>
          <!-- 模块数值 -->
          <view class="equity-inner__every--data">
            {{ data[item.valName] || 0 }}
          </view>
          <!-- 模块名称 -->
          <view class="equity-inner__every--name flex">
            {{ item.text }}
            <image :src="`${smartImg}/me/equity-next.png`" />
          </view>
        </view>
        <!-- 模块图标 -->
        <image :src="item.img" class="equity-inner__every--icon"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        luckValue: 0, // 福气值
        coupon: 0, // 优惠券
      },
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      //权益模块组件按钮集
      modulesList: [
        {
          text: "福气值", //模块名称
          valName: "luckValue", //模块数值字段
          sceneName: "smartFuqizhi", // 跳转页面
          img: `${this.$smartImg}/me/good-fortune.png`, //模块图标
        },
        {
          text: "优惠券",
          valName: "coupon",
          sceneName: "smartCoupon",
          img: `${this.$smartImg}/me/coupon.png`,
        },
      ],
    };
  },
  methods: {
    // 页面跳转
    navigationTo(sceneName, params) {
      this.$emit("navigationTo", sceneName, params);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
/* 我的权益 */
.equity {
  margin-top: 16rpx;
  padding: 16rpx 0 24rpx !important;
  background: #ffffff;
  border-radius: 24rpx;
  &-title {
    padding: 12rpx 16rpx 0 24rpx;
    justify-content: space-between;
    font-size: 30rpx;
    font-weight: 600;
    color: #222222;
    line-height: 40rpx;
  }
  &-inner {
    justify-content: space-between;
    margin-top: 20rpx;
    padding: 0 16rpx 0 12rpx;
  }
  &-inner__every {
    justify-content: space-between;
    position: relative;
    width: 50%;
    height: 100%;
    padding: 0 32rpx 0 36rpx;
    &::after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      width: 2rpx;
      height: 64rpx;
      background: #c3c3c3;
    }
    &:last-child::after {
      display: none;
    }
    &--data {
      font-size: 40rpx;
      font-weight: 600;
      color: #191919;
      line-height: 48rpx;
      padding-bottom: 8rpx;
      font-family: Arial-BoldMT, Arial;
    }
    &--icon {
      flex-shrink: 0;/*防止被压缩*/
      width: 132rpx;
      height: 88rpx;
    }
  }
  &-inner__every--name {
    vertical-align: middle;
    height: 34rpx;
    font-size: 26rpx;
    line-height: 34rpx;
    color: #191919;
    image {
      margin-left: 4rpx;
      width: 24rpx;
      height: 26rpx;
    }
  }
}
</style>
