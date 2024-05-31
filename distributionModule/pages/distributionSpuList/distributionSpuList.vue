<template>
	<view class="applet-spulist-wrap" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
		<!-- 商品列表头部模块 -->
		<view class="applet-spulist-header" :style="[showHeader]">
			<!-- 商品列表头部 - 搜索模块 -->
			<view class="applet-search-wrap">
				<view class="applet-search-bar">
					<u-search
						@click="searchFun"
						height="64"
						color="#000"
						search-icon-color="#9D9D9D"
						placeholder-color="#9D9D9D"
						:placeholder="type==='gift'? '在结果中搜索商品':'请输入关键字'"
						disabled
						v-model="searchParams.queryString"
						:show-action="false"
					></u-search>
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
			<view class="applet-shops-navbar">
				<view class="applet-shops-navbar-dropdown">
					<wsf-dropdown active-color="#e60113" v-model="searchParams.sortItems" @open="this.maskShow = true" @close="this.maskShow = false" @change="sortItemChange">
						<wsf-dropdown-item title="综合" :options="sortItems.priceFilter" type="price"></wsf-dropdown-item>
						<wsf-dropdown-item title="销量" :options="sortItems.saleNum"></wsf-dropdown-item>
						<wsf-dropdown-item title="最新上架" :options="sortItems.skuUpTime"></wsf-dropdown-item>
					</wsf-dropdown>
				</view>

				<view class="applet-shops-navbar-line"></view>

				<view class="applet-shops-navbar-filter-btn" :class="[{ acitve: isFilter }]" @click="openFilterPopup">
					筛选
					<image style="height: 28rpx;width: 28rpx;" src="@/static/img/screening@2x.png" mode=""></image>
				</view>
			</view>
			<view v-if="type==='gift'" class="explain">以下商品可使用面值{{cardPrice || 0}}元的礼品卡进行购买</view>
		</view>

		<view>
			<view v-if="flowList && flowList.length">

				<view v-for="(item, index) in flowList" :key="index">
					<goods-item :item="item" :fromUser="fromPage=='distributionIndex'" @handleShareProduct="handleShareProduct"></goods-item>
				</view>
				<u-loadmore ref="backTop" margin-top="40" margin-bottom="40" :loadText="loadText" :status="loadStatus" bg-color="#f5f5f5"></u-loadmore>
			</view>
			<view class="nodatebox" v-else>
				<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/bge.png" mode=""></image>
				<text class="result">没有搜索结果</text>
				<text class="goods">没有找到相关宝贝</text>
			</view>
			<view style="height: 170rpx"></view>
		</view>

		<!-- <view class="applet-spulist-body" :style="{'background':listStyle == 'column'?'#fff':'#f5f5f5'}">
			<view class="bg_color" :style="{'display':listStyle == 'column'?'none':'block'}" v-if="flowList.length!=0"></view>
			<wsf-goods-list
				ref="goodslist"
				:list="flowList"
				:loadStatus="loadStatus"
				:showStyle="listStyle"
				:loadMoreBgColor ='listStyle == "column" ? "#FFF" : "#f5f5f5"'
				loadMoreTextColor="#999"
				@goodsClick="goodsClick($event)"
				@shopsClick="shopsClick($event)"
			></wsf-goods-list>
		</view> -->

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
						<!-- <view :class="[{ active: isWsfStore }, 'applet-spulist-filter-model-click-item']" @click="isWsfStore = !isWsfStore">商城自营</view> -->
					</view>
					<!-- 筛选模块遍历 -->
					<template v-for="(val, key, i) in aggRes">
						<view class="applet-spulist-filter-model" :key="key" v-if="val.length !== 0">
							<view class="applet-spulist-filter-model-title">{{ key }}</view>
							<!-- <u-line class="u-line" margin="0 0 20rpx 0"></u-line> -->
							<view class="applet-spulist-filter-model-list">
								<template v-for="(item, index) in val">
									<view
										:key="index"
										class="applet-spulist-filter-model-click-item u-line-1"
										:class="[{ active: iscChooseBrandName(key, item, val) }]"
										@click="filtersClick(key, item)"
									>
										{{ item }}
									</view>
								</template>
							</view>
						</view>
					</template>
				</scroll-view>
				<!-- 品牌列表 -->
				<!-- <view class="applet-spulist-filter-model">
					<view class="applet-spulist-filter-model-title">品牌</view>
					<u-line class="u-line" margin="0 0 20rpx 0"></u-line>
					<view class="applet-spulist-filter-model-list">
						<template v-for="(item, index) in brandList">
							<view :key="index" class="applet-spulist-filter-model-click-item u-line-1">{{ item.brandName }}</view>
						</template>
					</view>
				</view>
 -->
				<!-- 按钮区域 -->
				<view class="applet-spulist-filter-btn">
					<view class="applet-spulist-filter-btn-reset" @click="resetFilterPopup">重置</view>
					<view class="applet-spulist-filter-btn-comfirm" @click="confirmFilterPopup">确认</view>
				</view>
			</view>
		</u-popup>

		<!-- 遮罩层模块 -->
		<u-mask :show="maskShow" :mask-click-able="false"></u-mask>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
		<!-- 分享弹窗 -->
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
import wsfDropdown from '@/components/wsf-dropdown/wsf-dropdown.vue';
import wsfDropdownItem from '@/components/wsf-dropdown-item/wsf-dropdown-item.vue';
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import goodsItem from './goods-item.vue';

