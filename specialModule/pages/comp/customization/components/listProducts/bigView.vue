<template>
  <div class="view-content" @click="toDetail">
    <div class="goods-img">
      <img class="goods-images" :src="item.url" alt="" />
    </div>

    <!-- 价格和促销-->
    <div class="details-colortype">
      <div class="price-box"><goodsInfo :item="item" :showName="false"></goodsInfo></div>
      
      <div v-if="couponShowlist.length > 0" class="shop-coupon-activty">
        <div v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item"
          v-html="item.showFaceValue"></div>
      </div>

      <div data-desc="标签" class="tag-pannel" v-if="item.skuLable">
        <div class="tag-list" v-if="item.skuLable.goodsTagList && item.skuLable.goodsTagList.length > 0">
          <div class="tag-every" v-for="tags in item.skuLable.goodsTagList.slice(0,2)" :key="tags.id">
            <div class="tag-inner">
              {{ tags.tagName }}
            </div>
          </div>
        </div>
        <div class="expression" v-if="performanceScore > 0">
          <div class="performance">
            <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="" />
            <div class="num-pannel">
              绩效分:
              <span class="num">{{ performanceScore | filterFraction }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-title">
        {{ item.name }}
      </div>

      <!-- 商品评论 好评率 -->
      <div class="shop-info-evaluate" v-if="item.skuLable && item.skuLable.baseLabel">
        <span v-if="item.skuLable.baseLabel.comment">{{ item.skuLable.baseLabel.comment | filterFraction(1) }}评论</span>
        <label v-if="item.skuLable.baseLabel.applauseRate * 1">
          <span v-if="item.skuLable.baseLabel.comment" class="separator">|</span>
          {{ item.skuLable.baseLabel.applauseRate }}%好评
        </label>
        <label v-if="item.skuLable.baseLabel.salesVolume" class="">
          <span v-if="item.skuLable.baseLabel.applauseRate * 1 || item.skuLable.baseLabel.comment"
            class="separator">|</span>
          {{ item.skuLable.baseLabel.salesVolume | filterFraction(1) }}人已买
        </label>
      </div>
    </div>
  </div>
</template>
<script>

import goodsInfo from '../../../singlePage/components/goodsInfo.vue';

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  components: { goodsInfo },

  filters: {
    priceInt(price) {
      let int;
      if (price && Number(price) < 10000) {
        int = Number(price).toFixed(2).split(".")[0];
      } else if (price && Number(price) >= 10000) {
        int = parseInt(price)
      } else {
        int = "0";
      }
      return int;
    },
    priceFloat(price) {
      let float;
      if (price && Number(price) < 10000) {
        float = '.' + Number(price).toFixed(2).split(".")[1];
      } else if (price && Number(price) >= 10000) {
        float = ""
      } else {
        float = ".00";
      }
      return float;
    },
    filterFraction(val, make) {
      let len = (val + '').length
      switch (len) {
        case 3:
        case 4:
          if (make && val == 1000) {
            val = '999+'
          } else {
            val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+'
          }
          break
        case 5:
        case 6:
        case 7:
          if (make) {
            val = '999+'
          } else {
            val = parseInt((val / 10000) * 10) / 10 + '万'
          }
          break
        default:
          break
      }
      return val
    },
  },

  data() {
    return {
      favoriteText: '收藏',
    }
  },

  computed: {
    performanceScore() {
      let skuLable = (this.item && this.item.skuLable) || {}
      let performanceScoreLabel = skuLable.performanceScoreLabel || {}
      return performanceScoreLabel.performanceScore || 0
    },

    isCouponLable() {
      let skuLable = this.item.skuLable
      return skuLable && skuLable.couponLable && skuLable.couponLable.length != 0 && skuLable.couponLable[0].afterCouponPrice
    },

    finalPrice() {
      let skuLable = this.item.skuLable,
        price = (skuLable && (skuLable.finalPrice || skuLable.baseLabel.price)) || this.item.price
      if (this.isCouponLable) {
        price = skuLable.couponLable[0].afterCouponPrice
      }
      return price
    },

    couponShowlist() {
      let obj = this.item && this.item.skuLable || {}
      let couponlist = []
      // 活动和优惠券标签，最多显示3个标签
      if (obj.markIngLabel && obj.markIngLabel.length) {
        if ([1, 3].includes(obj.markIngLabel[0].ruleType)) {
          // 固定金额和自定义规则: 只显示优惠券标签，最多显示2个按照优惠力度由大到小排列
          couponlist = obj.couponLable ? obj.couponLable.slice(0, 2) : []
        } else if (obj.markIngLabel[0].ruleType == 2) {
          // 固定折扣活动: 显示活动标签为【XX折】+1个优惠券标签，按照优惠力度由大到小排列
          if (obj.markIngLabel && obj.markIngLabel[0].fixedDiscount) {
            couponlist.push({ showFaceValue: obj.markIngLabel[0].fixedDiscount + '折' })
          }
        } else if ([4, 5].includes(obj.markIngLabel[0].ruleType)) {
          // 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
          if (obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length) {
            couponlist = obj.markIngLabel[0].tiredPricingList.slice(0, 1)
            couponlist.forEach(item => {
              if (obj.markIngLabel[0].ruleType == 4) {
                item.showFaceValue = '满' + item.amountLimitation + '减' + item.faceValue
              } else {
                item.showFaceValue = '满' + item.amountLimitation + '打' + item.faceValue + '折'
              }
            })
          } else if (obj.couponLable) {
            couponlist = [...obj.couponLable.slice(0, 1)]
          }
        }
      } else {
        couponlist = obj.couponLable ? obj.couponLable.slice(0, 1) : []
      }
      couponlist.forEach(item => {
        if (item.couponsType == 2) {
          item.showFaceValue = item.faceValue + '折'
        } else if (item.couponsType == 3) {
          item.showFaceValue = '立减' + item.faceValue + '元'
        }
      })
      return couponlist
    },
  },

  methods: {
    setPrice(val) {
      let skuLable = val.skuLable,
        price = (skuLable && (skuLable.finalPrice || skuLable.baseLabel.price)) || val.price
      return price
    },

    toDetail() {
      this.$emit('toDetail', this.item)
    }
  },
}
</script>

