<template>
	<view class="waterfall-goods" :class="{'waterfall-goods-left': type == 'left'}">
		<view style="height: 352rpx;width: 352rpx;overflow: hidden;border-radius: 24rpx 24rpx 0 0;background: #fff;position:relative">
			<u-image
				height="352rpx"
				width="352rpx"
				loading-icon=""
				border-radius="24rpx 24rpx 0 0"
				:src="item.url + '?imageView2/1/w/352'"
				error-icon="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_4.png"
			></u-image>

			<image class="smart-goods-tag" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_goods_tag.png">
			</image>
			<view class="smart-goods-tag-title">电商</view>
		</view>
		<view class="waterfall-goods-info">
			<view class="waterfall-goods-name u-line-2">{{ item.name || item.skuName }}</view>
			<!-- <view class="waterfall-goods-describe" v-if="item.subTitle">{{item.subTitle}}</view> -->

			<!-- 商品标签-->
			<view class="column-info-goodstags" v-if="item.skuLable && item.skuLable.goodsTagList && item.skuLable.goodsTagList.length">
				<view v-for="(ele, index) in item.skuLable.goodsTagList.slice(0,2)" :key="index" class="column-info-goodstags-item">	
					{{ ele.tagName }}
				</view>			
			</view>


			<view class="waterfall-goods-comment" v-if="item.skuLable.baseLabel && (item.skuLable.baseLabel.comment || item.skuLable.baseLabel.applauseRate != '0')">
				<block v-if="item.skuLable.baseLabel.comment">
					{{item.skuLable.baseLabel.comment | saleNumCount}}评论
				</block>
				<text v-if="item.skuLable.baseLabel.comment && item.skuLable.baseLabel.applauseRate != '0'" class="line"></text>
				<block v-if="item.skuLable.baseLabel.applauseRate != '0'">
					{{item.skuLable.baseLabel.applauseRate}}%好评
				</block>
			</view>
			<view class="performance-mark" v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
				<image class="icon" :src="performanceIcon"/>
				绩效分: {{getPerformanceScore}}
			</view>

			<!-- 优惠券和活动 -->
			<view class="shop-coupon-activty" v-if="couponShowlist.length">
				<view v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item">
					<view class="shop-coupon-activty-item-icon">
						惠
					</view>
					<view class="shop-coupon-activty-item-price">
						{{ item.showFaceValue }}
					</view>
				</view>
			</view>
			
			<view class="waterfall-goods-price">
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
					<text class="waterfall-after-coupon-text" v-if="item.skuLable.couponLable && afterCouponPrice">券后</text>
					<text>¥</text>
					<text class="waterfall-goods-price-num" v-if="item.skuLable.couponLable && afterCouponPrice">{{ afterCouponPrice * 100/10000 | priceInt}}</text>
					<text class="waterfall-goods-price-num" v-else>{{ item.finalPrice * 100/10000 | priceInt }}</text>
					<text v-if="item.skuLable.couponLable && afterCouponPrice">{{ afterCouponPrice * 100/10000 | priceFloat}}</text>
					<text v-else>{{item.finalPrice * 100/10000 | priceFloat}}</text>
				</template>
				
				<view class="waterfall-coupon" v-if="item.skuLable && trueCouponLable">
					<!-- <image class="triangle" :src="triangleIcon" />
					<view class="bubble">
						<block v-if="trueCouponLable.couponsType == 1">满{{trueCouponLable.amountLimitation}}减{{trueCouponLable.faceValue | tenThousandCount}}</block>
							<block v-else-if="trueCouponLable.couponsType == 2">{{trueCouponLable.faceValue | tenThousandCount}}折</block>
							<block v-else>立减{{trueCouponLable.faceValue | tenThousandCount}}</block>
					</view> -->
				</view>
				<view class="waterfall-old-price" v-else-if="item.finalPrice != item.price">
					<text class="old-price-small">¥</text>
					<text class="old-price">{{ item.price * 100/10000 | priceInt }}</text>
					<text class="old-price-small">{{ item.price * 100/10000 | priceFloat}}</text>
				</view>
			</view>
			<view :style="{'margin-top': item.skuLable.couponLable && afterCouponPrice ? '0rpx' : '-8rpx' }" class="waterfall-goods-buy">
				<block v-if="item.skuLable.couponLable && afterCouponPrice">
					<text class="old-price-small">¥</text>
					<text class="old-price">{{ item.finalPrice * 100/10000 | priceInt }}</text>
					<text class="old-price-small" style="margin-right: 8rpx">{{ item.finalPrice * 100/10000 | priceFloat}}</text>
				</block>
				<text class="saleNum" v-if="item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume">{{item.skuLable.baseLabel.salesVolume | saleNumCount}}人已买</text>
			</view>
			<view class="activitity-mark" v-if="item.skuLable && item.skuLable.thematicLabel && item.skuLable.thematicLabel.subjectLabel">
				<image class="hot-icon" :src="hotIcon" />
				<text>
					<!-- {{item.skuLable.markIngLabel[0].label}} -->
					{{ item.skuLable.thematicLabel.subjectLabel }}
				</text>
				<image class="arrow-right-icon" :src="arrowRightIcon" />
			</view>			

			<view v-if="fromPage == 'distributionIndex'" class="share-button" @tap.stop="$emit('handleShareProduct', item)">
                <view class="share-button-box">
                    <text class="price-label activitity-mark-text">预估佣金</text>
                    <text class="share-button-price activitity-mark-text">{{ item.commissionAmount * 100/10000 | priceInt }}</text>
                    <text class="share-button-price price-fen activitity-mark-text">{{ item.commissionAmount * 100/10000 | priceFloat }}</text>
                </view>
                <!-- <view class="share-buttin-bg">分享赚</view> -->
            </view>
		</view>
	</view>
