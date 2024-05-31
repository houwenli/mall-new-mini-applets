<template>
	<view class="applet-spulist-wrap" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
		<!-- 商品列表头部模块 -->
		<view class="applet-spulist-header" :style="[showHeader]">
			<!-- 商品列表头部 - 搜索模块 -->
			<view class="applet-search-wrap">
				<!-- <view class="applet-search-bar">
					<u-search
						@click="searchFun"
						height="64"
						color="#000"
						search-icon-color="#9D9D9D"
						placeholder-color="#9D9D9D"
						:placeholder="type==='gift'? '在结果中搜索商品':'请输入关键字'"
						disabled
						v-model="searchParams.spuName"
						:show-action="false"
					></u-search>
				</view> -->
				<view class="search-input">
					<i class="search"></i>
					<input v-model="searchParams.spuName" type="text" placeholder="请输入搜索关键字" @click="navigationTo('Search',{fromPage:'storeIndex',storeId,})"/>
					<image v-show="searchParams.spuName && searchParams.spuName.length > 0" class="clear"
						src="/static/img/clear2.png" @tap="handleClearSearch(true)" />
						<!-- @confirm="handleClearSearch()"   当前也没直接搜索用，不跳搜索页（原逻辑） -->
				</view>
			<!-- 	<view class="applet-search-icon" @click="toggleListStyle">
					<image v-show="listStyle == 'column'" style="height: 100%;width: 100%;" src="@/static/img/a.png"></image>
					<image v-show="listStyle == 'common'" style="height: 100%;width: 100%;" src="@/static/img/e.png"></image>
				</view> -->
			</view>
			<!-- 商品列表头部 - 店铺信息模块 -->
		<!-- 	<view class="applet-shops-wrap" v-if="canSearchShops" @click="this.$wsf.go('StoreIndex', { storeId: storeInfo.id })">
				<view class="applet-shops-info">
					<image class="applet-shops-avatar" :src="storeInfo.avatarPicture"></image>
					<view class="applet-shops-title">
						<view class="applet-shops-title-name">{{ storeInfo.storeName }}</view>
						<view class="applet-shops-title-follow">{{ storeInfo.followNum || 0 }}人关注</view>
					</view>
				</view>
				<view class="applet-shops-btn">
					<span>前往店铺</span>
					<image class="applet-shops-btn-right" style="height: 18rpx;width: 10rpx;" src="@/static/img/you.png" mode=""></image>
				</view>
			</view> -->
			<!-- 商品列表头部 - 导航搜索框模块 -->
			<!-- <view class="applet-shops-navbar"> -->
				<!-- <view class="applet-shops-navbar-dropdown">
					<wsf-dropdown active-color="#e60113" v-model="searchParams.sortItems" @open="this.maskShow = true" @close="this.maskShow = false" @change="sortItemChange">
						<wsf-dropdown-item title="综合" :options="sortItems.priceFilter" type="price"></wsf-dropdown-item>
						<wsf-dropdown-item title="销量" :options="sortItems.saleNum"></wsf-dropdown-item>
						<wsf-dropdown-item title="最新上架" :options="sortItems.skuUpTime"></wsf-dropdown-item>
					</wsf-dropdown>
				</view> -->

				<!-- <view class="applet-shops-navbar-line"></view> -->
				<!-- <view class="applet-shops-navbar-filter-btn" :class="[{ acitve: isFilter }]" @click="openFilterPopup">
					筛选
					<image style="height: 28rpx;width: 28rpx;" src="@/static/img/screening@2x.png" mode=""></image>
				</view> -->
			<!-- </view> -->
			<!-- <view v-if="type==='gift'" class="explain">以下商品可使用面值{{cardPrice || 0}}元的礼品卡进行购买</view> -->
		</view>
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
		<!-- 商品列表模块 -->
		<view class="applet-spulist-body" style="background: #f5f5f5;">
			<!-- <view class="bg_color" :style="{'display':listStyle == 'column'?'none':'block'}" v-if="flowList.length!=0"></view> -->
			<wsf-goods-list ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
			<!-- :loadMoreBgColor ='listStyle == "column" ? "#FFF" : "#f5f5f5"'
			loadMoreTextColor="#999" -->
				<!-- @shopsClick="shopsClick($event)" -->
				<!-- :showStyle="listStyle" -->
		</view>

		<!-- 筛选弹窗模块 -->
		<u-popup v-model="screenPopup" z-index="10999" mode="right" width="620rpx" safe-area-inset-bottom>
			<view class="applet-spulist-filter">
				<!-- 内容区域 -->
				<scroll-view style="height: 100%;" :scroll-y="true">
					<!-- 快捷筛选模块 -->
					<view class="filterHeaderBox">
						<view class="serverBox">
							服务/折扣
						</view>
						<view class="applet-spulist-filter-model applet-spulist-filter-quick">
							<view :class="[{ active: freeShipping }, 'applet-spulist-filter-model-click-item']" @click="this.freeShipping = !this.freeShipping">包邮</view>
							<view :class="[{ active: promotion }, 'applet-spulist-filter-model-click-item']" @click="this.promotion = !this.promotion">促销</view>
							<view :class="[{ active: hasStock }, 'applet-spulist-filter-model-click-item']" @click="hasStock = !hasStock">仅看有货</view>
						</view>
						<!-- <view :class="[{ active: isWsfStore }, 'applet-spulist-filter-model-click-item']" @click="isWsfStore = !isWsfStore">商城自营</view> -->
					</view>
					<view class="filterHeaderBox">
						<view class="serverBox">
							价格区间
						</view>
						<view class="applet-spulist-filter-model applet-spulist-filter-quick" style="padding-bottom: 24rpx;">
							<u-input input-align="center" type="number" v-model.number="priceRange.min" class="inputBox" clearable="false" placeholder="最低价" placeholder-style="text-align:center;color:#999;gont-size:22rpx;" />
							<text style="color:#666;margin:0 10rpx">—</text>
							<u-input input-align="center" type="number" v-model.number="priceRange.max" class="inputBox" clearable="false" placeholder="最高价" placeholder-style="text-align:center;color:#999;gont-size:22rpx;" />
						</view>
					</view>

				</scroll-view>

			</view>
		</u-popup>

		<!-- 遮罩层模块 -->
		<u-mask :show="maskShow" :mask-click-able="false"></u-mask>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
