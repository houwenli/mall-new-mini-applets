<template>
	<view class="store-container" :class="{paddingTop:!isMy}" v-if="!isClose" @tap.capture="isShow = false">
		<view class="store-header" :class="{ moveDown: showTitle, moveUp: !showTitle }" v-if="!isMy">
			<view class="store-search" >
				<view class="search-input">
					<i class="search"></i>
					<input v-model="queryForm.spuName" type="text" placeholder="请输入搜索关键字" @click="navigationTo('Search',{fromPage:'storeIndex',storeId,agencyStoreId:storeInfo.id})"/>
					<image v-show="queryForm.spuName && queryForm.spuName.length > 0" class="clear"
						src="/static/img/clear2.png" @tap="handleClearSearch(true)" />
				</view>
				<i class="more" @click="showTab"></i>
				<view class="mui-global-nav" v-if="isShow">
					<view class="mui-global-nav-arr"></view>
					<view class="ul">
						<view @click="toIndex" class="li">
							<view class="li_a mui-global-nav-tab-home">首页</view>
						</view>
						<!-- <view @click="toStoreIndex" class="li"><view class="li_a mui-global-nav-tab-shop">店铺首页</view></view>
						<view @click="toStoreCategory" class="li"><view class="li_a mui-global-nav-tab-class">店铺分类</view></view>
						<view @click="allSpu" class="li"><view class="li_a mui-global-nav-tab-goods">全部商品</view></view> -->
						<!-- <button open-type="contact" class="li" session-from="weapp"><view class="li_a mui-global-nav-tab-service">联系客服</view></button> -->
						<button @click="serviceTel({ isproduct: 'isproduct' })" class="li">
							<view class="li_a mui-global-nav-tab-service">联系客服</view>
						</button>
					</view>
				</view>
			</view>
		</view>
		<view class="storeInfo">
			<view class="top">
				<view class="left">
					<image class="headImg" v-if="storeInfo.imageUrl" :src="storeInfo.imageUrl"></image>
					<image class="headImg" v-else src="https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaOrgWebManager/5/1672105155880_koUFV.png"></image>
					<view class="storeName ellipsis2">{{ storeInfo.storeName }}</view>
				</view>
				<view v-if="isMy" class="right">
					<text>粉丝数：</text>
					<text>{{ storeInfo.fans || 0 }}</text>
				</view>
				<view v-else>
					<view class="store-like" :class="{
		          'is-active': !hasAttention,
		        }" @click="attentionStore">
						<u-icon v-if="!hasAttention" class="add-icon" name="plus"></u-icon>
						<span>{{ hasAttention ? "取消" : "" }}订阅</span>
					</view>
				</view>
			</view>
			<view class="describe">
				{{ storeInfo.storeDescription || "" }}
			</view>
		</view>
		<!-- 筛选过滤商品 -->
		<view class="result-sort">
			<block v-for="(item, index) in filterBoxList" :key="index">
				<view class="wbox-flex" :class="{ cur: filterItemIndex === index }"
					@click="filterChoose(item, index)">
					{{ item.filterBoxName }}
					<view class="sort-type" v-if="item.hasSort">
						<image v-if="filterItemIndex === index && priceSort === 1"
							style="height: 10rpx; width: 14rpx" src="@/static/img/sort_up_select@2x.png" alt="" />
						<image v-else style="height: 10rpx; width: 14rpx" src="@/static/img/sort_up@2x.png"
							alt="" />
						<image v-if="filterItemIndex === index && priceSort === 0"
							style="height: 10rpx; width: 14rpx; margin-top: 1px"
							src="@/static/img/sort_down_select@2x.png" alt="" />
						<image v-else style="height: 10rpx; width: 14rpx; margin-top: 2rpx"
							src="@/static/img/sort_down@2x.png" alt="" />
					</view>
				</view>
			</block>
		</view>
		<view class="shop_container" style="margin-top: -2rpx">
			<!-- <view class="result-sort">
				<template v-for="(item, index) in filterBoxList">
					<view class="wbox-flex" :key="index" :class="{ cur: filterItemIndex === index }"
						@click="filterChoose(item, index)">
						{{ item.filterBoxName }}
						<view class="sort-type" v-if="item.hasSort">
							<image v-if="filterItemIndex === index && priceSort === 1"
								style="height: 10rpx; width: 14rpx" src="@/static/img/sort_up_select@2x.png" alt="" />
							<image v-else style="height: 10rpx; width: 14rpx" src="@/static/img/sort_up@2x.png"
								alt="" />
							<image v-if="filterItemIndex === index && priceSort === 0"
								style="height: 10rpx; width: 14rpx; margin-top: 1px"
								src="@/static/img/sort_down_select@2x.png" alt="" />
							<image v-else style="height: 10rpx; width: 14rpx; margin-top: 2rpx"
								src="@/static/img/sort_down@2x.png" alt="" />
						</view>
					</view>
				</template>
				<view class="wbox-flex" :class="{ cur: filterGoods }" @click="onlyGoods()">仅看有货</view>
			</view> -->

			<wsf-goods-list ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)">
			</wsf-goods-list>
		</view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="100">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
		<button class="share-page-icon" @tap="handleSharePage()">
			<image class="share-page-img" :src="ossUrl + 'wsf-mall/distribution/ic_WeChat.png'" />
		</button>
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
		<u-popup v-model="showUnFocusPopup" mode="bottom" border-radius="20" :mask-close-able="false" :closeable="true">
			<view class="showUnFocus">
				<view class="subscribe">
					订阅管理
				</view>
				<view class="cancel" @click="cancelFocusStore">
					<image src="@/static/img/store/dingyue.png" mode=""></image>
					<text>取消订阅</text>
				</view>
				<view class="cancelBtn" @click="showUnFocusPopup=false">
					取消
				</view>
			</view>
		</u-popup>
	</view>

	<view v-else class="store-container store-empty">
		<image :src="storeEmptyImg" class="store-empty-img"></image>
		<view class="store-empty-text">店铺不存在或已关闭</view>
	</view>
</template>

