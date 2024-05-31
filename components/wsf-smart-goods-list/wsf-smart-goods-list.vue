<template>
	<view>
	<view v-if="goodsList && goodsList.length>0">
		<view v-if="title" class="applet-template-recommend-title">
			 <image
        style="height: 32rpx; width: 498rpx"
        :src="titleImg"
        mode="heightFix"
      ></image>
		</view>
		<view style="margin-bottom: 90rpx;" v-if="goodsListStyle == 'column'">
			<view class="list-goods">
				<template v-for="(item, index) in goodsList">
					<view @click="$emit('goodsClick', item)" :key="index">
						<column-goods :item="item" :fromPage="item.fromPage" @handleShareProduct="$emit('handleShareProduct', item)"></column-goods>
					</view>
				</template>
			</view>
		</view>
		<!-- 瀑布流样式 -->
		<view style="margin-bottom: 40rpx;" v-else-if="goodsListStyle == 'waterfall'">
			<u-waterfall v-model="goodsList" ref="uWaterfall" add-time="0">
				<template v-slot:left="{ leftList }">			
					<view v-for="(item, index) in leftList" :key="index" @click="$emit('goodsClick', item)">
						<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
						<block v-if="item.relatedId && item.relatedType == 2">
							<hot-ranking :item="item" @handleAddCart="handleAddCart" @goodsClick="goodsClick"></hot-ranking>
						</block>
						<block v-else-if="item.relatedId && item.relatedType == 1">
							<hot-swiper :item="item" @clickSwiperCurrent="clickSwiperCurrent"></hot-swiper>
						</block>
						<block v-else>
							<waterfall-goods :item="item" type="left" :fromPage="item.fromPage" @handleShareProduct="$emit('handleShareProduct', item)"></waterfall-goods>
						</block>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view v-for="(item, index) in rightList" :key="index" @click="$emit('goodsClick', item)">
						<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
						<block v-if="item.relatedId && item.relatedType == 2">
							<hot-ranking :item="item" @handleAddCart="handleAddCart" @goodsClick="goodsClick"></hot-ranking>
						</block>
						<block v-else-if="item.relatedId && item.relatedType == 1">
							<hot-swiper :item="item" type="right" @clickSwiperCurrent="clickSwiperCurrent"></hot-swiper>
						</block>
						<block v-else>
							<waterfall-goods :item="item" :fromPage="item.fromPage" @handleShareProduct="$emit('handleShareProduct', item)"></waterfall-goods>
						</block>
					</view>
				</template>
			</u-waterfall>
		</view>
		<!-- 普通排列 -->
		<view class="common-goods-container" v-else-if="goodsListStyle == 'common'">
			<view class="common-goods" v-for="(item, index) in goodsList" :key="index">
				<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
				<block v-if="item.relatedId && item.relatedType == 2">
					<hot-ranking :item="item" @handleAddCart="handleAddCart" @goodsClick="goodsClick"></hot-ranking>
				</block>
				<block v-else-if="item.relatedId && item.relatedType == 1">
					<hot-swiper :item="item" @clickSwiperCurrent="clickSwiperCurrent"></hot-swiper>
				</block>

				<view v-else class="waterfall-goods" @click="$emit('goodsClick', item)">
					<!-- <view style="height: 344rpx;width: 344rpx;background-color: #fff !important;overflow: hidden;border-radius: 16rpx 16rpx 0 0;">
						<u-image
							height="344rpx"
							width="344rpx"
							loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png"
							border-radius="16rpx 16rpx 0 0"
							:src="item.url + '?imageView2/1/w/513'"
							bg-color="#fff"
						></u-image>
					</view> -->
					<view class="waterfall-goods-info common-goods-info">
						<view class="waterfall-goods-name u-line-2">{{ item.name || item.skuName }}</view>
						<view class="waterfall-goods-price">
							<span>¥</span>
							<text class="waterfall-goods-price-num" :style="{fontSize: item.afterCouponPrice ? selfFontSize(item.afterCouponPrice) : '36rpx' }">{{ item.afterCouponPrice ? item.afterCouponPrice : item.finalPrice }}</text>
							<text class="waterfall-after-coupon-text" v-if="item.afterCouponPrice">券后价</text>
							<text class="waterfall-original-price" v-if="item.afterCouponPrice">¥{{ item.finalPrice * 100/10000 }}</text>
							<text class="waterfall-old-price" v-else-if="item.finalPrice != item.price">¥{{ item.price * 100/10000 }}</text>
						</view>
						<!-- <view class="performance-mark" v-if="item.performanceScore && item.performanceScore > 0">绩效分{{ item.performanceScore }}</view> -->
						<view class="coupon-mark-box" v-if="item.couponLabelList && item.couponLabelList.length">
								<view v-for="(n, i) in item.couponLabelList" :key="i" class="coupon-mark">
          			  <block v-if="n.couponsType == 1">满{{n.amountLimitation}}减¥{{n.faceValue}}</block>
          			  <block v-else-if="n.couponsType == 2">{{n.faceValue ? n.faceValue : 0}}折</block>
          			  <block v-else>立减¥{{n.faceValue}}</block>
          			</view>
						</view>
						<block v-for="(n, i) in item.marketingVos" :key="i">
							<view class="reduced-price tag-mark" v-if="n.type == 1">
                <!-- 直降标签 -->
								<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/reduced_price%402x.png"></image>
								<text class="price-tag">{{ n.fall.price }}元</text>
							</view>
							<view class="gift-product tag-mark" v-if="n.type == 2">赠</view>
						</block>
					</view>
				</view>
			</view>
		</view>

		<u-loadmore v-if="loadMoreScene == 'normal'" margin-bottom="40" :loadText="loadText" :bg-color="loadMoreBgColor" :color="loadMoreTextColor" :status="loadStatus"></u-loadmore>
		<view v-else-if="loadMoreScene == 'detail'">
			<u-loadmore v-if="loadStatus != 'nomore'" :loadText="loadText" :bg-color="loadMoreBgColor" :color="loadMoreTextColor" :status="loadStatus"></u-loadmore>
			<view v-else class="no-more-box">
					<view class="text">见底啦～不如去</view>
					<button class="button" @tap="goIndex()">首页逛逛</button>
			</view>
		</view>

		<!-- 如果是智慧生活首页需要多加一个 -->
		<!-- <view v-if="pageIndex">
			<u-loadmore v-if="loadStatus != 'nomore'" :loadText="loadText" :bg-color="loadMoreBgColor" :color="loadMoreTextColor" :status="loadStatus"></u-loadmore>			
		</view> -->
	</view>
	<view class="nodatebox" v-else>
		<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/bge.png" mode=""></image>
		<text class="result">{{ loadStatus == 'nomore' ? '没有搜索结果' : '加载商品信息' }}</text>
		<text class="goods" v-if="loadStatus == 'nomore'">没有找到相关宝贝</text>
	</view>	
	</view>
