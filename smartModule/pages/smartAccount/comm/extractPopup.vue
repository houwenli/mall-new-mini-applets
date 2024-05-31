<template>
  <u-popup
    v-model="popShow"
    mode="bottom"
    :border-radius="24"
    :mask-close-able="true"
    :mask-custom-style="{ backgroundColor: 'rgba(0, 13, 29, 0.6)' }"
    @close="closeExtractPopup"
  >
    <view class="extractPopup">
      <view class="extractPopup-title">
        选择银行卡
        <image
          src="@/static/img/icon/close-icon.png"
          class="extractPopup-title__icon"
          @click="closeExtractPopup()"
        ></image>
      </view>
      <view class="extractPopup-list">
        <view
          class="extractPopup-list__item flex"
          v-for="(item, index) in data"
          :key="index"
          @click="selected(item)"
        >
          <text class="extractPopup-list__label">
            <text>{{ item.bankName }}</text>
            <text>({{ item._bankCard }})</text>
          </text>
          <view
            :class="[
              'extractPopup-list__img',
              { 'extractPopup-list__img--select': selectId == item.bankId },
            ]"
          />
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "dateScreenPopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      selectId: 0, //选中的值
      popShow: false,
    };
  },

  watch: {
    show() {
      this.popShow = this.show;
    },
  },

  methods: {
    // 关闭弹窗
    closeExtractPopup() {
      this.$emit("closeExtractPopup");
    },
    // 选择银行
    selected(val) {
      if (!val) return;
      this.selectId = val.bankId;
      this.$emit("getCardName", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  align-content: center;
}
.extractPopup {
  height: 740rpx;
  &-title {
    padding: 28rpx 16rpx 48rpx;
    text-align: center;
    width: 100%;
    height: 114rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #111111;
    &__icon {
      width: 54rpx;
      height: 40rpx;
      position: absolute;
      right: 16rpx;
    }
  }
  &-list {
    overflow: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    padding: 0 16rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    height: 626rpx;
    &__item {
      justify-content: space-between;
      width: 100%;
      height: 108rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #191919;
      line-height: 44rpx;
      text-align: center;
      margin: 0rpx 24rpx 0rpx 24rpx;
      border-bottom: 1rpx solid #eeeeee;
      &:last-child {
        border-bottom: none;
      }
    }
    &__label {
      text {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        line-height: 44rpx;
      }
    }
    &__img {
      width: 32rpx;
      height: 32rpx;
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/cart-sku-nomal.png);
      background-size: 32rpx 32rpx;
    }
    &__img--select {
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/2023-09-25/cart-sku-select.png);
    }
  }
}
</style>
