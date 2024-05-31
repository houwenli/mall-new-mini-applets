<template>
	<view class="applet-check-order-wrap u-flex  flex-column">
		<view class="applet-check-order-header" :style="{ 'padding-top': `${safeTopBarHeight * 2}rpx` }">
			<view class="applet-check-order-header-info u-flex flex-column">
				<view class="">
					<image src="@/static/img/icon/complete@2x.png" style="height: 36rpx; width: 36rpx;margin-top: 10rpx;vertical-align: text-bottom;" mode=""></image>
					<text class="applet-check-order-header-info-type">{{ orderType > 1 ? '支付成功' : '支付结果稍有延迟,请稍后查看' }}</text>
				</view>
				<view class="moneyBox" v-if="orderType > 1">
					¥
					<text>{{ money | priceFilter }}</text>
				</view>
				<view class="">
					<text class="applet-check-order-header-info-btn" @click.stop="goToOrder">查看订单</text>
					<text class="applet-check-order-header-info-btn goHome" @click.stop="goPages">继续逛逛</text>
				</view>
			</view>
		</view>
		<view class="applet-check-order-tips">注意：万顺福平台及销售商不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作.</view>

			<!-- 热销商品模块 -->
		<view class="applet-template-recommend">
			<wsf-goods-list title="hot" ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
		</view>

		<wsf-confirm
			v-model="discountGiftDialog"
			title="恭喜您获得优惠券礼包"
			:showCloseDialogBtn="true"
			activeText="立即查看"
			:isNeedTouchClose="true"
			:hideCancel="true"
			@confirm="discountGiftConfirm"
			@handleCloseDialog="handleCloseDialog()"
		>
			<view class="discount-gift-container">
				<view class="discount-gift-text">以下优惠券已发放到您的账户中</view>
				<view class="discount-gift-list">
					<view class="discount-gift-coupon" v-for="(item, index) in platformCouponCodeVoList" :key="index">
						<span class="top-round-corner"></span>
						<span class="bottom-round-corner"></span>
						<view class="stub-ticket">
							<view class="content">
								<span class="text" v-if="item.type != 2">￥</span>
								<span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : skuPriceInt(item.price) }}</span>
								<span class="text" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
								<span class="text" v-else>折</span>
							</view>
						</view>
						<view class="main-ticket">
							<view class="content">
								<view class="title" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
								<view class="title" v-else>无门槛</view>
								<view class="cate">
									<template v-if="item.permittedType == 0">
										全平台商品可用
									</template>
									<template v-else-if="item.permittedType == 1">
										平台部分商品可用
									</template>
									<template v-else-if="item.permittedType == 2">
										限平台部分品类商品
									</template>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</wsf-confirm>

		 <!-- 支付异常提醒弹窗 -->
       <wsf-confirm
        v-model="showPayErrorConfirm"
        title="支付异常提醒"
        activeText="去设置"
        :hideConfirm="true"
        cancelText="我知道了"
      >
       <view slot="context">
        <view class="pay-error-confirm-content">1.余额扣款失败，订单已取消，已付金额将予以原路退回，请您留意查收</view>
        <view>2.如还需购买，请您重新加购～</view>
       </view>
       <view slot="button" class="pay-error-confirm-button" @tap="goToOrder()">
        我知道了
       </view>
      </wsf-confirm>
	</view>
</template>

