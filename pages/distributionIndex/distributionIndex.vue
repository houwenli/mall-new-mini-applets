<template>
	<view class="page">
		<view class="scroll-content" :style="[bgStyle]">
			<view class="header" :style="{ height: headerIconHeight + searchBarPaddingTop + 'px'}">

			<distribution-header
				 ref="distributionHeader"
				:headerBg="headerBg"
				:bgType="bgType"
				:headerType="headerType"
				@search="navigationTo('Search',{fromPage:'distributionIndex'})">
			</distribution-header>


			</view>
			<view>
				<view class="applet-template-container">
					<!-- <applet-template :floors="getFloors" :isDistribution="isDistributionTemplate" :timestamp="timestamp" :pageNavData="pageNavData" :hasPower="hasPower"></applet-template> -->
					<applet-template :isDistribution="isDistributionTemplate" :timestamp="timestamp" :floors="getFloors" :storeid="storeId" :hasPower="hasPower" :seckill-data="seckillData">
					</applet-template>
				</view>

				<!-- 商品列表 -->
				<more-list ref="moreList" :goodsList="goodsList" @goDetail="goDetail" @handleShareProduct="handleShareProduct" @handleSharePage="handleSharePage"></more-list>
			</view>
		</view>

		<!-- <view class="product-container safe-area-inset-bottom">
			<template v-if="goodsList && goodsList.length">
				<view class="hot-shop">
					<view class="hot-shop-left" @tap="goDetail(goodsList[0])">
						<view class="hot-shop-left-image">
							<u-image height="344rpx" width="100%"
								loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/504"
								border-radius="10rpx" :src="goodsList[0].productUrl + '?imageView2/1/w/504'"></u-image>
						</view>
						<view class="hot-shop-left-info">
							<view class="hot-shop-left-name">{{ goodsList[0].skuName }}</view>
							<view class="hot-shop-price">
								￥
								<text class="light">{{ goodsList[0].showFinalPrice }}</text>
								<text class="del"
									v-if="goodsList[0].finalPrice < goodsList[0].price">{{ goodsList[0].showPrice }}</text>
							</view>
							<view class="hot-shop-mark">赚 {{ '￥' + goodsList[0].preCommission }}</view>
							<view class="hot-shop-left-share-button" @tap.stop="handleShareProduct(goodsList[0])">分享
							</view>
						</view>
					</view>
				</view>
				<view class="well-goods">
					<image
              style="height: 30rpx; width: 136rpx"
              :src="ossUrl + 'wsf-mall/home/search-for-recommand-pic-new.png'"
							mode="heightFix"
            ></image>
				</view>
				<view class="goods-list-box">
					<block v-for="(item, index) in goodsList" :key="index">
						<view class="product">
							<view class="product-box" @tap="goDetail(item)">
								<view class="product-image">
									<u-image height="344rpx" width="344rpx"
										loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/504"
										border-radius="10rpx" :src="item.productUrl + '?imageView2/1/w/504'"></u-image>
								</view>
								<view class="product-info">
									<view class="product-name u-line-2">{{ item.skuName }}</view>
									<view class="product-price">
										￥
										<text class="light">{{ item.showFinalPrice }}</text>
										<text class="del" v-if="item.finalPrice < item.price">￥{{ item.showPrice }}</text>
									</view>
									<text class="product-mark">赚 {{ '￥' + item.preCommission }}</text>
								</view>
							</view>
							<view class="share-button" @tap.stop="handleShareProduct(item)">分享</view>
						</view>
					</block>
				</view>
				<u-loadmore ref="backTop" margin-top="40" margin-bottom="40" :loadText="loadText" :status="loadStatus"
					bg-color="#f5f5f5"></u-loadmore>
				<view style="height: 140rpx"></view>
			</template>
			<view class="empty-page" v-else>
				<image class="empty-image" :src="emptyImg"></image>
				<text class="empty-text">暂无商品</text>
			</view>
		</view> -->

		<!-- <button class="share-page-icon" @tap="handleSharePage()">
			<image class="share-page-img" :src="ossUrl + 'wsf-mall/distribution/ic_WeChat.png'" />
		</button> -->

		<image v-if="showReturnTop" class="back-top" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png"
			@tap="backTop()" />

		<image v-if="!showFooter" class="to-order-top" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/to_order.png" @tap="navigationTo('DistributionOrder')" />

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
		<wsfTabBar v-if="showFooter" :selected="1"></wsfTabBar>
	</view>
</template>

