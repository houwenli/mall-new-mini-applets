<template>
	<view>
		<view class="applet-order-list-wrap">
			<view class="headerbox" :style="{ paddingTop: headerboxTop + 'px', backgroundColor:!showDatePopup ? '#fff' : '#F6F6F6',
				boxShadow: !showDatePopup ? ' 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.1)' : '' }">
        <back-top class="head-back-top" ref="headerNav" title="" :isShowSearch="false" @toBack="back" :topbackBgColor="showDatePopup ? '#f6f6f6' : '#fff'"
					:topSearch="!showDatePopup" @goToSearchPage="goToSearchPage"></back-top>
				
				<!-- 头部 Tabs -->
				<view class="applet-order-list-tabs" v-if="!showDatePopup">
					<scroll-view scroll-x="true" enhanced="true" show-scrollbar="false" class="list-tab-box">
						<view class="list-tab-box-contaier">
							<view v-for="(item, index) in orderStatusList" :key="item.status" class="list-tab-item" @tap="changeOrderStatus(index)"> 
								<view class="tab-name" :class="{'tab-name-active' : orderIndex==index} ">
									{{ item.name }}
								</view>
								<view class="tab-item-active"  v-if="orderIndex==index"></view>
								<!-- <view class="tab-item-active" :style="[tabBarStyle]" v-if="orderIndex==index"></view> -->
							</view>
						</view>
					</scroll-view>
					<view class="applet-order-list-tabs-filter" @click="openScreen">
						<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_chlence.png"></image>
					</view>
					
				</view>
      </view>
			<view :style="{ height: headerboxTop + 'px'}"></view>
			
			<view class="conten-box">				

				<view v-if="orderList.length === 0 && !isEmpty && isLoading">
					<loaddingPage></loaddingPage>
				</view>

				<!-- 缺省 -->
				<view class="applet-order-list-isEmpty u-flex flex-column" v-if="isEmpty">
					<image style="height: 320rpx;width: 320rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" mode=""></image>
					<view class="u-padding-top-20rpx" style="color: #999;padding-bottom: 64rpx;font-size: 30rpx;">您还没有相关订单～</view>
				</view>
				<!-- 第一页报错 -->
				<view class="applet-order-list-isEmpty u-flex flex-column" v-if="noNetwork">
					<image style="height: 320rpx;width: 320rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" mode=""></image>
					<view class="u-padding-top-20rpx" style="color: #999;padding-bottom: 64rpx;font-size: 30rpx;">系统错误，请稍后重试～</view>
				</view>
				<!-- 内容区 -->
				<view v-if="!isEmpty && orderList.length > 0">
					<view class="order-item" v-for="(item, index) in orderList" :key="index">
						<!-- 订单卡片 -->
						<orderListItem :orderItem="item" @reload="confirmResearch" :status="queryForm.status" @confirm="confirmEvent"></orderListItem>
					</view>
					<u-loadmore class="loadmore" :status="loadmore" margin-top="36" color="#c3c3c3" font-size="22" :load-text="loadText" />
				</view>

				<!-- 热销商品模块 -->
				<!-- <view v-if="showRecommend" class="applet-template-recommend">
					<wsf-goods-list title="hot" ref="recommedList" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
				</view> -->
			</view>
		</view>

		<!-- 筛选弹窗 -->
    <order-filter-popup :show.sync="showDatePopup" @confirmFilter="confirmFilter" :headerboxTop="headerboxTop" @closeDatePopup="showDatePopup=false"></order-filter-popup>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" z-index="999" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>	
		
		<smartConfirm
			:show="confirmShow"
			:title="confirmInfo.title" 
			:confirmText="confirmInfo.confirmText"
			:cancelText="confirmInfo.cancelText"
			@cancel="activeCancel"
			@confirm="activeConfirm">
			<template v-if="confirmInfo.eventType === 4">
				<div class="pay-confirm-content">
        			<div>
        			  <span>福气值已抵扣：</span>
        			  <span style="color: #fe3040">{{ confirmInfo.integralAmount }}</span>
        			</div>
        			<div>
        			  <span>仍需支付：</span>
        			  <span style="color: #fe3040">{{ confirmInfo.stillNeedPayAmount }}</span>
        			</div>
      			</div>
			</template>
		</smartConfirm>
	</view>