</template>

<script>
import { priceFilter } from '@/common/wsfValidate.js';
import WaterfallGoods from './waterfall-goods.vue';
import ColumnGoods from './column-goods.vue';
import HotRanking from './hot-ranking.vue'
import HotSwiper from './hot-swiper.vue'
export default {
	components: {
		HotRanking,
		HotSwiper,
		WaterfallGoods,
		ColumnGoods
	},
	props: {
		title: {
			type: String
		},
		list: {
			type: Array
		},
		loadStatus: {
			type: String
		},
		loadMoreBgColor: {
			type: String,
			default: '#F5F5F5'
		},
		loadMoreTextColor: {
			type: String,
			default: '#999'
		},
		showStyle: {
			type: String,
			default: 'waterfall',
			// common: 两列，column:一列，waterfall:瀑布流
		},
		loadMoreScene: {
			type: String,
			default: 'normal',
		},
		fromPage: {
			type: String
		},
		// 智慧生活的没有分页
		pageIndex: {
			type: Boolean,
			default: false,
		}
	},
	computed: {
		titleImg() {
			if(this.title && this.title == 'hot') {
				return this.$oss + 'wsf-mall/home/hot_commodity.png'
			} else if(this.title && this.title == 'good') {
				return this.$oss + 'wsf-mall/home/search-for-recommand-pic-new.png'
			} else {
				return ''
			}
		}
	},
	watch: {
		showStyle(newVal, oldval) {
			console.log('newVal', newVal);
			this.goodsListStyle = newVal;
		},
		
		list: {
			deep: true,
      immediate: true,
      handler(n, o) {			
				this.goodsList = n.map(item => {
					item.finalPrice = priceFilter(item.finalPrice);
					item.fromPage = this.fromPage
					return item;
				});			
				// this.goodsList = n;
			}		
		}	
	},
	created(){
		if(this.pageIndex){
			this.goodsList = this.list.map(item => {
				item.finalPrice = priceFilter(item.finalPrice);
				item.fromPage = this.fromPage
				return item;
			});	
		}
	},
	data() {
		return {
			performanceIcon: this.$oss + 'wsf-mall/home/ic_performance_mark.png',
			imgList: [{
				url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//uat/87de7ed6e55053d6404b441dfd4782c2.png?fileUid=1608716837110?imageView2/1/w/513"
			},{
				url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//uat/87de7ed6e55053d6404b441dfd4782c2.png?fileUid=1608716837110?imageView2/1/w/513"
			}],
			isShowStore: 0,
			goodsListStyle: this.showStyle,
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			goodsList: []
		};
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore // 判断商城信息
	},
	methods: {
		goIndex() {
			if(this.fromPage == 'distributionIndex' || this.fromPage == 'distributionUserPage') {
				// 分销回到分销首页
				this.$smart.go('Distribution')
			} else {
				this.$smart.go("SmartIndex")
			}
		},
		clearList() {
			this.goodsList = [];
		},
		/* 点击swiper */
    clickSwiperCurrent(item) {
      this.$emit("clickSwiperCurrent", item.appletJumpUrl)
    },
		handleAddCart(n) {
			this.$emit("clickAddCart", n)
		},
		goodsClick(n){
			this.$emit('goodsClick', n)
		},
		selfFontSize(price) {
			price = Number(price)
			if(price && price >= 10000) {
				return '26rpx'
			} else if(price && price >= 1000) {
				return '30rpx'
			} else {
				return '36rpx'
			}
		}
	}
};
</script>

