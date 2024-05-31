<template>
	<view>
		<view class="applet-order-list-wrap">
			<view class="headerbox" :style="{ paddingTop: headerboxTop + 'px' }">
        		<back-top class="head-back-top" ref="headerNav" title="我的订单" :isShowSearch="false" @toBack="back"></back-top>
				<view class="head-search" @click="goToOrder">
					<image class="search-img" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" mode="widthFix"> </image>
					<text class="search-text">搜索我的订单</text>
				</view>
				<!-- 头部 Tabs -->
				<view class="applet-order-list-tabs">
					<view v-for="(item, index) in orderStatusList" :key="item.status" class="list-tab-item" @tap="changeOrderStatus(index)"> 
						<view class="tab-name">
							<view v-if="orderMessageCount[item.badgeKey] > 0" class="tab-item-badge" :class="orderMessageCount[item.badgeKey] < 10 ? 'badge1' : orderMessageCount[item.badgeKey] < 100 ? 'badge2' : 'badge3'">{{ orderMessageCount[item.badgeKey] | badgeFilter}}</view>
							{{ item.name }}
						</view>
					</view>
					<view class="tab-item-active" :style="[tabBarStyle]"></view>
				</view>
      		</view>
			<view :style="{ height: headerboxTop + 'px'}"></view>
			

			<view class="conten-box">
				<!-- 轮播图 -->
				<view class="swipe-item" v-if="swipeContent && swipeContent.list && swipeContent.list.length > 0">
					<swipe :isShowIndicatorDots="false" class="swipe-item" :config="swipeContent"></swipe>
				</view>

				<view v-if="orderList.length === 0 && !isEmpty">
					<loaddingPage></loaddingPage>
				</view>

				<!-- 缺省 -->
				<view class="applet-order-list-isEmpty u-flex flex-column u-padding-top-64" v-if="isEmpty">
					<image style="height: 320rpx;width: 320rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" mode=""></image>
					<view class="u-padding-top-8rpx" style="color: #444;padding-bottom: 64rpx;">您还没有相关订单～</view>
				</view>

				<!-- 内容区 -->
				<view v-if="!isEmpty && orderList.length > 0">
					<view>
						<template v-for="(item, index) in orderList">
							<!-- 订单卡片 -->
							<orderListItem :orderItem="item" :key="index" @orderOperation="orderOperation"></orderListItem>
						</template>
					</view>
					<u-loadmore :status="loadmore" margin-top="36" bg-color="#F3F3F3" color="#c3c3c3" font-size="22" :load-text="loadText" />
				</view>

				<!-- 热销商品模块 -->
				<view v-if="showRecommend" class="applet-template-recommend">
					<wsf-goods-list title="hot" ref="recommedList" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
				</view>
			</view>
		</view>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" z-index="999" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>

		<orderSecondConfirm ref="orderSecondConfirm" @confirmResearch="confirmResearch"></orderSecondConfirm>
		
	</view>