</template>
<script>
// 方法 接口
import { ORDER_STATUS_LIST } from '@/common/constants/order'
import { priceFilter } from '@/common/wsfFilter.js';
import { queryOrderByUserId } from '@/common/smart-api/orderApi'

// 公共组件
import swipe from '@/pages/index/components/swipe/index.vue';
import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";

// 组件
import orderListItem from './components/orderList/orderListItem.vue';
import orderFilterPopup from './components/orderFilterPopup.vue'
import loaddingPage from './components/loaddingPage.vue'
import backTop from './components/headerSearch.vue';

export default {
	components: {
		orderListItem,
		backTop,
		swipe,
		smartConfirm,
		loaddingPage,
		orderFilterPopup
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
			orderStatusList: ORDER_STATUS_LIST, // 订单列表
			flowList: [], // 推荐商品瀑布流
			orderIndex: 0, // 订单Idx
			orderList: [], // 订单列表
			isEmpty: false, // 缺省状态
			hasMore: true, // 是否还有更多
			isLoading: false, // 正在加载
			noNetwork: false, // 无网络，主接口报错
			queryForm: {
				nextPageTime: '',
				pageSize: 10,
				status: -1, // 订单状态
				labels: [], // 标签查询条件
			},
			RecommendQueryForm: {
				pageNo: 0,
				pageSize: 10,
			},
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的～'
			},
			cancelPopupShow: false, // 弹出组件状态
			priceFilter,
			scrollTop: 0,
			isVirtual: false, //虚拟商品标识
			orderType: '', // 判断是否是电动车订单
			barStyle: { bottom: '-4rpx', backgroundImage: 'linear-gradient(#FF5F2E, #FF0A35)'},
			badgeOffset: [0, 2],
			headerboxTop: 0,
			showRecommend: false, // 显示热销商品		
			orderMessageCount: {},
			tabBarWidth: 375 / 5, // 页面宽度
			showDatePopup:false,//是否显示筛选订单弹窗

			confirmInfo: {},
			confirmShow: false
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
		this.tabBarWidth = relScreenWidth / 5		
	},
	onShow() {
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
			// this.loadRecommend();
		} else {
			// 获取订单列表
			this.loadOrderList();
		}
	},
	methods: {	
		// 确定筛选弹窗
		confirmFilter(val) {
			this.resetQueryForm();
			this.queryForm.labels = val || []
			this.loadOrderList()
			// 关闭弹窗
			this.showDatePopup = false
		},
		// 打开筛选弹窗
		openScreen(){
			this.showDatePopup = !this.showDatePopup
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

		// 获取订单列表
		loadOrderList() {
			if (this.isEmpty || !this.hasMore || this.isLoading) return;
			this.isLoading = true;
			this.noNetwork = false;
			let { nextPageTime } = this.queryForm
			let params = {
				...this.queryForm
			};
			if (params.status < 0) {
				delete params.status
			}
			queryOrderByUserId(params)
				.then(res => {
					this.isLoading = false;
					uni.stopPullDownRefresh();
					if(nextPageTime === '') {
						this.orderList = []
					}
					if (nextPageTime === '' && res.data.length === 0) {
						this.isEmpty = true;
						this.showRecommend = true
						this.RecommendHasMore = true
						// this.loadRecommend();
					} else {
						this.orderList = this.orderList.concat(
							res.data.map(el => {
								el.status = Number(el.status);
								return el;
							})
						);
						// 设置新的nextPageTime，值为最后一个订单的nextPageTime，分页需要
						let lastOrder = this.orderList[this.orderList.length - 1]
						this.queryForm.nextPageTime = lastOrder.nextPageTime || ''
						this.hasMore = res.data.length === this.queryForm.pageSize;

						if(!this.hasMore) {
							this.showRecommend = true
							this.RecommendHasMore = true
							// this.loadRecommend();
						}
						console.log(this.orderList, 'this.orderListthis.orderListthis.orderList');
					}
				})
				.catch(err => {
					this.isLoading = false;
					// 只有第一页的时候才报系统错误
					if (!this.queryForm.nextPageTime) {
						this.noNetwork = true;
					}
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
					this.RecommendQueryForm.pageNo++;
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
			this.queryForm.nextPageTime = '';
			this.RecommendQueryForm.pageNo = 0
			this.showRecommend = false
			this.orderList = []
		},

		confirmResearch() {
			this.resetQueryForm();
			this.loadOrderList();
			this.loadOrderCount();
		},
		
		// 前往物流详情
		goToTraces(item) {
			this.$wsf.go('trackingCells');
		},

		// 前往搜索列表页
		goToSearchPage() {
			this.$smart.go("smartOrderSearch", {
				status: this.queryForm.status
			});
		},

		confirmEvent(data) {
			this.confirmInfo = data 
			this.confirmShow = true
		},
		activeCancel() {
			this.confirmShow = false
		},
		activeConfirm() {
			this.$smart.go(this.confirmInfo.appletLink);
			this.confirmShow = false
		},
	}
};
</script>
<style lang="scss" scoped>

.applet-order-list-isEmpty {
	padding-top: 300rpx;
}

.loadmore /deep/ {
	.u-line {
		display: none;
	}
}
.applet-order-list-wrap {
	padding-bottom: 60rpx;
	.headerbox {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		background-color: #fff;
		/deep/ .head-search {
			border-color: #191919;
		}
	}
	.conten-box {
		overflow: hidden;
		padding-top: 97rpx;
	}

	.order-item {
		margin-top: 16rpx;
	}
	.order-item:first-child {
		margin-top: 0rpx;
	}
	
	
	.applet-order-list-tabs {
		display: flex;
		// background-color: #fff;
		border-radius: 0 0 20rpx 20rpx;
		// overflow: hidden;
		width: 100%;
		&-filter{
			width: 84rpx;
			height: 80rpx;
			background: #fff;
			position: relative;
			// right: 0;
			// top: 0;
			image{
				position: absolute;
				right: 30rpx;
				top: 24rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}
		&-filter::before{
			position: absolute;
			top: 22rpx;
			left: 0;
			content: '';
			display: block;
			width: 2rpx;
			height: 36rpx;
			background: #E1E1E1;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.1);
			// border: 2rpx solid #E1E1E1;
		}
		.list-tab-box{
    	width: calc(100% - 84rpx);								
			&-contaier{
    		display: flex;
				.list-tab-item {
					position: relative;
					padding-top: 20rpx;
					// text-align: center;
					font-size: 26rpx;
					color: #191919;
					height: 80rpx;
					// flex: 1;
					width: 148rpx;
					text-shadow: 0px 0px 20px rgba(0,0,0,0.1);
					display: flex;
    			justify-content: center;
					flex-shrink: 0;
				}
			}			
		}
		.tab-item-active {
			position: absolute;
			font-weight: 600;
			color: #191919;
			bottom: 24rpx;
			z-index: -1;
			transition-duration: 0.3s;			
			width: 60rpx;
			height: 12rpx;
			background: #FFBE0C;			
			border-radius: 6rpx;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.1);
		}
		.tab-name {
			position: relative;
			display: inline-block;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #6E6E6E;
		}
        .tab-name-active{
            font-weight: 500;
            color: #191919;
            font-family: PingFangSC-Medium, PingFang SC;
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

.pay-confirm-content {
	font-size: 14rpx;
	padding-top: 32rpx;
	text-align: center;
	line-height: 36rpx;
}
</style>