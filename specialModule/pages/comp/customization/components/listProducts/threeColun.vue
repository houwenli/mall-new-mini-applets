<template>
  <div class="view-content">
    <div v-for="item in list" :key="item.id" class="product-item" @click="toDetail(item)">
      <img :src="item.url" alt="" class="product-img" />
      <div class="product-info">
        <div class="info-name u-line-2">{{ item.name }}</div>
        <div class="info-price">
          <span v-if="isCouponLable(item.skuLable)" class="info-price-lable">券后</span>
          <span class="info-price-icon font-din">¥</span>
          <span class="info-price-yuan font-din">{{ setPrice(item) | priceInt }}</span>
          <span class="info-price-fen font-din">{{ setPrice(item) | priceFloat }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

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
  },

  methods: {
    setPrice(val) {
      let skuLable = val.skuLable,
        price = (skuLable && (skuLable.finalPrice || skuLable.baseLabel.finalPrice)) || val.price
        if (this.isCouponLable(skuLable)) {
          price = skuLable.couponLable[0].afterCouponPrice
        }
      return price
    },

    isCouponLable(data) {
      return data && data.couponLable && data.couponLable.length != 0 && data.couponLable[0].afterCouponPrice
    },

    toDetail(item) {
      this.$emit('toDetail', item)
    } 
  },
}
</script>

<style lang="less" scoped>
.view-content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .product-item {
      margin-top: 24rpx;
      margin-right: 24rpx;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 24rpx;
      overflow: hidden;
      flex-shrink: 0;
      width: calc((100% - 48rpx) / 3);
      &:nth-child(-n + 3) {
        margin-top: 0;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .product-img {
        width: 100%;
        height: 218rpx;
      }
      .product-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 12rpx 16rpx;
      }
      .info-name {
        font-size: 26rpx;
        line-height: 34rpx;
        font-weight: 600;
        color: #191919;
        line-height: 34rpx;
      }
      .info-price {
        padding-top: 12rpx;
        color: #ff0a35;
        font-size: 0;
        font-weight: 600;
      }
      .info-price-lable {
        font-size: 16rpx;
        vertical-align: super;
        margin-right: 4rpx;
        font-weight: 400;
      }
      .info-price-icon {
        padding-right: 1rpx;
        font-size: 10px;
      }
      .info-price-yuan {
        font-size: 26rpx;
      }
      .info-price-fen {
        font-size: 22rpx;
      }
    }
  }
</style>
