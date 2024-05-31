<template>
	<view>
		<wsf-popup v-model="couponShow" mode="bottom" height="1100">
			<view class="coupon-title">
				优惠
			</view>
			<view class="coupon-close" @click="hideCouponModel"></view>
			<view class="coupon-container">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="estimate-module">
						<view class="estimate-card u-margin-bottom-30">
							<view class="price" v-if="selectCouponItem">¥{{selectCouponItem.afterCouponPrice.toFixed(2)}}</view>
							<view class="price" v-else>¥{{skuData.price.toFixed(2)}}</view>
							<view class="text">预估到手</view>
						</view>
						<view class="detail-bubble" v-if="selectCouponItem">
							<view class="detail-bubble-title">当前购买可使用以下优惠</view>
							<view class="detail-bubble-content" v-if="selectCouponItem.couponsType != 2">¥{{selectCouponItem.beforeCouponPrice.toFixed(2)}} - ¥{{selectCouponItem.faceValue}}</view>
							<view class="detail-bubble-content" v-else>¥{{selectCouponItem.beforeCouponPrice.toFixed(2)}} * {{selectCouponItem.faceValue}}折</view>
							<view>
								<view class="estimate-card-small u-margin-right-30">
									<view class="small-el text">当前售价</view>
									<view class="small-el">¥{{selectCouponItem.beforeCouponPrice.toFixed(2)}}</view>
								</view>
								<view class="estimate-card-small">
									<view class="small-el text">商品券</view>
									<view class="small-el" v-if="selectCouponItem.couponsType == 1">满{{selectCouponItem.amountLimitation}}减{{selectCouponItem.faceValue}}</view>
									<view class="small-el" v-if="selectCouponItem.couponsType == 2">{{selectCouponItem.faceValue}}折</view>
									<view class="small-el" v-if="selectCouponItem.couponsType == 3">满{{selectCouponItem.faceValue}}减{{selectCouponItem.faceValue}}</view>
								</view>
							</view>
						</view>
						<view class="detail-bubble" v-else>
							<view class="detail-bubble-title">当前购买可使用以下优惠</view>
							<view class="nonuse-content">不使用优惠券</view>
						</view>
					</view>

					<view class="active">
						<view class="active-title">
							<view class="active-title__icon"></view>
							<view class="active-title__word">活动</view>
							<view class="active-title__desc">活动仅限对当前商品生效，不可与其他商品叠</view>
						</view>
						<view class="active-list">
							<view class="active-list__every">
								<view class="active-list__every-desc">
									满600-100
								</view>
								<view class="active-list__every-detail">
									【满减】满200元，总价减20元
								</view>
							</view>
							<view class="active-list__every">
								<view class="active-list__every-desc">
									满600-100
								</view>
								<view class="active-list__every-detail">
									【满减】满200元，总价减20元
								</view>
							</view>
							<view class="active-list__every">
								<view class="active-list__every-desc">
									满600-100
								</view>
								<view class="active-list__every-detail">
									【满减】满200元，总价减20元
								</view>
							</view>
						</view>
					</view>


					<view class="coupon-pannel" v-if="
						(usableCouponList && usableCouponList.length > 0)
						|| (disableCouponList && disableCouponList.length > 0)
					">
						<view class="coupon-pannel-title">
							<view class="coupon-pannel-title__icon"></view>
							<view class="coupon-pannel-title__word">优惠券</view>
						</view>
						<block v-if="usableCouponList && usableCouponList.length > 0">
							<view class="title" >可用</view>
							<view class="coupon-list">
								<block v-for="(item, index) in usableCouponList" :key="index">
									<view class="coupon product-coupon">
										<view class="main-ticket">
											<view class="main-mark product-mark">商品券</view>
											<view class="coupon-detail">
												<view class="coupon-price product-color">
													<text class="text" v-if="item.couponsType != 2">￥</text>
													<text class="price">{{ item.faceValue }}</text>
													<text class="text" v-if="item.couponsType == 2">折</text>
												</view>
												<view class="coupon-info">
													<view class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
										<view class="condition" v-else-if="item.couponsType == 3">满{{ item.faceValue }}元可用</view>
													<view class="condition" v-else>无门槛</view>
													<view class="indate">
														{{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
													</view>
												</view>
											</view>
										</view>
										<view class="stub-ticket">
											<image
													src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png"
													alt=""
													class="choosebox"
													v-if="selectCouponItem && selectCouponItem.id == item.id"
													@tap="selectCoupon(null)"
												></image>
												<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/cat_ns_platform%402x.png" alt="" class="choosebox" v-else @tap="selectCoupon(item)"></image>
										</view>
									</view>
								</block>
							</view>
						</block>
						<block v-if="disableCouponList && disableCouponList.length > 0">
							<view class="title" >当前不可用</view>

							<view class="coupon-list">
								<block v-for="(item, index) in disableCouponList" :key="index">
									<view class="coupon disabled-coupon">
										<view class="main-ticket">
											<view class="main-mark disabled-mark">商品券</view>
											<view class="coupon-detail">
												<view class="coupon-price disabled-color">
													<text class="text" v-if="item.couponsType != 2">￥</text>
													<text class="price">{{ item.faceValue }}</text>
													<text class="text" v-if="item.couponsType == 2">折</text>
												</view>
												<view class="coupon-info">
													<view class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
										<view class="condition" v-else-if="item.couponsType == 3">满{{ item.faceValue }}元可用</view>
													<view class="condition" v-else>无门槛</view>
													<view class="indate">
														{{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
													</view>
												</view>
											</view>
										</view>
										<view class="stub-ticket"></view>
									</view>
								</block>
							</view>
						</block>
					</view>



					<!-- </block> -->
				</scroll-view>
				<view class="coupon-confirm-button" @tap="confirmSelectCoupon()">确定</view>
			</view>
		</wsf-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isProcess: false,
			giftProductList: [],
			couponShow: false,
			isHaveGift: false,
			usableCouponList: [],
			disableCouponList: [],
			selectCouponItem: null
		};
	},
	props: {
		skuData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	filters: {
		formatDate(date) {
			let newDate = new Date(date.replace(/-/g, '/'));
			let time = newDate.getFullYear() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getDate();
			return time;
		}
	},
	methods: {
		navigateTo(sceneName, params) {
			this.$wsf.go(sceneName, params);
		},
		initData() {
			if (this.skuData.marketingVos) {
				let list = this.skuData.marketingVos;
				for (let i in list) {
					if (list[i].type == 2) {
						this.isHaveGift = true;
						this.giftProductList = list[i].fullGiftList;
						console.log(this.giftProductList, 'this.giftProductList');
						return;
					}
				}
			}
		},
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		openCouponModel() {
			let params = [{
				spuId: this.skuData.spuId,
				num: 1,
				beforeCouponPrice: this.skuData.price
			}]
			this.$u.api.GetUserCoupons(params).then(res => {
				let list = res.data, usableCouponList = [], disableCouponList = []
				list.forEach(item => {
					if(item.usable == true) {
						usableCouponList.push(item)
					} else {
						disableCouponList.push(item)
					}
					if(!this.selectCouponItem && this.skuData.afterCouponPrice && item.checked == true) {
						this.selectCouponItem = item
					}
				})
				this.usableCouponList = usableCouponList
				this.disableCouponList = disableCouponList
				this.couponShow = true;
			})
		},
		getcoupon(id) {
			let list = [];
			list.push(id);
			let data = {
				couponIdList: list
			};
			this.$u.api.ReceiveCoupons(data).then(res => {
				this.showToastError('领取成功');
				this.$emit('updateCouponList');
			});
		},
		getPlatformCoupon(id) {
			if (this.isProcess) {
				return;
			}
			this.isProcess = true;
			this.$u.api
				.receiveCoupon(id)
				.then(res => {
					if (res.code == 200) {
						if(res.data == 1) {
							this.showToastError('领取成功')
						} else {
							this.showToastError('该优惠券已被领完')
						}
						this.$emit('updateCouponList');
					} else {
						this.showToastError(res.description);
					}
				})
				.finally(() => {
					this.isProcess = false;
				});
		},
		goSkuDetail(id) {
			this.$wsf.go('SkuDetail', { skuId: id });
		},
		selectCoupon(item) {
			this.selectCouponItem = item
		},
		confirmSelectCoupon() {
			if(this.selectCouponItem) {
				this.$parent.skuDetail.afterCouponPrice = this.selectCouponItem.afterCouponPrice
			} else {
				this.$parent.skuDetail.afterCouponPrice = null
			}
			this.couponShow = false
		},
		hideCouponModel () {
			this.couponShow = false
		}
	}
};
</script>

<style lang="scss" scoped>
.wsf-cell-group {
	padding: 26rpx 32rpx;
	.wsf-cell-item {
		display: flex;
		align-items: flex-start;
		.wsf-cell-title {
			font-weight: bold;
			height: 54rpx;
			line-height: 54rpx;
			width: 92rpx;
		}
		.wsf-cell-value {
			text-align: left;
			color: #000;
			width: 570rpx;
			min-height: 54rpx;
			line-height: 54rpx;
		}
		.wsf-cell-icon {
			line-height: 54rpx;
			height: 54rpx;
		}
	}
}
.get_icon {
	vertical-align: middle;
	display: inline-block;
	width: 58rpx;
	height: 26rpx;
	border-radius: 4rpx;
	border: 2rpx solid $wsf-color-red;
	text-align: center;
	line-height: 24rpx;
	font-size: 20rpx;
	color: $wsf-color-red;
}
.coupon-part {
	overflow: hidden;
	height: 54rpx;
	.coupon_icon {
		// vertical-align: middle;
		display: inline-block;
		padding: 0 10rpx;
		height: 32rpx;
		line-height: 32rpx;
		background: #fd2929;
		border-radius: 4rpx;
		font-size: 20rpx;
		color: #fff;
		position: relative;
		margin-left: 16rpx;
		vertical-align: middle;
		.left-radius {
			background-color: #fff;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			left: 0;
			height: 8rpx;
			width: 8rpx;
			border-radius: 0 50% 50% 0;
		}
		.right-radius {
			background-color: #fff;
			position: absolute;
			top: 50%;
			transform: translate(50%, -50%);
			right: 0;
			height: 8rpx;
			width: 8rpx;
			border-radius: 50% 0 0 50%;
		}
	}
}
.coupon-container {
	width:100%;
	padding: 0 24rpx;
	overflow-x:hidden;
	.scroll-Y {
		height: 850rpx;

		::-webkit-scrollbar {
		  width: 0;
		  height: 0;
		  color: transparent;
		}
		.title {
			padding:24rpx 0;
			line-height: 36rpx;
			color: #000;
			font-size: 26rpx;
		}
		.gift-container {
			padding: 24rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			margin-bottom: 60rpx;
			width: 90vw;
			.gift-stage {
				margin-top: 40rpx;
				&:first-child {
					margin-top: 0;
				}
				.gift-stage-title {
					display: inline-flex;
					align-items: center;
					padding-bottom: 20rpx;
					i {
						width: 58rpx;
						height: 26rpx;
						border-radius: 4rpx;
						border: 2rpx solid $wsf-color-red;
						text-align: center;
						line-height: 22rpx;
						font-size: 20rpx;
						color: $wsf-color-red;
						vertical-align: middle;
						margin-right: 16rpx;
					}
					span {
						line-height: 28rpx;
						color: $wsf-color-red;
					}
				}
				.image-box {
					width: 100rpx;
					height: 100rpx;
					border-radius: 6rpx;
					position: relative;
					image {
						width: 100%;
						height: 100%;
					}
					i {
						position: absolute;
						right: 0;
						bottom: 0;
						padding: 0 4rpx;
						color: #fff;
						background: rgba(0, 0, 0, 0.3);
						border-radius: 6rpx;
						font-size: 18rpx;
					}
				}
				.gift-list-one {
					display: flex;
					justify-content: space-between;
					.gift-product {
						width: 310rpx;
						height: 104rpx;
						border-radius: 6rpx;
						border: 2rpx solid #fecacd;
						background-color: #fff;
						display: inline-flex;
						align-items: center;

						.content {
							flex: 1;
							margin: 18rpx;
							color: #666;
							font-size: 20rpx;
						}
					}
				}
				.gift-list-two {
					.scroll-x {
						height: 104rpx;
						white-space: nowrap;
					}
					.gift-product {
						vertical-align: top;
						display: inline-block;
						border-radius: 6rpx;
						border: 2rpx solid #fecacd;
						margin-right: 10rpx;
					}
				}
			}
		}
		.coupon {
			margin-bottom: 20rpx;
			width: 678rpx;
			height: 172rpx;
			background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/coupon_bg%402x.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			.left {
				display: inline-block;
				width: 488rpx;
				padding: 32rpx 0 32rpx 24rpx;
				height: 100%;
				.content {
					color: $wsf-color-red;
					padding-bottom: 24rpx;
					.bold {
						font-weight: bold;
					}
					.number {
						font-size: 72rpx;
						line-height: 56rpx;
					}
				}
				.date {
					font-size: 26rpx;
					color: $wsf-color-red;
					line-height: 24rpx;
				}
			}
			.right {
				vertical-align: top;
				display: inline-flex;
				width: 188rpx;
				height: 100%;
				justify-content: center;
				align-items: center;
				position: relative;
				.btn {
					width: 120rpx;
					height: 48rpx;
					background: $wsf-color-red;
					border-radius: 28rpx;
					line-height: 48rpx;
					color: #fff;
					text-align: center;
					font-size: 20rpx;
				}
				.text {
					color: #fe8993;
					font-size: 26rpx;
				}
				.is_have {
					width: 72rpx;
					height: 58rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}

		.coupon-list {
			.coupon-hint {
				line-height: 38rpx;
				margin-top: 40rpx;
				text-align: center;
				color: #999;
				font-size: 26rpx;
				width: 100vw;
				margin-left: -36rpx;
				.markedness {
					color: #e71021;
				}
			}
			.product-coupon {
				background: #fef4f4;
			}
			.store-coupon {
				background: #fff7ee;
			}
			.disabled-coupon {
				background: #f2f2f2;
			}
			.coupon {
				width: 100%;
				margin-bottom: 20rpx;
				height: 196rpx;
				border-radius: 16rpx;
				overflow: hidden;
				display: flex;
				position: relative;
				.top-round-corner {
					background-color: #fff;
					position: absolute;
					top: -16rpx;
					right: 192rpx;
					transform: translate(50%, 0);
					height: 28rpx;
					width: 28rpx;
					border-radius: 0 0 50% 50%;
					z-index: 2;
				}
				.bottom-round-corner {
					background-color: #fff;
					position: absolute;
					bottom: -16rpx;
					right: 192rpx;
					transform: translate(50%, 0);
					height: 28rpx;
					width: 28rpx;
					border-radius: 50% 50% 0 0;
					z-index: 2;
				}
				.main-ticket {
					// width: 502rpx;
					flex: 1;
					position: relative;
					padding: 60rpx 0 60rpx 36rpx;
					.coupon-detail {
						display: inline-flex;
						align-items: center;
						height: 76rpx;
						.store-color {
							color: #fe8c02;
						}
						.product-color {
							color: #e60113;
						}
						.disabled-color {
							color: #999 !important;
						}
						.coupon-price {
							font-weight: 600;
							display: inline-flex;
							align-items: baseline;
							.text {
								font-size: 28rpx;
								line-height: 40rpx;
							}
							.price {
								margin: 0 8rpx;
								font-size: 64rpx;
								line-height: 76rpx;
							}
						}
						.coupon-info {
							margin-left: 24rpx;
							display: inline-flex;
							flex-direction: column;
							justify-content: space-between;
							.condition {
								color: #000;
								font-size: 28rpx;
								line-height: 40rpx;
								font-weight: 500;
							}
							.indate {
								color: #666;
								font-size: 22rpx;
								line-height: 32rpx;
							}
						}
					}
					.coupon-explain {
						white-space: nowrap;
						padding-top: 16rpx;
						font-size: 0;
						color: #666;
						line-height: 32rpx;
						text {
							font-size: 22rpx;
						}
					}

					.store-mark {
						background: #ffb760;
					}
					.product-mark {
						background: #fe8993;
					}
					.disabled-mark {
						background: #999;
					}

					.main-mark {
						width: 100rpx;
						height: 36rpx;
						border-radius: 0 0 16rpx 0px;
						position: absolute;
						left: 0;
						top: 0;
						text-align: center;
						line-height: 36rpx;
						font-size: 20rpx;
						color: #fff;
					}
				}
				.stub-ticket {
					// border-left: 2rpx dashed #faccd0;
					// width: 200rpx;
					width: 108rpx;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					position: relative;
					.stub-mark {
						width: 104rpx;
						height: 100rpx;
						position: absolute;
						right: 0;
						top: 0;
						z-index: 1;
					}
					.product-btn {
						background: #e60113;
					}
					.store-btn {
						background: #fe8c02;
					}
					.get-coupon-button {
						width: 152rpx;
						height: 60rpx;
						border-radius: 30rpx;
						line-height: 60rpx;
						text-align: center;
						font-size: 24rpx;
						color: #fff;
						z-index: 2;
					}
					.choosebox {
            width: 36rpx;
            height: 36rpx;
          }
				}
			}
		}
	}
}

.estimate-module {
	text-align: center;
	.estimate-card {
		min-width: 100rpx;
		background: rgba(255, 10, 53, 0.08);
		border-radius: 24rpx;
		padding: 20rpx 24rpx;
		display: inline-block;
		.price {
			font-size: 30rpx;
			font-weight: 600;
			color: #FF0A35;
			line-height: 34rpx;
			margin-bottom: 4rpx;
		}
		.text {
			font-size: 24rpx;
			color: #FF0A35;
			line-height: 30rpx;
			text-align: center;
		}
	}
	.estimate-card-small {
		min-width: 100rpx;
		border-radius: 8rpx;
		display: inline-flex;
		flex-direction: column;
		border: 1rpx solid #FF0A35;
		margin-top: 4rpx;
		.small-el {
			width: 100%;
			line-height: 36rpx;
			text-align: center;
			color: #FF0A35;
			font-size: 18rpx;
		}
		.text {
			background-color: rgba(255, 10, 53, 0.08);
		}
	}
	.detail-bubble {
		width: 702rpx;
		height: 210rpx;
		border: 1rpx solid #E60113;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		padding: 20rpx 0 26rpx;
		position: relative;
		.detail-bubble-title {
			font-size: 22rpx;
			font-weight: 500;
			color: #444;
			line-height: 30rpx;
		}
		.detail-bubble-content {
			margin: 20rpx 0 0;
			font-size: 30rpx;
			font-weight: 600;
			color: #FF0A35;
			line-height: 34rpx;
		}
		.nonuse-content {
			text-align: center;
			font-size: 28rpx;
			font-weight: 500;
			color: #999;
			line-height: 140rpx;
		}
		&::before{
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: -12rpx;
			left: 50%;
			transform: translateX(-50%);
			border-left: 12rpx solid transparent;
			border-right: 12rpx solid transparent;
			border-bottom: 12rpx solid #E60113;
		}
		&::after{
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: -11rpx;
			left: 50%;
			transform: translateX(-50%);
			border-left: 12rpx solid transparent;
			border-right: 12rpx solid transparent;
			border-bottom: 12rpx solid #fff;
		}
	}
}
.coupon-confirm-button {
	margin: 10rpx 8rpx;
	height: 80rpx;
	background: #E60113;
	border-radius: 38rpx;
	line-height: 80rpx;
	text-align: center;
	color: #fff;
	font-size: 28rpx;
}

.coupon-title {
	text-align: center;
	font-size: 32rpx;
	line-height: 92rpx;
}
.coupon-close {
	width: 54rpx;
	height: 40rpx;
	background-size: 100% 100%;
	background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
	position: absolute;
	right: 24rpx;
	top: 24rpx;
}

.active {
	&-title {
		display: flex;
		align-items: flex-end;
		margin-top: 32rpx;
		&__icon {
			width: 36rpx;
			height: 36rpx;
			background-size: 100% 100%;
			background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/coupon-pop-active-2x.png);
		}
		&__word {
			font-size: 30rpx;
			font-weight: bold;
			color: #222;
			margin-left: 8rpx;
		}
		&__desc {
			font-size: 20rpx;
			color: #999;
			margin-left: 8rpx;
		}
	}
	&-list {
		margin-top: 12rpx;
		&__every {
			display: flex;
			align-items: center;
			margin-top: 20rpx;
		}
		&__every-desc {
			height: 36rpx;
			padding: 0 12rpx;
			background-color: rgba(255, 10, 53, 0.08);
			color: #FF0A35;
			border-radius: 4rpx;
			font-size: 20rpx;
		}
		&__every-detail {
			font-size: 26rpx;
			color: #191919;
		}
	}
}
.coupon-pannel {
	&-title {
		display: flex;
		align-items: flex-end;
		margin-top: 32rpx;
		&__icon {
			width: 36rpx;
			height: 36rpx;
			background-size: 100% 100%;
			background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/coupon-pop-coupon-2x.png);
		}
		&__word {
			font-size: 30rpx;
			font-weight: bold;
			color: #222;
			margin-left: 8rpx;
		}
	}

}
</style>