<style scoped lang="scss">
/* 热销商品 */
.applet-template-recommend-title {
	text-align: center;
	margin: 40rpx 0 20rpx;
}
.waterfall-goods-left {
	margin-right: 14rpx;
}

/* 普通排列样式*/
.common-goods-container {
	margin-bottom: 90rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.common-goods-info {
		height: 194rpx;
		.waterfall-goods-name {
			min-height: 80rpx;
		}
	}
}

/* 瀑布流样式 */
.waterfall-goods {
	margin-bottom: 20rpx;
	.waterfall-goods-info {
		width: 352rpx;
		background-color: #fff;
		padding: 12rpx 16rpx 24rpx;
		border-radius: 0 0 24rpx 24rpx;
		.waterfall-goods-name {
			font-size: 26rpx;
			line-height: 34rpx;
			color: #191919;
			margin-bottom: 8rpx;
		}
		.waterfall-goods-describe {
			font-size: 22rpx;
			color: #E3903F;
			line-height: 30rpx;
			height: 30rpx;
			padding-bottom: 12rpx;
			overflow:hidden;
			white-space:nowrap;
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
				width: 1rpx;
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
			}
		}
		.waterfall-goods-price {
			font-size: 22rpx;
			color: #FE3040;
			line-height: 46rpx;
			text {
				font-size: 22rpx;
			}
			.waterfall-goods-price-num {
				font-size: 40rpx;
			}
			.waterfall-old-price {
				font-size: 22rpx;
				color: #999;
				margin-left: 16rpx;
				text-decoration: line-through;
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
		}
		.waterfall-goods-buy {
			display: inline-flex;
			align-items: center;
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
		.tag-mark {
			vertical-align: middle;
			margin-top: 8rpx;
			margin-right: 12rpx;
			display: inline-block;
		}
		.gift-product {
			width: 28rpx;
			height: 28rpx;
			line-height: 28rpx;
			text-align: center;
			color: $wsf-color-red;
			font-size: 20rpx;
			border-radius: 4rpx;
			border: 2rpx solid $wsf-color-red;
		}
		.reduced-price {
			width: 116rpx;
			height: 28rpx;
			position: relative;
			.price-tag {
				height: 100%;
				width: 60rpx;
				text-align: center;
				line-height: 28rpx;
				color: #fff;
				font-size: 18rpx;
				position: absolute;
				right: 0;
				top: 0;
			}
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.nodatebox{
	display:flex;
	flex-direction:column;
	align-items:center;
	padding-bottom: 15%;
	image{
		width:190rpx;
		height:198rpx;
		margin-top:20%;
	}
	.result {
		color: #666;
		font-size:32rpx;
		margin: 20rpx 0 10rpx
	}
	.goods{
		font-size: 28rpx;
		color:#999
	}
}
// /deep/#u-left-column,#u-right-column{
// 	margin-right: 16rpx !important;
// 	width: calc(50% - 8rpx) !important;
// }
.no-more-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 40rpx;
	.text {
		font-size: 26rpx;
		color: #999;
		line-height: 34rpx;
	}
	.button {
		margin: 4rpx 0 0;
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 196rpx;
		height: 50rpx;
		background: #FFE7EB;
		border-radius: 30rpx;
		border: 1rpx solid #FF0A35;
		font-size: 26rpx;
		color: #ff0a35;
	}
}
/deep/ u-line{
	display: none;
}
</style>