<script>
	const app = getApp();
	import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
	import {
		priceFilter
	} from '@/common/wsfFilter.js';
	import {
		visit
	} from '@/common/visit.js';
	export default {
		components: {
			wsfGoodsList
		},
		data() {
			return {
				ossUrl: this.$oss,
				isClose: false,
				storeEmptyImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ef2d4ffb0cd22ba651cdcbb224791894.png',
				starNum: 5,
				flowList: [], // 瀑布流商品列表
				loadStatus: 'loadmore', // 加载更多样式效果
				isLoading: false, // 是否正在加载
				hasMore: true, // 是否拥有更多
				queryForm: {
					// storeId: '',
					// pageNum: 0,
					// pageSize: 10,
					// onlyQueryNewSpu: 0, //是否只查新品
					// stockFilter: -1
					storeId: '',    //店铺id
					spuName: '',
					sort: 1,
					pageNum: 1,  // 当前页码
					pageSize: 10, // 每页显示记录数
				},
				documentScrollTop: 0,
				storeId: '',
				storeName: '',
				isShow: false,
				// storeInfo: {},
				isMy: false, // 是否是自己的店
				hasAttention: false, // 是否关注店铺
				storeInfo: {}, // 店铺信息 -->
				// searchParams: {
				// 	storeId: "", //店铺id
				// 	spuName: "", //商品名称
				// 	sort: 1, // 排序
				// 	pageNum: 1,
				// 	pageSize: 10,
				// },
				showTitle: false,
				tabIndex: 0,
				// tabList: [{
				// 		id: 0,
				// 		name: '商品'
				// 	},
				// 	{
				// 		id: 1,
				// 		name: '新品'
				// 	},
				// 	{}
				// 	// {
				// 	// 	id: 2,
				// 	// 	name: '活动'
				// 	// }
				// ],
				scrollTop: 0,

				filterBoxList: [{
						filterBoxName: '综合',
						hasSort: false,
					},
					{
						filterBoxName: '价格',
						hasSort: true
					},
					{
						filterBoxName: '仅看有货',
						hasSort: false
					}
				], // 筛选条件列表
				filterItemIndex: 0, // 过滤的item
				priceSort: -1, // 综合过滤 0 综合过滤 1 价格从低到高 2 价格从高到低

				filterGoods: false,
				showUnFocusPopup:false,
				showShareModal:false,  //分享弹窗
				shareParams: { //分享参数
					name: "",
					image: "",
					shareType: "",
					distributionCode: "",
				},
			};
		},
		onLoad(option) {
			console.log("option--店铺页面--",option);
			let storeId
			if (option && option.storeId) {
				storeId = option.storeId;
			} else if (option && option.scene) {
				let scene = decodeURIComponent(option.scene);
				console.log(scene, "scene");
				if (scene.indexOf("storeId") != -1) {
					storeId = scene.split("storeId=")[1];
					console.log("this.storeId--店铺id--",storeId);
				}
			}
			if (!storeId) {
				storeId = getApp().globalData.storeId
			}
			this.isMy = option.type == 1;
			this.storeId = storeId;
			this.queryForm.storeId = storeId;
			if(option.queryString){
				// 搜索回来后查询需要搜索的店铺商品
				this.queryForm.spuName= option.queryString
			}

		},
		onShow() {
			console.log('onShow------',this.queryForm)
			this.queryForm.pageNum = 1;
			this.flowList = [];
			this.hasMore = true;

			this.shopListData();
			this.queryStoreInfo();
			visit(this, '店铺主页', {
				storeId: this.storeId
			});
		},
		onPageScroll(e) {
			let that = this;
			let scrollTop = e.scrollTop;
			let showTitle = false;
			if (scrollTop > 120) {
				if (scrollTop > that.documentScrollTop) {
					showTitle = true;
				} else {
					showTitle = false;
				}
			} else {
				showTitle = false;
			}
			if (showTitle != that.showTitle) {
				this.showTitle = showTitle;
			}

			this.documentScrollTop = scrollTop;
			this.scrollTop = scrollTop;
		},
		//滚动到底部触发事件
		onReachBottom() {
			this.shopListData();
		},
		// 分享配置
		onShareAppMessage(options) {
			// console.log(options)
			// 来自页面内分享按钮
			this.showShareModal = false;

			let	url = `productModule/pages/store/storeIndex?storeId=${this.queryForm.storeId}&type=0`
			return {
				title: this.shareParams.name,
				imageUrl: this.shareParams.image,
				path: url
			};
		},
		methods: {
			navigateTo(sceneName, params) {
				// this.$wsf.go('Login')
				this.$wsf.go(sceneName, params);
			},
			showToastError(errMsg, duration = 1500) {
				uni.showToast({
					title: errMsg,
					icon: 'none',
					mask: true,
					duration: duration
				});
			},
			toSearch() {
				this.navigateTo('Search', {
					storeId: this.storeInfo.id,
					from: 'storeIndex',
					storeInfo: {
						storeName: this.storeInfo.storeName,
						followNum: this.storeInfo.followNum,
						aveScore: this.storeInfo.aveScore,
						id: this.storeInfo.id
					}
				});
			},
			handleClearSearch(isClear) {
				if (isClear) this.queryForm.spuName = '';
				this.queryForm.pageNum = 1;
				this.hasMore = true;
				this.flowList = [];
				this.shopListData()
			},
			handleSharePage() {
				this.shareParams = {
					name: "发现一个宝藏店铺，\r\n快来看看~",
					image: this.$oss + "wsf-mall/distribution/bg_distribution.png",
					shareType: "page",
				};
				this.showShareModal = true;
			},
			getPost() {
				let params = {
					scene: `storeId=${this.queryForm.storeId}`,
					page: "productModule/pages/store/storeIndex",
					width: 60,
					autoColor: false,
					lineColor: "",
					isHyaline: false,
				};
				this.$u.api.StoreCode(params).then((res) => {
					console.log('StoreCode-----', res);
					this.showShareModal = false;
					let posterImg = res.data;

					uni.downloadFile({
						url: posterImg,
						success: (res) => {
							console.log("---wx.downloadFil--成功--", res);
							uni.showShareImageMenu({
								path: res.tempFilePath,
								success: (res) => {
									if (res.errMsg == "showShareImageMenu:ok") {
										this.$u.toast("保存成功！");
									}
								},
								fail: (res) => {
									console.log(res);
									if (res.errMsg ==
										"showShareImageMenu:fail auth deny") {
										this.$u.toast("保存失败！");
									}
								},
							});
						},
					});
				});
			},
			// queryStoreInfo() {
			// 	let that = this;
			// 	let data =  this.storeId
			// 	this.$u.api.QueryAgencyStore(data).then(res => {
			// 		this.storeInfo = res.data;
			// 		if (this.storeInfo.status == 4) {
			// 			this.isClose = true;
			// 			uni.setNavigationBarTitle({
			// 				title: '店铺首页'
			// 			});
			// 		} else {
			// 			this.isClose = false;
			// 			let options = {},
			// 			storeServiceConfig = that.storeInfo.storeServiceConfig;
			// 			let obj = '';
			// 			if(storeServiceConfig) {
			// 				Object.keys(storeServiceConfig).forEach(key => {
			// 					if (storeServiceConfig[key]) {
			// 						if (key == 'staffId') {
			// 							options.staffid = storeServiceConfig[key];
			// 						} else {
			// 							options[key] = storeServiceConfig[key];
			// 						}
			// 					}
			// 				});
			// 				let ysfData = {
			// 					...options
			// 				};
			// 				obj = JSON.stringify(ysfData);
			// 			}
			// 			uni.setStorageSync('YSFDATA', obj);
			// 			uni.setNavigationBarTitle({
			// 				title: res.data.storeName
			// 			});
			// 		}
			// 	});
			// },
			// 查询店铺信息
			queryStoreInfo() {
				let storeId = this.storeId
				this.$u.api.QueryAgencyStore(storeId).then((res) => {
					this.storeInfo = res.data;
					console.log("店铺信息", this.storeInfo);
					if (this.storeInfo.status == 4) {
						this.isClose = true;
						uni.setNavigationBarTitle({
							title: this.isMy ? '我的小店' : "店铺首页",
						});
					} else {
						this.isClose = false;
						if (!this.isMy) {
							// 查询关注状态
							this.isFocusStore()
						}
						let options = {},
							storeServiceConfig = this.storeInfo.storeServiceConfig;
						let obj = "";
						if (storeServiceConfig) {
							Object.keys(storeServiceConfig).forEach((key) => {
								if (storeServiceConfig[key]) {
									if (key == "staffId") {
										options.staffid = storeServiceConfig[key];
									} else {
										options[key] = storeServiceConfig[key];
									}
								}
							});
							let ysfData = {
								...options,
							};
							obj = JSON.stringify(ysfData);
						}
						uni.setStorageSync("YSFDATA", obj);
						uni.setNavigationBarTitle({
							title: this.isMy ? '我的小店' : res.data.storeName,
						});
					}
				});
			},
			showTab() {
				this.isShow = !this.isShow;
				console.log(this.isShow, 'this.isHide');
			},
			//关注/取关店铺
			// attentionStore() {
			// 	// if (!app.globalData.isLink) {
			// 	// 	this.navigateTo('QuickLogin');
			// 	// 	return;
			// 	// }
			// 	if (this.storeInfo.hasAttention) {
			// 		let data = {
			// 			storeId: this.storeId
			// 		};
			// 		this.$u.api.CancelStoreAttention(data).then(res => {
			// 			if (res.code == 200) {
			// 				this.storeInfo.hasAttention = 0;
			// 				this.showToastError('取关成功');
			// 			}
			// 		});
			// 	} else {
			// 		let data = {
			// 			storeId: this.storeId
			// 		};
			// 		this.$u.api.AddStoreAttention(data).then(res => {
			// 			if (res.code == 200) {
			// 				this.storeInfo.hasAttention = 1;
			// 				this.showToastError('关注成功');
			// 			}
			// 		});
			// 	}
			// },
			//关注/取关店铺
			attentionStore() {
				let data = {
					storeId: this.queryForm.storeId,
				};
				if (this.hasAttention) {
					this.showUnFocusPopup = true

				} else {
					this.$u.api.FocusStore(data).then((res) => {
						if (res.code == 200) {
							this.hasAttention = true;
							this.showToastError("订阅成功");
						}
					});
				}
			},
			// 取消订阅
			cancelFocusStore(){
				let data = {
					storeId: this.queryForm.storeId,
				};
				this.$u.api.UnFocusStore(data).then((res) => {
					if (res.code == 200) {
						this.hasAttention = false;
						this.showToastError("已取消订阅");
					}

				});
				this.showUnFocusPopup = false
			},
			// 是否关注店铺
			isFocusStore() {
				this.$u.api.FocusStoreState({
					storeId: this.queryForm.storeId
				}).then((res) => {
					if (res.code == 200) {
						this.hasAttention = res.data == 0;
					}
				});
			},
			toIndex: () => {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			//进入店铺
			toStoreIndex() {
				this.navigateTo('StoreIndex', {
					storeName: this.storeInfo.storeName,
					storeId: this.storeInfo.id
				});
			},
			//进入店铺分类
			// toStoreCategory() {
			// 	this.navigateTo('StoreCategory', {
			// 		storeName: this.storeInfo.storeName,
			// 		followNum: this.storeInfo.followNum,
			// 		aveScore: this.storeInfo.aveScore,
			// 		storeId: this.storeInfo.id
			// 	});
			// },
			// 进入店铺全部商品
			// allSpu() {
			// 	this.navigateTo('SpuList', {
			// 		storeId: this.storeInfo.id,
			// 		from: 'storeIndex',
			// 		storeInfo: {
			// 			storeName: this.storeInfo.storeName,
			// 			followNum: this.storeInfo.followNum,
			// 			aveScore: this.storeInfo.aveScore,
			// 			id: this.storeInfo.id
			// 		}
			// 	});
			// },
			// 切换分类
			// changeTab(id) {
			// 	this.tabIndex = id;
			// 	this.queryForm.pageNum = 1;
			// 	this.queryForm.onlyQueryNewSpu = id;
			// 	this.hasMore = true;
			// 	this.flowList = [];
			// 	// this.$refs.goodslist.clearList();

			// 	this.filterItemIndex = 0;
			// 	this.priceSort = -1;
			// 	this.filterGoods = false;
			// 	this.queryForm.stockFilter = -1;

			// 	this.shopListData();
			// },

			goodsClick(e) {
				let param = e.id;
				if (!param) {
					this.showToastError('缺少参数');
				}
				// this.navigateTo('SkuDetail', {
				// 	skuId: param,
				// 	agencyStoreId: this.storeInfo.id
				// });

				if(e.goodsSource == 4){
					this.$wsf.go('ToMotor',{skuId: e.id, idNumber: this.queryForm.storeId, agencyStoreId: this.storeInfo.id});
				} else {
					this.navigateTo('SkuDetail', {
						skuId: param,
						agencyStoreId: this.storeInfo.id
					});
				}
			},

			shopListData() {
				console.log("进入了商品列表方法--",this.isLoading,!this.hasMore)
				let that = this;
				if (this.isLoading || !this.hasMore) return;
				this.isLoading = true;
				this.loadStatus = 'loading';
				this.$u.api.PageAgencyStore(this.queryForm).then(res => {
					this.isLoading = false;
					this.loadStatus = 'loadmore';
					console.log('店铺商品列表-----', res);
					if (res.code === 200) {
						let list = res.data.list
						list.forEach(item => {
							item.finalPrice = item.price
							item.name = item.spuName
							item.skuLable = {
								baseLable: null,
								couponLable: null
							}
						})
						this.flowList = this.flowList.concat(list);
						console.log(this.flowList, 'this.flowList');
						this.queryForm.pageNum++;
						this.hasMore = res.data.list.length === 10;
						this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
					}
				});
			},
			// 筛选排序
			filterChoose(item, index) {
				this.flowList = [];
				this.queryForm.pageNum = 1;
				if (!this.hasMore) {
					this.hasMore = true;
				}
				if (this.filterItemIndex === index) {
					this.priceSort = this.priceSort == 1 ? 0 : 1;
				} else {
					this.filterItemIndex = index;
					this.priceSort = 0;
				}
				if (item.filterBoxName == '综合') {
					this.priceSort = -1;
				}

				if (this.filterItemIndex == 0) {
					this.queryForm.sort = 1;
				} else if (this.filterItemIndex == 1 && this.priceSort == 1) {
					this.queryForm.sort = 2;
				} else if (this.filterItemIndex == 1 && this.priceSort == 0) {
					this.queryForm.sort = 3;
				} else if (this.filterItemIndex == 2) {
					this.queryForm.sort = 4;
				}

				this.shopListData();
			},
			onlyGoods() {
				this.filterGoods = !this.filterGoods;
				if (this.filterGoods) {
					this.queryForm.stockFilter = 1;
				} else {
					this.queryForm.stockFilter = -1;
				}
				if (!this.hasMore) {
					this.hasMore = true;
				}
				this.flowList = [];
				this.queryForm.pageNum = 1;
				this.shopListData();
			},
			/* 跳转 */
			navigationTo(sceneName, params) {
				this.$wsf.go(sceneName, params);
			},
		}
	};
</script>

<style scoped lang="scss">
	@keyframes moveDown {
		from {
			transform: translate3d(0, 0, 0);
		}

		to {
			transform: translate3d(0, -125px, 0);
		}
	}

	@keyframes moveUp {
		from {
			transform: translate3d(0, -125px, 0);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}

	.clearfix:after {
		content: '';
		display: block;
		clear: both;
	}

	.store-empty {
		height: 100%;
		padding-top: 140rpx;

		.store-empty-img {
			height: 180rpx;
			width: 180rpx;
			margin: 0 auto;
			display: block;
		}

		.store-empty-text {
			font-size: 32rpx;
			margin-top: 12rpx;
			color: #666;
			line-height: 36rpx;
			text-align: center;
		}
	}
	.paddingTop{
		padding-top: 90rpx;
	}
	.store-container {
		background: #f5f5f5;
		height: 100%;
		.moveDown {
			transform: translate3d(0, -250rpx, 0);
			animation: moveDown 0.5s;
		}
		.moveUp {
			transform: translate3d(0, 0, 0);
			animation: moveUp 0.5s;
		}
		.store-header {
			box-sizing: border-box;
			padding: 0 24rpx;
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 999;
		}
		.store-search {
			height: 88rpx;
			display: inline-flex;
			align-items: center;
			width: 100%;

			i {
				width: 48rpx;
				height: 48rpx;
				display: inline-block;
				background-size: 100%;

				&.more {
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVRoQ+2VsQ3CMBREL03IElDBErSsQZEqK1ASSlb4lQvWoGUJqGAJcIWQqBLjCJ1wSHRpo/vxvefYGQb+ZANfP1Sgb4MyIAMkAW0hEiAdlwEaITlABkiAdFwGaITkABkgAdJxGaARkgPGaaAsyyLP8w2ANYApgBuAg/d+75y7d0FLmW8ZeH/8CGAZWOjJe7+KlUidbxWoqmoLoI5Qrs1s9+l96nyowBnAPFLgYmaLSIGk+VCB1x6fRAo8zKyIFEiaH6WBYf8DqU+R5lb89vvBi6xxjs8AXIl74Kf5cd7EXTftP72Xgb5tyIAMkAS0hUiAdFwGaITkABkgAdJxGaARkgNkgARIx2WARkgOeAI4rr0xIlMv6AAAAABJRU5ErkJggg==');
				}

				&.search {
					margin-top: 4rpx;
					margin-right: 12rpx;
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADmUlEQVRoQ+2YT0gUURjAv2+WShejQfsDWWDQoQ7VQS/ZKZyZTcpEiI2gS1CnLOraH5roz7VQOxV0CaIlELWwnR3x1NLBLnXIg5BgBpZuE8nqrs588WRGJlD3vdmxGNo5zeH79/u+977vvYcQ8Q8jHj9UAP51BSsVqFSgzAxUlhBL4MjIyAbLshJEpBFRIwDsBYAtbnJ/AsAYIr5HREOW5XRTU9NCmYlfVi+rAsPDw3KxWLyCiBcBYCtnUNNE9Cifzz/s6OiwOHVWFQsMYJrmKSLqIaIdQYJAxClE7FQU5WUQfU9HGICI0DCMO4h4DeCPQTiBiH2I+BoRP87MzHxnTurq6rYR0QEiOk5E7QCw2xcwEdF9TdNuIiIFARECYMGbpvmciE4vZwBxkoh0y7KeJpNJe60gUqlUTJblc4ioE1G9z8YLRVHOBIEQAkin03cR8bovyP65ubmz7e3tv0Sy19fXt7m6uvoZAJz09IjoXiKRuCFih8lyA7A17zhOyqfTlc1mr+q67og6ZfK6rkvNzc0PAOCyq0+SJCVF9wQXQG9vr1xTUzPq27D92Wy2I2jwHrAL0etVgm3s2dnZfSLdiQsgnU7riHhrqWSIk/l8fr/oslmtSmw5xePxT96eIKLbiURC561qSQA2pHK53Fdfn7+gadoTXgc8coZhnAeAx67sdG1t7U7eYVcSwDTNE47jDLjGJyzL2lOq2/AE7Zdxu9Nnr8VKktSmKMorHjslATKZTBcRXXKXT4+qqkv/YX+ZTKabiDpdP92qqnqbe01XJQEMw3gLAM3MiiRJrYqivAk7eGbPNM1jjuMMurazmqYd4fHDAzAFANuZsVgstqulpWWSx7CozNDQUL1t219cvW+apnEdUXgA5gFgEzNsWdamZDJZFA2ORz6VSm2UZbngyhY0Tavi0fsvACK/hKK9iSPfRiM/yCJ/lGCtLNKHOQbALu+Li4vRPU67oz66FxpvIq7nlRIAcrZtN7a2to7zTGBPpuQk9htbr0u9z8e4bdtHRSCEAJijsJ9VAOAHANQGhRAG8ByF9bC1sLAwEovFhgGgIQhEYADmjF324/F42U+Lg4ODDStAjBUKhUNtbW35tfZEWQCe4TAed1eCQMTDqqq+W3cAka6xlqwLkXFft0cLhULjX6lAWADMzsDAQLyqqurg/Pz8h1LBM/lQllCYAKK2KgCiGQtbvlKBsDMqaq9SAdGMhS0f+Qr8BnY1QU+lc2uAAAAAAElFTkSuQmCC');
				}
			}
		}

		.search-input {
			padding-left: 20rpx;
			display: inline-flex;
			align-items: center;
			width: 590rpx;
			height: 64rpx;
			background: #ededed;
			border-radius: 16px;
			margin-right: auto;
			overflow: hidden;
			position: relative;

			input {
				background: #ededed;
				width: 440rpx;
			}

			.clear {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 30rpx;
				height: 30rpx;
			}
		}

		.storeInfo {
			background: #ffffff;
			border-radius: 16rpx;
			margin: 24rpx;
			padding: 24rpx;
			box-sizing: border-box;

			.store-like {
				display: flex;
				align-items: center;
				height: 56rpx;
				padding: 0 16rpx;
				font-size: 28rpx;
				color: #999999;
				text-align: center;
				border-radius: 28rpx;
				border: 1px solid #999999;

				.add-icon {
					margin-right: 10rpx;
				}

				&.is-active {
					color: #fd302c;
					border-color: #fd302c;
				}
			}

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.left {
					display: flex;
					align-items: center;

					.headImg {
						width: 80rpx;
						height: 80rpx;
						margin-right: 24rpx;
						border-radius: 16rpx;
					}

					.storeName {
						font-size: 32rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #000000;
					}

					.ellipsis2 {
						max-width: 350rpx;
						overflow: hidden;
						/*超出内容隐藏*/
						text-overflow: ellipsis;
						/*超出内容为省略号*/
						display: -webkit-box;
						/*内容不换行*/
						-webkit-line-clamp: 3;
						/*超出几行*/
						-webkit-box-orient: vertical;
						/*从上到下垂直排列子元素*/
						word-break: break-all;
					}
				}

				.right {
					text {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}

			.describe {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}

		.result-sort {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 80rpx;
			background: #ffffff;

			.wbox-flex {
				flex: 1;
				text-align: center;
				color: #000000;
				font-size: 28rpx;

				&.cur {
					color: #e60113;
				}

				.sort-type {
					height: 100%;
					margin-left: 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				&:nth-child(2) {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}

		// .store-title {
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// 	/* height: 80px; */
		// 	height: 160rpx;
		// 	.store-info {
		// 		display: flex;
		// 		align-items: center;
		// 		.avatar {
		// 			vertical-align: middle;
		// 			display: inline-block;
		// 			width: 84rpx;
		// 			height: 84rpx;
		// 			border-radius: 10rpx;
		// 			border: 2rpx solid #ddd;
		// 			overflow: hidden;
		// 			image {
		// 				width: 100%;
		// 				height: 100%;
		// 			}
		// 			p {
		// 				font-size: 36rpx;
		// 				font-weight: bold;
		// 				color: #000;
		// 				line-height: 40rpx;
		// 			}
		// 		}
		// 		.name {
		// 			margin-left: 20rpx;
		// 			height: 80rpx;
		// 			display: inline-block;
		// 			/* vertical-align: top; */
		// 			.store-name {
		// 				font-weight: 500;
		// 				color: #000000;
		// 				line-height: 40rpx;
		// 				max-width: 440rpx;
		// 			}
		// 			.tag-part {
		// 				line-height: 52rpx;
		// 				display: flex;
		// 				align-items: center;
		// 				.tag {
		// 					display: inline-block;
		// 					margin-right: 4rpx;
		// 					color: #666;
		// 					font-size: 20rpx;
		// 				}
		// 				.store-type {
		// 					vertical-align: middle;
		// 					background: linear-gradient(277deg, #ffedf1 0%, #ed6f42 0%, #e60113 100%);
		// 					border-radius: 4rpx;
		// 					color: #fff;
		// 					line-height: 24rpx;
		// 					padding: 2rpx 4rpx;
		// 				}
		// 			}
		// 		}
		// 	}
		// 	.store-like {
		// 		width: 126rpx;
		// 		height: 52rpx;
		// 		background: #e60113;
		// 		border-radius: 26rpx;
		// 		font-size: 26rpx;
		// 		color: #fff;
		// 		text-align: center;
		// 		line-height: 52rpx;
		// 		.mark {
		// 			vertical-align: middle;
		// background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC8klEQVRYR+2WSeiNYRjFf4fMLEwrkYQypAwl05ISYSGKhSFhwYqSeR53WFCIkJBkVpSSxAIJKTJk2BlWkvnR4aX7/3zfvf/Lrf/GU7e+2zud9zznPc8jGjjUwOfzH0BZBiLC40OAUUAX4CvwCDgh6UFp+iKiJzAB6AE0Bp4DF4BrkqIo1YUAImI4sA3on7PYGx4C5gP+3g5MARrlzL0NzJN0NQ9ELoCImAnsBJoAL4AjwP30fzAwGWgFmIVvQC/gPXAUuA58BPqkeZ2Bz8AcSXuzIP4AEBEjgfPpNpuBVZK84e+IiG7AsRJ2fMuJkh5n5jXzemBRAjpa0sXSOXUARIQXPEz5Xi5pXVHuIqIDYFpN+1BJr8rMXQ6sSbroWXqhLIBZwC7gFjConHh8WESY5saS7pTzkyTmG8AAYJakPb/mZwGcAcYA0yTtr6VJRcQ0YB9wVtLYIgAvgU5OgSSLr2YREX7Gz4CXkizMH5FlwGJr6p8kK7dmERHe1/t/kmSt5QJ4A7QDOkp6XbPTf+qlPeA930rydy6AK4ANaJyk0zUGYG1ZY3bGoUUAFgMbgFOSxtcYwElfDKjzvLMa6Ag8BVoCI4rss1pgETECuJzcsmtpevOccAWwOlnvQEkfqj2wdH5EtABuJrteIWlt6XgegOZpQW+/W0kz/hGA3749wLWkv6RPZQF4MCL6JZttDayUZButOiLCTJrRd8CwPMcsV46t2hOpti+VtLEaBBGxDDDdX4Dxks7lra/UkEwHdicQm4Al9agP3nMLsDAdPlPSgSLwFXvCiHDt9wbuDY6nOmFK/4iIaAMcTM/NuZ4qyWW7MCoCSJpwS3YYaAvcS5Q+yai9O+C3bvHaUSdJulQpbfUCkEBkD5guyc5m0dpgrHYDvOveUFIdgH+dgswtTbHTYZd0L+i2zQ3J7FTYyqaoahEW5NmsLQDWp8rpaa5yiyRtrUR5drzeKcgujIi+wNzExA5JNpqq468BVH1SwYL/ABqcge/lyQ8w97nKsAAAAABJRU5ErkJggg==');
		// 			background-size: 100%;
		// 			width: 32rpx;
		// 			height: 32rpx;
		// 			display: inline-block;
		// 			margin-top: -4rpx;
		// 		}
		// 	}
		// 	.is-attention {
		// 		background: #fff;
		// 		border: 1px solid #999;
		// 		color: #999;
		// 	}
		// 	.no-attention {
		// 		background: #e60113;
		// 		color: #fff;
		// 	}
		// }
		// .store-categories {
		// 	height: 90rpx;
		// 	padding-left: 44rpx;
		// 	display: flex;
		// 	align-items: center;
		// 	.categories {
		// 		height: 100%;
		// 		margin-right: 100rpx;
		// 		position: relative;
		// 		font-size: 32rpx;
		// 		color: #000;
		// 		display: inline-block;
		// 		line-height: 90rpx;
		// 		i {
		// 			position: absolute;
		// 			bottom: 12rpx;
		// 			left: 0;
		// 			width: 64rpx;
		// 			height: 6rpx;
		// 			background: #e60113;
		// 			border-radius: 4rpx;
		// 			overflow: hidden;
		// 			&.active {
		// 				font-weight: bold;
		// 			}
		// 		}
		// 	}
		// }
		.shop_container {
			background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 10%);
			padding: 30rpx 24rpx 0;
		}
		.share-page-icon {
			z-index: 999;
			position: fixed;
			right: 12rpx;
			bottom: 260rpx;
			width: 134rpx;
			height: 134rpx;
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
	}


	.showUnFocus{
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 450rpx;
		padding-top: 40rpx;
		position: relative;
		.subscribe{
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #000000;
		}
		.cancel{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-top:86rpx;
			image{
				width: 48rpx;
				height: 48rpx;
				margin:0 30rpx 0 54rpx;
			}
			text{
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
			}
		}
		.cancelBtn{
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 80rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
		}
	}
	.mui-global-nav {
		display: block;
		width: 260rpx;
		position: absolute;
		background: rgba(255, 255, 255, 0.95);
		right: 0;
		top: 60rpx;
		font-size: 28rpx;
		text-align: left;
		padding-left: 28rpx;
		z-index: 99999;
		border-radius: 4rpx;
		border: solid 2rpx #eee;
	}

	.mui-global-nav-arr {
		font-size: 20rpx;
		position: absolute;
		top: -8rpx;
		right: 24rpx;
		border-left: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-bottom: 8rpx solid rgba(255, 255, 255, 0.95);
	}

	.mui-global-nav .li {
		padding: 0;
		line-height: auto;
		color: #333;
		background: none;
		font-size: 28rpx;
		border: none;
		text-align: left;
	}

	.mui-global-nav .li::after {
		border: none;
	}

	.mui-global-nav .li .li_a {
		color: #333;
		line-height: 88rpx;
		margin-left: 68rpx;
		padding-right: 28rpx;
		display: block;
		border-bottom: solid 2rpx #eee;
		position: relative;
	}

	.mui-global-nav .li:last-child .li_a {
		border: 0;
	}

	.mui-global-nav .li .li_a:before {
		position: absolute;
		top: 0;
		left: -68rpx;
		content: '';
		height: 88rpx;
		width: 68rpx;
		display: block;
	}

	.mui-global-nav-tab-home:before {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACdElEQVRYR+3Y4XXaMBAA4DtpgLBB6QRVpAFCN2gnSNggG5Ru0EyQZIKQCUIHkKJOULoBHeB8fcezeSZBtmwHSl/RP56x/XEn3UkgHPnAI/fB/wE0xoy01pcA8AkARgCwBIC59/5+aIYGR9AYY5RSD4g43oGZE9E0xrjqCx0ELHFPiDhi5h+IOCOipVLKIOI3ADgrI/n54MA6DgDuiei6Him5rrVeCJKZ70II0z7IXhE0xoyVUs8SOQB49N7L3Hs13gLZGVguiCcAMJLWoigmTXNsKLITsCuuCqlzTiL8IJ+ZeRpCuMtNdzawL66CWGuvEPG2KzILOBQ3BJkFdM5JeiRNv4nIxBilEPca9UgS0ccYo6z05GgFWmtvEfGqxMmCiL1ktZucczIHL5l5VRSFIJPPbATuA1dbOFnIJHCfuC7InUBr7QwRv8iDiOj8LdKamhbW2gUiXjDzsigKeddW334F7FsO+s5LqRBKKUF+AIBYLpwNcgt4aFz1o5qQG+DfwqWQ3vtzubYGlv3yuWuV75vW1H0v+vZNCOG6Ak601rIBuPfeS80TtGxAx22FdChS0gsAFzHGx1qwFswcQwiTpjKzRMR33vvWYj4EWRXtVFdJvtw5x/LiHGC5P5QzyWYg4sp7f9OGr8rM3oCC01r/3AVh5vU8akLuHVgVdWb+DgCbxl8V+rYMHBL4NYQwq7WxrClyAtZSfIrg1mLLLTOnCKZq1L8QQdmTnRHR+6ZD0tAU184nO8/LTa1ufWZoa1XVdWbeuYpz708FIgksN5Fz2Y7nvORlL60KcNu9zPwLAGapfxv2ulNpw+VcPwFzotT0naOP4B+KgW5H2IUKiwAAAABJRU5ErkJggg==) no-repeat left center;
		background-size: 40rpx;
	}

	.mui-global-nav-tab-shop:before {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADjUlEQVRYR+1YMWsUQRR+b7axUWNjo2BSCHbuzlSCYPILEnvBaC2Y4A/IpbESciDWuQN7zS/IpbDcca4SBUkELaySqwTNzJO3zi5ze3u3CV42EbNV7nbuzTffe+973wThjD94xvHBvw8wjuMYES+fBNNENDDGmEmxKxmM43hGCLGBiMsnAawck4g6zrlVY8xB+V0lQKXUNgDMNwEu2MNYaxfKIEcAxnE8H0URAwQiWnXOdapONg3wPlNLiLjp91vXWrfC2CMAlVIdAHgIAFtpmi5NA0hdDCllGxGfEtGe1npuLMA4jmejKNrlBZ7uXl3wabwP9wWA+2mavs3jDjEopWwh4hoRfdFaz05j86PGUEoxqMVy5soA9xFxhogeaa051Y09Sikupzc+e3PGmD3+uwAopVz2xTqw1s6eVGNMOrGUcg8RbxBR0SwFQKXUewCIAaCbpmkj+lcGG5RY0SwZwFBarLUFvY3l12/EshNF0b7/mDVLBjCXFiLa0Vo3LdBDPJRlLgMopTy15ihnKW8WIjrQWl/JGaSmtW9c+YRpTtMUMfyiSXGeALAYFhlAX4MZg2UVb7pJPJZCD0OAuYr30jRdqAPGHjGKotvW2p1cUGtStmitPTDGbNXFDpxUJncjMsMORmvdHhdISrmZ+0QuZOccW6RK08kHEUJs83TieJN8n29W9qArYT+EQp27GA7Uds6th9PEs7ZR9okMEhFb1tpuvt7X9SLHycHlB2bH4pxbCdn0sdcAIHdPxbAoz+IeIt4L2MvcDBHNImJoHrrW2nYURfw+vA7k7ifUUh6d7DGZGbZx4cPM8/QKnyGbN+IH/bjhYCP3EHY5zrllY0wGxBtOdkA8GqvuLXwQZiuz8jyxhBAdnrcVJTQgola5vMbe6nywnAmutd6EWuMa43rL1iMi23deP3LH8EDztVlt+tiV3nMIIDNCRA8Q8XWTbob3RcTnzrkP/X7/ZchuuQa/IuI1Ivqmtb5eJwnTeq+U+gQANzne4eHh436/n91RsmyEm0gpfyDihbDNpwViUpwkSXaFEFkTWmtfGWOenAM8DvPnDB6Hraq15wz+Dwx+F0JcrZUZpdQAAC7xQiL6iYjub9k54u8z7fUA7xpj3lXqYJIkLxDxGf4x2o0/RPRRa30r3HgESZIkXSHEfSK62BRCRPxFRJ+dc3dq/z+Yg2I30xRAAGCjVOl8TieXxzj5b1AuV0cuaeGZAAAAAElFTkSuQmCC) no-repeat left center;
		background-size: 40rpx;
	}

	.mui-global-nav-tab-class:before {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADMUlEQVRYR9WYT5JMQRDGv2eErZkT4AAiWFnMwjgBToATcAOcYDgBdhYTMSyscQKcACdgzE6gxa8ns6O6uupV1bxq0TLiRUdHvMr68v/3ctCGy7Dh+NQCcE/SF3um2LUtiQddRRkDiJL7ku5KuhhpeiXpqaR3xRtOXsC4O6aL/19N5xVJ1yW9kPQ9pSsHEIWHZimHAeIW35LEc0HSc0n3KkAe6cxwrD+zA9P10fSh51CDfmg2NwDDlyQF8OSQ9MmA5ELxQNK+XXijAJJoJD009+S5rZf6+fuaGYvRC4kBEsoPBg4vloTwP7NwAziUR5n0SOs8O7zRr9muRS0LEPR4EKA5i+MLAPJQ0qUgDTj/2XILI2oEL1+WdCyJFJhL6EFe+CbpsSQurZXUOc7jUYqgqlrtMo/IjjsoBEhI30aeqAXp1expEf+v1eOev+0FEwL0ULX0Rr+Ys1QhYUbwGhUZ52UN0FkYxZ4AyUPXt3RJDargnSzAKSGOvX9agB5i2tY8TXoUCXp6AXQ9ySLhItrMTcul2jbTCyDdgNb0OhiJK2QBF9ODqGYqqVZ6eJCiIs2WWlOqYr0XkQPM2Zo+NgUgTmEaAY77Rkede4xpwovn7TckCymvYhRPWMWcX7osOggwQHHuyCbYCjsq0S36GApgLiVxCuV9sPYMRjxppVsxGBKY3BiTkMzinZhDxmfJ9WIhtkwNwkF/ywke9HwFXMmD0LlJAMcYdQok4MJRVwLoqUCIYedNjJoiobIAGTPqXJEwi8Mi4dxYkaCbezgHOCq4ilF7m3lvBfIv2gyG8G1SbDPOqAGHdbUypQ/6HXgPkFfD3hsXyWkYdc9R5zRtwcL/K7Kw8XRrKqNeO2GdCjDcQJBL5HPLx5cXy1oYde+Ppq6MOvfZScgXzLiyX62FUY99uLd8YzcxatYfpX0LThlbfUCh2I6tTIeMN0kTGFORUfvyCDoE7S8tj5g6uT0OlzId4JUQgpQwvVhWAWzxwe4vjq3fGD0wan554vUbiiEEpd0L1Qwh8CnhhGBtjBp6jmcIYcsCEy/iaYx2gUN2YdQo7LUCdrZdZVwLo67sFH1f23iAfwGENgY4Hp3VTAAAAABJRU5ErkJggg==) no-repeat left center;
		background-size: 40rpx;
	}

	.mui-global-nav-tab-goods:before {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADC0lEQVRYR+1Y4XXTMBDWRQMQJiBMgCoNQJigZALKBLQTUCZoOwF0grYTUAaQ0AaUCQgDyMc7PzvvLMuKiOPXwKt/2tLdp7v7vjsZxIE/cOD4xBPAsRkajKDW+hQAjsc6KNmPiHfOucvU2iRApZSSUn4vMb6vNSGEI++9j+0lARpj3gohbmgxIl4JIdb7AhLZmQPAh+bdylp7WwRQa30OAB9psbV2UiIZY7AJxCfn3Pl/A/AeAF4j4jfn3HKi9NZmtdZZX8n0DW1SSs1ns9kFANyl6iV3EKprRDyuqurMe7+p6V0B/gKAORHEOXfaOm6k52KX2mS1dsYlRWt9SURBxLVz7nlRDQ4Vrtb6BAA+k5EQwkvv/UNJ+iPZ6rB1GyF7KebGEPG9c+5LC0IptZRSfs3JQgowl60Qwhvv/T3LCj90TwtTADcgYmNk1BhD9fNMCHFtrT0piaAxhg75Tgjx21o753v4oVP+egCjNPZOxJxRmpPqHwHgXal3qFzGyE4KYFaklVILKeWPRlwfqqpapVoUfSfns9nsBgAWubrNiXUKYM2qVDpSbCb2AcCptfaaR44yIYQgSapTiogd9vK1DGBHNYYiWCTSnH0NAAJaN3tEVC2wXBtjBx70mYpgEcCGMCS+FPEXKbIg4s8mur0hIIp2OcBtzTsjIwS2rjUAIH28Le02OS3sRXAXgCVSk1tTDDCn+GNB5PZHQt6Rrk4Et4nmVCBzfjsA+TDwN712LPBIWztyFAPcJtJz6sUNGcgQ79MkytSn17F4txNLQ5zVANGSk3UHYK5nklFezPEwa4whKalvgfGY1hKv6SadYaEFO9Tj4whmNZAXczws8PKIpyCttQeAV9SdQggqNaYNDa5xBOmqqYQQNDHTza73NExfpDSOvtGGuDfTJC6lXIYQ6FNyhmwB0nZr7VHrOAaYvWGNJcMuWvjvAHwsDWyjOuR/E8GDB8hZSIU64e+OoVKkubEmGZ8dNxHko/6UZCixzWUq1kH6BVaf4hEfz+/ik/4Y2schnwCOjeLBR/APvhWGRwCgfSoAAAAASUVORK5CYII=) no-repeat left center;
		background-size: 40rpx;
	}

	.mui-global-nav-tab-service:before {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADNklEQVRYR+1X7VUbMRDcvSsgTgWBCiJLBeBUEKggpANTAaYCSAWxKwBXEFLAKUoFcTqAAqTN23uSn9B9n48Xftj/MNLueKSdGSG88Q++cXxwBHjoCR3EoBDiJM/zzwCwICKBiCcMiIieENEQkXHObY0xj2OBjgLIwLIsu0bEyz6NiWiHiFdFUTz0WR+vGQxQSsmgbhFxNrQZADxaay+MMU999w4CKKVkYMuo+DMAPFhr1+kxCiFElmULAFgi4odoj/Egd31A9gYopeRGt1HRrbV2aYxpbSSEmGVZxnuvE5Cf+jDZC6AQYpHn+Y/QgIhutNarPgyENXw1EPF7tGdTFEXnHe4FUCn1CwCEL96rcB34FKS1lllsnfBOgHFRIvrrnBN9jqaJXaUUTzJLE3+2RVGct51EK8D5fH6WZdldYG/M0abNlVIM6D58b62dG2NME8hagH4C74PwJpsvxugZ16gZtFC6UX4qAP3U/WnSuUNYlFKukmmOfzvLT2WyKwBrimx8lS/exgZPcDTJMcCNdxjW1XdNtSsA44kNUxbLzFQMRrVFnuesEuzhO631aavVKaUoLCiKovwBrwmQ68c906GpY/B/A3yhjUeA8X2KBzB2keSIp2Mw6BoRfdVarxMwpfcS0ZXWmsWedXA/xaMBSik5XJbxyFp7ymmlaUgSV+AEXQZSRGS3YO/mOHYZhL0OIJtCmGLf831spXV3kJkImsdRiv8+Cek5lRnvOg9J5mPJ+O2cu4xtLAZIRFyX63MUK8MvEf3UWnOG3H9qnSTPc95Yimf6adJBz0T5JrHW7ur8tcNJeF/Fl9u8eI2IH2sAVu5bk9Gn3zd5sU9JzHYlerWmGX98fJdKZvilNjYosMf70Cv4+PmpAABPzjkmuzETdubBvux0rVNKcSLn+/VsrV20RazWO9jVaOj/PXOc/8rLXydJbTUnYzB+8RHRnXPuBgDKwBs96Aff30kAtgTRQM4LPRxyCpMATN4Z+/48nTwMzrnV2HfMJADrGCSib1rr+JE/hLhmoR5TxT8T2E3OgiM4587HsvZqU8y6CQCzrrfuEBImOeIhDYeuPQIcyli6/sjgoQz+A7riU0cr3vgdAAAAAElFTkSuQmCC) no-repeat left center;
		background-size: 40rpx;
	}

	.sort-type {
		//position: absolute;
		//top: 0;
		//right: 0.8rem;
		height: 100%;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	// .wbox-flex {
	// 	text-align: center;
	// 	width: 158rpx;
	// 	height: 48rpx;
	// 	line-height: 48rpx;
	// 	background: #f2f2f2;
	// 	border-radius: 100px;
	// 	border: 1px solid #f2f2f2;
	// 	color: #666666;
	// 	font-size: 24rpx;
	// 	float: left;
	// 	margin-right: 20rpx;
	// 	// display: flex;
	// 	// align-items: center;
	// 	// justify-content: center;
	// }

	// .result-sort {
	// 	position: unset;
	// 	overflow: hidden;
	// 	padding-top: 20rpx;
	// 	margin-bottom: 28rpx;
	// }

	// .result-sort view {
	// 	border-bottom: 0;
	// 	color: #000000;
	// }

	// .result-sort view.cur {
	// 	color: #e60113;
	// 	border: 2rpx solid #e60113;
	// }

	// .sort-wrap view.cur {
	// 	color: #e60113 !important;
	// }

	// .result-sort view:first-child .arrow {
	// 	top: 2rpx;
	// 	// vertical-align: middle;
	// }

	// .result-sort view:first-child .arrow:after {
	// 	width: 0;
	// 	height: 0;
	// 	border-style: solid;
	// 	border-width: 28rpx;
	// 	transform: rotate(180deg);
	// 	border-color: transparent transparent #e60113 transparent;
	// }

	// .result-sort view:first-child .firstNavli:after {
	// 	border-color: transparent transparent #000 transparent;
	// }

	// .result-sort view:first-child .arrowactive {
	// 	top: -24rpx;
	// 	// vertical-align: middle;
	// }

	// .result-sort view:first-child .arrowactive:after {
	// 	transform: rotate(0deg);
	// }

	// .result-sort view:nth-child(2) {
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
	// }
</style>
