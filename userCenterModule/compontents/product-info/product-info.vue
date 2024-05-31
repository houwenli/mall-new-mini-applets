<template>
  <view class="item">
    <view v-if="item.sku.status == '0' && item.goodsSource!=4" class="add-cart-icon" @click.stop="handleAddCart(item)">
      <image :src="addCartIcon" style="width: 48rpx;height: 48rpx;background: #fff"></image>
    </view>
    <view class="img-txt">
      <image class="img" mode="aspectFill" :src="item.sku.url" />
      <view class="txt" v-if="item.sku.status != 0">
        <text v-if="item.sku.status==1">下架</text>
        <text v-if="item.sku.status==2">无货</text>
        <text v-if="item.sku.status==3">售罄</text>
        <text v-if="item.sku.status==4">失效</text>
      </view>
    </view>
    <view class="column-goods-info">
      <view class="column-goods-info-top">
        <view class="name u-line-2" :class="[(item.sku.status != 0) ? 'disable-status' : '']">
          {{item.sku.name}}
        </view>
        <view class="desc" v-if="item.sku.subTitle">
          {{item.sku.subTitle}}
        </view>

        <!-- 商品标签-->
        <view class="column-info-goodstags" v-if="item.skuLable && item.skuLable.goodsTagList && item.skuLable.goodsTagList.length">
          <view v-for="(ele, index) in item.skuLable.goodsTagList.slice(0,2)" :key="index">	
            <text>
              {{ ele.tagName }}
            </text>		
          </view>			
        </view>


        <view class="comment" v-if="item.skuLable">
          <block v-if="item.skuLable.baseLabel.comment">
            {{item.skuLable.baseLabel.comment | saleNumCount}}评论
            <text class="line"></text> 
          </block>
          <block v-if="item.skuLable.baseLabel.applauseRate != '0'">
            {{item.skuLable.baseLabel.applauseRate}}%好评
            <text class="line"></text> 
          </block>
          <block v-if="item.skuLable.baseLabel.salesVolume">
            {{item.skuLable.baseLabel.salesVolume | saleNumCount}}人已买
          </block>
        </view>
        <view>
          <view class="activitity-mark" v-if="item.sourceType != 2 && item.skuLable && item.skuLable.thematicLabel && item.skuLable.thematicLabel.subjectLabel">
            <image class="hot-icon" :src="hotIcon" />
                <text>
                  <!-- {{item.skuLable.markIngLabel[0].label}} -->
                  {{ item.skuLable.thematicLabel.subjectLabel }}
                </text>
            <image class="arrow-right-icon" :src="arrowRightIcon" />
          </view>
        </view>
        <!-- 优惠券和活动 -->
        <view class="shop-coupon-activty">
          <view v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item">
            {{ item.faceValue }}
          </view>
        </view>

      </view>
      <view class="column-goods-info-bottom" v-if="item.sku.status!=1 && item.sku.status!=4">
        <view class="column-goods-price">
          <text class="column-after-coupon-text" v-if="item.sourceType != 2 && afterCouponPrice">券后</text>
          <text :class="[item.sku.status != '0' ? 'disable-status' : '']">¥</text>
          <text class="column-goods-price-num" v-if="item.sourceType != 2 && afterCouponPrice">{{ afterCouponPrice | priceInt }}</text>
          <text class="column-goods-price-num" :class="[item.sku.status != '0' ? 'disable-status' : '']" v-else>{{ item.salePrice | priceInt }}</text>
          <text v-if="item.sourceType != 2 && afterCouponPrice">{{afterCouponPrice | priceFloat}}</text>
          <text :class="[item.sku.status != '0' ? 'disable-status' : '']" v-else>{{item.salePrice | priceFloat}}</text>
          <view class="column-coupon" v-if="item.sourceType != 2  && item.skuLable && trueCouponLable">
            <!-- <image class="triangle" :src="triangleIcon" />
            <view class="bubble">
              <block v-if="item.skuLable.couponLable.couponsType == 1">满{{item.skuLable.couponLable.amountLimitation}}减{{item.skuLable.couponLable.faceValue | tenThousandCount}}</block>
              <block v-else-if="item.skuLable.couponLable.couponsType == 2">{{item.skuLable.couponLable.faceValue | tenThousandCount}}折</block>
              <block v-else>立减{{item.skuLable.couponLable.faceValue | tenThousandCount}}</block>
            </view> -->
          </view>
          <view class="column-old-price" v-else-if="item.salePrice != item.sku.price">
            <text class="old-price-small">¥</text>
            <text class="old-price">{{ item.sku.price | priceInt }}</text>
            <text class="old-price-small">{{ item.sku.price | priceFloat}}</text>
          </view>
        </view>
        <view class="column-goods-buy">
          <block v-if="item.skuLable && item.skuLable.couponLable && afterCouponPrice">
            <text class="old-price-small">¥</text>
            <text class="old-price">{{ item.salePrice | priceInt }}</text>
            <text class="old-price-small" style="margin-right: 4rpx">{{ item.salePrice | priceFloat}}</text>
          </block>
          <view class="performance-mark" v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
            <image class="icon" :src="performanceIcon" /> 绩效分: {{ item.skuLable.performanceScoreLabel.performanceScore | performanceCount }}
          </view>
        </view>
      </view>
      <view v-else class="no-price">
        暂无报价
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    components: {},
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    filters: {
      tenThousandCount(val) {
        if (val && Number(val) > 10000) {
          return (parseInt((Number(val) / 10000) * 10)/10) + 'w'
        } else {
          return parseInt(Number(val) * 10) / 10
        }
      },
      performanceCount(val) {
		  	if(val && Number(val) >= 10000) {
          return (parseInt((val / 10000) * 10)/10) + '万分'
        } else if(val && Number(val) >= 1000) {
		  		return parseInt(Number(val) / 1000) + '000+分'
		  	} else if(val && Number(val) >= 100) {
		  		return parseInt(Number(val) / 100) + '00+分'
		  	} else {
          return val + '分'
        }
		  },
      saleNumCount(val) {
        if (val && Number(val) > 999) {
          return '999+'
        } else if(val && Number(val) > 99) {
          return parseInt(Number(val) / 100) + '00+'
        } else {
          return val
        }
      },
      priceInt(price) {
        let int;
        if (price && Number(price) < 10000) {
          int = Number(price).toFixed(2).split(".")[0] + '.';
        } else if (price && Number(price) >= 10000) {
          int = parseInt(price)
        } else {
          int = "0.";
        }
        return int;
      },
      priceFloat(price) {
        let float;
        if (price && Number(price) < 10000) {
          float = Number(price).toFixed(2).split(".")[1];
        } else if (price && Number(price) >= 10000) {
          float = ""
        } else {
          float = "00";
        }
        return float;
      },
    },
    data() {
      return {
        performanceIcon: this.$oss + 'wsf-mall/home/ic_performance_mark.png',
        hotIcon: this.$oss + 'wsf-mall/skuDetail/icon-actity.png',
        arrowRightIcon: this.$oss + 'wsf-mall/skuDetail/icon-red.png',
        addCartIcon: this.$oss + 'wsf-mall/home/add-cart.png',
        triangleIcon: this.$oss + 'wsf-mall/home/bubble-triangle.png',       
      };
    },
    computed: {
      trueCouponLable(){
        return this.item.skuLable && this.item.skuLable.couponLable && this.item.skuLable.couponLable.find(ele=>{ return ele.checked })
      },
      afterCouponPrice(){
        let skuLable = this.item.skuLable || {}
        let couponLable = skuLable.couponLable || [];
        let coupon = couponLable.find(ele=>{ return ele.checked })
        return coupon && coupon.afterCouponPrice
      },
      couponShowlist(){
        let obj = this.item && this.item.skuLable || []
        let couponlist = []
        // 活动和优惠券标签，最多显示3个标签
				if(obj.markIngLabel && obj.markIngLabel.length){
					if([1, 3].includes(obj.markIngLabel[0].ruleType)){
						// 固定金额和自定义规则: 只显示优惠券标签，最多显示2个按照优惠力度由大到小排列
						couponlist =  obj.couponLable ? obj.couponLable.slice(0,2) : []
					} else if(obj.markIngLabel[0].ruleType == 2){
						// 固定折扣活动: 显示活动标签为【XX折】+1个优惠券标签，按照优惠力度由大到小排列
            if(obj.markIngLabel && obj.markIngLabel[0].fixedDiscount){				
							couponlist.push({ faceValue: obj.markIngLabel[0].fixedDiscount + '折' })
						}	
						if(obj.couponLable){								
							couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						}
					} else if([4, 5].includes(obj.markIngLabel[0].ruleType)){
						// 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
						if(obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length){
							couponlist =  obj.markIngLabel[0].tiredPricingList
							couponlist.forEach(item=>{
								if(obj.markIngLabel[0].ruleType == 4){
									item.faceValue = '满' + item.amountLimitation + '减' + item.faceValue
								} else {
									item.faceValue = '满' + item.amountLimitation + '打' + item.faceValue + '折'
								}
							})
              couponlist = couponlist.slice(0, 1)
						} 
            if(obj.couponLable){								
							couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						}
					}				
				} else {
          couponlist =  obj.couponLable ? obj.couponLable.slice(0,1) : []
        }
        couponlist.forEach(item=>{
          if(item.couponsType==2){
            item.faceValue = item.faceValue + '折'
          }  else if(item.couponsType==3){			
            item.faceValue = '立减' + item.faceValue + '元'
          }
        })
        return couponlist
      },
    },
    watch: {},
    created() {},
    mounted() {     
    },
    methods: {
      //加购
		  handleAddCart(item) {
		  	let data = {
		  		num: 1,
		  		skuId: item.skuId,
		  		sourceType: item.sourceType,
		  		storeId: item.storeId,
		  	};
		  	this.$u.api.AddShoppingCart(data).then(res => {
		  		if (res.code == 200) {
		  			this.$u.toast('成功加入购物车');
		  		}
		  	});
		  },
    },
  };
