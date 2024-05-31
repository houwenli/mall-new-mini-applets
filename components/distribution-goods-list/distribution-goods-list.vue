<template>
	<view class="">
		<view class="goods-list-box">
			<block v-for="(item, index) in goodsList" :key="index">
				<view class="product">
					<view class="product-box" @tap="goDetail(item)">
						<view class="product-image">
							<u-image
								height="344rpx"
								width="344rpx"
								loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/504"
								border-radius="10rpx"
								:src="item.productUrl + '?imageView2/1/w/504'"
							></u-image>
						</view>
						<view class="product-info">
							<view class="product-name u-line-2">{{ item.skuName }}</view>
							<view class="product-price">
								￥
								<text class="light">{{ item.showFinalPrice }}</text>
								<text class="del" v-if="item.finalPrice < item.price">￥{{ item.showPrice }}</text>
							</view>
							<text class="product-mark">赚 {{ '￥' + item.preCommission }}</text>
							<view class="buy-button" v-if="isDistribution==2">立即购买</view>
						</view>
					</view>
					<view class="share-button" v-if="isDistribution==1" @tap.stop="handleShareProduct(item)">分享</view>
				</view>
			</block>
		</view>
		<u-popup v-model="showShareModal" mode="bottom" border-radius="20" height="388rpx" :mask-close-able="false">
			<view class="share-container">
				<view class="share-title">分享至</view>
				<view class="share-way">
					<button class="share-way-part" open-type="share">
						<image class="share-way-image" src="@/static/img/icon/WeChat@2x.png"></image>
						<span>微信好友</span>
					</button>
					<button class="share-way-part" @click="getPost()">
						<image class="share-way-image" src="@/static/img/icon/pt@2x.png"></image>
						<span>生成海报</span>
					</button>
				</view>
				<view class="cancel-btn" @tap="showShareModal = false">取消</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { priceFilter } from '@/common/wsfValidate.js';
export default {
	props: {
		// title: {
		// 	type: String
		// },
		list: {
			type: Array
		},
		isDistribution:{
			type:Number,
			default:1
		}, // 1 能分销商品; 2 购买商品
		// showStyle: {
		// 	type: String,
		// 	default: 'waterfall',
		// 	// common: 两列，column:一列，waterfall:瀑布流
		// }
	},
	watch: {
		// showStyle(newVal, oldval) {
		// 	console.log('newVal', newVal);
		// 	this.goodsListStyle = newVal;
		// },
		list:{
			handler:function(newVal, oldval) {
				console.log('newVal', newVal);
				this.goodsList = newVal.map(item => {
					item.finalPrice = priceFilter(item.finalPrice);
					return item;
				});
				console.log('this.goodsList----------',this.goodsList)
			},
			immediate:true,
			deep:true,
		}
	},

	data() {
		return {

			isShowStore: 0,
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			goodsList: [],
			showShareModal:false,
			shareParams: {
				name: '',
				image: '',
				shareType: '',
				distributionCode: ''
			},
			promoteInfo:{
				promoteId: '',
				promoteType:'',
				phone: ''
			},
			priceFilter,
		};
	},
	mounted(){
		console.log(this.list)
	},
	onShareAppMessage(options) {
		console.log(options)
		if (options.from === 'button') {
			// 来自页面内分享按钮
			this.showShareModal = false;
			let url;
			if (this.shareParams.shareType == 'product') {
				url = 'productModule/pages/skuDetail/skuDetail?s=' + this.shareParams.skuId + '&c=' + this.shareParams
					.distributionCode;
			} else if (this.shareParams.shareType == 'page') {
				url = 'distributionModule/pages/distributionIndex/distributionList?id=' + this.promoteInfo.promoteId;
			}
			return {
				title: this.shareParams.name,
				imageUrl: this.shareParams.image,
				path: url
			};
		}
	},
	methods: {
		goDetail(e) {
			this.$wsf.go('distributionSkuDetail', {
				skuId: e.skuId
			});
		},
		handleShareProduct(e) {
			console.log(e)
			this.checkPermission().then(isPass => {
				console.log(isPass, 'isPass');
				if (!isPass) return;
				this.shareParams = {
					name: `¥${Number(e.finalPrice).toFixed(2)} | ${e.skuName}`,
					image: e.shareImage ? e.shareImage : e.productUrl,
					shareType: 'product',
					skuId: e.skuId
				};
				this.getShareCode(e.spuId);
				this.choseProduct = e;
				this.showShareModal = true;
			});
		},

		checkPermission() {
			return new Promise((resolve, reject) => {
				let userInfo = uni.getStorageSync('userInfo');
				let params = {
					userId: userInfo.id,
					userPhone: userInfo.mobile
				};
				this.$u.api.QueryIsDistribution(params).then(response => {
					if (response.data.code == 1) {
						if (!response.data.isDistribution || response.data.isDistribution == 0) {
							let info = {
								userId: userInfo.id,
								userPhone: userInfo.mobile,
								userName: userInfo.userName
							};
							this.$wsf.go('PromotionRegister', info);
							reject();
						} else {
							this.promoteInfo = {
								promoteId: response.data.promoteId,
								promoteType: response.data.promoteType,
								phone: response.data.mobile
							};
							resolve(true);
						}
					} else {
						uni.showToast({
							title: response.data.msg,
							icon: 'none'
						});
						reject();
					}
				});
			});
		},
		getShareCode(spuId) {
			let param = {
				spuId: spuId,
				recommendUserType: this.promoteInfo.promoteType,
				phone: this.promoteInfo.phone,
				customerId: this.promoteInfo.promoteId
			};
			this.$u.api.ShareForDistribution(param).then(res => {
				this.shareParams.distributionCode = res.data.data;
			});
		},
		getPost() {
			let params;
			let ShareCodeApi;
			if (this.shareParams.shareType == 'page') {
				params = {
					scene: `id=${this.promoteInfo.promoteId}`,
					page: 'distributionModule/pages/distributionIndex/distributionList',
					width: 60,
					autoColor: false,
					lineColor: '',
					isHyaline: false,
					recommendId: this.promoteInfo.promoteId
				};
				ShareCodeApi = this.$u.api.CreateSpuListShareCode;
			} else if (this.shareParams.shareType == 'product') {
				console.log('this.shareParams.shareType')
				params = {
					scene: `s=${this.choseProduct.skuId}&c=${this.shareParams.distributionCode}`,
					page: 'productModule/pages/skuDetail/skuDetail',
					width: 60,
					autoColor: false,
					lineColor: '',
					isHyaline: false,
					suncode: this.shareParams.distributionCode,
					goodsImgUrl: this.choseProduct.shareImage,
					goodsName: this.choseProduct.skuName,
					price: this.choseProduct.finalPrice
				};
				ShareCodeApi = this.$u.api.CreateShareCode;
			}
			ShareCodeApi(params).then(res => {
				this.showShareModal = false;
				let path = res.data.wsSunCodeUrl;
				wx.downloadFile({
					url: res.data.wsSunCodeUrl,
					success: res => {
						console.log('---wx.downloadFil--成功--', res);
						uni.showShareImageMenu({
							path: res.tempFilePath,
							success: res => {
								if (res.errMsg == 'showShareImageMenu:ok') {
									this.$u.toast('保存成功！');
								}
							},
							fail: res => {
								console.log(res);
								if (res.errMsg ==
									'showShareImageMenu:fail auth deny') {
									this.$u.toast('保存失败！');
								}
							}
						});
					}
				});
			});
		},


		clearList() {
			this.goodsList = [];
		},
		/* 获取当前swiper选中 */

		/* 点击swiper */

	}
};
</script>

