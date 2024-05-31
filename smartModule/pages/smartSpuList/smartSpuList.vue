<template>
	<view class="applet-spulist-wrap" >
		<view class="header">
		<!-- 商品列表头部模块 -->
		<wsf-nav-bar
			:status-bar="true"
			:shadow="false"
			:hasBack="true"
			bgSize="100% auto"
			bgColor="#fff"
			@onBackBtnClick="clickBackBtn"
			:backIconType="smart"
		>
			<view slot="searchBar" class="search_wrap">
				<wsfSmartSearch
					v-model="queryString"
					style="width:100%"
					:clearable="false"
					:disabled="true"
					placeholderStyle="color: c6c6c6"
					:showRight="false"
					:placeholder="type === 'gift' ? '在结果中搜索商品' : '请输入搜索关键字'"
					@click="searchFun"
				></wsfSmartSearch>
			</view>
			<view class="block" slot="additional"></view>
		</wsf-nav-bar>
	
		</view>

		<!-- 商品列表模块 -->
		<view class="applet-spulist-body">
			<view class="bg_color" :style="{'display':listStyle == 'column'?'none':'block'}" v-if="flowList.length!=0"></view>
			<wsf-smart-goods-list
				ref="goodslist"
				:list="flowList"
				:loadStatus="loadStatus"
				:showStyle="listStyle"
				:fromPage="fromPage"
				loadMoreBgColor='#f6f6f6'
				loadMoreTextColor="#999"
				@goodsClick="goodsClick($event)"				
				@handleShareProduct="handleShareProduct"				
			></wsf-smart-goods-list>
		</view>
		
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>	
	</view>
</template>

<script>



