<template>
	<view class="coupon-center-page" v-if="pageState == 'common'">
		<view class="bottom-button" @click="navigationTo('UserCoupon')">
			<text>已领取优惠券的详细信息可在</text>
			<text class="bright-colored">“我的-优惠券”</text>
			<text>中查看</text>
			<img class="arrow-right" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/arrow-right%402x.png" alt="" />
		</view>
		<view class="coupon-center-list">
			<view class="coupon" v-for="(item, index) in list" :key="index">
				<text class="top-round-corner"></text>
				<text class="bottom-round-corner"></text>
				<view class="main-ticket">
					<view class="main-mark">平台券</view>
					<view class="coupon-detail">
						<view class="coupon-price">
							    <text class="text" v-if="item.type != 2">￥</text>
							    <text class="price" v-if="item.type == 2">{{ parseInt(item.discountRate * 100) / 10 }}</text>
							              <text class="price" v-else>{{ item.price }}</text>
							              <text class="text" v-if="item.type == 2">折</text>
						</view>
						<view class="coupon-info">
							<view class="condition" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
							<view class="indate" v-if="item.validityType == 0">{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }} - {{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}</view>

						 <view class="indate" v-else>领券后{{ item.validityRelativeDaysNum }}天</view>
						 </view>
					</view>
					<view class="coupon-explain">
						<text v-if="item.permittedType == 0">全</text>
						<text>平台</text>
						<text v-if="item.permittedType == 2">部分</text>
						<text v-if="item.permittedType == 1">部分分类</text>
						<text>商品可用，</text>
						<text v-if="item.exclusionType == 1">不</text>
						<text>可与店铺券叠加使用</text>
					</view>
				</view>
				<view class="stub-ticket">
					<image class="stub-mark" v-if="item.webFlag == 2 || item.webFlag == 3" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ylq02%402x.png" alt=""></image>
          <image class="stub-mark" v-else-if="item.webFlag == 1" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/yqw%402x.png" alt=""></image>
					<button class="get-coupon-button platform-btn" v-if="item.webFlag == 0 || item.webFlag == 3" @click="getCoupon(item.id)">立即领取</button>
				</view>
			</view>
		</view>
	</view>
	<view class="empty-page" v-else-if="pageState == 'empty'">
		<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/empty.png" alt="" />
		<p class="nocoupon-txt">暂无优惠券</p>
	</view>

</template>
<script>
export default {
	components: {},
	data() {
		return {
			listQuery: {
				 type: 2, //0注册送，1定向送，2购买前送，3购买后（支付成功）
			},
			pageState: null,
			list: [],
			loading: false,
		};
	},
	onShow() {
		this.getList()
	},
	methods: {
		/* 跳转 */
		navigationTo(sceneName, params) {
			// this.$wsf.go('Login')
			console.log('sceneName', sceneName);
			this.$wsf.go(sceneName, params);
		},
		goBack() {
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			});
		},
		getList() {
			this.$u.api.getUserActivity(this.listQuery).then(res => {
				if (res.code == 200) {
					if(res.data) {
						this.list = res.data.platformCouponVoList;
						this.pageState = this.list && this.list.length > 0 ? 'common' : 'empty'
					} else {
						this.list = []
						this.pageState = 'empty'
					}
					wx.setNavigationBarTitle({ title: `优惠券(${this.pageList.length})` })
				}
			}).catch(err => {
				this.pageState = 'empty'
			});
		},
		getCoupon(id) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.$u.api
				.receiveCoupon(id)
				.then(res => {
					if (res.code == 200) {
						this.$u.toast(`领取${res.data == 1 ? '成功' : '失败'}`)
						this.getList();
					} else {
						this.$u.toast(res.description);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
	}
};
</script>
<style lang="scss" scoped>
.coupon-center-page {
	height: 100%;
	background: #f65946;

	.bottom-button {
		z-index: 10;
		position: fixed;
		bottom: 76rpx;
		left: 24rpx;
		width: 702rpx;
		background: linear-gradient(270deg, #ffc276 0%, #ffdc99 100%);
		border-radius: 36rpx;
		color: #943a0d;
		font-size: 26rpx;
		text-align: center;
		line-height: 72rpx;
		height: 72rpx;
		.bright-colored {
			color: #f65946;
		}
		.arrow-right {
			width: 10rpx;
			height: 22rpx;
			margin-left: 12rpx;
		}
	}
	.coupon-center-bg {
		height: 350rpx;
		background: #ffffff;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.coupon-center-list {
		padding: 0 24rpx 260rpx;
		background: #f65946;
		.coupon {
			margin-bottom: 20rpx;
			height: 196rpx;
			border-radius: 16rpx;
			overflow: hidden;
			background: #fef4f4;
			display: flex;
			position: relative;
			.top-round-corner {
				background-color: #f65946;
				position: absolute;
				top: -16rpx;
				right: 198rpx;
				transform: translate(50%, 0);
				height: 28rpx;
				width: 28rpx;
				border-radius: 0 0 50% 50%;
				z-index: 2;
			}
			.bottom-round-corner {
				background-color: #f65946;
				position: absolute;
				bottom: -16rpx;
				right: 198rpx;
				transform: translate(50%, 0);
				height: 28rpx;
				width: 28rpx;
				border-radius: 50% 50% 0 0;
				z-index: 2;
			}
			.main-ticket {
				width: 502rpx;
				position: relative;
				padding: 52rpx 0 20rpx 36rpx;
				.coupon-detail {
					display: inline-flex;
					align-items: center;
					height: 76rpx;
					.coupon-price {
						font-weight: 600;
						color: #e60113;
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

				.main-mark {
					width: 100rpx;
					height: 36rpx;
					background: #fe8993;
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
				border-left: 2rpx dashed #faccd0;
				width: 200rpx;
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
				.get-coupon-button {
					width: 152rpx;
					height: 60rpx;
					background: #e60113;
					border-radius: 30rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 24rpx;
					color: #fff;
					z-index: 2;
				}
			}
		}
	}
}
.empty-page {
	text-align: center;

	height: 100%;
	image {
		margin-top: 320rpx;
		width: 180rpx;
		height: 180rpx;
	}
	.nocoupon-txt {
		font-size: 28rpx;
		color: #999;
		margin-top: -6rpx;
		height: 40rpx;
		line-height: 40rpx;
	}
}
</style>
