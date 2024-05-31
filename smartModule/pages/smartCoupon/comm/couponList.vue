<template>
  <view class="coupon">
    <view v-for="(item, index) in list" :key="index" class="coupon-item flex">
      <!-- 左上方角标 -->
      <image :src="cornerMarkMap[1]" class="coupon-item__cornerMark" />
      <view class="coupon-item__left flex">
        <image v-if="item.url" :src="item.url" class="coupon-item__img" />
        <!-- 缺省图 -->
        <view v-else class="coupon-item__img--empty flex">
          <image :src="`${smartImg}/component-no-pic-default.png`" />
        </view>
        <view>
          <text class="coupon-title">{{ item.commodityName || "" }}</text>
          <!-- 优惠信息 -->
          <view class="coupon-price flex">
            <!-- 券类型 1:满减 2:折扣 3:立减 -->
            <text class="symbol" v-if="item.couponsType != 2"> ￥ </text>
            <text class="int-price">{{ item._faceValue }}</text>
            <text class="float-price" v-if="item.couponsType == 2"> 折 </text>
            <!-- 使用条件 -->
            <text class="condition">{{ item._condition }}</text>
          </view>
          <!-- 使用期限 -->
          <view class="coupon-time">{{ item._time }}</view>
        </view>
      </view>
      <view class="coupon-item__right" @click="toIndex(item)">
        <view class="coupon-item__right--text">立即使用</view>
        <view class="coupon-item__right--bal"></view>
      </view>
    </view>
    <u-loadmore
      margin-top="36"
      ref="backTop"
      :loadText="loadText"
      bg-color="#F6F6F6"
      color="#C3C3C3"
      font-size="22"
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
  data() {
    return {
      smartImg: this.$smartImg,
      cornerMarkMap: {
        1: `${this.$smartImg}/coupon/dianshang-tag.png`, //电商
        2: `${this.$smartImg}/coupon/huandian-tag.png`, //换电
      },
    };
  },
  methods: {
    toIndex(val) {
      let name = val.goodsSource == 4 ? "ToMotor" : "SkuDetail";
      this.$emit("toIndex", name, { skuId: val.skuId });
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
.coupon {
  padding: 0 16rpx;
  padding-bottom: calc(
    constant(safe-area-inset-bottom) + 36rpx
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 36rpx
  ); /* 兼容 iOS >= 11.2 */
  &-item {
    position: relative;
    justify-content: space-between;
    margin-top: 16rpx;
    padding: 24rpx;
    height: 192rpx;
    border-radius: 24rpx;
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/coupon/coupon-bg.png")
      top right no-repeat;
    background-size: 190rpx 94rpx;
    background-color: #fff;
  }
  &-item__cornerMark {
    position: absolute;
    top: 0;
    left: 0;
    width: 74rpx;
    height: 36rpx;
  }
  &-item__left {
    .coupon-title {
      flex: 1;
      font-size: 26rpx;
      font-weight: 600;
      color: #191919;
      height: 40rpx;
      line-height: 40rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 1; //行数
      line-clamp: 1;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }
    .coupon-price {
      align-items: flex-end;
      margin-top: 12rpx;
      text {
        display: inline-block;
      }
      .symbol {
        font-family: DINAlternate-Bold, DINAlternate;
        font-size: 24rpx;
        font-weight: bold;
        color: #ff450c;
        line-height: 32rpx;
      }
      .condition {
        margin-left: 8rpx;
        padding-bottom: 2rpx;
        font-size: 22rpx;
        font-weight: 400;
        color: #999999;
        line-height: 30rpx;
      }
      .int-price {
        font-family: DINAlternate-Bold, DINAlternate;
        font-size: 48rpx;
        font-weight: bold;
        color: #ff450c;
        line-height: 52rpx;
      }
      .float-price {
        font-family: DINAlternate-Bold, DINAlternate;
        font-size: 24rpx;
        font-weight: 600;
        color: #ff450c;
        line-height: 32rpx;
      }
    }
    .coupon-time {
      display: inline-block;
      padding: 0 8rpx;
      margin-top: 14rpx;
      height: 32rpx;
      background: #e7f8f4;
      border-radius: 16rpx;
      text-align: center;
      line-height: 32rpx;
      color: #4684ff;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 22rpx;
      font-weight: 400;
    }
  }
  &-item__img,
  &-item__img--empty {
    margin-right: 8rpx;
    flex-shrink: 0;
    width: 144rpx;
    height: 144rpx;
    border-radius: 13rpx;
  }
  &-item__img--empty {
    justify-content: center;
    background: rgba(180, 183, 186, 0.2);
    border-radius: 16rpx;
    image {
      width: 52rpx;
      height: 28rpx;
    }
  }
  &-item__right {
    position: relative;
    margin-left: 14rpx;
    flex-shrink: 0;
  }
  &-item__right--text {
    position: relative;
    z-index: 2;
    padding: 0 18rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: linear-gradient(90deg, #ff450c 0%, #ff0a35 100%);
    border-radius: 34rpx;
    text-align: center;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
  }
  &-item__right--bal {
    position: absolute;
    top: -6rpx;
    left: -16rpx;
    content: "";
    width: 172rpx;
    height: 92rpx;
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/coupon/btn-bg.png")
      center center no-repeat;
    background-size: 100% 100%;
  }
}
u-loadmore {
  /deep/ u-line {
    display: none;
  }
}
</style>
