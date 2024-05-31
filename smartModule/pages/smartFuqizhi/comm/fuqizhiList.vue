<template>
  <scroll-view
    class="fuqizhi"
    scroll-y
    refresher-enabled
    refresher-threshold="60"
    @scrolltolower="getList"
    @refresherrefresh="reset"
  >
    <view v-for="(item, index) in list" :key="index" class="fuqizhi-item">
      <view class="fuqizhi-item__top flex">
        <!-- 类型 -->
        <text class="desc">{{ item.appTitle }}</text>
        <!-- 金额 -->
        <text :class="['fqzPrice','fqzPrice-black']">
          {{ item | fqzPriceFilter }}
        </text>
      </view>
      <view class="fuqizhi-item__bottom">
        <!-- 时间 -->
        <text class="createTime">{{ item.createTime }}</text>
      </view>
    </view>
    <u-loadmore
      margin-top="24"
      ref="backTop"
      :loadText="loadText"
      bg-color="#F6F6F6"
      color="#C3C3C3"
      font-size="22"
      :status="loadStatus"
    ></u-loadmore>
  </scroll-view>
</template>

<script>
// 公共方法
import { fenToYuan } from "@/common/utils.js";
export default {
  options: {
    styleIsolation: "shared",
  },
  props: {
    // 列表数据
    list: {
      type: Array,
      default: [],
    },
    // 底部提示
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
    // 底部状态
    loadStatus: {
      type: String,
      default: "loadmore",
    },
  },
  filters: {
    //福气值余额
    fqzPriceFilter(val) {
      // if (!val.integralPoint || !val.incomeFlagType) return "";
      // incomeFlagType 1 收入 2 支出
      return (val.incomeFlagType == 1 ? "+" : "-") + Math.abs(val.integralPoint);
    },
  },
  data() {
    return {
      // 福气值图片公共路径
      smartImg: this.$smartImg,
      triggered: false,
    };
  },
  methods: {
    //获取列表数据
    getList() {
      this.$emit("getList");
    },
    //下拉刷新
    reset() {
      this.$emit("reset");
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
.fuqizhi {
  overflow: hidden;
  height: calc(100vh - 480rpx);
  box-sizing: border-box;
  background: linear-gradient(180deg, #ffffff 0%, #f6f6f6 100%) no-repeat;
  background-size: 100% 200rpx;
  border-radius: 24rpx;
  padding: 0 16rpx;
  &-refresher {
    width: 100vw;
    height: 60rpx;
    text-align: center;
  }
  &-item {
    margin-top: 16rpx;
    padding: 40rpx 24rpx;
    background: #ffffff;
    border-radius: 24rpx;
  }
  &-item:first-child {
    // margin-top: 34rpx;
  }
  &-item__top {
    justify-content: space-between;
    color: #191919;
    .desc {
      font-size: 32rpx;
      font-weight: 600;
      color: #191919;
      line-height: 40rpx;
    }
    .fqzPrice {
      font-size: 32rpx;
      font-weight: 600;
      color: #ff450c;
      line-height: 40rpx;
    }
    .fqzPrice-black {
      font-family: DINAlternate, DINAlternate;
      font-weight: bold;
      color: rgba(255, 10, 53, 1);
    }
  }
  &-item__bottom {
    margin-top: 20rpx;
    .createTime {
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
      line-height: 34rpx;
    }
  }
}
u-loadmore {
  /deep/ .u-load-more-wrap {
    padding-bottom: calc(
      constant(safe-area-inset-bottom) + 16rpx
    ); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(
      env(safe-area-inset-bottom) + 16rpx
    ); /* 兼容 iOS >= 11.2 */
  }
  /deep/ u-line {
    display: none;
  }
}
</style>