</template>

<script>
import { fenToYuan } from '@/common/utils.js';
const performanceCount = (val) => {
	if(val && Number(val) >= 10000) {
		return (parseInt((val / 10000) * 10)/10) + '万分'
	} else if(val && Number(val) >= 1000) {
		return parseInt(Number(val) / 1000) + '000+分'
	} else if(val && Number(val) >= 100) {
		return parseInt(Number(val) / 100) + '00+分'
	} else {
		return val + '分'
	}
}

export default {
  props: {
    item: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      required: true
    },
	fromPage: {
		type: String
	}
  },
  filters: {
    tenThousandCount(val) {
      if(val && Number(val) >= 10000) {
        return (parseInt((Number(val) / 10000) * 10)/10) + '万'
      } else {
        return parseInt(Number(val) * 10) / 10
      }
    },
		performanceCount,
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
		triangleIcon: this.$oss + 'wsf-mall/home/bubble-triangle.png',
		hotIcon: this.$smartImg + '/home/icon_sl_huodong.png',
		arrowRightIcon: this.$smartImg + '/home/icon_sl_right.png'		
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
			// 活动和优惠券标签，最多显示2个标签
			if(obj.markIngLabel && obj.markIngLabel.length){
				if([1, 3].includes(obj.markIngLabel[0].ruleType)){
					// 固定金额和自定义规则: 只显示优惠券标签，最多显示2个按照优惠力度由大到小排列
					couponlist =  obj.couponLable ? obj.couponLable.slice(0,2) : []
				} else if(obj.markIngLabel[0].ruleType == 2){
					// 固定折扣活动: 显示活动标签为【XX折】+1个优惠券标签，按照优惠力度由大到小排列
					if(obj.markIngLabel && obj.markIngLabel[0].fixedDiscount){				
						couponlist.push({ showFaceValue: obj.markIngLabel[0].fixedDiscount + '折' })
					}						
				} else if([4, 5].includes(obj.markIngLabel[0].ruleType)){
					// 满减或满折活动，商品参加满减或满折活动，显示活动标签为1个，取基数较小的1个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
					if(obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length){
						couponlist =  obj.markIngLabel[0].tiredPricingList.slice(0, 1)
						couponlist.forEach(item=>{
							if(obj.markIngLabel[0].ruleType == 4){
								item.showFaceValue = '满' + fenToYuan(item.amountLimitation*1,false) + '减' + fenToYuan(item.faceValue*1,false)
							} else {
								item.showFaceValue = '满' + fenToYuan(item.amountLimitation*1,false) + '打' + item.faceValue + '折'
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
					item.showFaceValue = '立减' + fenToYuan(item.faceValue*1,false) + '元'
				}
			})
			return couponlist
		},
		
		/**
		 * 获取绩效分-代码容错处理
		 * performanceScoreLabel可能为null
		 */
		getPerformanceScore() {
			if (this.item.skuLable && this.item.skuLable.performanceScoreLabel) {
				let performanceScore = this.item.skuLable.performanceScoreLabel.performanceScore

				return performanceCount(performanceScore)
			}

			return ''
		}
	}
};
</script>

<style scoped lang="scss">
.waterfall-goods-left {
	margin-right: 16rpx;
}
/* 瀑布流样式 */
.waterfall-goods {
  width: 352rpx;
	margin-bottom: 20rpx;
	.smart-goods-tag{
		width: 82rpx;
    height: 46rpx;
	}
	.smart-goods-tag-title{
		position: absolute;
		bottom: 3rpx
	}
	.waterfall-goods-info {
		width: 100%;
		background-color: #fff;
		padding: 12rpx 16rpx 16rpx;
		border-radius: 0 0 24rpx 24rpx;
		.waterfall-goods-name {
			font-size: 26rpx;
			line-height: 34rpx;
			color: #191919;
			margin-bottom: 8rpx;
			font-weight: 500;
		}
		.waterfall-goods-describe {
			font-size: 22rpx;
			color: #E3903F;
			line-height: 30rpx;
			height: 30rpx;
			
			margin-bottom: 12rpx;
			overflow:hidden;
		}
		// 商品标签
		.waterfall-info-goodstags{
			display: flex;
			align-items: center;
			margin-bottom: 8rpx;
			text{
				margin-right: 8rpx;
				border-radius: 8rpx;
				border: 1rpx solid;
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
		// 商品标签
		.column-info-goodstags{
			display: flex;
			align-items: center;
			margin-bottom: 8rpx;
			.column-info-goodstags-item{
			margin-right: 8rpx;
			border-radius: 8rpx;
			background-color: #fDF8E6;
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FF450C;
			line-height: 28rpx;
			// -webkit-background-clip: text;
			// -webkit-text-fill-color: transparent;
			padding: 0rpx 12rpx;
			}	
			&:last-of-type {
				margin-right: 0;
			}	
		}	
		.waterfall-goods-comment {
			font-size: 22rpx;
			color: #999999;
			line-height: 30rpx;
			display: inline-flex;
			align-items: center;
			margin-bottom: 16rpx;
			.line {
				display: inline-block;
				width: 2rpx;
				height: 24rpx;
				background: #C3C3C3;
				margin: 0 8rpx;
			}
		}
		.performance-mark { 
			height: 32rpx;
			background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
			border-radius: 8rpx;
			font-size: 22rpx;
			color: #008864;
			line-height: 32rpx;
			margin-bottom: 8rpx;
			.icon {
				width: 32rpx;
				height: 32rpx;
				vertical-align: middle;
				transform: translateY(-1rpx);
			}
		}
		.waterfall-goods-price {
			font-size: 22rpx;
			color: $wsf-color-new-red;
			line-height: 40rpx;
			text {
				font-size: 22rpx;
        font-weight: bold;
				font-family: DINAlternate-Bold, DINAlternate;
			}
			.waterfall-goods-price-num {
				font-size: 40rpx;
				font-family: DINAlternate-Bold, DINAlternate;
			}
			.waterfall-original-price {
				font-size: 20rpx;
				color: #666;
				margin-left: 16rpx;
			}
			.waterfall-after-coupon-text {
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
    .waterfall-coupon {
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
    .waterfall-old-price {
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
		.waterfall-goods-buy, .waterfall-old-price {
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
		}
		.coupon-mark-box {
			margin-top: 20rpx;
			height: 48rpx;
			overflow: hidden;
			width: 100%;
			.coupon-mark {
				margin-bottom: 10rpx;
  		  height: 32rpx;
  		  border-radius: 4rpx;
  		  border: 2rpx solid #E60113;
  		  padding: 0 6rpx;
  		  font-size: 20rpx;
  		  font-weight: 600;
  		  display: inline-flex;
  		  margin-right: 8rpx;
  		  align-items: center;
  		  color: #E60113;
  		}
		}
		.activitity-mark {
			height: 48rpx;
			background: #FFEDF0;
			border-radius: 28rpx;
			background: #FFEDF0;
			margin-top: 16rpx;
			// padding: 0 8rpx;
			display: flex;
			align-items: center;
			line-height: 48rpx;
			font-size: 20rpx;
			background: linear-gradient(to right, #F4FAFF 0%, #FFE8E8 10%, #FFF9E9 71%, #fef1e9 100%);
			text {
				flex: 1;
				font-size: 20rpx;
				color: #FF0A35;
				line-height: 30rpx;
				
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap; 
			}
			.hot-icon {
				flex-shrink: 0;
				width: 32rpx;
				height: 32rpx;
				margin:0rpx 6rpx 0rpx 8rpx;
			}
			.arrow-right-icon {
				flex-shrink: 0;
				width: 12rpx;
				height: 12rpx;
				margin-right: 16rpx;
			}
		}
		// 活动和优惠券显示
		.shop-coupon-activty{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			//margin-top: 6rpx;
			margin-bottom: 4rpx;
			height: 28rpx;
			&-item{
				height: 28rpx;		
				display: flex;
				align-items: center;
                padding-right: 8rpx;           
                border-radius: 8rpx;             
				border: 1rpx solid rgba(255,55,0,0.4);   
				margin-right: 8rpx;
                overflow: hidden;
                &:last-of-type {
                    margin-right: 0;
                }
				&-icon{
					width: 30rpx;
					height: 28rpx;
					text-align: center;
					line-height: 29rpx;
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
	}
	.share-button {
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        margin-top: 16rpx;
        display: flex;
        // justify-content: start;
        align-items: center;
        height: 64rpx;
        border-radius: 32rpx;
        width: 100%;
        padding-left: 16rpx;
        // border: 2rpx solid #ff0a35
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/share_earn_bg.png') 102% 0 no-repeat;
        background-size: 100% 100%;
    }
    .price-label {
        // line-height: 30rpx;
        line-height: 22rpx;
        padding-right: 2px;
        font-size: 22rpx;
        color: #6e6e6e;
        vertical-align: baseline;
        font-family: DINAlternate-Bold, DINAlternate;
    }
    .share-button-price {
        font-size: 32rpx;
        // line-height: 40rpx;
        line-height: 26rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff450c;
    }
    .price-fen {
        font-size: 26rpx;
        // line-height: 34rpx;
        line-height: 22rpx;
        font-family: DINAlternate-Bold, DINAlternate;
	}
    .share-button-box {
        display: flex;
        align-items: flex-end;
    }
}
</style>
