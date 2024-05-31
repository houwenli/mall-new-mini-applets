<template>
  <view class="column-goods-item">
    <view class="column-goods">
      <view class="column-goods-image">
        <u-image
          height="260rpx"
          width="260rpx"
          loading-icon=""
          border-radius="16rpx"
          :src="item.url + '?imageView2/1/w/520'"
          error-icon="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_4.png"
        ></u-image>
        <image class="smart-goods-tag" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_goods_tag.png">
        </image>
        <view class="smart-goods-tag-title">电商</view>
      </view>
      <view class="column-goods-info">
        <view class="column-goods-info-top">
          <view class="name u-line-2">
            {{item.name || item.skuName}}
          </view>
          <view class="desc" v-if="item.subTitle">
            {{item.subTitle}}
          </view>
          <!-- 商品标签-->
          <view class="column-info-goodstags" v-if="item.skuLable && item.skuLable.goodsTagList && item.skuLable.goodsTagList.length">
            <view class="column-info-goodstags-item" v-for="(ele, index) in item.skuLable.goodsTagList.slice(0,2)" :key="index">	
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
          

        
        </view>
        <view class="column-goods-info-bottom">

          <!-- 专题活动 -->
          <view>
            <view class="activitity-mark" v-if="item.skuLable && item.skuLable.thematicLabel && item.skuLable.thematicLabel.subjectLabel">
              <image class="hot-icon" :src="hotIcon" />
              <text>
                <!-- {{item.skuLable.markIngLabel[0].label}} -->
                {{ item.skuLable.thematicLabel.subjectLabel }}
              </text>
              <image class="arrow-right-icon" :src="arrowRightIcon" />
            </view>
          </view>

          <!-- 优惠券和活动 -->
          <view v-if="couponShowlist && couponShowlist.length > 0" class="column-coupon-activty">
            <view v-for="(item, index) in couponShowlist" :key="index" class="column-coupon-activty-item">
              <view class="column-coupon-activty-item-icon">
                惠
              </view>
              <view class="column-coupon-activty-item-price">
                {{ item.showFaceValue }}
              </view>
            </view>
          </view>

          <view class="column-goods-price">
            <!-- 添加福气值逻辑 -->
            <view class="fqz-price" v-if="item.integralPoint > 0">
              <text class="special">
                {{ item.integralPoint }}
              </text>
              福气值+
              <text class="special">
                {{ item.deductionAfterPrice | fenToYuan }}
              </text>
              元
            </view>
            <template v-else>
              <text class="column-after-coupon-text" v-if="item.skuLable.couponLable && afterCouponPrice">券后</text>
              <text>¥</text>
              <text class="column-goods-price-num" v-if="item.skuLable.couponLable && afterCouponPrice">{{afterCouponPrice * 100/10000 | priceInt}}</text>
              <text class="column-goods-price-num" v-else>{{ item.finalPrice * 100/10000 | priceInt }}</text>
              <text v-if="item.skuLable.couponLable && afterCouponPrice">{{afterCouponPrice * 100/10000 | priceFloat}}</text>
              <text v-else>{{item.finalPrice * 100/10000 | priceFloat}}</text>
            </template>
			    	
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
			    		<text class="old-price">{{ item.price * 100/10000 | priceInt }}</text>
			    		<text class="old-price-small">{{ item.price * 100/10000 | priceFloat}}</text>
            </view>
			    </view>
          <view class="column-goods-buy">
			    	<block v-if="item.skuLable.couponLable && afterCouponPrice">
			    		<text class="old-price-small">¥</text>
			    		<text class="old-price">{{ item.finalPrice * 100/10000 | priceInt }}</text>
			    		<text class="old-price-small" style="margin-right: 4rpx">{{ item.finalPrice * 100/10000 | priceFloat}}</text>
			    	</block>
			    	<view class="performance-mark" v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
			      	<image class="icon" :src="performanceIcon"/>
			      	绩效分: {{ item.skuLable.performanceScoreLabel.performanceScore | performanceCount }}
			      </view>
			    </view>
        </view>
        </view>
      </view>
      <view v-if="fromPage == 'distributionIndex'" class="share-button" @tap.stop="$emit('handleShareProduct', item)">
        <view class="share-button-box">
          <text class="price-label activitity-mark-text">预估佣金</text>
          <text class="share-button-price activitity-mark-text">{{ item.commissionAmount * 100/10000 | priceInt }}</text>
          <text class="share-button-price price-fen activitity-mark-text">{{ item.commissionAmount * 100/10000 | priceFloat }}</text>
        </view>
        <view class="share-button-bg">分享赚</view>
      </view>
    </view>
</template>

