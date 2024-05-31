<template>
  <view class="contacts">
    <u-swipe-action
      v-for="(item, index) in list"
      :key="index"
      :options="options"
      :show="item.isShow"
      :disabled="item.mobileFlag == 1"
      @click="close(item)"
      @open="open(item)"
    >
      <view class="contacts-item" @click="operate('edit', item.id)">
        <view class="contacts-item__left">
          <p class="contacts-item__left--source">
            <text class="nickname">{{ item.nickName || "暂无昵称" }}</text>
            <text class="place">( {{ item.mobileLocation }} )</text>
            <text class="subscript" v-if="item.defaultStatus == 1">默认</text>
          </p>
          <p class="ipone">{{ item.mobile }}</p>
        </view>
        <view class="contacts-item__right">
          <image class="next" :src="`${smartImg}/me/pro-order-next.png`" />
        </view>
      </view>
    </u-swipe-action>
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
  data() {
    return {
      smartImg: this.$smartImg,
      options: [
        {
          text: "删除",
          style: {
            color: "#fff",
            backgroundColor: "#e60113",
          },
        },
      ],
    };
  },
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  methods: {
    close(item) {
      this.$emit("close", item);
    },
    open(item) {
      this.$emit("open", item);
    },
    operate(name, id) {
      this.$emit("operate", name, id);
    },
  },
};
</script>

<style lang="scss" scoped>
.contacts {
  height: calc(100vh - 168rpx);
  overflow: scroll;
  /* 兼容 iOS*/
  padding-bottom: calc(constant(safe-area-inset-bottom) + 112rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 112rpx);
  /deep/ .u-swipe-view {
    background: #f6f6f7;
    width: calc(100vw + 150rpx) !important;
  }
  /deep/ .u-swipe-content {
    width: calc(100vw - 32rpx);
  }
  /deep/ .u-swipe-del {
    width: 134rpx !important;
    background-color: #FE3040 !important;
    border-radius: 24rpx;
    margin: 16rpx 16rpx 0 0;
    font-size: 28rpx;
    color: #ffffff !important;
  }
}
.contacts-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: calc(100vw - 32rpx);
  height: 178rpx;
  padding: 44rpx 24rpx 40rpx 24rpx;
  margin: 16rpx 16rpx 0rpx 16rpx;
  background: #ffffff;
  border-radius: 24rpx;
  .ipone {
    margin-top: 22rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  &__left--source {
    display: flex;
    align-items: center;
    .nickname {
      font-size: 26rpx;
      color: #191919;
      line-height: 34rpx;
    }
    .place {
      font-size: 22rpx;
      color: #6e6e6e;
      line-height: 30rpx;
    }
    .subscript {
      display: inline-block;
      margin-left: 16rpx;
      width: 56rpx;
      height: 28rpx;
      text-align: center;
      background: #FE3040;
      border-radius: 4rpx;
      font-size: 20rpx;
      line-height: 30rpx;
      color: #FFFFFF;
    }
  }
  &__right {
    .next {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
