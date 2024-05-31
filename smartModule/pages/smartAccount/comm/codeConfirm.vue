<template>
  <u-popup
    v-model="show"
    mode="center"
    border-radius="32"
    width="640"
    :mask-close-able="false"
    :closeable="false"
    :custom-style="{ padding: '64rpx 48rpx 0' }"
    class="codeconfirm"
  >
    <view class="codeconfirm__head flex">
      <text class="codeconfirm__head--title">
        尾号{{ data._reservePhone }}已发送验证码
      </text>
      <image
        class="codeconfirm__head--clo"
        :src="`${smartImg}/account/extract-close.png`"
        @click="clone"
      />
    </view>
    <view class="codeconfirm__content flex">
      <view class="codeconfirm__content--title">到帐金额</view>
      <view class="codeconfirm__content--money flex">
        <text class="unit">¥</text>
        <text class="price">
          {{ data._receiveMoney }}
        </text>
      </view>
      <view class="codeconfirm__content--standard flex">
        <text>收费标准</text>
        <text>{{ data.describe || 0 }}</text>
      </view>
      <view class="codeconfirm__content--code">
        <u-message-input
          active-color="#FE3040"
          width="100"
          @finish="finish"
        ></u-message-input>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  options: {
    styleIsolation: "shared",
  },
  props: {
    //是否显示
    show: {
      type: Boolean,
      default: false,
    },
    //数据
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
    };
  },
  methods: {
    // 关闭弹窗
    clone() {
      this.$emit("clone");
    },
    // 验证码输入结束
    finish(e) {
      this.$emit("getCode", e);
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.codeconfirm {
  font-family: PingFangSC-Regular, PingFang SC;
  &__head {
    position: relative;
    padding: 26rpx 80rpx 48rpx;
    &--title {
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #111111;
      line-height: 36rpx;
    }
    &--clo {
      position: absolute;
      right: 24rpx;
      width: 54rpx;
      height: 40rpx;
    }
  }
  &__content {
    flex-direction: column;
    align-items: center;
    padding: 0 80rpx 40rpx;
    &--title {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 30rpx;
    }
    &--money {
      margin-top: 16rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #191919;
      .unit {
        font-size: 40rpx;
        line-height: 34rpx;
      }
      .price {
        font-size: 72rpx;
        line-height: 80rpx;
      }
    }
    &--standard {
      justify-content: space-between;
      margin-top: 48rpx;
      width: 100%;
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 34rpx;
    }
    &--code {
      position: relative;
      margin-top: 48rpx;
      width: 100%;
      /deep/ .u-box {
        margin: 0 !important;
        width: 90rpx !important;
        height: 104rpx !important;
        background: #f6f6f6 !important;
        border-radius: 24rpx;
        font-size: 48rpx !important;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600 !important;
        border: none;
        color: #191919 !important;
      }
      /deep/.u-box-active {
        border: 2rpx solid #FE3040;
      }
      /deep/ .u-char-flex {
        justify-content: space-between;
      }
    }
  }
}
</style>