</template>
<script>
import { orderStatusList } from '@/common/wsfRules.js';
import { priceFilter } from '@/common/wsfFilter.js';
import orderListItem from '../../components/orderList/orderListItem.vue';
import backTop from '../orderSearch/headerSearch.vue';
import swipe from '@/pages/index/components/swipe/index.vue';
import orderSecondConfirm from '@/components/orderSecondConfirm.vue';
import loaddingPage from 'orderModule/components/loaddingPage'
export default {
	components: {
		orderListItem,
		backTop,
		swipe,
		orderSecondConfirm,
		loaddingPage
	},
	filters: {
		badgeFilter(val) {
			if(val < 100) {
				return val
			} else {
				return '99+'
			}
		}
	},
	data() {
		return {
			safeTopBarHeight: getApp().globalData.safeTopBarHeight, // 当前手机头部的安全导航栏
			orderStatusList: [], // 订单列表
			flowList: [], // 推荐商品瀑布流
			orderIndex: 0, // 订单Idx
			orderList: [], // 订单列表
			isEmpty: false, // 缺省状态
			hasMore: true, // 是否还有更多
			isLoading: false, // 正在加载
			queryForm: {
				pageType: 6,
				pageNum: 0,
				pageSize: 10,
				status: -1 // 订单状态
			},
			RecommendQueryForm: {
				pageType: 6,
				pageNum: 0,
				pageSize: 10,
			},
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的～'
			},
			cancelPopupShow: false, // 弹出组件状态
			priceFilter,
			isShowStore: 0,
			scrollTop: 0,
			isVirtual: false, //虚拟商品标识
			orderType: '', // 判断是否是电动车订单
			barStyle: { bottom: '-4rpx', backgroundImage: 'linear-gradient(#FF5F2E, #FF0A35)'},
			badgeOffset: [0, 2],
			headerboxTop: 0,
			showRecommend: false, // 显示热销商品
			swipeContent: null, // 轮播图信息
			orderMessageCount: {},
			tabBarWidth: 375 / 4 // 页面宽度
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	computed: {		
		loadmore() {
			if (this.isLoading) {
				return 'loading';
			} else {
				return this.hasMore ? 'loadmore' : 'nomore';
			}
		},
		// 移动bar的样式
		tabBarStyle() {
			let style = {
				transform: `translateX(${(this.orderIndex + 0.5) * (this.tabBarWidth)}px) translateX(-50%)`,
			};
			return style;
		},
	},
	onLoad(options) {
		this.orderStatusList = orderStatusList.filter(item=>{
			return item.status != 7
		});
		if(options.status) {
			this.queryForm.status = options.status;
			this.orderIndex = this.orderStatusList.findIndex(el => {
				return el.status == options.status;
			});
		}
		let { capsule, relScreenWidth } = getApp().globalData
		let { height, top } = capsule;
        let { statusBarHeight } = uni.getSystemInfoSync()
		this.headerboxTop = 2 * top - statusBarHeight + height
		this.tabBarWidth = relScreenWidth / 4

		this.queryPersonConfigTemp()
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
		console.log('onShow: orderStatusList', orderStatusList);
		this.resetQueryForm();
		this.loadOrderList();
		this.loadOrderCount()
	},
	onPullDownRefresh() {
		this.resetQueryForm();
		this.loadOrderList();
	},
	onReachBottom() {
		console.log('我到页面最底部了~');
		if (this.showRecommend) {
			// 加载推荐列表
			this.loadRecommend();
		} else {
			// 获取订单列表
			this.loadOrderList();
		}
	},
	methods: {
		// 查询轮播
		queryPersonConfigTemp() {
			this.$u.api.queryPersonConfigTemp(104).then(res => {
				if(res.code === 200) {
					let swipeConfigswipeConfig  = JSON.parse(res.data.content) || {}
          			this.swipeContent = swipeConfigswipeConfig.contentList[0] || null

					// 过滤掉没有图片的轮播
					if(this.swipeContent && this.swipeContent.list && this.swipeContent.list.length > 0) {
						this.swipeContent.list = this.swipeContent.list.filter(item => {
							return item.url
						})
					}
				}
			})	
		},

		goToOrder(){
			this.$wsf.go('orderSearch');
		},

		/* 获取用户订单数量 */
		loadOrderCount() {
			let that = this;
			this.$u.api.QueryOrderMessageCount().then(res => {
				if (res.code === 200) {
					let orderMessageCount = {
						toPayCount: res.data.toPayCount,
						toDeliverCount: res.data.toDeliverCount,
						toReceiptAndDeliverCount: res.data.toReceiptAndDeliverCount,
						toEvaluateCount: res.data.toEvaluateCount,
						backOrderCount: res.data.backOrderCount,
						toReceiptAndDeliverCount: res.data.toReceiptAndDeliverCount,
					};
					that.orderMessageCount = orderMessageCount;
				}
			});
		},

		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			// this.$wsf.go('SkuDetail', { skuId: e.id });
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
		},
		// 获取订单列表
		loadOrderList() {
			let that = this;
			if (this.isEmpty || !this.hasMore || this.isLoading) return;
			this.isLoading = true;
			let { pageNum } = this.queryForm
			this.$u.api
				.QueryCustomerOrders(this.queryForm)
				.then(res => {
					this.isLoading = false;
					uni.stopPullDownRefresh();
					if(pageNum === 0) {
						this.orderList = []
					}
					if (this.queryForm.pageNum === 0 && res.data.list.length === 0) {
						this.isEmpty = true;
						this.showRecommend = true
						this.RecommendHasMore = true
						this.loadRecommend();
					} else {
						this.orderList = this.orderList.concat(
							res.data.list.map(el => {
								el.status = Number(el.status);
								return el;
							})
						);
						this.queryForm.pageNum++;
						this.hasMore = res.data.list.length === 10;

						if(!this.hasMore) {
							this.showRecommend = true
							this.RecommendHasMore = true
							this.loadRecommend();
						}
						console.log(this.orderList, 'this.orderListthis.orderListthis.orderList');
					}
				})
				.catch(err => {
					this.isLoading = false;
				});
		},
		// 获取推荐商品列表
		loadRecommend() {
			let that = this;
			if (this.isLoading || !this.RecommendHasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.RecommendQueryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				console.log('res', res);
				if (res.code === 200) {
					this.flowList = this.flowList.concat(
						res.data.map(item => {
							item.price = this.priceFilter(item.price);
							return item;
						})
					);
					this.RecommendQueryForm.pageNum++;
					this.RecommendHasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
		// 切换订单列表状态
		changeOrderStatus(e) {
			if(this.orderIndex === e) {
				return
			}
			this.orderIndex = e;
			this.resetQueryForm();
			this.queryForm.status = this.orderStatusList[e].status;
			this.loadOrderList();
		},
		// 重置搜索条件
		resetQueryForm() {
			this.isEmpty = false;
			this.hasMore = true;
			this.isLoading = false
			this.queryForm.pageNum = 0;
			this.RecommendQueryForm.pageNum = 0
			this.showRecommend = false
			this.orderList = []
		},

		

		
		
		orderOperation(item, type) {
			this.$refs.orderSecondConfirm.orderOperation(item, type)
		},

		confirmResearch() {
			this.resetQueryForm();
            this.loadOrderList();
            this.loadOrderCount();
		},
		
		// 前往物流详情
		goToTraces(item) {
			this.$wsf.go('trackingCells');
		}
	}
};
</script>
<style lang="scss" scoped>
.applet-order-list-wrap {
	padding-bottom: 60rpx;
	.headerbox {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		background-color: #fff;
	}
	.conten-box {
		overflow: hidden;
		padding-top: 152rpx;
	}
	.swipe-item {
		margin-top: 20rpx;
		/deep/ .applet-template-swiper {
			padding: 0 16rpx;
		}
	}
	.head-search {
		margin: 0 24rpx;
		margin-bottom: 12rpx;
		padding-left: 16rpx;
		display: flex;
		align-items: center;
		height: 64rpx;
		background: #F2F2F2;
		border-radius: 38rpx;
		.search-img {
			width: 32rpx;
			height: 32rpx;
		}
		.search-text {
			padding-left: 16rpx;
			width: 306px;
			height: 18px;
			font-size: 28rpx;
			line-height: 18px;
			color: #c6c6c6;
		}
	}
	.applet-order-list-tabs {
		display: flex;
		// background-color: #fff;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		.list-tab-item {
			position: relative;
			padding-top: 6px;
			text-align: center;
			font-size: 26rpx;
			color: #444444;
			height: 76rpx;
			flex: 1;
		}
		.tab-item-active {
			position: absolute;
			font-weight: 600;
			color: #191919;
			bottom: 12rpx;
			transition-duration: 0.3s;
			border-radius: 4rpx;
			width: 52rpx;
			height: 8rpx;
			background-image: linear-gradient(#FF5F2E, #FF0A35);
		}
		.tab-name {
			position: relative;
			display: inline-block;
		}
		.tab-item-badge {
			padding: 0 10rpx;
			position: absolute;
			top: -8rpx;
			left: 90%;
			background-size: 100% 100%;
			font-size: 16rpx;
			height: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
		}
		.badge1 {
			background-image:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge1.png');
		}
		.badge2 {
			background-image:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge2.png');
		}
		.badge3 {
			background-image:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge3.png');
		}
	}
	
}
.applet-template-recommend {
	padding: 0 24rpx;
}

/deep/.wsf-mode-footer{
	height: auto !important;
}
</style>