<style lang="less" scoped>
.view-content {
  margin-top: 24rpx;
  padding-bottom: 24rpx;
  background-color: #fff;
  border-radius: 48rpx;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 702rpx;
  border-radius: 48rpx;
  overflow: hidden;

  .goods-images {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.details-colortype {
  padding: 0 24rpx;
  border-radius: 24rpx;
  background-color: #fff;


  .performance {
    display: flex;

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

  .shop-coupon-activty {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // margin-bottom: 6px;
    margin-top: 12rpx;

    &-item {
      background: #ffeee9;
      border-radius: 8rpx;
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff450c;
      line-height: 28rpx;
      padding: 4rpx 12rpx;
      margin-right: 8rpx;
    }

    &-item:last-of-type {
      margin-right: 0;
    }
  }

  .tag-pannel {
    display: flex;
    margin-top: 20rpx;

    .tag-list {
      display: flex;
    }

    .tag-every {
      border: 0.5rpx solid #ff3700;
      overflow: hidden;
      padding: 2rpx 12rpx;
      color: #ff0a35;
      border-radius: 8rpx;
      line-height: 20rpx;
      margin-right: 8rpx;

      .tag-inner {
        font-size: 20rpx;
        font-weight: 400;
        border-radius: 8rpx;
        background: #fff;
      }
    }
  }


}

.product-title {
  margin-top: 12rpx;
  padding-right: 0;
  font-weight: 600;
}

.shop-info-evaluate {
  margin-top: 12rpx;
  display: flex;
  overflow: hidden;
  width: 100%;
  font-size: 22rpx;
  color: #999999;

  .separator {
    padding: 0 8rpx;
  }
}
.price-box {
  /deep/ .goods-info-box {
    position: static;
    transform: none;
    margin: 0;
    padding: 0;
    padding-top: 24rpx;
    .product-price {
      padding-bottom: 0;
    }
  }
}

</style>
