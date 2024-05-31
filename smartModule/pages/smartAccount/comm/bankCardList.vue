<template>
  <view class="bankCard-list">
    <view v-for="(item, index) in list" :key="index" class="bankCard-item flex">
      <view class="bankCard-item__left flex">
        <image :src="`${smartImg}/setUp/account-bank-card.png`" />
      </view>
      <view class="bankCard-item__right flex">
        <text class="name">{{ item.bankName || "" }}</text>
        <text class="number">{{ item.bankCard | bankCardFilter }}</text>
      </view>
      <view class="bankCard-item--secure" @click="operate('secure', item)">
        解除绑定
      </view>
    </view>
    <view
      v-if="addBtnShow"
      class="bankCard-list--add flex"
      @click="operate('add')"
    >
      <image :src="`${smartImg}/account/bankCard-add.png`" />
      <text>添加银行卡</text>
    </view>
    <view class="bankCard-list--tag flex" v-else> 最多绑定5张银行卡 </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  filters: {
    //卡号处理
    bankCardFilter(val) {
      if (!val) return "";
      let reg = /^(\d{2})\d+(\d{4})$/;
      return val.replace(reg, "$1** **** **** $2");
    },
  },
  computed: {
    //添加按钮是否显示
    addBtnShow() {
      return this.list.length < 5;
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
    };
  },
  methods: {
    operate(typeName, item) {
      this.$emit("operate", typeName, item);
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  align-content: center;
}
.bankCard-list {
  padding: 18rpx 0 16rpx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 30rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
  &--add {
    justify-content: center;
    margin: 16rpx 16rpx 0;
    height: 136rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #191919;
    border-radius: 24rpx;
    border: 1rpx dashed #999999;
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
  &--tag {
    justify-content: center;
    position: fixed;
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    width: calc(100%);
    font-size: 22rpx;
    font-weight: 400;
    color: #c3c3c3;
    line-height: 30rpx;
  }
}
.bankCard {
  &-item {
    position: relative;
    margin: 16rpx 16rpx 0;
    padding: 48rpx 32rpx;
    background: #ffffff;
    border-radius: 24rpx;
    &:first-child {
      margin-top: 0;
    }
    &--secure {
      position: absolute;
      top: 24rpx;
      right: 0;
      width: 136rpx;
      height: 44rpx;
      line-height: 44rpx;
      text-align: center;
      background: #f6f6f6;
      border-radius: 22rpx 0rpx 0rpx 22rpx;
      font-size: 22rpx;
      font-weight: 400;
      color: #c3c3c3;
    }
  }
  &-item__left {
    margin-right: 20rpx;
    border-radius: 24rpx;
    image {
      width: 88rpx;
      height: 88rpx;
    }
  }
  &-item__right {
    min-width: 0;
    overflow: hidden;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    color: #191919;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 40rpx;
    }
    .number {
      font-size: 40rpx;
      font-weight: 400;
      color: #191919;
      line-height: 56rpx;
    }
  }
}
</style>
