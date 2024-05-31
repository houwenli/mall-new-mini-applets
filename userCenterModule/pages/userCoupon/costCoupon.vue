<template>
	<view class="useCoupon-page">
		<view class="coupon-card">
			<view class="coupon-content">
				<p class="coupon-use-detail">
					<text class="text" v-if="pageData.type != 2">￥</text>
					<text class="price" v-if="pageData.type != 2">{{ skuPriceInt(pageData.price) }}</text>
					<text class="price" v-else>{{ parseInt(pageData.discountRate * 100) / 10 }}</text>
					<text class="text" v-if="pageData.type != 2">{{ '.' + skuPriceFloat(pageData.price) }}</text>
					<text class="text" v-else>折</text>
					<text class="text right-text" v-if="pageData.type != 0">订单满{{ pageData.fullPrice }}可用</text>
					<text class="text right-text" v-else>下单即享</text>
				</p>
				<p class="coupon-use-time">
					使用时间：{{ $u.timeFormat(new Date(pageData.validityStartTime).getTime(), 'yyyy.mm.dd hh:MM') }} - {{ $u.timeFormat(new Date(pageData.validityEndTime).getTime(), 'yyyy.mm.dd hh:MM') }}
				</p>
			</view>
		</view>
		<!-- 适用商品模块 -->
		<view class="applet-template-recommend">
			<wsf-goods-list title="适用商品" ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)" showStyle="common"></wsf-goods-list>
		</view>
	</view>
</template>
<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
export default {
	components: { wsfGoodsList },
	data() {
		return {
			pageData: {},
			searchParam: {
				pageNum: 0,
				pageSize: 10
			},
			flowList: [], // 瀑布流商品列表
			loadStatus: 'loadmore' // 加载更多样式效果
		};
	},
	onLoad(option) {
		if (option.id) {
			this.couponId = option.id;
			this.getDetail();
		}
	},
	onReachBottom() {
		this.getSearchList();
	},
	methods: {
		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			this.$wsf.go('SkuDetail', { skuId: e.skuId, sourceType: e.sourceType, storeIdNumber: e.storeId });
		},
		skuPriceInt(price) {
			let intPrice = 0,
				floatPrice = 0;
			if (!price) {
				price = 0;
			} else {
				price = price.toFixed(2).split('.')[0];
			}
			return price;
		},
		skuPriceFloat(price) {
			let intPrice = 0,
				floatPrice = 0;
			if (!price) {
				price = 0;
			} else {
				price = price.toFixed(2).split('.')[1];
			}
			return price;
		},
		//查询优惠券详情
		getDetail() {
			this.$u.api.getCouponDetail(this.couponId).then(res => {
				if (res.code == 200) {
					this.pageData = res.data;
					if (this.pageData.permittedType == 1) {
						this.searchParam.thirdCateIds = this.pageData.cateIdListForES;
					} else if (this.pageData.permittedType == 2) {
						this.searchParam.spuIds = this.pageData.spuIdListForES;
					}
					this.getSearchList();
				}
			});
		},
		getSearchList() {
			if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;
			this.loadStatus = 'loading';
			this.$u.api.SearchSpu(this.searchParam).then(res => {
				this.loadStatus = 'loadmore';
				this.flowList = this.flowList.concat(res.data.esSearchResponse.datas);
				if (!res.data.esSearchResponse.datas || res.data.esSearchResponse.datas.length < 10) {
					this.loadStatus = 'nomore';
				}
				this.searchParam.pageNum++;
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.useCoupon-page {
	padding-bottom: 20rpx;
	.coupon-card {
		height: 240rpx;
		background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/couponbg03%402x.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 60rpx;
		.coupon-content {
			width: 642rpx;
			height: 176rpx;

			.coupon-use-detail {
				padding-top: 30rpx;
				display: flex;
				justify-content: center;
				align-items: baseline;
				color: #e60113;
				font-weight: 500;
				.text {
					font-size: 32rpx;
					line-height: 44rpx;
				}
				.price {
					font-size: 80rpx;
					line-height: 68rpx;
				}
				.right-text {
					margin-left: 20rpx;
					line-height: 40rpx;
				}
			}
			.coupon-use-time {
				text-align: center;
				font-size: 24rpx;
				color: #666;
				margin-top: 20rpx;
			}
		}
	}
}
.applet-template-recommend {
	padding: 0 24rpx;
}
</style>