<style scoped lang="scss">
.goods-list-box{
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.product {
		margin-bottom: 24rpx;
		overflow: hidden;
		position: relative;
		border-radius: 16rpx;

		.product-box {
			display: flex;
			flex-direction: column;
			// justify-content: flex-start;
			align-items: center;
			background-color: #fff;
			max-width: 344rpx;
			.product-image {
				// margin-right: 24rpx;
			}

			.product-info {

				display: flex;
				width: 100%;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				padding: 20rpx 16rpx;
				box-sizing: border-box;

				.product-name {
					height: 80rpx;
					margin-bottom: 58rpx;
					font-size: 28rpx;
					color: #000;
					max-width: 344rpx;
					line-height: 40rpx;
				}

				.product-price {
					font-size: 24rpx;
					color: #e60113;
					padding-bottom: 12rpx;
					line-height: 30rpx;

					.light {
						font-size: 36rpx;
						color: #e60113;
					}

					.del {
						margin-left: 12rpx;
						color: #666;
						font-size: 20rpx;
						text-decoration: line-through;
					}
				}

				.product-mark {
					text-align: center;
					display: inline-block;
					font-size: 20rpx;
					font-weight: 400;
					color: #fd302c;
					padding: 0 8rpx;
					border-radius: 4rpx;
					background: #ffe5ea;
					overflow: hidden;
				}
			}
			.buy-button {
				position: absolute;
				width: 160rpx;
				height: 56rpx;
				background: #fd302c;
				border-radius: 8rpx;
				right: 24rpx;
				bottom: 24rpx;
				line-height: 56rpx;
				text-align: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #fff;
			}
		}

		.share-button {
			position: absolute;
			width: 120rpx;
			height: 56rpx;
			background: #fd302c;
			border-radius: 8rpx;
			right: 16rpx;
			bottom: 12rpx;
			line-height: 56rpx;
			text-align: center;
			font-weight: 500;
			font-size: 28rpx;
			color: #fff;
		}

	}
}
.share-container {
		height: 388rpx;
		.share-title {
			text-align: center;
			padding: 34rpx 0;
			color: #666;
		}

		.share-way {
			margin: 6rpx 0 40rpx;
			display: flex;
			justify-content: space-around;

			button {
				padding: 0;
				margin: 0;
				background-color: #fff;
				line-height: 24rpx;
				outline: none;
			}

			button::after {
				border: none;
			}

			.share-way-part {
				width: 96rpx;
				text-align: center;

				.share-way-image {
					width: 92rpx;
					height: 92rpx;
					margin-bottom: 24rpx;
				}

				span {
					color: #000;
					font-size: 24rpx;
				}
			}
		}

		.cancel-btn {
			border-top: 1px solid #f2f2f2;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			font-size: 32rpx;
			color: #000;
		}
	}
</style>
