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
		>
			<view slot="searchBar" class="search_wrap">
				<wsf-search
					v-model="queryString"
					style="width:100%"
					:clearable="false"
					:disabled="true"
					bgColor="#F2F2F2"
					placeholderStyle="color: c6c6c6"
					inputBgColor="#F2F2F2"
					:showRight="false"
					:placeholder="type === 'gift' ? '在结果中搜索商品' : '请输入搜索关键字'"
					@click="searchFun"
				></wsf-search>
			</view>
			<view class="block" slot="additional"></view>
		</wsf-nav-bar>
		<view class="applet-spulist-header">
			<!-- 商品列表头部 - 店铺信息模块 -->
			<view class="applet-shops-wrap" v-if="canSearchShops" @click="this.$wsf.go('StoreIndex', { storeId: storeInfo.id })">
				<view class="applet-shops-info">
					<image class="applet-shops-avatar" :src="storeInfo.avatarPicture"></image>
					<view class="applet-shops-title">
						<view class="applet-shops-title-name">{{ storeInfo.storeName }}</view>
						<!-- <view class="applet-shops-title-follow">{{ storeInfo.followNum || 0 }}人关注</view> -->
					</view>
				</view>
				<view class="applet-shops-btn">
					<span>前往店铺</span>
					<image class="applet-shops-btn-right" style="height: 18rpx;width: 10rpx;" src="@/static/img/you.png" mode=""></image>
				</view>
			</view>
			<!-- 商品列表头部 - 导航搜索框模块 -->
			<view class="applet-shops-navbar">
				<view class="applet-shops-navbar-dropdown">
					<wsf-dropdown active-color="#191919"  isSubscript="true" inactiveColor="#444444" v-model="searchParams.sortItems" @open="this.maskShow = true" @close="this.maskShow = false" @change="sortItemChange">
						<wsf-dropdown-item title="综合" :options="sortItems.priceFilter" type="price"></wsf-dropdown-item>
						<wsf-dropdown-item title="销量" :options="sortItems.saleNum"></wsf-dropdown-item>
						<wsf-dropdown-item title="最新上架" :options="sortItems.skuUpTime"></wsf-dropdown-item>
					</wsf-dropdown>
				</view>

				<view class="applet-shops-navbar-line"></view>

				<view style="width: 32rpx;height: 40rpx;margin: 0 24rpx;" @click="setlistStyle">
					<image style="width: 32rpx;height: 32rpx;" v-show="listStyle=='column'" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/broadwise_list.png"></image>
					<image style="width: 32rpx;height: 32rpx;" v-show="listStyle=='waterfall'" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/direction_list.png"></image>
				</view>

				<view class="applet-shops-navbar-line"></view>

				<view class="applet-shops-navbar-filter-btn" :class="[{ acitve: isFilter }]" @click="openFilterPopup">
					筛选
					<image style="height: 32rpx;width: 34rpx;margin-left: 12rpx" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/screening.png" mode=""></image>
				</view>
			</view>
			<view v-if="type==='gift'" class="explain">以下商品可使用面值{{cardPrice || 0}}元的礼品卡进行购买</view>
		</view>
		</view>

		<!-- 商品列表模块 -->
		<view class="applet-spulist-body">
			<view class="bg_color" :style="{'display':listStyle == 'column'?'none':'block'}" v-if="flowList.length!=0"></view>
			<wsf-goods-list
				ref="goodslist"
				:list="flowList"
				:loadStatus="loadStatus"
				:showStyle="listStyle"
				:fromPage="fromPage"
				loadMoreBgColor='#f6f6f6'
				loadMoreTextColor="#999"
				@goodsClick="goodsClick($event)"
				@shopsClick="shopsClick($event)"
				@handleShareProduct="handleShareProduct"
			></wsf-goods-list>
		</view>

		<!-- 筛选弹窗模块 -->
		<u-popup v-model="screenPopup" z-index="10999" mode="right" width="620rpx" safe-area-inset-bottom :custom-style="{top: top}" :mask-custom-style="{top: top}" :zoom="false">
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
										@click="() => {filtersClick(key, item)}"
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
import {visit} from '@/common/visit.js'
import { priceFilter } from "@/common/wsfFilter.js";
export default {
	components: {
		wsfDropdown,
		wsfDropdownItem,
		wsfGoodsList
	},
	data() {
		return {
			priceFilter,
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
				}
			},
			defaultStoreId: -1, // 存放storeId
			touchStart: 0, // 点击时窗口的高度
			headerFix: false, // 当前头部区域是否固定定位
			queryString: '', // 查询搜索词
			listStyle: 'waterfall', // 商品列表展示样式
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

			freeShipping: false, // 包邮过滤
			promotion: false, // 促销过滤
			priceRange: {
				min: '',
				max: '',
			}, //  价格区间
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
			choseProduct: null,

			promoteId: null,
			// --- end ---
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
		this.searchParams.storeId = options.storeId || -1;
		this.searchParams.cateId = options.cateId || -1;
		this.searchParams.storeCateId = options.storeCateId || -1;
		// 二级分类id
		this.searchParams.secondCateId = options.secondCateId || "";
		this.isSearchCate = options.isSearchCate || 0;
		this.defaultStoreId = options.storeId || -1;
		if(options.type&& options.type === 'gift'){
			this.type = options.type
			this.cardPrice = options.cardPrice
			this.storeIds = options.storeIds.split(',')
		}

		// 来自哪个页面
		if (options.fromPage) {
			this.fromPage = options.fromPage
		}
		// 搜索词埋点
		if (this.queryString) {
			this.$u.api.searchWordsVisit({
				searchName: this.queryString
			})
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

	// 小程序分享方法
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
		setlistStyle(){
			this.listStyle = this.listStyle == 'column' ? 'waterfall' : 'column'
		},
		clickBackBtn() {
			// this.$wsf.go('Index')
			// uni.getCurrentPages()
			uni.navigateBack();
		},
		searchFun(){
			let searchValue
			if(this.isSearchCate) {
				searchValue = ''
			} else {
				searchValue = this.queryString
			}

			let query = { type: 1, storeId:this.searchParams.storeId, searchValue, giftType: this.type==='gift'? 'gift':'', fromPage: this.fromPage }

			// 分销分享员信息
			if(this.promoteId) {
				query.promoteId = this.promoteId
			}

			this.$wsf.go('Search', query)
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
			if(this.isSearchCate == '1') {
				this.searchParams.queryString = ''
			} else {
				this.searchParams.queryString = this.queryString
			}

			// 如果来自分销的搜索传1
			if(['distributionIndex', 'distributionUserPage'].includes(this.fromPage) ) {
				this.searchParams.isDistribution = 1
			}

			this.$u.api.SearchSpu(this.searchParams).then(res => {
				visit(this,'搜索页',this.searchParams)
				// 判断是否搜索到了店铺
				// this.canSearchShops = !!res.data.storeInfo;
				// 数据加载完，结束进程
				if (!res.data) {
					this.loadStatus = 'nomore';
					return
				}
				this.canSearchShops = this.isShowStore > 0 ? !!res.data.storeInfo : false;
				this.storeInfo = res.data.storeInfo;
				this.loadStatus = 'loadmore';
				if(res.data.esSearchResponse.datas && res.data.esSearchResponse.datas.length) {
					this.flowList = this.flowList.concat(res.data.esSearchResponse.datas);
				}
				// if(this.showAggRes){
					this.aggRes = res.data.esSearchResponse.aggRes;
					// this.showAggRes = false
				// }
				if (res.data.esSearchResponse.datas===null || res.data.esSearchResponse.datas.length < 10) {
					this.loadStatus = 'nomore';
				}
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
						this.$wsf.go('SkuDetail', { s: e.skuId, c: res.data.data });
					});
					return 
				}
				
				// 分享购跳转
				this.$wsf.go('distributionSkuDetail', {
					skuId: e.skuId
				});

        		return
      		}

			// sourceType-4 电动车数据跳转电动车详情
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.skuId});
			} else {
        // 普通商品详情
				this.$wsf.go('SkuDetail', { skuId: e.skuId, sourceType: e.sourceType, storeIdNumber: e.storeId });
			}
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
				cateId: this.searchParams.cateId, // 分类
				storeId: this.defaultStoreId || -1, // 店铺
				storeCateId: -1, // 店铺分类
				queryString: this.queryString, // 关键字
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

			this.searchParams.freeShipping = this.freeShipping ? 1 :-1;
			this.searchParams.promotion = this.promotion ? 1 :-1;
			this.searchParams.priceRange = this.priceRange;

			this.screenPopup = false;
			this.$refs.goodslist.clearList();

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
					scene: `n=${this.choseProduct.skuId}&c=${this.shareParams.distributionCode}`,
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
		padding: 20rpx 16rpx 60rpx;
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