<script>
import { fenToYuan } from '@/common/utils.js';
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    fromPage: {
      type: String
    }
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
    fenToYuan
  },
  data() {
    return {
      performanceIcon: this.$oss + 'wsf-mall/home/ic_performance_mark.png',
      hotIcon: this.$oss + 'wsf-mall/skuDetail/icon-actity.png',
      arrowRightIcon: this.$oss + 'wsf-mall/skuDetail/icon-red.png',
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
							couponlist.push({ showFaceValue: obj.markIngLabel[0].fixedDiscount + '折' })
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
									item.showFaceValue = '满' + fenToYuan(item.amountLimitation*1,false) + '减' + fenToYuan(item.faceValue*1,false)
								} else {
									item.showFaceValue = '满' + fenToYuan(item.amountLimitation*1,false) + '打' + item.faceValue + '折'
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
            item.showFaceValue = item.faceValue + '折'
          }  else if(item.couponsType==3){			
            item.showFaceValue = '立减' + fenToYuan(item.faceValue*1,false) + '元'
          }
        })
        return couponlist
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
// 列表样式
.column-goods-item {
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  padding: 16rpx;
}
.column-goods {
  display: flex;
  justify-content: flex-start;
  // align-items: center;
  overflow: hidden;
  .column-goods-image {
    position: relative;
    margin-right: 16rpx;
    background: #fff;
  }
  .smart-goods-tag {
    border-bottom-left-radius: 8px;
  } 
  .column-goods-info {
    min-height: 260rpx;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .column-goods-info-top {
      .name {
        font-family: PingFangSC-Medium, PingFang SC;
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
        overflow:hidden; 
      }
      // 商品标签
      .column-info-goodstags{
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        .column-info-goodstags-item{
            margin:4rpx 8rpx 0rpx 0rpx;
			border-radius: 8rpx;
			background-color: #fDF8E6;
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FF450C;
			line-height: 28rpx;
			padding: 0rpx 8rpx;
        }	
        &:last-of-type {
          margin-right: 0;
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
    }
    // 活动和优惠券显示
    .column-coupon-activty{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 12rpx;
      // margin-bottom: 12rpx;
      height: 28rpx;
      &-item{
        height: 28rpx;				
				display: flex;
				align-items: center;
        padding-right: 8rpx;           
        border-radius: 8rpx;             
				border: 1rpx solid rgba(255,55,0,0.4);   
				margin-right: 8rpx;             
        &:last-of-type {
            margin-right: 0;
        }
				&-icon{
					width: 30rpx;
					height: 28rpx;
					text-align: center;
					line-height: 28rpx;
					background: rgba(255, 69, 12, 0.13);					
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FF450C;
				}
				&-price{
					font-size: 20rpx;				
                	color: #ff450c;
					margin-left: 4rpx;					
				}
      }
    }
    .column-goods-info-bottom {
      width: 100%;
      .column-goods-price {
        font-size: 22rpx;
        color: #ff450c;
        line-height: 46rpx;
        text {
          font-size: 22rpx;
          font-weight: bold;
          font-family: DINAlternate-Bold, DINAlternate;
			  }
			  .column-goods-price-num {
			  	font-size: 40rpx;
          font-family: DINAlternate-Bold, DINAlternate;
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
        .fqz-price {
          font-size: 20rpx;
          .special {
            font-size: 40rpx;
          }
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
		  .column-goods-buy, .column-old-price {
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

      .activitity-mark {
        height: 32rpx;
        background: #FFEDF0;
        border-radius: 14rpx;
        background: #FFEDF0;
        border-radius: 28rpx;
        margin-top: 12rpx;
        padding: 0 4rpx;
        display: inline-flex;
        align-items: center;
        line-height: 32rpx;
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
          width: 20rpx;
          height: 20rpx;
          margin-left: 4rpx;
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
.share-button {
  margin-top: 12rpx;
  height: 64rpx;
  border-radius: 38rpx;
  background-color:rgba(246, 246, 246, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .share-button-box {
    display: flex;
    align-items: flex-end;
    padding-left: 276rpx;
  }
  .price-label {
      line-height: 22rpx;
      padding-right: 2px;
      font-size: 22rpx;
      color: #6e6e6e;
      vertical-align: baseline;
      font-family: DINAlternate-Bold, DINAlternate;
  }
  .share-button-price {
      font-size: 32rpx;
      line-height: 26rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ff450c;
  }
  .price-fen {
      font-size: 26rpx;
      line-height: 22rpx;
      font-family: DINAlternate-Bold, DINAlternate;
  }
  .share-button-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200rpx;
    height: 100%;
    background-image: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    border-radius: 200rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 30rpx;
  }
}

</style>