<script>
	// import {
	// 	priceFilter
	// } from '@/common/wsfFilter.js';
	import wsfTabBar from '@/components/wsf-tab-bar/wsf-tab-bar.vue';
	// import appletTemplate from "@/components/applet-template/distribution-applet-template.vue";
	import appletTemplate from "@/components/applet-template/distribution-applet-template.vue";
	import distributionHeader from '@/components/distribution/header.vue';
	import moreList from '@/components/distribution/moreList.vue';

	import { genNewLink } from './data'

	export default {
		components: {
			wsfTabBar,
			appletTemplate,
			distributionHeader,
			moreList
		},
		data() {
			const {windowWidth, capsule} = getApp().globalData;
			return {
				timestamp:{},
				showReturnTop: false,
				scrollTop: 0,
				ossUrl: this.$oss,
				hotRankIcon: {
					0: this.$oss + 'wsf-mall/activity/hot-first.png',
					1: this.$oss + 'wsf-mall/activity/hot-second.png',
					2: this.$oss + 'wsf-mall/activity/hot-third.png'
				},
				showShareModal: false,
				emptyImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/bf7051fe79eb0e831298a985302ccff1.png',
				tabIndex: 0,
				tabList: [{
						name: '商品列表'
					},
					{
						name: '分销订单'
					}
				],
				// 搜索的参数
				// searchParam: {
				// 	pageNum: 0, // 当前页码
				// 	pageSize: 10 // 每页显示记录数
				// },
				// goodsList: [], // 分销商品列表
				orderList: [],
				// loadStatus: 'loadmore', // 加载更多样式效果
				// isLoading: false, // 是否正在加载
				// hasMore: true, // 是否拥有更多
				// priceFilter,
				// loadText: {
				// 	loadmore: '',
				// 	loading: '努力加载中',
				// 	nomore: '我也是有底线的~'
				// },
				// shareParams: {
				// 	name: '',
				// 	image: '',
				// 	shareType: '',
				// 	distributionCode: ''
				// },
				promoteInfo: {
					promoteId: '',
					promoteType: '',
					phone: ''
				}, //推广员信息
				showStatusDict: {
					0: '已失效',
					1: '等待收货',
					2: '已收货',
					3: '已结束',
					4: '部分退货',
					5: '已退货'
				},
				choseProduct: null,
				showSearchBar: false, // 是否显示头部导航栏
				topSwiperAutoplay: true,
				currentSwiper: 0,
				messageCount: 0, // 消息总数
				bgColor: "",
				isDistribution: 1 ,// 1：分销商品
				isDistributionTemplate:true,
				// searchBarPaddingTop:statusBarHeight+"px" ,
				searchBarPaddingTop: capsule.top,
				headerIconHeight: capsule.height,
				swiperBoxHeight:windowWidth*0.608+"px",

				showFooter: false
			};
		},
		computed: {
			// 模板数据
			getFloors() {
        		let list = this.$u.deepClone(this.$store.getters["SETTINGS/distributionWsfFloors"] || []);
				// console.log(list, '------------11------------')
				// list.map(item => {
				// 	if (item.list && item.list.length > 0) {
				// 		item.list.forEach(ele => {
				// 			if (ele.link && ele.link.indexOf('cateId=') > -1) {
				// 				let url = ele.link.split('~')[1] || ele.link
				// 				ele.link = url + '&fromPage=distributionIndex'
				// 			}
				// 		});
				// 	}
				// 	return item
				// })
				// 2023-03-29 产品张晗毓 要求关闭金刚区展示
				// let newLIst = list.filter(item => item.text != '金刚区')
				genNewLink(list)
				return list;
			},
			// 浮动数据
			// floatBtnData() {
			// 	return this.$store.getters["SETTINGS/distributionFloatBtnData"];
			// },
			// 背景图数据
			headerData() {
				return this.$store.getters["SETTINGS/distributionHeaderData"];
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
			// 头部样式
			headerType() {
				return this.showFooter ? 1 : 2
			},
		},
		// watch: {
		// 	headerData: {
		// 		handler(newVal,oldVal) {
		// 			this.currentSwiper = 0
		// 			this.bgColor =  newVal.slideshowImageList ? newVal.slideshowImageList[0].bgColor : '';
		// 		},
		// 		immediate: true,
		// 		deep: true
		// 	}
		// },
		onLoad(option) {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: 'rgba(30,30,30,0.6)',
			});
		},
		onShow() {
			this.showFooter = !!getApp().globalData.swichDistribution
			// this.getProductList();
			if (getApp().globalData.isTokenRefresh) {
				this.loadMessageCount();
			} else {
				this.loadMessageCount();
			}
			// 查询模板信息(分销页面配置)
			this.$store.dispatch("SETTINGS/queryIndexTemplate",true);

			this.$refs.distributionHeader.getHotWordList()
		},

		onHide() {
			this.$refs.distributionHeader.swiperStop()
		},

		onPullDownRefresh() {
			this.$refs.moreList.reset()
		},
		onReachBottom() {
			this.$refs.moreList.getProductList()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			let showSearchBar = this.showSearchBar;
			if (this.scrollTop > 2500) {
				this.showReturnTop = true;
			} else {
				this.showReturnTop = false;
				if (e.scrollTop > 50 && !showSearchBar) {
					this.showSearchBar = true;
					this.bgColor = ''
				} else if (e.scrollTop < 50 && showSearchBar) {
					this.showSearchBar = false;
					// this.bgColor = this.headerData.slideshowImageList[this.currentSwiper].bgColor;
				} else {
					return;
				}
			}
		},
		onShareAppMessage(options) {
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
			// reset() {
			// 	this.loadStatus = 'loadmore';
			// 	this.hasMore = true;
			// 	this.searchParam = {
			// 		pageNum: 0,
			// 		pageSize: 10
			// 	};
			// 	this.goodsList = [];
			// 	this.getProductList();
			// },
			// // 获取分销商品列表数据
			// getProductList() {
			// 	if (this.isLoading || !this.hasMore) return;
			// 	this.isLoading = true;
			// 	this.loadStatus = 'loading';
			// 	this.$u.api.QueryDistributionSpuList(this.searchParam).then(res => {
			// 		this.isLoading = false;
			// 		uni.stopPullDownRefresh();
			// 		if (res.code === 200) {
			// 			// console.log(res)
			// 			this.goodsList = this.goodsList.concat(
			// 				res.data.list.map(item => {
			// 					item.preCommission = this.priceFilter(item.preCommission);
			// 					item.showFinalPrice = this.priceFilter(item.finalPrice);
			// 					item.showPrice = this.priceFilter(item.price);
			// 					return item;
			// 				})
			// 			);
			// 			console.log(this.goodsList);
			// 			this.searchParam.pageNum++;
			// 			this.hasMore = res.data.list.length === 10;
			// 			this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
			// 		}
			// 	});
			// },
			goDetail(e) {
				this.$wsf.go('distributionSkuDetail', {
					skuId: e.skuId
				});
			},
			handleShareProduct(e) {
				this.checkPermission().then(isPass => {
					console.log(isPass, 'isPass');
					if (!isPass) return;
					this.shareParams = {
						name: `¥${e.finalPrice.toFixed(2)} | ${e.skuName}`,
						image: e.shareImage ? e.shareImage : e.productUrl,
						shareType: 'product',
						skuId: e.skuId
					};

					this.getShareCode(e.spuId);
					this.choseProduct = e;
					this.showShareModal = true;
				});
			},
			getShareCode(spuId){
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
			navigateMiniProgram() {
				uni.navigateToMiniProgram({
					appId: 'wx0d1811ba25b5aeab',
					path: 'pages/index/index',
					envVersion: __wxConfig.envVersion
				});
			},
			handleSharePage() {
				this.checkPermission().then(isPass => {
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
					params = {
						scene: `n=${this.choseProduct.skuNo}&c=${this.shareParams.distributionCode}`,
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
			//返回顶部
			backTop() {
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
			getSwiperCurrent(e) {
				let {
					current,
					source
				} = e.detail
				if (source === 'autoplay' || source === 'touch') {
					this.currentSwiper = current
					if (this.scrollTop < 50) {
						this.bgColor = this.headerData.slideshowImageList[current].bgColor;
					}
				}
			},

			/* 点击swiper */
			clickSwiperCurrent(link) {
				console.log(link, "link");
				if (!link) {
					return;
				} else {
					let jumpLink = link.split('~')[1]
					if (jumpLink == "distributionModule/pages/distributionIndex/distributionIndex") {
						let isLogin = getApp().globalData.isLink;
						if (isLogin) {
							this.$wsf.go('distributionIndex')
						} else {
							this.$wsf.go('QuickLogin', {
								cartRoute: 'pages/index/index'
							})
						}
					} else {
						this.$wsf.go(jumpLink);
					}
				}
			},
			/* 获取消息总数 */
			loadMessageCount() {
				if (!getApp().globalData.isLink) {
					this.messageCount = 0;
					return;
				}
				this.$u.api.queryNewsReadNums().then((res) => {
					if (res.code == 200) {
						let num = 0;
						res.data.filter((ele) => {
							if (ele.receiverType == 2) {
								num += ele.count;
							}
						});
						this.messageCount = num;
					}
				});
			},
			/* 跳转 */
			navigationTo(sceneName, params) {
				this.$wsf.go(sceneName, params);
			}
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

	// .applet-template-container {
	// 	margin-top: 20rpx;
	// }

	.back-top {
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		right: 24rpx;
		bottom: 186rpx;
	}

	.to-order-top {
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		right: 24rpx;
		bottom: 394rpx;
	}





	.share-page-icon {
		z-index: 999;
		position: fixed;
		right: 12rpx;
		bottom: 270rpx;
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

		.hot-shop-mark {
			font-size: 20rpx;
			font-weight: 400;
			color: #fd302c;
			padding: 0 8rpx;
			border-radius: 4rpx;
			background: #ffecef;
			line-height: 28rpx;
			display: inline-block;
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

				.hot-shop-left-share-button {
					position: absolute;
					bottom: 12rpx;
					right: 16rpx;
					width: 72rpx;
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

				.hot-shop-left-name {
					height: 80rpx;
					margin-bottom: 20rpx;
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

							.hot-shop-right-share {
								width: 54rpx;
								height: 28rpx;
								background: #fd302c;
								border-radius: 4rpx;
								text-align: center;
								line-height: 28rpx;
								color: #fff;
								font-size: 20rpx;
								overflow: hidden;
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
		top: 12rpx;
		left: 24rpx;
		right: 24rpx;
		width: 500rpx;
		padding-top: 88rpx;
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
</style>
