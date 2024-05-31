<template>
  <view>
    <view class="column-goods">
      <image class="add-cart-icon" :src="addCartIcon"></image>
      <view class="column-goods-image">
        <u-image
          height="260rpx"
          width="260rpx"
          loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/513"
          border-radius="16rpx"
          :src="item.url + '?imageView2/1/w/520'"
        ></u-image>
      </view>
      <view class="column-goods-info">
        <view class="column-goods-info-top">
          <view class="name">
            {{item.name || item.skuName}}
          </view>
          <view class="desc" v-if="item.subTitle">
            {{item.subTitle}}
          </view>
          <!-- 商品标签-->
          <view class="column-info-goodstags" v-if="item.skuLable && item.skuLable.goodsTagList && item.skuLable.goodsTagList.length">
            <view v-for="(ele, index) in item.skuLable.goodsTagList.slice(0,2)" :key="index">
              <block v-if="index != 0"> | </block>	
              <text>
                {{ ele.tagName }}
              </text>		
            </view>			
          </view>
          <!-- 优惠券和活动 -->
          <view class="column-coupon-activty" v-if="couponShowlist.length > 0">
            <view v-for="(item, index) in couponShowlist" :key="index" class="column-coupon-activty-item">
              {{ item.showFaceValue }}
            </view>
          </view>
          <!-- 评论 -->
          <view class="comment" v-if="showComment">
            <block v-if="item.skuLable.baseLabel.comment">
              {{item.skuLable.baseLabel.comment | saleNumCount}}评论
				      <text class="line"></text>
            </block>
            <block v-if="item.skuLable.baseLabel.applauseRate != '0'">
				      {{item.skuLable.baseLabel.applauseRate}}%好评
              <text class="line"></text>
            </block>
            <block v-if="item.skuLable.baseLabel.salesVolume">
              热销{{item.skuLable.baseLabel.salesVolume | saleNumCount}}
            </block>
          </view>
          <view>
            <!-- <view class="activitity-mark" v-if="item.skuLable && item.skuLable.thematicLabel && item.skuLable.thematicLabel.subjectLabel"> -->
            <view class="activitity-mark" v-if="false">
              <image class="hot-icon" :src="hotIcon" />
              <text>
                <!-- {{item.skuLable.markIngLabel[0].label}} -->
                {{ item.skuLable.thematicLabel.subjectLabel }}
              </text>
              <image class="arrow-right-icon" :src="arrowRightIcon" />
            </view>
          </view>
          <view class="column-goods-buy">
			    	<!-- <block v-if="item.skuLable.couponLable && afterCouponPrice"> -->
            <block v-if="false">
			    		<text class="old-price-small">¥</text>
			    		<text class="old-price">{{ item.finalPrice | priceInt }}</text>
			    		<text class="old-price-small" style="margin-right: 4rpx">{{ item.finalPrice | priceFloat}}</text>
			    	</block>
			    	<view class="performance-mark" v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
			      	<image class="icon" :src="performanceIcon"/>
			      	绩效分: {{ item.skuLable.performanceScoreLabel.performanceScore }}
			      </view>
			    </view>
        </view>
        <view class="column-goods-info-bottom">
          <!-- 商品价格 -->
          <view class="column-goods-price" >
            <!-- 有活动或则优惠券 -->
            <view class="info-price">
              <text class="column-after-coupon-text">{{ skuJoinActType }}</text>
              <text class="unit u-margin-right-2">¥</text>
              <text class="column-goods-price-num">{{ getFinalPrice | priceInt }}</text>
              <text class="decimal">{{getFinalPrice | priceFloat}}</text>
              <!-- 无活动优惠券时只有原价 -->
              <!-- 当不是满减满折活动，又没有优惠券时划线 -->
              <view class="column-old-price"  v-if="actType || couponType" :class="[actType && actType !== 4 && actType!==5 && !couponType ? 'old-price-line' : '']">
                <text class="old-price-small saleNum">¥</text>
                <text class="old-price">{{ item.price | priceInt }}</text>
                <text class="old-price-small">{{ item.price | priceFloat}}</text>
              </view>
            </view>
          </view>

          <view class="column-goods-price" v-if="false">
			    	<text class="column-after-coupon-text" v-if="item.skuLable.couponLable && afterCouponPrice">券后</text>
			    	<text>¥</text>
			    	<text class="column-goods-price-num" v-if="item.skuLable.couponLable && afterCouponPrice">{{afterCouponPrice | priceInt}}</text>
			    	<text class="column-goods-price-num" v-else>{{ item.finalPrice | priceInt }}</text>
			    	<text v-if="item.skuLable.couponLable && afterCouponPrice">{{afterCouponPrice | priceFloat}}</text>
			    	<text v-else>{{item.finalPrice | priceFloat}}</text>
            <view class="column-coupon" v-if="item.skuLable && trueCouponLable">
              <!-- <image class="triangle" :src="triangleIcon" />
              <view class="bubble">
                <block v-if="item.skuLable.couponLable.couponsType == 1">满{{item.skuLable.couponLable.amountLimitation}}减{{item.skuLable.couponLable.faceValue | tenThousandCount}}</block>
  		    	    <block v-else-if="item.skuLable.couponLable.couponsType == 2">{{item.skuLable.couponLable.faceValue | tenThousandCount}}折</block>
  		    	    <block v-else>立减{{item.skuLable.couponLable.faceValue | tenThousandCount}}</block>
              </view> -->
            </view>
            <view class="column-old-price" v-else-if="item.finalPrice != item.price">
              <text class="old-price-small">¥</text>
			    		<text class="old-price">{{ item.price | priceInt }}</text>
			    		<text class="old-price-small">{{ item.price | priceFloat}}</text>
            </view>
			    </view>
          
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  filters: {
    tenThousandCount(val) {
      if(val && Number(val) > 10000) {
        return (parseInt((Number(val) / 10000) * 10)/10) + '万'
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
      if(val && Number(val) > 999) {
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
      triangleIcon: this.$oss + 'wsf-mall/home/bubble-triangle.png',
      data: this.item.skuLable,
      addCartIcon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/cart.png',
    };
  },
  computed: {
    // 展示评论区
    showComment() {
      let skuLable = this.item.skuLable || {}
      let baseLabel = skuLable.baseLabel || {};

      return baseLabel && (parseFloat(baseLabel.comment) || parseFloat(baseLabel.applauseRate) || parseFloat(baseLabel.salesVolume))
    },
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
							couponlist.push({ showFaceValue: obj.markIngLabel[0].fixedDiscount + '折' })
						}	
						if(obj.couponLable){								
							couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						}
					} else if([4, 5].includes(obj.markIngLabel[0].ruleType)){
						// 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
						if(obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length){
							couponlist =  obj.markIngLabel[0].tiredPricingList.slice(0, 1)
							couponlist.forEach(item=>{
								if(obj.markIngLabel[0].ruleType == 4){
									item.showFaceValue = '满' + item.amountLimitation + '减' + item.faceValue
								} else {
									item.showFaceValue = '满' + item.amountLimitation + '打' + item.faceValue + '折'
								}
							})
						} else if(obj.couponLable){								
							couponlist = [...obj.couponLable.slice(0,1)]
						}
					}
					
				} else {
          couponlist =  obj.couponLable ? obj.couponLable.slice(0,1) : []
        }
        couponlist.forEach(item=>{
          if(item.couponsType==2){
            item.showFaceValue = item.faceValue + '折'
          }  else if(item.couponsType==3){			
            item.showFaceValue = '立减' + item.faceValue + '元'
          }
        })
        return couponlist
    },
    // 获取参与活动类型
    // ruleType	1单品促销   2条件促销-固定折扣   3条件促销-固定金额 4 满减  5 满折
    actType() {
      // 原价和终价一样就没有活动
      if (this.item.price == this.data.finalPrice) {
        return ''
      }
      let active = (this.data.markIngLabel || [])[0] || null;
      if (!active) {
        return ''
      }
      
      return active.ruleType
    },
    // 获取优惠券类型 
    // couponsType 1满减券，2折扣券，3立减券
    couponType() {
      if(!this.coupon) {
        return ''
      }
      return this.coupon.couponsType || ''
    },
    // 获取优惠券
    coupon() {
      let couponList = (this.data.couponLable || []).filter(item => {
        return item.checked;
      })
      let coupon = couponList[0] || null;

      return coupon
    },
    // 判断 减后 折后 券后 或者没有
    skuJoinActType() {
      let type = ''
      // ruleType	1单品促销   2条件促销-固定折扣   3条件促销-固定金额 4 满减  5 满折
      if (this.actType == 4) {
        type = '减后'
      } else if(this.actType == 5) {
        type = '折后'
      } else if(this.couponType) {
        type = '券后'
      }
      return type
    },
    // 获取最终价格
    getFinalPrice() {
      // finalPrice是活动减掉后的价格
      let finalPrice = this.data.finalPrice;
      // 如果有券的话需要取券后价
      if (this.couponType) {
        finalPrice = this.coupon.afterCouponPrice || finalPrice
      }
      return finalPrice
    }
  },
  methods: {
    //加购
    handleAddCart(item) {
      let data = {
        num: 1,
        skuId: item.id,
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
// 列表样式
.column-goods {
  margin-top: 20rpx;
  display: flex;
  justify-content: flex-start;
  // align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 20rpx;
  min-height: 292rpx;
  position: relative;
  .add-cart-icon {
    width: 56rpx;
    height: 56rpx;
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
  }
  .column-goods-image {
    margin-right: 16rpx;
    background: #fff
  }
  .column-goods-info {
    height: 260rpx;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .column-goods-info-top {
      .name {
        padding-right: 10px;
        color: #000;
        font-size: 26rpx;
        font-weight: bold;
        line-height: 26rpx;
        height: 26rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
      }
      .desc {
        padding-right: 10px;
        width: 410rpx;
        color: #E3903F;
        line-height: 20rpx;
        height: 20rpx;
        font-size: 20rpx;
        margin-top: 12rpx;
        overflow:hidden; 
      }
      // 商品标签
      .column-info-goodstags{
        display: flex;
        align-items: center;
        margin-top: 12rpx;
        font-size: 20rpx;
        text{
          margin: 0 8rpx;
          border-radius: 8rpx;
          // border-image: linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1)) 1 1;
          font-size: 20rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #999999;
          line-height: 20rpx;
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
        }	
        >view {
          font-size: 20rpx;
          color: #999999;
          line-height: 20rpx;
        }
        >view:last-of-type{
          text{
            margin-right: 0;
          }
        }	
      }	
      .comment {
        font-size: 20rpx;
			  color: #999999;
			  line-height: 20rpx;
			  display: inline-flex;
			  align-items: center;
			  padding-top: 12rpx;
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
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap; 
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
      .column-goods-buy, .column-old-price {
		  	.old-price {
		  		font-size: 28rpx;
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
			    font-size: 20rpx;
			    color: #00BBBA;
			    line-height: 32rpx;
          display: inline-block;
          margin-top: 12rpx;
			    .icon {
			    	width: 32rpx;
			    	height: 32rpx;
			    	vertical-align: middle;
            transform: translateY(-1rpx);
			    }
		    }
		  }
    }
    // 活动和优惠券显示
    .column-coupon-activty{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 12rpx;
      // margin-bottom: 12rpx;
      &-item{
        background: #FFEDED;
        border-radius: 16rpx;
        font-size: 20rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF0B35;
        height: 34rpx;
        line-height: 34rpx;
        padding: 0rpx 10rpx;
        margin-right: 8rpx;
      }
      &-item:last-of-type{
        margin-right: 0;
      }
    }
    .column-goods-info-bottom {
      .column-goods-price {
			  font-size: 22rpx;
			  color: #FF0A35;
			  line-height: 46rpx;
        display: flex;
        align-items: center;
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
			}
      .old-price-line {
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
		  .column-goods-buy, .column-old-price {
		  	.old-price {
		  		font-size: 28rpx;
		  		color: #c3c3c3;
		  		font-weight: bold;
		  	}
		  	.old-price-small {
		  		font-size: 20rpx;
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
}
</style>