import wsfDropdown from '@/components/wsf-dropdown/wsf-dropdown.vue';
import wsfDropdownItem from '@/components/wsf-dropdown-item/wsf-dropdown-item.vue';

import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';

export default {
	components: {
		wsfDropdown,
		wsfDropdownItem,
		wsfGoodsList
	},
	data() {
		return {
			showAggRes: true,
			searchParams: {
				// 搜索请求

				storeId: "", // 店铺id
				// storeCateId: -1, // 店铺分类
				spuName: '', // 关键字
				pageNum: 1, // 页码
				pageSize: 10, // 页容量
				sort:1,
				// sortItems: [], // 排序状态
				// attributes: [], // 分类
				// brandNames: [], // 品牌
				// stockFilter: -1,
				// freeShipping: -1,
				// promotion: -1,
				// priceRange: {
				// 	min: "",
				// 	max: ""
				// }
			},
			// searchParams: {
			// 	// storeId: '',
			// 	// pageNum: 0,
			// 	// pageSize: 10,
			// 	// onlyQueryNewSpu: 0, //是否只查新品
			// 	// stockFilter: -1
			// 	storeId: '',    //店铺id
			// 	spuName: '',
			// 	sort: 1,
			// 	pageNum: 1,  // 当前页码
			// 	pageSize: 10, // 每页显示记录数
			// },
			defaultStoreId: -1, // 存放storeId
			touchStart: 0, // 点击时窗口的高度
			headerFix: false, // 当前头部区域是否固定定位
			queryString: '', // 查询搜索词
			listStyle: 'column', // 商品列表展示样式
			isShowSearchBar: true, // 是否展示搜索栏
			canSearchShops: false, // 是否搜索到了店铺
			storeInfo: {}, // 店铺信息
			flowList: [], // 商品数据
			loadStatus: 'loadmore', // 商品数据加载状态
			sortItems: {
				priceFilter: [
					// 价格过滤
					{
						label: '综合排序',
						value: -1,
						aliases: '综合'
					},
					{
						label: '价格从低到高',
						value: 0,
						aliases: '价格升序'
					},
					{
						label: '价格从高到低',
						value: 1,
						aliases: '价格降序'
					}
				],
				saleNum: [
					{
						field: 'saleNum',
						order: 1
					}
				],
				skuUpTime: [
					{
						field: 'skuUpTime',
						order: 1
					}
				]
			},
			screenPopup: false, // 筛选弹窗组件
			aggRes: [], // 筛选条件列表
			isWsfStore: false, // 是否商城自营
			hasStock: false, // 是否仅看有货
			chooseBrandNames: [], // 选中的品牌
			chooseAttributes: [], // 选中的分类
			maskShow: false, // 遮罩层
			isShowStore: 0,
			scrollTop:0,
			isLoading: false, // 是否正在加载
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
			hasMore:true,

			freeShipping: false, // 包邮过滤
			promotion: false, // 促销过滤
			priceRange: {
				min: '',
				max: '',
			}, //  价格区间
			storeIds:[],
			type: undefined,
			cardPrice:0,// 礼品卡金额
			storeId:"",
			agencyStoreId:""
		};
	},
	computed: {
		showHeader() {
			let style = {};
			style.transform = `translateY(${this.isShowSearchBar ? 0 : 'calc(-100% + 80rpx)'})`;
			return style;
		},
		// searchParamsQueryString() {
		// 	return this.searchParams.queryString;
		// },
		// isFilter() {
		// 	return (
		// 		this.searchParams.attributes.length > 0 ||
		// 		this.searchParams.brandNames.length > 0 ||
		// 		this.searchParams.stockFilter >= 0 ||
		// 		this.searchParams.storeId === 0 ||
		// 		this.searchParams.priceRange.min ||
		// 		this.searchParams.priceRange.max ||
		// 		this.searchParams.freeShipping >= 0 ||
		// 		this.searchParams.promotion >= 0 ||
		// 		false
		// 	);
		// }
	},
	watch: {
		// searchParamsQueryString(n, o) {
		// 	if (n === o) return;
		// 	this.resetSearchParams();
		// 	this.searchParams.queryString = n;
		// }
	},
	onLoad(options) {

		console.log("myStore----",options)
		this.searchParams.spuName = options.queryString || '';
		this.searchParams.storeId = options.storeId || '';
		this.storeId = options.storeId || ''
		this.agencyStoreId = options.agencyStoreId || ""
		// this.searchParams.cateId = options.cateId || -1;
		// this.searchParams.storeCateId = options.storeCateId || -1;
		// this.defaultStoreId = options.storeId || -1;
		// if(options.type&& options.type === 'gift'){
		// 	this.type = options.type
		// 	this.cardPrice = options.cardPrice
		// 	this.storeIds = options.storeIds.split(',')
		// }
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
		handleClearSearch(isClear) {
			if (isClear) this.searchParams.spuName = '';
			this.searchParams.pageNum = 1;
			this.hasMore = true;
			this.flowList = [];
			this.getSearchList()
		},
		searchFun(){
			this.$wsf.go('Search', { type: 1, storeId:this.searchParams.storeId, searchValue: this.searchParams.spuName,giftType: this.type==='gift'? 'gift':'' })
			setTimeout(()=>{
				this.resetFilterPopup()
			},500)
		},

		// 切换商品列表样式
		toggleListStyle() {
			if(this.listStyle == "common") {
				this.listStyle = 'column'
			} else if(this.listStyle == "column") {
				this.listStyle = 'common'
			}
		},
		// 监听触摸事件开始,便于获取当前页面高度
		handleTouchStart(e) {
			this.touchStart = e.changedTouches[0].clientY;
		},
		// 监听触摸事件移动,便于获取当前页面高度,计算顶栏移动距离
		handleTouchMove(e) {
			let touchMove = e.changedTouches[0].clientY;
			let moveLength = touchMove - this.touchStart;
			// 避免误滑操作
			if (Math.abs(moveLength) < 10) return;

			// 检测头部是否吸顶
			if (!this.headerFix) return;
			// Todo 节流防抖,性能检测
			this.isShowSearchBar = moveLength > 0;
		},

		// 商品跳转
		goodsClick(e) {
			console.log(e)
			let param = e.id;
			if (!param) {
				this.showToastError('缺少参数');
			}
			this.navigationTo('SkuDetail', {
				skuId: param,
				agencyStoreId: this.agencyStoreId,
			});
			// this.$wsf.go('SkuDetail', { skuId: e.skuId, sourceType: 1, storeIdNumber: e.storeId });
		},

		// 店铺跳转
		shopsClick(e) {
			this.$wsf.go('StoreIndex', { storeId: e.storeId, storeName: e.storeName });
		},
		// 当排序条件改变时
		sortItemChange(e) {
			this.searchParams.sortItems = e
			this.searchParams.pageNum = 0;
			this.loadStatus = 'loadmore';
			this.flowList = [];
			this.$refs.goodslist.clearList();
			this.getSearchList();
		},
		// 重置搜索条件
		resetSearchParams() {
			this.loadStatus = 'loadmore';
			this.searchParams = {
				// 搜索请求
				cateId: -1, // 分类
				storeId: this.defaultStoreId || -1, // 店铺
				storeCateId: -1, // 店铺分类
				queryString: this.searchParams.queryString, // 关键字
				pageNum: 0, // 页码
				pageSize: 10, // 页容量
				sortItems: [], // 排序状态
				attributes: [], //
				brandNames: [], //
				stockFilter: -1,
				priceRange: {
					min:'',
					max:'',
				}
			};
			this.flowList = [];
		},
		// 打开筛选
		openFilterPopup() {
			this.isWsfStore = this.searchParams.storeId === 0;
			// this.hasStock = this.searchParams.stockFilter === 0;
			this.chooseBrandNames = this.searchParams.brandNames;
			this.chooseAttributes = this.searchParams.attributes;
			this.screenPopup = true;
		},
		// 筛选条件点击事件
		filtersClick(key, item) {
			if (key === '品牌') {
				let keyIdx = this.chooseBrandNames.indexOf(item);
				if (keyIdx < 0) {
					this.chooseBrandNames.push(item);
				} else {
					this.chooseBrandNames.splice(keyIdx, 1);
				}
			} else {
				let keyIdx = this.chooseAttributes.findIndex(el => {
					return el.name === key;
				});
				if (keyIdx < 0) {
					this.chooseAttributes.push({ name: key, values: [item] });
				} else {
					let valIdx = this.chooseAttributes[keyIdx].values.indexOf(item);
					if (valIdx < 0) {
						this.chooseAttributes[keyIdx].values.push(item);
					} else {
						this.chooseAttributes[keyIdx].values.splice(valIdx, 1);
					}
				}
			}
		},
		// 确定筛选条件
		// confirmFilterPopup() {
		// 	if (this.priceRange.min && this.priceRange.max && this.priceRange.min > this.priceRange.max) {
		// 		this.$u.toast(`最高价不得小于最低价`);
		// 		this.priceRange.min = ''
		// 		this.priceRange.max = ''
		// 		return false
		// 	}
		// 	this.resetSearchParams();
		// 	this.searchParams.storeId = this.isWsfStore ? 0 : this.defaultStoreId;
		// 	this.searchParams.stockFilter = this.hasStock ? 0 : -1;
		// 	this.searchParams.brandNames = this.chooseBrandNames;
		// 	this.searchParams.attributes = this.chooseAttributes;

		// 	this.searchParams.freeShipping = this.freeShipping ? 1 :-1;
		// 	this.searchParams.promotion = this.promotion ? 1 :-1;
		// 	this.searchParams.priceRange = this.priceRange;

		// 	this.screenPopup = false;
		// 	this.$refs.goodslist.clearList();

		// 	if (this.searchParams.attributes.length == 0 &&
		// 		this.searchParams.brandNames.length == 0 &&
		// 		this.searchParams.stockFilter == -1 &&
		// 		!this.searchParams.priceRange.min &&
		// 		!this.searchParams.priceRange.max &&
		// 		this.searchParams.freeShipping == -1 &&
		// 		this.searchParams.promotion == -1){
		// 		this.isFilter = false
		// 	}

		// 	this.getSearchList();
		// },
		// 重置筛选条件
		resetFilterPopup() {
			this.searchParams.brandNames = this.chooseBrandNames = [];
			this.searchParams.attributes = this.chooseAttributes = [];
			this.searchParams.freeShipping = this.searchParams.promotion = this.searchParams.stockFilter = -1;
			this.freeShipping = this.promotion = this.hasStock =  false;
			this.searchParams.priceRange = this.priceRange = {
				min: '',
				max: '',
			};
			this.isWsfStore = false;
			this.loadStatus = 'loadmore';
			this.searchParams.pageNum = 0;
			this.flowList = [];
			this.isFilter = false

			// this.$refs.goodslist.clearList();
			// this.resetSearchParams()
			this.getSearchList();
		},
		/* 跳转 */
		navigationTo(sceneName, params) {
			// let pages = getCurrentPages();
			// console.log(pages)
			// let prevPage = pages[pages.length - 2]; //上一个页面
			// console.log(prevPage)
			// // prevPage.$vm.searchParams.spuName = val
			// uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
			// 	delta: 1
			// });
			this.$wsf.go(sceneName, params,'redirectTo');
		},
		// 返回筛选条件是否已经点击
		iscChooseBrandName(key, item, val) {
			if (key === '品牌') {
				return this.chooseBrandNames.indexOf(item) >= 0 || false;
			} else {
				let keyIdx = this.chooseAttributes.findIndex(el => {
					return el.name === key;
				});
				if (keyIdx >= 0) {
					return this.chooseAttributes[keyIdx].values.indexOf(item) >= 0 || false;
				} else {
					return false;
				}
			}
		},
		// 筛选排序
		filterChoose(item, index) {
			this.flowList = [];
			this.searchParams.pageNum = 1;
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
				this.searchParams.sort = 1;
			} else if (this.filterItemIndex == 1 && this.priceSort == 1) {
				this.searchParams.sort = 2;
			} else if (this.filterItemIndex == 1 && this.priceSort == 0) {
				this.searchParams.sort = 3;
			} else if (this.filterItemIndex == 2) {
				this.searchParams.sort = 4;
			}

			this.getSearchList();
		},
		getSearchList(){
			console.log("进入了商品列表方法--",this.isLoading,!this.hasMore)
			let that = this;
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.PageAgencyStore(this.searchParams).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				console.log('店铺商品列表-----', res);
				if (res.code === 200) {
					let list = res.data.list
					list.forEach(item => {
						item.finalPrice = item.price
						item.name = item.spuName
					})
					this.flowList = this.flowList.concat(list);
					console.log(this.flowList, 'this.flowList');
					this.searchParams.pageNum++;
					this.hasMore = res.data.list.length === 10;
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		}

	}
};
</script>

<style lang="scss" scoped>
.applet-spulist-wrap {
	min-height: 100%;
	// background-color: #fff;
	// 头部样式
	.applet-spulist-header {
		z-index: 10080;
		position: sticky;
		top: 0;
		background-color: #fff;
		transition: all 0.3s;
		// 搜索框样式
		.applet-search-wrap {
			z-index: 10080;
			padding: 12rpx 24rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.search-input {
				padding-left: 20rpx;
				display: inline-flex;
				align-items: center;
				width: 100%;
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
				height: 38rpx;
				width: 1px;
				background-color: #e1e1e1;
			}
			.applet-shops-navbar-filter-btn {
				width: 200rpx;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
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
	// 内容样式
	.applet-spulist-body {
		position: relative;
		background-color: #fff;
		padding: 12rpx 24rpx 60rpx;
		.bg_color{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 300rpx;
			background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
			background: -moz-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
			background: -webkit-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
			background: -webkit-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
			background: -o-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
			background: -ms-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
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
</style>
