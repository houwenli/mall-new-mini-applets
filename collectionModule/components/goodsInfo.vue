<template>
  <div class="goods-info">
    <image
      v-if="shopState === 1"
      class="soldout-img"
      src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_soldout%402x.png"
    ></image>
    <!-- 价格 -->
    <template v-if="shopState === 2 && sku">
      <text class="not-price">暂无售价</text>
    </template>
    <template v-else>
      <div class="goods-price">
        <div class="current-price" v-if="sku.entPurchasePrice">
          <div class="current-price-icon">¥</div>
          <div class="current-price-value">
            {{ floatPrice(sku.entPurchasePrice).split(".")[0] }}.
          </div>
          <div class="current-price-icon">
            {{ floatPrice(sku.entPurchasePrice).split(".")[1] }}
          </div>
        </div>
        <div class="original-price" v-if="sku.wsPrice">
          <div class="original-price-icon">¥</div>
          <div class="original-price-value">
            {{ floatPrice(sku.wsPrice).split(".")[0] }}.
          </div>
          <div class="original-price-icon">
            {{ floatPrice(sku.wsPrice).split(".")[1] }}
          </div>
        </div>
      </div>
    </template>

    <!-- 标签和绩效分 -->
    <view class="tag-pannel">
      <!-- 标签 -->
      <view class="tag-list" v-if="sku.labelList && sku.labelList.length > 0">
        <view
          class="tag-every"
          v-for="(tags, index) in sku.labelList"
          :key="index"
          >{{ tags }}</view
        >
      </view>
    </view>
    <div class="sku-name">{{ sku.skuName }}</div>
    <div class="sub-title" v-if="sku.subTitle">{{ sku.subTitle }}</div>
  </div>
</template>

<script>
export default {
  name: "goodsInfo",
  props: {
    sku: {
      type: Object,
      default: () => {},
    },
    shopState: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    floatPrice(price) {
      if (!price || Number(price) === 0) {
        return "0.00";
      } else {
        return Number(price).toFixed(2);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.goods-info {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 22rpx 24rpx 28rpx 24rpx;
  margin: 20rpx 24rpx;
  position: relative;
  .soldout-img {
    position: absolute;
    right: 0rpx;
    top: 0rpx;
    width: 140rpx;
    height: 140rpx;
  }
  .not-price {
    line-height: 56rpx;
    color: #ff0a35;
    font-weight: 600;
  }
  .goods-price {
    display: flex;
    align-items: flex-end;
    margin-bottom: 12rpx;
    .original-price,
    .current-price {
      font-weight: 600;
      display: flex;
      align-items: baseline;
      font-weight: bold;
    }

    .original-price {
      margin-left: 6rpx;
      color: #c3c3c3;
      position: relative;
    }
    .original-price::before {
      content: "";
      height: 1px;
      background: #999999;
      width: 100%;
      position: absolute;
      top: 50%;
    }
    .current-price {
      color: #ff0a35;
      line-height: 40rpx;
    }
    .current-price-icon {
      font-size: 16px;
    }
    .current-price-value {
      font-size: 30px;

      font-family: DINAlternate-Bold, DINAlternate;
    }
    .original-price-icon {
      font-size: 22rpx;
    }
    .original-price-value {
      font-size: 32rpx;
    }
  }
  .expression {
    display: flex;
    padding-bottom: 10rpx;
    .tab-time {
      height: 32rpx;
      border-radius: 8rpx;
      border: 1rpx solid #0a7ad4;
      padding: 0 12rpx;
      line-height: 28rpx;
      color: #0a75d9;
      font-size: 22rpx;
      font-weight: bold;
      margin-right: 12rpx;
    }
    img {
      width: 32rpx;
      height: 32rpx;
    }
    .num-pannel {
      color: #008864;
      font-size: 22rpx;
      .num {
        font-size: 22rpx;
        font-weight: bold;
      }
    }
  }
  .tag-pannel {
    display: flex;
    margin-bottom: 12rpx;
    .tag-list {
      display: flex;
    }
    .tag-every {
      height: 28rpx;
      line-height: 28rpx;
      border: 1rpx solid #ff3700;
      padding: 0 12rpx;
      color: #ff0a35;
      border-radius: 8rpx;
      font-size: 20rpx;
      margin-right: 8rpx;
    }
  }

  .sku-name {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #111111;
    line-height: 40rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .sub-title {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 12rpx;
  }
}
</style>
