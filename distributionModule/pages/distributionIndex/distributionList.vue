<template>
	<view class="page">
		<view class="scroll-content" :style="[bgStyle]">
			<view class="header" :style="{ height: headerIconHeight + searchBarPaddingTop + 'px'}">
				<distribution-header
					ref="distributionHeader"
					:headerBg="headerBg"
					:bgType="bgType"
					:headerType="3"
					:promoteId="promoteId"
					fromPage="distributionUser"
					@search="navigationTo('Search',{fromPage:'distributionUserPage'})">
				</distribution-header>
			</view>

			<view class="applet-template-container"><applet-template :floors="getFloors" :isDistribution="isDistributionTemplate" :timestamp="timestamp" :pageNavData="pageNavData"  :hasPower="hasPower"></applet-template></view>
			<more-list ref="moreList" fromUser @goDetail="goDetail" @handleSharePage="handleSharePage"></more-list>
		</view>

		<image v-if="showReturnTop" class="back-top" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" @tap="backTop()" />

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
import { priceFilter } from '@/common/wsfFilter.js';
import appletTemplate from "@/components/applet-template/distribution-applet-template.vue";
import distributionHeader from '@/components/distribution/header.vue';
import moreList from '@/components/distribution/moreList.vue';

import { genNewLink } from './data'
export default {
	components:{
		appletTemplate,
		distributionHeader,
		moreList
	},
	data() {
		const {windowWidth, capsule} = getApp().globalData;
		return {
			showReturnTop: false,
			showShareModal: false,
			ossUrl: this.$oss,
			hotRankIcon: {
				0: this.$oss + 'wsf-mall/activity/hot-first.png',
				1: this.$oss + 'wsf-mall/activity/hot-second.png',
				2: this.$oss + 'wsf-mall/activity/hot-third.png'
			},
			emptyImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/bf7051fe79eb0e831298a985302ccff1.png',
			// 搜索的参数
			searchParam: {
				pageNum: 0, // 当前页码
				pageSize: 10 // 每页显示记录数
			},
			goodsList: [], // 分销商品列表
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			loadText: {
				loadmore: '',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			priceFilter,
			promoteId: '',
			promoteInfo: {
				recommendUserType: '',
				phone: '',
				promoteId: ''
			},
			showSearchBar: false, // 是否显示头部导航栏
			topSwiperAutoplay: true,
			currentSwiper: 0,
			messageCount: 0, // 消息总数
			bgColor: '',
			isDistribution:2, // 1：分销商品 2 用户视角
			isDistributionTemplate:true,
			timestamp:{},
			searchBarPaddingTop: capsule.top,
			headerIconHeight: capsule.height,
			getFloors: []
		};
	},
	onLoad(option) {
		console.log(option, 'option');
		if (option) {
			if (option.scene) {
				let scene = decodeURIComponent(option.scene);
				console.log(scene, 'scene');
				if (scene.indexOf('id=') != -1) {
					this.promoteId = scene.split('id=')[1];
				}
			} else {
				this.promoteId = option.id;
			}
		}
	},
	onShow() {
		// 查询模板信息(分销页面配置)
		this.$store.dispatch("SETTINGS/queryIndexTemplate",true);
		this.getPromoteInfo();
		// this.getList();
		this.$refs.distributionHeader.getHotWordList()

	},

	onHide() {
			this.$refs.distributionHeader.swiperStop()
	},

	onPullDownRefresh() {
		// this.reset();
		this.$refs.moreList.reset()
	},
	onReachBottom() {
		this.$refs.moreList.getProductList()
	},
	computed: {
		// 模板数据
		floors() {
			// let list = this.$u.deepClone(this.$store.getters["SETTINGS/distributionWsfFloors"] || []);
			// 
			// // 2023-03-29 产品张晗毓 要求关闭金刚区展示
			// // let newLIst = list.filter(item => item.text != '金刚区')
			// genNewLink.call(this, list)
			// return list;
			return this.$store.getters["SETTINGS/distributionWsfFloors"] || []
		},
		// 浮动数据
		// floatBtnData() {
		// 	return this.$store.getters['SETTINGS/distributionFloatBtnData'];
		// },
		// 背景图数据
		headerData() {
			return this.$store.getters['SETTINGS/distributionHeaderData'];
		},

		headerBg() {
			return this.headerData.headerBg || {}
		},
		pageNavBg() {
			return this.headerData.pageNavBg || {}
		},
		bgType() {
			return this.headerData.theme || 1
		},
		bgStyle() {
			let { backgroundType, bgImage, bgColor } = this.pageNavBg
        	let background = backgroundType == 1 ? `url(${bgImage}) no-repeat` : bgColor ? bgColor : '#fff'
        	return {
        	  background,
        	  // backgroundSize: this.bgSize,
        	}
		},
	},
	watch: {
		headerData: {
			handler(newVal) {
				this.currentSwiper = 0;
				this.bgColor = newVal.slideshowImageList?newVal.slideshowImageList[0].bgColor:'';
			},
			immediate: true,
			deep: true
		},
		floors: {
			handler(newVal) {
				let list = this.$u.deepClone(newVal)
				genNewLink.call(this, list)
				// return list;
				this.getFloors = list
			}
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
		let showSearchBar = this.showSearchBar;
		if (this.scrollTop > 2500) {
			this.showReturnTop = true;
		} else {
			this.showReturnTop = false;
			// if (e.scrollTop > 50 && !showSearchBar) {
			// 	this.showSearchBar = true;
			// 	this.bgColor = ''
			// } else if (e.scrollTop < 50 && showSearchBar) {
			// 	this.showSearchBar = false;
			// 	this.bgColor = this.headerData.slideshowImageList[this.currentSwiper].bgColor;
			// } else {
			// 	return;
			// }
		}
	},
	onShareAppMessage(options) {
		console.log("onShare--分享参数--",options)
		if (options.from === 'button') {
			// 来自页面内分享按钮
			this.showShareModal = false;
			let url;
			if (this.shareParams.shareType == 'product') {
				// url = 'productModule/pages/skuDetail/skuDetail?s=' + this.shareParams.skuId + '&c=' + this.shareParams
				// 	.distributionCode;
					url = 'productModule/pages/skuDetail/distributionSkuDetail?s=' + this.shareParams.skuId + '&c=' + this.shareParams
					.distributionCode
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
								if (res.errMsg == 'showShareImageMenu:fail auth deny') {
									this.$u.toast('保存失败！');
								}
							}
						});
					}
				});
			});
		},
		/* 跳转 */
		navigationTo(sceneName, params) {
			this.$wsf.go(sceneName, params);
		},
		getPromoteInfo() {
			console.log("getPromoteInfo---传参---id---",this.promoteId)
			this.$u.api.QueryUserBasicInfoById({ id: this.promoteId }).then(res => {
				console.log("getPromoteInfo---接口返回----",res)
				this.promoteInfo = {
					recommendUserType: res.data.recommendUserType,
					phone: res.data.mobile,
					promoteId: res.data.id
				};
			});
		},
		getList() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryDistributionSpuList(this.searchParam).then(res => {
				this.loadStatus = 'loadmore';
				this.isLoading = false;
				uni.stopPullDownRefresh();
				if (res.code === 200) {
					this.goodsList = this.goodsList.concat(
						res.data.list.map(item => {
							item.showFinalPrice = this.priceFilter(item.finalPrice);
							item.showPrice = this.priceFilter(item.price);
							return item;
						})
					);
					this.searchParam.pageNum++;
					this.hasMore = res.data.list.length === 10;
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
		reset() {
			this.loadStatus = 'loadmore';
			this.hasMore = true;
			this.searchParam = {
				pageNum: 0,
				pageSize: 10
			};
			this.goodsList = [];
			this.getList();
		},
		//跳转到推广员小程序
		navigateMiniProgram() {
			uni.navigateToMiniProgram({
				appId: 'wx0d1811ba25b5aeab',
				path: 'pages/index/index',
				envVersion: __wxConfig.envVersion
			});
		},
		//跳转商品详情
		goDetail(item) {
			let param = {
				spuId: item.spuId,
				recommendUserType: this.promoteInfo.recommendUserType,
				phone: this.promoteInfo.phone,
				customerId: this.promoteId
			};
			this.$u.api.ShareForDistribution(param).then(res => {
				this.$wsf.go('SkuDetail', { s: item.skuId, c: res.data.data });
			});
		},
		getSwiperCurrent(e) {
			let { current, source } = e.detail;
			if (source === 'autoplay' || source === 'touch') {
				this.currentSwiper = current;
				if (this.scrollTop < 50) {
					this.bgColor = this.headerData.slideshowImageList[current].bgColor;
				}
			}
		},

		/* 点击swiper */
		clickSwiperCurrent(link) {
			console.log(link, 'link');
			if (!link) {
				return;
			} else {
					let jumpLink = link.split('~')[1]
				if (jumpLink == 'distributionModule/pages/distributionIndex/distributionIndex') {
					let isLogin = getApp().globalData.isLink;
					if (isLogin) {
						this.$wsf.go('distributionIndex');
					} else {
						this.$wsf.go('QuickLogin', {
							cartRoute: 'pages/index/index'
						});
					}
				} else {
					this.$wsf.go(jumpLink);
				}
			}
		},
		// 分享弹窗
		handleSharePage() {
			this.checkPermission().then(isPass => {
				console.log(isPass, 'isPass');
				if (!isPass) return;
				this.shareParams = {
					name: '分享赚，自购省钱，分享赚钱\r\n一键转发，货通全国',
					image: this.$oss + 'wsf-mall/distribution/bg_distribution.png',
					shareType: 'page'
				};
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
							// uni.switchTab({
							//   url: "/pages/index/index",
							// });
							// setTimeout(() => {
							uni.showToast({
								title: response.data.msg,
								icon: 'none'
							});
							// }, 500);
							reject();
						}
					});
				});
			},
			//返回顶部
			backTop() {
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
	}
};
</script>

