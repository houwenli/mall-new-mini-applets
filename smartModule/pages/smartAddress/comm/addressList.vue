<template>
  <view class="address" v-if="list && list.length">
    <view v-for="(item, index) in list" :key="index" class="address-item">
      <view class="address-item__top flex">
        <view class="flex">
          <text class="name omit">{{ item.name }}</text>
          <text class="mobile">
            {{ item.mobile }}
          </text>
          <text class="tag" v-if="isDefault(item.isDefault)">默认</text>
        </view>
        <!-- 编辑 -->
        <image
          class="edit"
          :src="`${smartImg}/setUp/address-edit.png`"
          @click="operate(item, 'edit')"
        />
      </view>
      <view class="address-item__bottom">
        <text class="address-detail">{{ item._address }}</text>
      </view>
    </view>
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
  computed: {
    // 是否默认
    isDefault() {
      return (val) => {
        return val && val == 1 ? true : false;
      };
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
    };
  },
  methods: {
    operate(item, type) {
      this.$emit("operate", type, item);
    },
  },
};
</script>

<style scoped lang="scss">
.omit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-all;
}
.flex {
  display: flex;
  align-items: center;
  align-content: center;
}
.address {
  height: calc(100vh - 168rpx);
  overflow: scroll;
  padding: 18rpx 16rpx 16rpx;
  padding-bottom: calc(
    constant(safe-area-inset-bottom) + 112rpx
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 112rpx
  ); /* 兼容 iOS < 11.2 */
  &-item {
    margin-top: 16rpx;
    padding: 40rpx 24rpx;
    background: #ffffff;
    border-radius: 24rpx;
    &:first-child {
      margin-top: 0;
    }
  }
  &-item__top {
    justify-content: space-between;
    color: #191919;
    .name,
    .mobile {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 40rpx;
    }
    .mobile {
      margin-left: 20rpx;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    .tag {
      flex-shrink: 0;
      margin-left: 16rpx;
      width: 56rpx;
      height: 28rpx;
      text-align: center;
      background: #FE3040;
      color: #ffffff;
      border-radius: 4rpx;
      font-size: 20rpx;
      line-height: 30rpx;
    }
    .edit {
      flex-shrink: 0;
      width: 40rpx;
      height: 40rpx;
    }
  }
  &-item__bottom {
    margin-top: 20rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
    .address-detail {
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }
  }
}
</style>
