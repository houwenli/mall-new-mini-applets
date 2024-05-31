<template>
  <view class="goods-list-container">
    <view class="goods-catogry-name">
      <image class="catogry-name-pic" :src="categoryLink" />
    </view>
    <!-- 附图 -->
    <view class="sub-pic-list">
      <view
        class="sub-pic-item"
        v-for="(item, index) in list"
        :key="index"
        @click="goGoodsDetail(item)"
      >
        <view class="goods-pic">
          <image :src="item.url" alt="" />
        </view>

        <view class="goods-info">
          <view class="text-ellipsis goods-desc">
            {{ item.name }}
          </view>

          <view class="active-price">
            <view>原价:</view>
            <view class="price-line">￥{{ item.price }}</view>
          </view>

          <view class="goods-price-wrap">
            <view class="money-unit">￥</view>
            <view class="price">
              <view class="price-integer">{{
                item.discountPrice.split(".")[0]
              }}</view>
              <view class="price-decimal"
                >.{{ item.discountPrice.split(".")[1] }}</view
              >
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const categoryLinks = {
  // 颜值能量站
  1: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_nengliang.png",
  // 美味能量站
  2: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_meiwei.png",
  // 养身能量站
  3: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_yangshen.png",
};

export default {
  name: "goodsPanel",
  props: {
    type: {
      type: [String, Number],
      require: true,
    },
    list: {
      type: Array,
      default: () => [],
    },

    /**
     * 是否有活动
     */
    hasDiscount: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 标题背景图
      categoryLink: "",
    };
  },
  mounted() {
    this.categoryLink = categoryLinks[this.type];
  },

  methods: {
    /**
     * 跳转商品详情
     */
    goGoodsDetail(item) {
      // 埋点
      // bargainVisit({
      //   // 具体商品
      //   isBargain: 0,
      //   skuId: item.sku,
      //   spuId: item.spu,
      //   category: this.type
      // }).then(() => { }).catch(e => { })

      this.$wsf.go("SkuDetail", { spuId: item.spu });
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-list-container {
  background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_sahngpinbeijing.png");
  background-size: 100% 100%;
  width: 100%;
  padding: 36rpx 8rpx 28rpx 8rpx;
  margin-bottom: 31rpx;
  box-sizing: border-box;
}

.goods-catogry-name {
  width: 100%;
  margin-bottom: 30rpx;

  .catogry-name-pic {
    width: 454rpx;
    height: 48rpx;
    display: block;
    margin: 0 auto;
  }
}

.sub-pic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;

  .sub-pic-item {
    width: 33%;
    margin-bottom: 5rpx;
    border-radius: 10rpx;
    background: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .goods-pic {
    width: 100%;
    height: 234rpx;
    background: #fff;
    overflow: hidden;

    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .goods-info {
    flex: 1;
    padding: 20rpx 0rpx;
    background: linear-gradient(0deg, #ffffff 0%, #ffd3e8 100%);
  }

  // 商品标题
  .goods-desc {
    width: 192rpx;
    height: 62rpx;
    font-size: 24rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000;
    margin: 0rpx 20rpx 0rpx 20rpx;
    line-height: 32rpx;
  }

  .goods-price-wrap {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_jiagebeijing.png");
    background-size: 100% 100%;
    display: flex;
    align-items: baseline;
    width: 100%;
    height: 84rpx;
    border-radius: 8rpx;
    font-weight: bold;
    color: #ffffff;
    padding: 10rpx 80rpx 0rpx 28rpx;

    .money-unit {
      font-size: 24rpx;
      font-family: Source Han Sans CN;
    }
    .price {
      display: flex;
      align-items: baseline;
    }
    .price-integer {
      font-size: 36rpx;
    }
    .price-decimal {
      font-size: 24rpx;
    }
  }
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  text-overflow: ellipsis;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-all;
}

.active-price {
  display: flex;
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  margin: 0rpx 20rpx 12rpx 20rpx;
  color: #7c7c7c;
  .price-line {
    text-decoration: line-through;
  }
}
</style>