<script>
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import { priceFilter } from '@/common/wsfFilter.js';
export default {
	components: {
		wsfConfirm,wsfGoodsList
	},
	data() {
		return {
			priceFilter,
			showPayErrorConfirm: false,
			discountGiftDialog: false,
			orderCode: '', // 订单编号
			orderType: 0, // 订单状态 1 - 未支付
			orderId: '', // 订单id
			safeTopBarHeight: getApp().globalData.safeTopBarHeight, // 头部安全距离
			money: 0,
			flowList: [], // 瀑布流商品列表
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
				// 页码页容量
				pageType: 5,
				pageNum: 0,
				pageSize: 10,
				orderCode: ''
			},
            platformCouponCodeVoList:[]
		};
	},
	onLoad(options) {
		console.log('options', options);
		this.orderCode = options.orderCode;
	},
	onShow() {
		setTimeout(() => {
			this.loadOrderDetail();
		}, 500);
		this.resetList()
		this.GetRecommendList();
	},
	onReachBottom() {
		this.GetRecommendList();
	},
	methods: {
		handleCloseDialog() {
			this.discountGiftDialog = false;
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
		discountGiftConfirm() {
			this.discountGiftDialog = false;
			this.$wsf.go('/mycoupon', { type: 2 });
		},
		// 查询订单支付状态
		loadOrderDetail() {
			this.$u.api.queryPayInfo(this.orderCode).then(res => {
				if (res.code == 200) {
					this.money = res.data.price.toFixed(2);
					this.orderType = res.data.status;
					if(res.data.status == 5 || res.data.status == 6) {
						this.showPayErrorConfirm = true
					}
					if (res.data.platformCouponCodeVoList && res.data.platformCouponCodeVoList.length > 0) {
						this.platformCouponCodeVoList = res.data.platformCouponCodeVoList || [];
						this.discountGiftDialog = true;
					}
				}
			});
		},
		// 前往订单详情
		goToOrder() {
			// this.$wsf.go('PendingPayment', { orderId: this.orderId,sign:'checkOrderPay' }, 'redirectTo');
			this.$wsf.go('OrderList', { status: -1 }, 'redirectTo');
		},
		// 点击完成时的跳转
		goPages() {
			this.$wsf.go('Index');
			// if(getApp().globalData.pageSign === "SkuDetail"){
			// 	this.$wsf.go(getApp().globalData.pageSign,{skuId:getApp().globalData.skuId})
			// }else {
			// 	this.$wsf.go(getApp().globalData.pageSign)
			// }
		},
		/* 获取推荐的商品列表 */
		GetRecommendList() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.queryForm.orderCode = this.orderCode
			this.$u.api.QueryRecommendCommodity(this.queryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				if (res.code === 200) {
					this.flowList = this.flowList.concat(
						res.data.map(item => {
							item.price = this.priceFilter(item.price);
							return item;
						})
					);
					this.queryForm.pageNum++;
					this.hasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
		resetList() {
			this.flowList = []
			this.hasMore = true
			this.loadStatus = 'loadmore'
			this.queryForm = {
				// 页码页容量
				pageType: 5,
				pageNum: 0,
				pageSize: 10
			}
		},
		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			// this.$wsf.go('SkuDetail', { skuId: e.id }, 'redirectTo');
			if(e.goodsSource == 4){			
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id }, 'redirectTo');
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.applet-check-order-wrap {
	// padding: 0 40rpx 40rpx 40rpx;
	height: 100%;
	background: #f5f5f5;
	.applet-check-order-header {
		width: 100%;
		// height: 410rpx;
		padding: 40rpx 0;
		background: url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///f90850135c796218ffa4ec42dbf80be4.png) no-repeat center 100%;
		&-info {
			position: relative;
			&-type {
				margin-top: 20rpx;
				margin-bottom: 40rpx;
				font-size: 36rpx;
				line-height: 38rpx;
				font-weight: 500;
				color: #fff;
			}
			&-btn {
				display: inline-block;
				width: 208rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				border: 2rpx solid #ffffff;
				color: #fff;
				font-size: 24rpx;
				text-align: center;
			}
			&-back-btn {
				position: absolute;
				right: 0;
				top: 0;
				padding: 10rpx 30rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #fff;
			}
		}
	}
	.applet-check-order-icon {
		padding-top: 80rpx;
		margin-bottom: 20rpx;
		&-title {
			font-size: 32rpx;
			color: #000;
		}
	}
	.applet-check-order-tips {
		padding: 36rpx 40rpx 100rpx;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	.applet-check-order-btn {
		color: #fff;
		background-color: $wsf-color-red;
		border: 1rpx solid $wsf-color-red;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 78rpx;
		text-align: center;
		width: 100%;
		border-radius: 40rpx;
		margin-bottom: 20rpx;
	}
	.applet-check-order-btn-plain {
		border: 1rpx solid $wsf-color-red;
		background-color: #fff;
		color: $wsf-color-red;
	}
	.moneyBox {
		color: #fff;
		font-size: 48rpx;
		margin: 32rpx 0 36rpx;
		text {
			font-size: 48rpx;
		}
	}
	.goHome {
		margin-left: 20rpx;
		background-color: #fff;
		color: #e60113;
	}
}

.discount-gift-container {
	.discount-gift-text {
		text-align: center;
		font-size: 28rpx;
		color: #666;
		margin: 16rpx 0;
	}
	.discount-gift-list {
		height: 560rpx;
		overflow-y: auto;

		.discount-gift-coupon {
			position: relative;
			width: 100%;
			background: #fef4f4;
			border-radius: 20rpx;
			display: flex;
			height: 140rpx;
			margin-top: 16rpx;
			.top-round-corner {
				background-color: #fff;
				position: absolute;
				top: -16rpx;
				left: 210rpx;
				transform: translate(-50%, 0);
				height: 28rpx;
				width: 28rpx;
				border-radius: 0 0 50% 50%;
				z-index: 2;
			}
			.bottom-round-corner {
				background-color: #fff;
				position: absolute;
				bottom: -16rpx;
				left: 210rpx;
				transform: translate(-50%, 0);
				height: 28rpx;
				width: 28rpx;
				border-radius: 50% 50% 0 0;
				z-index: 2;
			}
			.stub-ticket {
				width: 210rpx;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				border-right: 2rpx dashed #faccd0;
				.content {
					display: inline-flex;
					align-items: baseline;
					color: #e60113;
					font-weight: 600;
					.text {
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.price {
						font-size: 60rpx;
						line-height: 76rpx;
					}
				}
			}
			.main-ticket {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				.content {
					margin-left: 36rpx;
					.title {
						font-size: 28rpx;
						font-weight: 500;
						color: #000;
						line-height: 40rpx;
					}
					.cate {
						margin-top: 4rpx;
						color: #666;
						line-height: 32rpx;
						font-size: 22rpx;
					}
				}
			}
		}
	}
}

.pay-error-confirm-button {
  width: 208rpx;
  height: 60rpx;
  border-radius: 29rpx;
  border: 1px solid #E60113;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #EA0213;
  font-weight: bold;
}

.pay-error-confirm-content{
  margin-bottom: 16rpx; 
  line-height: 44rpx;
}

/* 热销商品 */
.applet-template-recommend {
	padding: 0 24rpx;
}
</style>
