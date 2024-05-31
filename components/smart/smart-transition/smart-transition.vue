<template>
  <view
    class="transition"
    :class="[
      typeName == 'loading' ? 'ws-loading' : 'ws-default',
      { 'phone-bto': isPhoneBto },
      { 'transition-flex': !topHight },
    ]"
  >
    <view class="transition-content transition-flex" :style="[contentStyle]">
      <!-- 展示图片 -->
      <image :src="imgList[typeName]" />
      <!-- 提示文字 -->
      <text>{{ text }}</text>
      <!-- 按钮插槽 -->
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    //居中是否减去IOS底部安全距离
    isPhoneBto: {
      type: [Boolean],
      default: true,
    },
    //默认loading文案
    text: {
      type: [String],
      default: "加载中...",
    },
    //缺省图类型
    typeName: {
      type: String,
      default: "loading",
    },
    //缺省图样式时，距离区域顶部的距离（设置此属性默认不居中）
    topHight: {
      type: String,
      default: "",
    },
  },
  computed: {
    contentStyle() {
      return { marginTop: this.topHight + "rpx" };
    },
  },
  data() {
    return {
      imgList: {
        loading: `${this.$smartImg}/comm/loading.gif`, //加载中
        noNetwork: `${this.$smartImg}/comm/blank_network.png`, //暂无网络
        noPreferential: `${this.$mallImg}/coupon/empty.png`, //暂无优惠
        noHistory: `${this.$smartImg}/fuqizhi/fuqizhi.png`, //暂无流水
        noAddress: `${this.$smartImg}/setUp/address.png`, //暂无地址
        noBankCard: `${this.$smartImg}/account/bankCard.png`, //暂无银行卡
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.transition-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.transition {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 998;
  overflow: hidden;
}
.phone-bto {
  padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
}
.ws-default {
  .transition-content {
    image {
      width: 320rpx;
      height: 320rpx;
    }
    text {
      margin-top: 24rpx;
      font-size: 26rpx;
      color: #999999;
      line-height: 34rpx;
    }
  }
}
.ws-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  .transition-content {
    width: 272rpx;
    height: 272rpx;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 23px;
    image {
      width: 160rpx;
      height: 80rpx;
    }
    text {
      margin-top: 4rpx;
      font-size: 10px;
      font-weight: 400;
      color: #90969e;
      line-height: 14px;
    }
  }
}
</style>
