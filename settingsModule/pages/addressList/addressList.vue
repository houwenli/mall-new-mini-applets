<template>
	<view>
		<view class="applet-addresslist-wrap">
			<view class="applet-addresslist-empty" v-if="isEmpty">
				<view class="applet-addresslist-empty-icon"><image style="height: 100%;width: 100%;" src="@/static/img/address_isEmpty.png" mode=""></image></view>
				<view class="applet-addresslist-empty-tips">您还没有收货地址哦</view>
				<view class="applet-addresslist-empty-btn" @click="$wsf.go('EditAddress',{addressType: this.addressType})">新建地址</view>
			</view>
			<view v-else class="addresslist">
				<view v-for="(item, index) in addressList" style="margin-bottom: 24rpx;border-radius: 20rpx;overflow: hidden;">
					<u-swipe-action
						bg-color="#FFF"
						btn-width="160"
						:show="item.show"
						:index="index"
						:key="item.id"
						@click="openDeleteConfirm(item)"
						@open="open"
						:options="options"
					>
						<view class="addresslist-item">
							<view @click="handleAddress(item.id)" v-if="addressType" class="addresslist-item-check">
								<view :class="item.id == addressId ? 'addresslist-item-check-btn checked' : 'addresslist-item-check-btn'"></view>
							</view>
							<view v-else style="padding-left: 12rpx;" @click="handleAddress(item.id)"></view>
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view class="addresslist-item-info" @click="handleAddress(item.id)">
								<view class="addresslist-item-info-header">
									<text class="addresslist-item-info-header-name">{{ item.name }}</text>
									<text class="addresslist-item-info-header-phone">{{ item.originMobile | phoneNumberHide }}</text>
									<view v-if="item.isDefault>0" class="addresslist-item-info-header-is-default">默认</view>
								</view>
								<text class="addresslist-item-info-body-address">{{ item.address + item.detailAddress }}</text>
							</view>
							<view class="addresslist-item-edit" @click="toeditAddress(item.id, addressType)">
								<image style="height: 28rpx;width: 28rpx;" src="@/static/img/icon/edit@2x.png"></image>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</view>
			<view v-show="!isEmpty" class="address-add-btn" @click="$wsf.go('EditAddress',{addressType: this.addressType})">
				<text style="font-size: 42rpx;font-weight: bold;color: #fff;margin-right: 20rpx;">+</text>
				新增收货地址
			</view>
		</view>
		<wsf-confirm v-model="showConfirm" title="您还没有收货地址哦，赶快设置一个吧！" activeText="去设置" @confirm="activeConfirm"></wsf-confirm>
		<wsf-confirm v-model="showDeleteConfirm" title="是否确认删除该地址" activeText="删除" cancelText="取消" @confirm="activeDeleteConfirm"></wsf-confirm>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressType: 0,
			addressId: 0,
			isEmpty: true,
			addressList: [],
			showConfirm: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#E60113',
						borderRadius: '10rpx',
						color: '#FFFFFF'
					}
				}
			],
			showDeleteConfirm: false,
			delAddressId: 0,
		};
	},
	onLoad(options) {
		console.log("地址列表options********", options)
		this.addressType = options.type ? options.type : '';
		this.addressId = options.addressId || 0;
		let title = options.type ? '收货地址' : '地址管理';
		uni.setNavigationBarTitle({
			title
		});
	},
	onShow() {
		this.getAddressList();
	},
	methods: {
		// 获取所有地址列表
		getAddressList() {
			this.$u.api.QueryCustomerAddress().then(res => {
				this.isEmpty = !res.data.length;
				if (this.isEmpty) {
					this.showConfirm = true
				}
				this.addressList = res.data;
			});
		},
		toeditAddress(id, type) {
			this.$wsf.go('EditAddress', { addressId:id,addressType:type });
		},
		// 控制跳转, 从下单界面跳转的地址管理使用返回,通过个人中心跳转的进入编辑页面
		handleAddress(addressId,type) {
			if (!this.addressType) {
				this.$wsf.go('EditAddress', { addressId:addressId });
				return;
			}
			// 返回上一页,并更新上一页的参数
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			prevPage.$vm.addressId = addressId
			
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			});
		},
		// 滑动打开时
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.addressList[index].show = true;
			this.addressList.map((val, idx) => {
				if (index != idx) this.addressList[idx].show = false;
			});
		},
		// Confirm确认框点击确认时
		activeConfirm() {
			this.showConfirm = false
			this.$wsf.go('EditAddress',{addressType: this.addressType})
		},
		// 打开模态框
		openDeleteConfirm(item) {
			this.delAddressId = item.id
			this.showDeleteConfirm = true
		},
		// 删除确认框点击时
		activeDeleteConfirm() {
			console.log("this.addressList.length",this.addressList.length)
			if (this.addressList.length == 0) {
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});	
			}
			this.showDeleteConfirm = false
			this.deleteAddress();
		},
		// 删除地址
		deleteAddress() {
			this.$u.api.DeleteCustomerAddressById({ addressId: this.delAddressId }).then(res => {
				this.isLoading = false;
				this.$u.toast('删除成功');
				this.getAddressList();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.applet-addresslist-wrap {
	min-height: 100%;
	.applet-addresslist-empty {
		padding-top: 200rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		&-icon {
			height: 108rpx;
			width: 168rpx;
			margin-bottom: 38rpx;
			line-height: 20rpx;
		}
		&-tips {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 30rpx; 
		}
		&-btn {
			width: 200rpx;
			height: 70rpx;
			border-radius: 34rpx;
			border: 1px solid #666;
			font-size: 28rpx;
			color: #000;
			text-align: center;
			line-height: 70rpx;
		}
	}
	.addresslist {
		padding-top: 24rpx;
		padding-bottom: 160rpx;
		&-item {
			padding: 24rpx 0 24rpx 24rpx;
			border-radius: 20rpx;
			overflow: hidden;
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: stretch;
			// 选择框样式
			&-check {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 24rpx;
				&-btn {
					position: relative;
					width: 36rpx;
					height: 36rpx;
					box-sizing: border-box;
					background: #ffffff;
					border-radius: 18rpx;
					border: 2px solid #d9d9d9;
				}

				.checked {
					background: $wsf-color-red;
					border: 2px solid $wsf-color-red;

					&::after {
						content: '';
						position: absolute;
						left: 6rpx;
						top: 6rpx;
						width: 50%;
						height: 25%;
						border: 4rpx solid #fff;
						border-radius: 1rpx;
						border-top: none;
						border-right: none;
						background: transparent;
						transform: rotate(-45deg);
					}
				}
			}
			// 地址信息
			&-info {
				width: 550rpx;
				padding: 16rpx 0;
				&-header {
					height: 40rpx;
					margin-bottom: 16rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					&-name {
						color: #000000;
						font-size: 32rpx;
						height: 40rpx;
						margin-right: 20rpx;
						width: 260rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&-phone {
						color: #333333;
						font-size: 34rpx;
						height: 38rpx;
						margin-right: 20rpx;
					}
					&-is-default {
						height: 28rpx;
						width: 50rpx;
						font-size: 20rpx;
						background-color: $wsf-color-red;
						color: #FFFFFF;
						text-align: center;
					}
				}
				&-address {
					color: #333333;
					font-size: 24rpx;
					line-height: 38rpx;
				}
			}
			// 编辑按钮样式
			&-edit {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-left: 36rpx;
				padding-right: 38rpx;
			}
		}
		// 重置滑动的删除按钮样式
		/deep/ .u-btn-text {
			color: #fff;
		}
	}
	.address-add-btn {
		transition: all 0.3s;
		width: 678rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 38rpx;
		position: fixed;
		bottom: 40rpx;
		left: 36rpx;
		background-color: $wsf-color-red;
		color: #fff;
		font-weight: bold;
		text-align: center;
		font-size: 32rpx;
	}
}
</style>
