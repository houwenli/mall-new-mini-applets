<template>
	<u-popup v-model="value" mode="bottom" @close="close" :safe-area-inset-bottom="true"
		border-radius="20" height="880rpx">
		<view class="addresspop">
			<view class="addresspop-close" @click="close"></view>
			<view class="addresspop-title">
				配送至
			</view>
			<scroll-view scroll-y="true" class="addresspop-content">
				<view v-if="isEmpty" class="addresspop-empty">
					<view class="addresspop-empty__flag">
					</view>
					<view class="addresspop-empty__desc">暂无设置收货地址～</view>
				</view>
				<view v-else class="addresspop-list">
					<view v-for="(item, index) in addressList" 
						:key="item.id"
						class="addresspop-list__every"
						@click="itemClick(item)"
						:class="index == 0 ? 'addresspop-list__every-first' : ''"
						>
						<view :class="
							item.id == addressId
							? 'addresspop-list__checked'
							: 'addresspop-list__check'
						"></view>
						<view class="addresspop-list__content">
							<view class="addresspop-list__address-detail">
								{{ item.detailAddress }}
							</view>
							<view class="addresspop-list__address">
								{{ item.address }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="addresspop-add">
				<view class="addresspop-add__btn" @click="showCitySelect">
					添加收货地址
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			value: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				addressId: 0,
				isEmpty: true,
				addressList: [],
				showConfirm: false,
			};
		},
		mounted() {
			this.getAddressList();
		},
		methods: {
			close() {
				this.$emit("input", false);
			},
			// 获取所有地址列表
			getAddressList() {
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.$u.api.QueryCustomerAddress().then((res) => {
						this.isEmpty = !res.data.length;
						if (this.isEmpty) {
							this.showConfirm = true;
						}
						this.addressList = res.data;
						this.$emit("getressList",{list: res.data});
					});
				}
			},
			showCitySelect() {
				this.$emit("showCitySelect");
			},
			itemClick(item) {
				this.$emit("selectedCity", {
					data: item
				});
				this.addressId = item.id;
				this.close()
			},
		},
	};
</script>

<style lang="scss" scoped>
	.addresspop {
		background-color: #F6F6F6;
		height: 100%;
		overflow: hidden;
		position: relative;
		&-close {
			width: 54rpx;
			height: 40rpx;
			background-size: 100% 100%;
			background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
			position: absolute;
			right: 24rpx;
			top: 24rpx;
		}
		&-title {
			text-align: center;
			font-size: 32rpx;
			line-height: 92rpx;
		}
		&-content {
			position: absolute;
			top: 92rpx;
			bottom: 96rpx;
			left: 0;
			right: 0;
			overflow: scroll;
		}
		&-location {
			width: 702rpx;
			background-color: #FFFFFF;
			margin: 0 auto;
			display: flex;
			align-items: center;
			border-radius: 24rpx;
			padding: 24rpx 0;
			&__icon {
				width: 32rpx;
				height: 32rpx;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-location-2x.png);
				margin: 20rpx;
			}
			&__content {
				width: 514rpx;
			}
			&__content-top {
				display: flex;
				align-items: center;
			}
			&__desc {
				width: 96rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				border-radius: 4rpx;
				background-color: rgba(255, 231, 235, 0.5);
				font-size: 20rpx;
				color: #FF0A35;
			}
			&__address-detail {
				width: 410rpx;
				line-height: 40rpx;
				color: #191919;
				font-size: 32rpx;
				font-weight: bold;
				margin: 0 0 0 8rpx;
			}
			&__address {
				width: 514rpx;
				line-height: 34rpx;
				font-size: 26rpx;
				color: #999;
				margin: 8rpx 0 0 0;
			}
			&__retry {
				font-size: 20rpx;
				color: #FF0A35;
				margin: 0 0 0 20rpx;
			}
		}
		&-list {
			width: 702rpx;
			background-color: #FFFFFF;
			margin: 20rpx auto 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-radius: 24rpx;
			padding: 24rpx 0;
			&__every {
				width: 100%;
				display: flex;
				align-items: center;
				margin: 40rpx 0 0;
			}
			&__every-first {
				margin-top: 0;
			}
			&__check {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				border: 2rpx solid #c3c3c3;
				margin: 20rpx;
			}
			&__checked {
				width: 32rpx;
				height: 32rpx;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
				margin: 20rpx;
			}
			&__content {
				width: 614rpx;
			}
			&__address-detail {
				width: 100%;
				line-height: 40rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #191919;
			}
			&__address {
				width: 100%;
				font-size: 26rpx;
				color: #999999;
				margin-top: 8rpx;
			}
		}
		&-add {
			width: 100%;
			padding: 8rpx 0;
			background-color: #fff;
			position: absolute;
			left: 0;
			bottom: 0;
			&__btn {
				width: 702rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-image: linear-gradient(
					90deg,
					rgba(255, 95, 46, 1) 0,
					rgba(255, 10, 53, 1) 100%
				);
				border-radius: 40rpx;
				margin: 0 auto;
				text-align: center;
				color: #FFF9E9;
				font-size: 32rpx;
			}
		}
		&-empty {
			&__flag {
				width: 320rpx;
				height: 320rpx;
				margin: 144rpx auto 0;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-blank-2x.png);
			}
			&__desc {
				line-height: 34rpx;
				font-size: 26rpx;
				text-align: center;
				color: #444444;
				margin-top: 16rpx;
			}
		}
	}
</style>
