<template>
	<view class="">
		<view class="first-order-container" v-if="marketingInfo" :style="{ 'background-color': marketingInfo.marketingAttr.backgroundColor }">
			<view class="activity-img">
				<!-- <image :src="bannerUrl" /> -->
				<image :src="marketingInfo.marketingAttr.advertPic" />
				<view class="rule-dialog" @click="show = true" v-if="marketingInfo.marketingAttr.ruleDesc">规则</view>
			</view>
			<view
				class="activity-goods-list-second"
				v-if="marketingInfo.marketingAttr && marketingInfo.marketingAttr.layout == 1"
				:style="{ 'background-color': marketingInfo.marketingAttr.backgroundColor }"
			>
				<template v-for="(item, index) in shopList">
					<view class="activity-goods" @click="toDetails(item.skuId)" :key="index">
						<view class="goods-img"><u-image width="100%" height="100%" :src="`${item.url}?imageView2/1/w/171`" /></view>
						<view class="goods-info">
							<view class="goods-name u-line-1">{{ item.name }}</view>
							<view class="goods-desc u-line-1">{{ item.subTitle }}</view>
							<view class="goods-activity-type" :class="{ 'is-show': !isShowPriceLabel }">{{ marketingInfo.marketingAttr && marketingInfo.marketingAttr.label }}</view>
							<view class="shop-info-price">
								<view class="price-left">
									<view>
										<span class="price-symbol">¥</span>
										<span class="price">
											{{
												formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
													.toString()
													.split('.')[0]
											}}
										</span>
										<span style="color:#E60113;">
											.{{
												formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
													.toString()
													.split('.')[1]
													? formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
															.toString()
															.split('.')[1]
													: '00'
											}}
										</span>
									</view>
									<view class="oldPrice" v-if="isShowPriceLabel">¥{{ formatPrice(item.price) }}</view>
								</view>
								<view class="price-right"><view class="buy-btn">立即抢购</view></view>
							</view>
						</view>
					</view>
				</template>
			</view>
			<view class="activity-goods-list" v-else :style="{ 'background-color': marketingInfo.marketingAttr.backgroundColor }">
				<view class="guess-list">
					<template v-for="(item, idx) in shopList">
						<view class="shop-card" @click="toDetails(item.skuId)" :key="idx">
							<view class="shop-img" ref="shopImg"><u-image width="100%" height="100%" border-radius="10" :src="`${item.url}?imageView2/1/w/513`" /></view>
							<view class="shop-info">
								<view>
									<view class="shop-info-name u-line-2">
										<text>{{ item.name }}</text>
									</view>
									<view class="shop-info-desc u-line-1">
										<text>{{ item.subTitle }}</text>
									</view>
									<view class="activity-type" :class="{ 'is-show': !isShowPriceLabel }">
										{{ marketingInfo.marketingAttr && marketingInfo.marketingAttr.label }}
									</view>
								</view>
								<view class="shop-info-price">
									<view class="price-left">
										<view>
											<span class="price-symbol">¥</span>
											<span class="price">
												{{
													formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
														.toString()
														.split('.')[0]
												}}
											</span>
											<span style="color: #e60113">
												.{{
													formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
														.toString()
														.split('.')[1]
														? formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
																.toString()
																.split('.')[1]
														: '00'
												}}
											</span>
										</view>
										<view class="oldPrice" v-if="isShowPriceLabel">¥{{ formatPrice(item.price) }}</view>
									</view>
									<view class="price-right"><view class="buy-btn">立即抢购</view></view>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
			<div class="noData" v-if="!shopList || shopList.length < 1">抱歉，暂无数据〜</div>
			<u-loadmore :status="status" :bg-color="loadMoreBgColor" :load-text="loadText" color="#fff" v-show="isShowLoadmore" />
			<view>
				<u-popup v-model="show" mode="center" border-radius="14" width="80%" height="832rpx" closeable>
					<view class="u-padding-top-70 u-padding-bottom-70 u-padding-left-36 u-padding-right-36 regulation-content">
						<view class="title">活动规则</view>
						<scroll-view scroll-y="true" style="height: 624rpx;" class="scroll">
							<view class="content"><view v-html="marketingInfo.marketingAttr.ruleDesc"></view></view>
						</scroll-view>
					</view>
				</u-popup>
			</view>
			<button open-type="share" @click="clickFun" class="share-btn">
				<span>分享</span>
				<i></i>
			</button>
		</view>
		<view v-else class="emtpy-page">
			<image class="emtpy-page-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" mode=""></image>
			<view class="emtpy-page-text">抱歉，活动已失效〜</view>
			<view class="emtpy-page-btn" @click="goIndex">看看其他</view>
		</view>

		<view>
			<u-popup v-model="tipsShow" mode="center" border-radius="14" width="80%" height="476rpx">
				<view class="u-padding-top-70 u-padding-bottom-70 u-padding-left-36 u-padding-right-36 tipsBox">
					<view class="title">温馨提示</view>
					<view class="content">活动将于 {{ marketingInfo.startTime }} 开始，敬请期待！</view>
					<text @click="tipsShow = false">我知道了</text>
				</view>
			</u-popup>
		</view>

	</view>