<style scoped lang="scss">
.scroll-content {
	width: 100%;
	background-size: 100% auto !important;
	.header {
		padding-top: 80rpx;
		box-sizing: content-box;
	}
}

.header-img {
	margin: 26rpx 26rpx 0 26rpx;
}
.swiperBox {
	height: 456rpx;
}
.applet-template-container {
	// margin-top: 20rpx;
}
.product-container {
	padding: 0 24rpx 24rpx;
	margin-bottom: 200rpx;
	.product {
		margin-bottom: 24rpx;
		display: flex;
		flex-direction: column;
		max-width: 344rpx;
		align-items: center;
		background-color: #fff;
		overflow: hidden;
		position: relative;
		border-radius: 16rpx;

		.product-image {
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
}

.goods-list-box {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.empty-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 40%;
	.empty-image {
		width: 360rpx;
		height: 360rpx;
	}
	.empty-text {
		font-weight: 500;
		font-size: 30rpx;
		color: #999;
		margin-top: 20rpx;
		line-height: 42rpx;
	}
}

.share-page-icon {
	z-index: 999;
	position: fixed;
	right: 0;
	bottom: 160rpx;
	width: 128rpx;
	height: 128rpx;
	background: transparent;
	padding: 0;
	outline: 0;
	border: 0;
	&::after {
		border: 0;
	}
	.share-page-img {
		width: 100%;
		height: 100%;
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

.hot-shop {
	display: flex;
	.hot-shop-left,
	.hot-shop-right {
		flex: 1;
	}
	.hot-shop-price {
		color: #fd302c;
		margin-bottom: 2rpx;
		font-size: 24rpx;
		font-weight: 600;
		display: flex;
		align-items: flex-end;
		.light {
			font-size: 36rpx;
			font-weight: 600;
			color: #fd302c;
			line-height: 30rpx;
		}
		.light-float {
			font-size: 28rpx;
			line-height: 30rpx;
		}
		.del {
			font-weight: 400;
			font-size: 20rpx;
			margin-left: 8rpx;
			line-height: 28rpx;
			color: #666;
			text-decoration: line-through;
		}
	}

	.hot-shop-left {
		margin-right: 14rpx;
		height: 538rpx;
		.hot-shop-left-info {
			background-color: #fff;
			padding: 16rpx 16rpx 12rpx 16rpx;
			position: relative;
			border-radius: 0 0 16rpx 16rpx;
			height: 194rpx;
			box-sizing: border-box;
			.hot-shop-left-flex {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.hot-shop-left-share-button {
					width: 120rpx;
					height: 40rpx;
					background: #fd302c;
					border-radius: 8rpx;
					text-align: center;
					line-height: 40rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #fff;
					font-weight: 500;
				}
			}
			.hot-shop-left-name {
				height: 80rpx;
				margin-bottom: 34rpx;
				font-weight: 500;
				color: #000;
				line-height: 40rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
		}
	}
	.hot-shop-right {
		height: 538rpx;
		border-radius: 16rpx;
		background-color: #fff;
		width: 344rpx;
		position: relative;
		background-size: 100% 100%;
		.hot-shop-right-banner {
			width: 100%;
			height: 102rpx;
			display: block;
		}
		.hot-shop-right-title {
			position: absolute;
			left: 20rpx;
			top: 18rpx;
			font-weight: bold;
			line-height: 44rpx;
			color: #fff;
		}
		.hot-shop-right-content {
			margin-top: -22rpx;
			height: 458rpx;
			background: #fff;
			border-radius: 24rpx 24rpx 16rpx 16rpx;
			overflow: hidden;
			padding: 2rpx 20rpx 24rpx;
			.hot-shop-right-goods {
				margin-top: 44rpx;
				height: 100rpx;
				position: relative;
				display: flex;
				.hot-shop-right-top {
					width: 36rpx;
					height: 48rpx;
					position: absolute;
					left: -4rpx;
					top: -22rpx;
				}
				.hot-shop-right-goods-img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 4rpx;
					margin-right: 8rpx;
				}
				.hot-shop-right-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					.hot-shop-right-column {
						margin-top: 8rpx;
						display: inline-flex;
						justify-content: space-between;
						.hot-shop-right-buy {
							width: 104rpx;
							height: 32rpx;
							background: #fd302c;
							border-radius: 8rpx;
							text-align: center;
							line-height: 32rpx;
							color: #fff;
							font-size: 20rpx;
						}
					}
				}
			}
		}
	}
}
.well-goods {
	margin: 40rpx 0 10rpx;
	text-align: center;
}
/**
* 头部导航栏搜索框样式
*/
.nav-search-bar-wrap {
	width: 100%;
	height: 40px;
	line-height: 40px;
	box-sizing: border-box;
	padding-top: 6px;
	padding-left: 12px;
}

.nav-search-bar-wrap .nav-search-bar {
	height: 32px;
	line-height: 32px;
	background-color: #ededed;
	border-radius: 16px;
	position: relative;
}

.nav-search-form-icon {
	position: absolute;
	top: 6rpx;
	left: 22rpx;
	width: 48rpx;
	height: 48rpx;
	background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic-search.png') no-repeat center center;
	background-size: 32rpx 32rpx;
}

.nav-search-form-value {
	text-align: left;
	padding-left: 40px;
	color: #999999;
	font-size: 14px;
}

.search-bar {
	display: flex;
	align-items: center;
	position: fixed;
	z-index: 100;
	left: 24rpx;
	right: 24rpx;
	top: 30rpx;
	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 24rpx 0 20rpx;
		height: 64rpx;
		border-radius: 32rpx;
		background: #fff;
		z-index: 99;

		.search-icon {
			width: 32rpx;
			height: 32rpx;
			display: block;
			margin-right: 16rpx;
		}

		.input {
			flex: 1;
			height: 64rpx;
			background-color: #fff;
			border: 0;
			color: #999999;
			font-size: 24rpx;
		}
		.search-tips {
			background: #fff;
			font-size: 24rpx;
			color: #333333;
			font-weight: 600;

			&::before {
				content: '';
				height: 15px;
				margin: 0 14rpx;
				border: 1px solid #999999;
			}
		}
	}

	.message-box {
		position: relative;
		.message-icon {
			display: block;
			width: 48rpx;
			height: 48rpx;
			margin-left: 20rpx;
		}
	}
}
.back-top {
	width: 80rpx;
	height: 80rpx;
	position: fixed;
	right: 24rpx;
	bottom: 186rpx;
}
</style>
