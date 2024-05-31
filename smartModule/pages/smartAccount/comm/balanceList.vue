<template>
  <view class="balance-list">
    <view v-for="(item, index) in list" :key="index" class="balance-item">
      <view class="balance-item__top flex">
        <text class="name">{{ item.flowTypeName }}</text>
        <text
          class="money"
          :class="{ 'money--sub': isNegative(item.signedType) }"
        >
          {{ item._amount }}
        </text>
      </view>
      <view class="balance-item__bottom">
        <text class="time">{{ item.createTime }}</text>
      </view>
    </view>
    <u-loadmore
      margin-top="20"
      ref="backTop"
      :loadText="loadText"
      bg-color="#f3f3f3"
      color="#999"
      :status="loadStatus"
    ></u-loadmore>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    loadText: {
      type: Object,
      default() {
        return {
          loadmore: "上拉加载更多",
          loading: "努力加载中",
          nomore: "我也是有底线的~",
        };
      },
    },
    loadStatus: {
      type: String,
      default: "loadmore",
    },
  },
  computed: {
    //是否是负号
    isNegative() {
      return (val) => {
        return val == -1;
      };
    },
  },
  data() {
    return {};
  },
  methods: {
    operate(item, type) {
      this.$emit("operate", type, item);
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
.balance-list {
  padding: 0 16rpx 16rpx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 30rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
}
.balance {
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
    .name {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 40rpx;
    }
    .money {
      font-size: 32rpx;
      font-weight: 600;
      color: #ff450c;
      line-height: 40rpx;
    }
    .money--sub {
      color: #191919;
    }
  }
  &-item__bottom {
    margin-top: 20rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
    .time {
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