</script>

<style scoped lang="scss">
  .item {
    background-color: #fff;
    display: flex;
    padding: 16rpx;
    margin: 0 16rpx;
    position: relative;
    min-height: 292rpx;
    border-radius: 16rpx;
    .add-cart-icon {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      right: 24rpx;
      bottom: 24rpx;
    }
    .img-txt {
      position: relative;
      margin-right: 16rpx;
      .img {
        width: 260rpx;
        height: 260rpx;
        border-radius: 16rpx;
      }
      .txt {
        width: 110rpx;
        height: 110rpx;
        position: absolute;
        background: #000000;
        opacity: 0.7;
        text-align: center;
        line-height: 110rpx;
        border-radius: 55rpx;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 999;
        text {
          opacity: 1;
          color: #FFFFFF;
        }
      }
    }
  }
  .no-price {
    font-size: 32rpx;
    color: #bababa;
  }
  .disable-status {
    color: #bababa !important;
  }
  .column-goods-info {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .column-goods-info-top {
      .name {
        color: #191919;
        font-size: 26rpx;
        font-weight: 500;
        line-height: 34rpx;
      }
      .desc {
        width: 410rpx;
        color: #E3903F;
        line-height: 30rpx;
        height: 30rpx;
        font-size: 22rpx;
        margin-top: 8rpx;
        overflow: hidden;
      }
	  // 商品标签
	  .column-info-goodstags{
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
		text{
			margin-right: 8rpx;
			border-radius: 8rpx;
			border: 0.5rpx solid;
			// border-image: linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1)) 1 1;
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FF0A35;
			line-height: 28rpx;
			// -webkit-background-clip: text;
			// -webkit-text-fill-color: transparent;
			padding: 0 8px;
		}	
		>view:last-of-type{
			text{
				margin-right: 0;
			}
		}	
	  }	
      .comment {
        font-size: 22rpx;
        color: #999999;
        line-height: 30rpx;
        display: inline-flex;
        align-items: center;
        padding-top: 8rpx;
        .line {
          display: inline-block;
          width: 2rpx;
          height: 24rpx;
          background: #C3C3C3;
          margin: 0 8rpx;
        }
      }
      .activitity-mark {
        height: 28rpx;
        background: #FFEDF0;
        border-radius: 14rpx;
        background: #FFEDF0;
        border-radius: 14px;
        margin-top: 12rpx;
        padding: 0 4rpx;
        display: inline-flex;
        align-items: center;
        line-height: 28rpx;
        font-size: 20rpx;
        text {
          font-size: 20rpx;
          background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          max-width: 358rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hot-icon {
          width: 20rpx;
          height: 20rpx;
          margin-right: 4rpx;
        }
        .arrow-right-icon {
          width: 16rpx;
          height: 16rpx;
          margin-left: 4rpx;
        }
      }
      // 活动和优惠券显示
      .shop-coupon-activty{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 12rpx;
        // margin-bottom: 12rpx;
        &-item{
          background: #FFEEE9;
          border-radius: 8rpx;
          font-size: 20rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FF450C;
          line-height: 28rpx;
          padding: 4rpx 12rpx;
          margin-right: 8rpx;
          margin-bottom: 12rpx;
        }
        &-item:last-of-type{
          margin-right: 0;
        }
      }
    }
    .column-goods-info-bottom {
      .column-goods-price {
        font-size: 22rpx;
        color: #FF0A35;
        line-height: 46rpx;
        text {
          font-size: 22rpx;
          font-weight: bold;
          font-family: DINAlternate-Bold, DINAlternate;
        }
        .column-goods-price-num {
          font-size: 40rpx;
        }
        .column-original-price {
          font-size: 20rpx;
          color: #666;
          margin-left: 16rpx;
        }
        .column-after-coupon-text {
          font-size: 20rpx;
          line-height: 28rpx;
        }
      }
      .column-coupon {
        height: 36rpx;
        display: inline-flex;
        align-items: flex-end;
        vertical-align: sub;
        .triangle {
          width: 10rpx;
          height: 10rpx;
          margin-right: -2rpx;
        }
        .bubble {
          border-radius: 8rpx 16rpx 16rpx 0;
          height: 36rpx;
          line-height: 36rpx;
          font-size: 20rpx;
          color: #fff;
          padding: 0 12rpx 0 8rpx;
          background: #FF0A35;
        }
      }
      .column-old-price {
        display: inline-block;
        position: relative;
        color: #c3c3c3;
        font-size: 26rpx;
        margin-left: 8rpx;
        &::after {
          content: ' ';
          width: 100%;
          height: 2rpx;
          background-color: #c3c3c3;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .column-goods-buy,
      .column-old-price {
        .old-price {
          font-size: 26rpx;
          color: #c3c3c3;
          font-weight: bold;
        }
        .old-price-small {
          font-size: 22rpx;
          color: #c3c3c3;
          font-weight: bold;
        }
        .saleNum {
          color: #c3c3c3;
          font-size: 20rpx;
        }
        .performance-mark {
          height: 32rpx;
          background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
          border-radius: 8rpx;
          font-size: 22rpx;
          color: #008864;
          line-height: 32rpx;
          display: inline-block;
          .icon {
            width: 32rpx;
            height: 32rpx;
            vertical-align: middle;
            transform: translateY(-1rpx);
          }
        }
      }
    }
    .column-goods-info-name {
      padding-top: 8rpx;
      font-size: 26rpx;
      line-height: 34rpx;
      color: #191919;
      font-weight: 500;
    }
    .column-goods-info-price {
      width: 100%;
      color: $wsf-color-red;
      .column-goods-info-price-num {
        font-size: 36rpx;
        color: $wsf-color-red;
        padding-left: 8rpx;
      }
      .column-goods-info-price-old {
        font-size: 22rpx;
        color: #999;
        margin-left: 16rpx;
        text-decoration: line-through;
      }
      .column-goods-info-price-original {
        font-size: 20rpx;
        color: #666;
        margin-left: 16rpx;
      }
      .list-goods-item-info-coupon-text {
        font-size: 24rpx;
        margin-left: 4rpx;
      }
    }
  }
</style>