</template>
<script>
const formatPrice = function(num, scale = 2) {
	if (num === null || isNaN(num)) {
		return '';
	}
	return num.toFixed(scale);
};
import { visit } from '@/common/visit.js';
export default {
	name: 'FirstOrder',
	components: {},
	data() {
		return {
			formatPrice,
			status: 'loadmore',
			loadMoreBgColor: '#fd743a',
			marketingInfo: {},
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: ''
			},
			listQuery: {
				marketingId: '', // 营销id
				pageNum: 0,
				pageSize: 10
			},
			show: false,
			bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/26d5d0178e3f52c5103ecb5d0490fd5d.jpg',
			shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/fc47d3e998cc3cd9bcf0ad7ad6db46ba.png',
			postImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/b08154426295c77bfb5db8b72d59f85f.jpg',
			show: false,
			shopList: [],
			isShowPriceLabel: false,
			isShowLoadmore: true,
			tipsShow:false,
			firstIn: false, //首次进入活动弹窗控制
		};
	},
	onShareAppMessage(options) {
		let url = `productModule/pages/firstOrder/firstOrder?id=${this.listQuery.marketingId}`;
		return {
			title: this.marketingInfo.marketingAttr.shareText,
			desc: '',
			imageUrl: this.marketingInfo.marketingAttr.activitySharePic,
			path: url
		};
	},
	onLoad(options) {
		this.firstIn = true
		this.listQuery.marketingId = options.id;
		this.getMarketingInfo();
		this.findList();
		visit(this, '平台活动专区页', { activityId: options.id });
		uni.setNavigationBarTitle({
			title: this.marketingInfo.marketingAttr&&this.marketingInfo.marketingAttr.label
		});
	},
	onReachBottom() {
		this.findList();
	},
	methods: {
		//去首页
		goIndex() {
			this.$wsf.go('Index');
		},
		toDetails(id) {
			this.$wsf.go('SkuDetail', { skuId: id });
		},
		getMarketingInfo() {
			let { marketingId } = this.listQuery;
			this.$u.api.getMarketingById({ marketingId: marketingId }).then(res => {
				this.marketingInfo = res.data;
				if (res.data) {
					let now = Date.parse(new Date());
					let start = Date.parse(new Date(this.marketingInfo.startTime.replace(/\-/g, '/')));
					let end = Date.parse(new Date(this.marketingInfo.endTime.replace(/\-/g, '/')));
					this.isShowPriceLabel = this.marketingInfo.openChannel && start <= now && end >= now;
					uni.setNavigationBarTitle({
						title: this.marketingInfo.marketingAttr.label
					});
				}
			});
		},
		findList() {
			this.marketingInfo.openChannel = true;
			// 数据全部加载完成
			this.status = 'loading';
			this.$u.api.getSpuSpeicalAreaList(this.listQuery).then(res => {
				this.status = 'loadmore';
				if (res.code === 200) {
					this.shopList = this.shopList.concat(res.data.list);
					let nowDate = new Date().getTime()
					this.marketingInfo.startTime = this.marketingInfo.startTime.replace(/\-/g, '/')
					let startTime = new Date(this.marketingInfo.startTime).getTime()
					if (nowDate < startTime && this.shopList.length > 0 && this.firstIn) {
						this.tipsShow = true
					}
					this.firstIn = false
					this.listQuery.pageNum++;
					if (res.data.list.length < 10) {
						this.status = 'nomore';
						this.isShowLoadmore = false;
						return;
					}
				}
			});
		},
		clickFun(){
			let params = {
				name:this.marketingInfo.marketingAttr&&this.marketingInfo.marketingAttr.label,
				type: 1,
				id: this.listQuery.marketingId
			}
			this.$store.dispatch('SETTINGS/shareVisitRequest',params)
		}
	}
};
</script>
<style lang="scss" scoped>
.is-show {
	visibility: hidden;
}
.scroll::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
}
.emtpy-page {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding-top: 50%;
	&-img {
		width: 180rpx;
		height: 180rpx;
	}
	&-text {
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
		margin: 12rpx 0 30rpx;
	}
	&-btn {
		width: 180rpx;
		height: 60rpx;
		border-radius: 40rpx;
		border: 2rpx solid #666;
		color: #000;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.first-order-container {
	background-repeat: repeat-y;
	background-size: contain;
	// background: #fd743a;
	height: 100%;
	.activity-img {
		width: 100%;
		height: 482rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}
		.rule-dialog {
			font-size: 24rpx;
			padding: 4rpx 20rpx;
			position: absolute;
			color: #ffffff;
			background-color: #000;
			opacity: 0.6;
			border-radius: 20rpx;
			right: 20rpx;
			top: 24rpx;
			text-align: center;
			border-radius: 20rpx;
		}
	}
	.activity-goods-list {
    padding: 24rpx;
		// background: #fd743a;
		.guess-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			.shop-card {
				display: flex;
				width: 100%;
				border-radius: 10rpx;
				margin-bottom: 18rpx;
				overflow: hidden;
				background-color: #fff;
				padding: 10rpx;
				height: 300rpx;

        &:last-child {
          margin-bottom: 0;
        }
				.shop-img {
					width: 280rpx;
					height: 280rpx;
					flex-shrink: 0;
				}
				.shop-info {
					width: 100%;
					overflow: hidden;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 8rpx 32rpx 0rpx 20rpx;
					.shop-info-name {
						color: #000000;
						font-size: 28rpx;
						line-height: 38rpx;
						text-align: left;
					}
					.shop-info-desc {
						margin-top: 12rpx;
						color: #999;
						font-size: 24rpx;
						line-height: 27rpx;
						text-align: left;
					}
					.activity-type {
						margin-top: 14rpx;
						color: #e60113;
						font-size: 20rpx;
						text-align: center;
						padding: 4rpx 4rpx;
						display: inline-block;
						border-radius: 10rpx;
						background: #fdebeb;
					}
					.shop-info-price {
						display: flex;
						justify-content: space-between;
						text-align: left;
						padding-bottom: 10rpx;
						.price-left {
							display: flex;
							flex-direction: column;
							margin-top: -6rpx;
							.price-symbol {
								color: #e60113;
								font-size: 28rpx;
								display: inline-block;
								height: 32rpx;
								line-height: 32rpx;
							}
							.price {
								font-size: 40rpx;
								color: #e60113;
							}
						}
						.price-right {
							.buy-btn {
								width: 160rpx;
								height: 60rpx;
								background: #ffa000 linear-gradient(180deg, #ffa000 0%, #c82b1d 100%);
								border-radius: 30rpx;
								text-align: center;
								line-height: 60rpx;
								color: #fff;
							}
						}
					}
				}
				.oldPrice {
					display: inline-block;
					font-size: 24rpx;
					text-decoration: line-through;
					color: #999;
					transform: scale(0.92);
					// margin-top: 2rpx;
				}
			}
		}
	}
	.activity-goods-list-second {
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.activity-goods {
			margin-bottom: 18rpx;
			overflow: hidden;
			border-radius: 10rpx;
			display: inline-block;
			width: 342rpx;
			height: 604rpx;
			background: #fff;
			.goods-img {
				width: 100%;
				height: 342rpx;
			}
			.goods-info {
				padding: 20rpx;

				.goods-name {
					line-height: 38rpx;
					font-size: 30rpx;
					color: #000;
				}
				.goods-desc {
					margin-top: 12rpx;
					min-height: 28rpx;
					color: #999;
					font-size: 24rpx;
					line-height: 27rpx;
					text-align: left;
				}
				.goods-activity-type {
					color: #e60113;
					margin: 16rpx 0 20rpx;
					font-size: 20rpx;
					line-height: 20rpx;
					text-align: center;
					padding: 4rpx 4rpx;
					display: inline-block;
					border-radius: 4rpx;
					background: #fdebeb;
				}

				.shop-info-price {
					text-align: left;
					display: flex;
					justify-content: space-between;
					.price-left {
						display: flex;
						flex-direction: column;
						margin-top: -6rpx;
						.price-symbol {
							color: #e60113;
							font-size: 28rpx;
							display: inline-block;
							height: 32rpx;
							line-height: 32rpx;
						}
						.price {
							font-size: 40rpx;
							color: #e60113;
						}
					}
					.price-right {
						.buy-btn {
							width: 120rpx;
							height: 60rpx;
							background: #ffa000;
							border-radius: 40rpx;
							text-align: center;
							line-height: 60rpx;
							color: #fff;
							font-size: 22rpx;
						}
					}
				}
				.oldPrice {
					display: inline-block;
					font-size: 24rpx;
					text-decoration: line-through;
					color: #999;
					transform: scale(0.92);
					margin-top: 2rpx;
				}
			}
		}
	}
	.guess-load-more-tips {
		padding: 0.4rem 0;
		text-align: center;
		color: #888888;
	}
	/deep/ .van-popup {
		padding: 30px 10px;
		width: 80%;
		height: 300px;
	}
	.regulation-content {
		width: 100%;
		height: 100%;
		.title {
			text-align: center;
			font-size: 36rpx;
			margin-bottom: 0.8rem;
			margin-top: -28rpx;
		}
		.content {
			color: #666666;
			font-size: 0.56rem;
			line-height: 48rpx;
		}
	}
	.share-btn {
		position: fixed;
		right: 0;
		bottom: 200rpx;
		width: 108rpx;
		height: 70rpx;
		border-radius: 16rpx 0px 0px 16rpx;
		background: #000;
		opacity: 0.7;
		display: flex;
		align-items: center;
		padding-left: 14rpx;
		flex-direction: row;
		color: #fff;
		font-size: 28rpx;
		i {
			margin-left: 4rpx;
			display: inline-block;
			width: 26rpx;
			height: 26rpx;
			background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/share%402x.png') no-repeat center center;
			background-size: 100%;
		}
	}
	button {
		border-radius: 0;
		padding: 0;
		margin: 0;
		background-color: transparent;
		line-height: 24rpx;
		outline: none;
	}
	button::after {
		border: none;
	}
}
.noData {
	text-align: center;
	margin-top: 40rpx;
	font-size: 28rpx;
	color: #fff;
}
.tipsBox{
	text-align:center;
	.title{
		font-size: 32rpx;
		margin-bottom: 40rpx;
		font-weight: bold;
	}
	.content {
		line-height: 48rpx;
		color: #666666;
		font-size: 30rpx;
		margin-bottom: 80rpx;
	}
	text{
		display: inline-block;
		border: 1px solid #333;
		width: 280rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 8rpx;
		text-align: center;
	}
}
</style>