import wsfSmartGoodsList from "@/components/wsf-smart-goods-list/wsf-smart-goods-list.vue";
import {visit} from '@/common/visit.js'
import { priceFilter } from "@/common/wsfFilter.js";
import wsfSmartSearch from "@/components/wsf-smart-search/wsf-smart-search.vue";
import {
  GetSearchProduct
} from "@/common/smart-api/homeApi";
export default {
	components: {
		wsfSmartSearch,
		wsfSmartGoodsList
	},
	data() {
		return {
			priceFilter,		
			searchParams: {
				// 搜索请求						
				queryString: '', // 关键字
				pageNum: 0, // 页码
				pageSize: 10, // 页容量																
			},			
	
			headerFix: false, // 当前头部区域是否固定定位
			queryString: '', // 查询搜索词
			listStyle: 'column', // 商品列表展示样式
			isShowSearchBar: true, // 是否展示搜索栏
			canSearchShops: false, // 是否搜索到了店铺
			storeInfo: {}, // 店铺信息
			flowList: [], // 商品数据
			loadStatus: 'loadmore', // 商品数据加载状态
																					
			isShowStore: 0,
			scrollTop:0,						
			storeIds:[],
			type: undefined,
			cardPrice:0,// 礼品卡金额
			isSearchCate: 0,
			fromPage: '',

			// 分享相关属性--start-----
			showShareModal:false, // 分享弹窗
			promoteInfo: {  //推广员信息
				promoteId: '',
				promoteType: '',
				phone: ''
			},
			shareParams: {
				name: '',
				image: '',
				shareType: '',
				distributionCode: ''
			},	
			promoteId: null,
		
		};
	},
	computed: {
		showHeader() {
			let style = {};
			style.transform = `translateY(${this.isShowSearchBar ? 0 : 'calc(-100% + 80rpx)'})`;
			return style;
		},
		searchParamsQueryString() {
			return this.queryString;
		},		
		top() {
			let statusBarHeight = getApp().globalData.statusBarHeight;
			return statusBarHeight + 44 + "px";
		},
	},
	watch: {
		searchParamsQueryString(n, o) {
			if (n === o) return;
			this.resetSearchParams();
			this.queryString = n;
		}
	},
	onLoad(options) {
		this.queryString = options.queryString || '';		
		
		this.isSearchCate = options.isSearchCate || 0;

		if(options.type&& options.type === 'gift'){
			this.type = options.type
			this.cardPrice = options.cardPrice
			this.storeIds = options.storeIds.split(',')
		}

		// 来自哪个页面
		if (options.fromPage) {
			this.fromPage = options.fromPage
		}	

		if(options.promoteId) {
			this.promoteId = options.promoteId
			this.getPromoteInfo()
		}
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore // 判断商城信息
		this.getSearchList();
	},
	onReachBottom() {
		this.getSearchList();
	},
	onPageScroll(e) {
		let scrollTop = e.scrollTop;
		this.scrollTop = scrollTop
		//判断商品头部高度,店铺详情是否展示
		let headerHeight = this.canSearchShops ? 157 : 87;

		if (scrollTop > headerHeight && !this.headerFix) {
			this.headerFix = true;
			this.isShowSearchBar = false;
		} else if (scrollTop <= headerHeight && this.headerFix) {
			this.headerFix = false;
			this.isShowSearchBar = true;
		} else {
			return;
		}
	},

	methods: {		
		clickBackBtn() {			
			uni.navigateBack();
		},
		searchFun(){
			let searchValue
			if(this.isSearchCate) {
				searchValue = ''
			} else {
				searchValue = this.queryString
			}
			let query = { type: 1, searchValue, giftType: this.type==='gift'? 'gift':'', fromPage: this.fromPage }

			// 分销分享员信息
			if(this.promoteId) {
				query.promoteId = this.promoteId
			}
			this.$smart.go('smartSearch', query)					
		},
		getSearchList() {
			if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;
			this.loadStatus = 'loading';
			if(this.type === 'gift'){
				this.searchParams.storeIds = this.storeIds
			}
			if(this.isSearchCate == '1') {
				this.searchParams.queryString = ''
			} else {
				this.searchParams.queryString = this.queryString
			}
					
			GetSearchProduct(this.searchParams).then(res => {
				console.log(res,'wwwwwwwwwwwwwwwwwwwwww');
				visit(this,'搜索页',this.searchParams)			
				if (!res.data) {
					this.loadStatus = 'nomore';
					return
				}
				this.canSearchShops = this.isShowStore > 0 ? !!res.data.storeInfo : false;
				this.storeInfo = res.data.storeInfo;
				this.loadStatus = 'loadmore';
				if(res.data.products && res.data.products.length) {
					this.flowList = this.flowList.concat(res.data.products);					
				}													
				if (res.data.products===null || res.data.products.length < 10) {
					this.loadStatus = 'nomore';
				}
				this.searchParams.pageNum++;
			});
		},
						

		// 商品跳转
		goodsClick(e) {
			console.log(e,'eeeeeeeeee');
      		// 跳转到分销详情的逻辑
			if(this.fromPage == 'distributionIndex' || this.fromPage == 'distributionUserPage') {

				// 被分享跳转
				if(this.fromPage == 'distributionUserPage') {
					let param = {
						spuId: e.spuId,
						recommendUserType: this.promoteInfo.recommendUserType,
						phone: this.promoteInfo.phone,
						customerId: this.promoteId
					};
					this.$u.api.ShareForDistribution(param).then(res => {
						this.$smart.go('SkuDetail', { s: e.skuId, c: res.data.data });
					});
					return 
				}
				
				// 分享购跳转
				this.$smart.go('distributionSkuDetail', {
					skuId: e.skuId
				});

        		return
      		}
			let skuId = e.id || e.skuId
			// sourceType-4 电动车数据跳转电动车详情
			if(e.goodsSource == 4){
				this.$smart.go('ToMotor',{skuId: e.skuId});
			} else {
			// 普通商品详情
			
				this.$smart.go('SkuDetail', { skuId });
			}
		},		
		
		// 重置搜索条件
		resetSearchParams() {
			this.loadStatus = 'nomore';
			this.searchParams = {
				queryString: this.queryString, // 关键字
				pageNum: 0, // 页码
				pageSize: 10, // 页容量													
			};
			this.flowList = [];
		},
				
		
	
		

		// 分销分享方法----------start-----------------
		handleShareProduct(e) {
			console.log(e, '-----------');
			this.checkPermission().then(isPass => {
				if (!isPass) return;
				this.shareParams = {
					name: `¥${e.finalPrice} | ${e.skuName}`,
					image: e.shareImage ? e.shareImage : e.productUrl,
					shareType: 'product',
					skuId: e.skuId
				};
				this.getShareCode(e.spuId);
				
				this.showShareModal = true;
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
		// 分销分享检测是否是分销员
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
							this.$smart.go('PromotionRegister', info);
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
		
		// 分销分享方法----------end-----------------

		// 查询分享员信息
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
	}
};
</script>

<style lang="scss" scoped>
.applet-spulist-wrap {
	min-height: 100%;
	// background-color: #fff;
	// 头部样式
	.header {
		position: sticky;
		top: 0;
		z-index: 10080;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx 0px rgba(0,0,0,0.1);
	}
	.search_wrap {
		margin-left: 88rpx;
		height: 44px;
		display: flex;
		align-items: center;
	}
	.block {
		height: 10px;
	}
	.applet-spulist-header {
		// z-index: 10080;
		// position: sticky;
		// top: 0;
		// background-color: #fff;
		// transition: all 0.3s;
		// 搜索框样式
		.applet-search-wrap {
			z-index: 10080;
			padding: 12rpx 24rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.applet-search-bar {
				flex: 1;
				margin-right: 24rpx;
			}
			.applet-search-icon {
				height: 64rpx;
				width: 60rpx;
				padding: 8rpx 6rpx;
			}
		}
		// 店铺信息样式
		.applet-shops-wrap {
			z-index: 10080;
			height: 140rpx;
			padding: 0 20rpx;
			margin: 0 24rpx;
			background-color: #f5f5f5;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			.applet-shops-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.applet-shops-avatar {
					height: 64rpx;
					width: 64rpx;
					margin-right: 20rpx;
				}
				.applet-shops-title {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					// height: 60rpx;
					.applet-shops-title-name {
						color: #000000;
						font-size: 28rpx;
						line-height: 28rpx;
						font-weight: bold;
					}
					.applet-shops-title-follow {
						color: #666666;
						font-size: 20rpx;
						line-height: 20rpx;
					}
				}
			}
			.applet-shops-btn {
				font-size: 24rpx;
				color: #000;
				line-height: 28rpx;
				.applet-shops-btn-right {
					height: 18rpx;
					width: 10rpx;
					margin-left: 8rpx;
				}
			}
		}
		// 导航栏样式
		.applet-shops-navbar {
			z-index: 10080;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.applet-shops-navbar-dropdown {
				flex: 1;
				text-align: center;
			}
			.applet-shops-navbar-line {
				margin-bottom: 10rpx;
				height: 24rpx;
				width: 1px;
				background-color: #e1e1e1;
			}
			.applet-shops-navbar-filter-btn {
				width: 144rpx;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				padding-bottom: 14rpx;
			}
			.acitve {
				color: $wsf-color-red;
			}

		}
		.explain {
				height: 76rpx;
				line-height: 76rpx;
				padding: 0 20rpx;
				margin: 0 23rpx;
				background-color: #FFF7EA;
				color: #E18F04;
				border-radius: 10rpx;
			}
	}
	// 内容样式
	.applet-spulist-body {
		position: relative;
		background-color: #fff;
		padding: 16rpx 16rpx 60rpx;
		background-color: #f6f6f6;
		.bg_color{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 300rpx;
			background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
		}
	}
	// 筛选弹出层样式
	.applet-spulist-filter {
		background-color: #f6f6f6;
		position: relative;
		height: 100%;
		padding-bottom: 88rpx;
		&-model {
			background-color: #fff;
			margin-bottom: 20rpx;
			padding-left: 20rpx;
			border-radius: 0 0 20rpx 20rpx;
			.active {
				// background-color: $wsf-color-red;
				// color: #fff;
				border-color:#E60113;
				color:#E60113;
			}
			&-title {
				font-size: 28rpx;
				color: #000;
				height: 96rpx;
				line-height: 96rpx;
				font-weight:bold;
			}
			&-click-item {
				width: 180rpx;
				height: 60rpx;
				line-height: 60rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				text-align: center;
				font-size: 24rpx;
				color: #000000;
				border-radius: 10rpx;
				padding: 0 10rpx;
				box-sizing: border-box;
				background-color: #F2F2F2;
				border-radius: 30rpx;
				border:2rpx solid #f2f2f2;
			}

			&-list {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
			}
		}
		&-quick {
			display: flex;
			padding: 20rpx 0 0 20rpx;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
		}

		&-btn {
			background-color: #fff;
			position: absolute;
			height: 100rpx;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 36rpx 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&-comfirm {
				flex: 1;
				text-align: center;
				font-size: 28rpx;
				color: #fff;
				background-color: $wsf-color-red;
				width: 276rpx;
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 36rpx;
				margin-left: 16rpx;
			}
			&-reset {
				flex: 1;
				text-align: center;
				font-size: 28rpx;
				color: #000;
				// background-color: #fff;
				// background-color: $wsf-color-red;
				border: 1rpx solid #666666;
				width: 276rpx;
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 34rpx;
				margin-left: 36rpx;
			}
		}
	}
}
.filterHeaderBox{
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	.serverBox{
		font-weight:bold;
		font-size:28rpx;
		color:#000;
		padding-left: 20rpx;
		height: 80rpx;
		line-height: 110rpx;
	}
	.inputBox{
		width: 150rpx;
		height: 60rpx;
		line-height:60rpx;
		background: #F2F2F2;
		border-radius: 30rpx;
		padding-left:24rpx;
		padding-right:24rpx;
	}
}
.inputbox {
  display: inline-block;
  width: 90px;
  height: 30px;
  background: #f2f2f2;
  border-radius: 15px;
  padding-left: 12px;
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