import {visit} from '@/common/visit.js'
export default {
	components: {
		wsfDropdown,
		wsfDropdownItem,
		wsfGoodsList,
		goodsItem
	},
	data() {
		return {
			showAggRes: true,
			searchParams: {
				// 搜索请求
				cateId: -1, // 分类
				storeId: -1, // 店铺
				storeCateId: -1, // 店铺分类
				queryString: '', // 关键字
				pageNum: 0, // 页码
				pageSize: 10, // 页容量
				sortItems: [], // 排序状态
				attributes: [], // 分类
				brandNames: [], // 品牌
				stockFilter: -1,
				freeShipping: -1,
				promotion: -1,
				priceRange: {
					min: "",
					max: ""
				},
				isDistribution:1
			},
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
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			loadText: {
				loadmore: '',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
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

			freeShipping: false, // 包邮过滤
			promotion: false, // 促销过滤
			priceRange: {
				min: '',
				max: '',
			}, //  价格区间
			storeIds:[],
			type: undefined,
			cardPrice:0,// 礼品卡金额
			fromPage:"", // 来自哪个页面搜索

			// 分享相关属性--start-----
			showShareModal:false,
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
			choseProduct: null,
		};
	},
	computed: {
		showHeader() {
			let style = {};
			style.transform = `translateY(${this.isShowSearchBar ? 0 : 'calc(-100% + 80rpx)'})`;
			return style;
		},
		searchParamsQueryString() {
			return this.searchParams.queryString;
		},
		isFilter() {
			return (
				this.searchParams.attributes.length > 0 ||
				this.searchParams.brandNames.length > 0 ||
				this.searchParams.stockFilter >= 0 ||
				this.searchParams.storeId === 0 ||
				this.searchParams.priceRange.min ||
				this.searchParams.priceRange.max ||
				this.searchParams.freeShipping >= 0 ||
				this.searchParams.promotion >= 0 ||
				false
			);
		}
	},
	watch: {
		searchParamsQueryString(n, o) {
			if (n === o) return;
			this.resetSearchParams();
			this.searchParams.queryString = n;
		}
	},
	onLoad(options) {
		this.searchParams.queryString = options.queryString || '';
		this.searchParams.storeId = options.storeId || -1;
		this.searchParams.cateId = options.cateId || -1;
		this.searchParams.storeCateId = options.storeCateId || -1;
		this.defaultStoreId = options.storeId || -1;
		if(options.type&& options.type === 'gift'){
			this.type = options.type
			this.cardPrice = options.cardPrice
			this.storeIds = options.storeIds.split(',')
		}
		this.fromPage = options.fromPage || "";
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
		goDetail(e) {
			this.$wsf.go('distributionSkuDetail', {
				skuId: e.skuId
			});
		},
		searchFun(){
			this.$wsf.go('Search', { type: 1, storeId:this.searchParams.storeId, searchValue: this.searchParams.queryString,fromPage:this.fromPage,giftType: this.type==='gift'? 'gift':'' })
			setTimeout(()=>{
				this.resetFilterPopup()
			},500)
		},
		getSearchList() {
			if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;
			this.loadStatus = 'loading';
			if(this.type === 'gift'){
				this.searchParams.storeIds = this.storeIds
			}
			console.log('--getSearchList------',this.searchParams);
			 this.$u.api.SearchSpu(this.searchParams).then(res => {
				// visit(this,'搜索页',this.searchParams)
				// 判断是否搜索到了店铺
				// this.canSearchShops = !!res.data.storeInfo;
				// this.canSearchShops = this.isShowStore > 0 ? !!res.data.storeInfo : false;
				// this.storeInfo = res.data.storeInfo;
				this.loadStatus = 'loadmore';
				let data = res.data && res.data.esSearchResponse || {}
				let result = data.datas || []
				this.flowList = this.flowList.concat(result);
				// if(this.showAggRes){
					console.log("分销搜索结果-----",this.flowList)
					this.aggRes = data.aggRes;
					// this.showAggRes = false
				// }
				if ( result < 10) {
					this.loadStatus = 'nomore';
				}
				this.hasMore = result.length === 10;
				this.searchParams.pageNum++;
			});
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
			this.$wsf.go('SkuDetail', { skuId: e.skuId, sourceType: e.sourceType, storeIdNumber: e.storeId });
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
			this.searchParams.isDistribution = 1;
			this.flowList = [];
			// this.$refs.goodslist.clearList();
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
				},
				isDistribution:1,
			};
			this.flowList = [];
			this.hasMore = true
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
		confirmFilterPopup() {
			if (this.priceRange.min && this.priceRange.max && this.priceRange.min > this.priceRange.max) {
				this.$u.toast(`最高价不得小于最低价`);
				this.priceRange.min = ''
				this.priceRange.max = ''
				return false
			}
			this.resetSearchParams();
			this.searchParams.storeId = this.isWsfStore ? 0 : this.defaultStoreId;
			this.searchParams.stockFilter = this.hasStock ? 0 : -1;
			this.searchParams.brandNames = this.chooseBrandNames;
			this.searchParams.attributes = this.chooseAttributes;
			this.searchParams.isDistribution =1
			this.searchParams.freeShipping = this.freeShipping ? 1 :-1;
			this.searchParams.promotion = this.promotion ? 1 :-1;
			this.searchParams.priceRange = this.priceRange;

			this.screenPopup = false;
			// this.$refs.goodslist.clearList();

			if (this.searchParams.attributes.length == 0 &&
				this.searchParams.brandNames.length == 0 &&
				this.searchParams.stockFilter == -1 &&
				!this.searchParams.priceRange.min &&
				!this.searchParams.priceRange.max &&
				this.searchParams.freeShipping == -1 &&
				this.searchParams.promotion == -1){
				this.isFilter = false
			}

			this.getSearchList();
		},
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
			this.screenPopup = false;
			// this.$refs.goodslist.clearList();
			// this.resetSearchParams()
			this.getSearchList();
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
			// 分享方法----------start-----------------
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
		// 分享方法----------end---------
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
	// 商品列表
	.goods-list-box {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 24rpx;
		box-sizing: border-box;
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
.nodatebox{
	display:flex;
	flex-direction:column;
	align-items:center;
	padding-bottom: 15%;
	image{
		width:190rpx;
		height:198rpx;
		margin-top:20%;
	}
	.result {
		color: #666;
		font-size:32rpx;
		margin: 20rpx 0 10rpx
	}
	.goods{
		font-size: 28rpx;
		color:#999
	}
}
</style>

