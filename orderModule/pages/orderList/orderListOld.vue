<template>
	<view style="padding-bottom: 148rpx">
		<view class="applet-order-list-wrap">
			<!-- 头部 Nav -->
			<wsf-nav-bar
				:fixed="true"
				:placeholder="true"
				:status-bar="true"
				title="订单列表"
				:shadow="false"
				:hasBack="true"
				bgColor="#fff"
				:additionalHeight="60"
				@onBackBtnClick="$wsf.go('UserCenter')"
			>
				<view class="applet-order-list-tabs" slot="additional">
					<u-tabs
						:list="orderStatusList"
						active-color="#E60113"
						font-size="28"
						height="120"
						bar-width="60"
						:bar-style="{ bottom: '20rpx' }"
						:is-scroll="false"
						:current="orderIndex"
						@change="changeOrderStatus"
					></u-tabs>
				</view>
			</wsf-nav-bar>
			<!-- 头部 Tabs -->

			<!-- 缺省 -->
			<view class="applet-order-list-isEmpty u-flex flex-column u-padding-top-60" v-if="isEmpty">
				<image style="height: 180rpx;width: 180rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" mode=""></image>
				<view class="u-padding-top-10rpx" style="color: #999999;padding-bottom: 100rpx;">你还没有相关订单</view>
			</view>
			<!-- 内容区 -->
			<view class="applet-order-list-body">
				<view class="applet-order-list-order">
					<template v-for="(item, index) in orderList">
						<!-- 订单卡片 -->
						<view class="applet-order-list-order-item u-flex flex-column" :key="index" @click.stop="goToOrderDetail(item)">
							<view class="applet-order-list-order-item-header u-flex u-row-between ">
								<!-- 订单号 -->
								<view class="applet-order-list-order-item-header-orderNo u-flex">
									<view class="u-line-1 applet-order-list-order-item-header-orderNo-name"> <text class="applet-order-list-order-item-header-orderNo-text">订单号：</text>{{ item.orderCode }}</view>
								</view>
								<!-- 订单状态栏 -->
								<!-- 售后订单状态 -->
								<view v-if="item.backStatus === 1 && (item.status == 2 || item.status == 3)" class="applet-order-list-order-item-header-status u-flex-1" style="color: #E60113;font-size: 28rpx;">
									退款申请中
								</view>
								<!-- 已完成状态 -->
								<view v-else-if="item.status === 4" class="applet-order-list-order-item-header-status u-flex-1 u-flex u-row-right" style="color: #E60113;font-size: 28rpx;">
									<image src="@/static/img/completed@2x.png" style="height: 100rpx;width: 120rpx;margin-top: 0rpx;margin-right: 16rpx;" mode=""></image>
									<view class="applet-order-list-order-item-header-status-delete-btn u-flex u-row-center" @click.stop="openConfirm('delete', item)">
										<image style="height: 48rpx;width: 48rpx;" src="@/static/img/icon/delete@2x.png" mode=""></image>
									</view>
								</view>
								<!-- 已取消状态 -->
								<view
									v-else-if="item.status === 5 || item.status === 6 || item.status === 7"
									class="applet-order-list-order-item-header-status u-flex-1 u-flex u-row-right"
									style="color: #E60113;font-size: 28rpx;"
								>
									<view class="applet-order-list-order-item-header-status-text">已取消</view>
									<view class="applet-order-list-order-item-header-status-line" v-if="item.orderType != 12"></view>
									<view class="applet-order-list-order-item-header-status-delete-btn u-flex u-row-center" @click.stop="openConfirm('delete', item)" v-if="item.orderType != 12">
										<image style="height: 48rpx;width: 48rpx;" src="@/static/img/icon/delete@2x.png" mode=""></image>
									</view>
								</view>
								<view v-else class="applet-order-list-order-item-header-status u-flex-1" style="color: #E60113;font-size: 28rpx;">{{
									item.orderType != 12 ? orderStatusMap[item.status] : motorSatusMap[item.status]}}</view>

							</view>
							<view class="applet-order-list-order-item-body u-flex u-row-between">
								<!-- 单商品情况 -->
								<view v-if="item.skus.length <= 1 && !item.skus[0].giftSkuInfos" class="applet-order-list-order-item-body-sku u-flex ">
									<!--start 虚拟商品标签 -->
									<view v-if="item.orderType == 7" class="applet-order-list-order-item-body-sku-virtual-tag">虚拟</view>
									<!--end 虚拟商品标签 -->
									<image :src="item.skus[0].skuImage" style="height: 160rpx;width: 160rpx;border-radius: 10rpx;overflow: hidden;margin-right: 24rpx;" mode="aspectFill"></image>
									<view class="applet-order-list-order-item-body-sku-title u-line-2">{{ item.skus[0].skuName }}</view>
								</view>
								<!-- 多商品情况 -->
								<scroll-view v-else class="applet-order-list-order-item-body-scroll" :enable-flex="true" scroll-x="true">
									<template v-for="(subItem, subIdx) in item.skus">
										<view class="applet-order-list-order-item-body-scroll-item" :key="subIdx">
											<image :src="subItem.skuImage" style="height: 100%;width: 100%;" mode="aspectFill"></image>
										</view>
										<block v-for="(n, i) in subItem.giftSkuInfos" :key="i">
											<view class="applet-order-list-order-item-body-scroll-item"><image :src="n.url" style="height: 100%;width: 100%;" mode="aspectFill"></image></view>
										</block>
									</template>
									<view class="applet-order-list-order-item-body-scroll-placeholder"></view>
								</scroll-view>
								<!-- 右侧商品价格及数量 -->
								<view class="applet-order-list-order-item-body-info u-flex flex-column u-row-center">
									<view class="applet-order-list-order-item-body-info-price">
										¥
										<text style="font-size: 32rpx;">{{ item.price.toFixed(2).split('.')[0] }}</text>
										.{{ item.price.toFixed(2).split('.')[1] || "00" }}
									</view>
									<view v-if="item.skus && item.skus.length > 1" class="applet-order-list-order-item-body-info-total">共{{ item.sum }}件</view>
									<view class="performance-mark" v-if="item.performanceScore && item.performanceScore > 0">绩效分{{ item.performanceScore }}</view>
									<!-- <view class="applet-order-list-order-item-body-info-point" v-if="performanceScoreTotal(item.skus) > 0">绩效分{{ performanceScoreTotal(item.skus) }}</view> -->
								</view>
							</view>
							<!-- 商户卡片 按钮区 -->
							<view class="applet-order-list-order-item-footer u-flex u-row-right">
								<u-button
									v-if="item.status === 4 && item.isCanAfterSale && item.orderType != 7 && item.orderType != 12"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="goToBackOrder()"
								>
									退换/售后
								</u-button>
								<u-button
									v-if="item.status === 1"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="openCancelPopup(item)"
								>
									取消订单
								</u-button>
								<!-- <u-button
									v-if="item.canRefund && item.status == 2"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="goToRefund(item)"
								>
									申请退款
								</u-button> -->
								<u-button
									v-if="item.backStatus > 0 && item.status === 1"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
								>
									售后中
								</u-button>
								<u-button
									v-if="item.status === 4"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="openConfirm('invoice', item)"
								>
									{{(item.invoiceFlag != null && item.invoiceFlag != 0)?"查看发票":"发票服务"}}
								</u-button>
								<!-- 	<u-button
									v-if="item.status === 6 || item.status === 7"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
								>
									退款明细
								</u-button> -->
								<u-button
									v-if="item.status === 5 || item.status === 6 || (item.status === 4 && item.orderType != 7)"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#E60113', borderColor: '#E60113', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="buyAgain(item)"
								>
									{{ item.orderType != 12 ? '再次购买' : '重新下单' }}
								</u-button>
								<u-button
									v-if="item.status === 1"
									shape="circle"
									hover-class="none"
									@click.stop="goToPay(item)"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#E60113', borderColor: '#E60113', 'font-size': '26rpx', 'margin-left': '20rpx' }"
								>
									去支付
								</u-button>
								<!-- <u-button
									v-if="item.status === 3"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="goToTraces(item)"
								>
									查看物流
								</u-button> -->
								<u-button
									v-if="item.status === 3 && item.orderType!=12"
									shape="circle"
									hover-class="none"
									:custom-style="{
										height: '60rpx',
										width: '152rpx',
										color: '#FFFFFF',
										borderColor: '#E60113',
										backgroundColor: '#E60113',
										'font-size': '26rpx',
										'margin-left': '20rpx'
									}"
									@click.stop="openConfirm('receipt', item)"
								>
									确认收货
								</u-button>
								<!-- <u-button
									v-if="item.backStatus == 1"
									shape="circle"
									hover-class="none"
									:custom-style="{ height: '60rpx', width: '152rpx', color: '#000000', borderColor: '#666666', 'font-size': '26rpx', 'margin-left': '20rpx' }"
									@click.stop="openConfirm('cancel', item)"
								>
									取消申请
								</u-button> -->
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
		<!-- 热销商品模块 -->
		<view v-if="isEmpty" class="applet-template-recommend">
			<wsf-goods-list title="hot" ref="recommedList" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
		</view>
		<u-loadmore v-if="!isEmpty" :status="loadmore" bg-color="#F3F3F3" :load-text="loadText" />

		<!-- 取消订单弹框模块 -->
		<wsf-popup v-model="cancelPopupShow" mode="bottom" title="取消订单" height="800">
			<!-- 弹框组件 -->
			<view class="applet-cancel-order-wrap">
				<view class="applet-cancel-order-tips">
					<view class="applet-cancel-order-tips-title">温馨提示:</view>
					<view class="applet-cancel-order-tips-text">订单一旦取消，无法恢复</view>
				</view>
				<view class="applet-cancel-order-radio">
					<view class="applet-cancel-order-radio-title">请选择取消订单的原因（必选）：</view>
					<template v-for="(item, index) in informationList">
						<view class="applet-cancel-order-radio-item u-flex" :key="index" @click="selectInformation(item, index)">
							<image v-if="cancelInformation !== item.value" style="margin-right: 14rpx;height: 36rpx;width: 36rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png" mode=""></image>
							<image v-else style="margin-right: 14rpx;height: 36rpx;width: 36rpx;" src="@/static/img/icon/Selected@2x.png" mode=""></image>
							<text>{{ item.label }}</text>
						</view>
					</template>
					<view style="height: 370rpx;width: 100%;"></view>
				</view>
			</view>
			<view class="applet-cancel-order-footer" slot="footer">
				<view class="applet-cancel-order-footer-switch u-flex u-row-between" v-if="orderType!=12">
					<text class="applet-cancel-order-footer-switch-text">提交后，将本单商品放回购物车中</text>
					<wsf-switch inactive-color="#DDD" v-model="isAddCart" :isShowCatSwitch="isVirtual"></wsf-switch>
				</view>
				<view class="applet-cancel-order-footer-btn" :class="{ disable: cancelInformation <= 0 }" @click.stop="cancelOrder">提交</view>
			</view>
		</wsf-popup>
		<!-- 发票确认模块 -->
		<wsf-confirm v-model="showConfirm" :title="confirmInfo.title" :activeText="confirmInfo.activeText" :cancelText="confirmInfo.cancelText" @confirm="activeConfirm"></wsf-confirm>

		<wsf-confirm
			v-model="discountOrderDialog"
			:isNeedTouchClose="true"
			:title="discountOrderType == 'cancelOrder' ? '以下订单需一起取消' : '以下订单需一起付款'"
			:activeText="discountOrderType == 'cancelOrder' ? '取消订单' : '付款'"
			:cancelText="discountOrderType == 'cancelOrder' ? '直接买了' : '取消'"
			@confirm="discountOrderConfirm"
			@cancel="discountOrderCancel"
			@handleCloseDialog="discountOrderDialog = false"
		>
			<view class="discount-order-container">
				<view class="order-auto-box">
					<view class="discount-order" v-for="(item, index) in discountOrderData.orderList" :key="index">
						<view class="discount-order-info">
							<view class="left-part">{{ item.storeName }}</view>
							<view class="right-part">￥{{ item.price }}</view>
						</view>
						<view class="discount-order-count">(共{{ item.orderSkus && item.orderSkus.length }}件)</view>
					</view>
				</view>
				<view class="order-total-box">
					<span class="text">订单合计金额：</span>
					<span class="symbol">￥</span>
					<span class="price">{{ discountOrderData.totalPrice }}</span>
				</view>
			</view>
		</wsf-confirm>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>

		<!-- 合并订单 -->
		<merge-order-popup :show="mergeOrderPopup" :data="mergeOrderData" @close="mergeOrderPopup = false"></merge-order-popup>
		<!-- 福气值抵扣提示弹框 -->
		<wsf-confirm
			v-model="fqzConfirmDialog"
			title="支付确认"
			activeText="确认支付"
			cancelText="再想想"
			@confirm="handleFqzConfirm"
			@cancel="fqzConfirmDialog = false"
		>
			<view class="fqz-confirm-dialog">
				<view class="fqz-column" style="padding-bottom: 20rpx">
					福气值已抵扣 <text class="light">：¥{{mergeOrderData.fqzPrice.toFixed(2)}}</text>
				</view>
				<view class="fqz-column">
					仍需支付 <text class="light">：¥{{mergeOrderData.orderFqzAmount.toFixed(2)}}</text>
				</view>
			</view>
		</wsf-confirm>
	</view>
</template>
<script>
import { orderStatusList } from '@/common/wsfRules.js';
import { priceFilter } from '@/common/wsfFilter.js';
import MergeOrderPopup from '../../components/mergeOrderPopup/mergeOrderPopup.vue';
export default {
	components: {
		MergeOrderPopup
	},
	data() {
		return {
			fqzConfirmDialog: false,
			mergeOrderData: {
				orderFqzAmount: 0,
				fqzPrice: 0,
				wsOrderCode: "",
				totalAmount: "",
				orderInfoVos: [],
			},
			mergeOrderPopup: false,
			discountOrderData: {},
			discountOrderDialog: false,
			discountOrderType: '',
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
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '没有更多数据'
			},
			cancelPopupShow: false, // 弹出组件状态
			showConfirm: false, // 发票提示框
			confirmInfo: {
				type: '',
				title: '',
				activeText: '',
				cancelText: ''
			},
			isAddCart: false, // 是否加入购物车
			cancelInformation: 0, // 取消原因ID
			selectOrderId: '', // 选中订单
			informationList: [
				{
					label: '地址信息填写错误',
					value: 1
				},

				{
					label: '不想要了',
					value: 2
				},

				{
					label: '商品错选/多选',
					value: 3
				},

				{
					label: '商品无货',
					value: 4
				},

				{
					label: '商品降价',
					value: 5
				}
			],
			priceFilter,
			isShowStore: 0,
			scrollTop: 0,
			isVirtual: false, //虚拟商品标识
			orderStatusMap: {
			  1: '等待付款',
			  2: '正在出库',
			  3: '等待收货',
			  4: '已完成',
			  5: '已取消',
			  6: '已取消',
			  7: '已取消',
			}, // 订单状态
			motorSatusMap: {
				1: '等待支付',
				2: '请前往门店取车',
				3: '请前往门店取车',
				4: '已完成',
				5: '已取消',
				6: '已取消',
				7: '已取消',

			}, // 电动车订单状态
			orderType: ''// 判断是否是电动车订单
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
		}
	},
	onLoad(options) {
		this.queryForm.status = options.status;
		this.orderStatusList = orderStatusList;
		this.orderIndex = this.orderStatusList.findIndex(el => {
			return el.status == options.status;
		});
		// this.loadOrderList();
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
		console.log('onShow: orderStatusList', orderStatusList);
		this.resetQueryForm();
		this.orderList = [];
		this.loadOrderList();
	},
	onPullDownRefresh() {
		this.resetQueryForm();
		this.orderList = [];
		this.loadOrderList();
	},
	onReachBottom() {
		console.log('我到页面最底部了~');
		if (this.isEmpty) {
			// 加载推荐列表
			this.loadRecommend();
		} else {
			// 获取订单列表
			this.loadOrderList();
		}
	},
	methods: {
		//合并支付/取消订单 确认按钮
		discountOrderConfirm() {
			if (this.discountOrderType == 'cancelOrder') {
				//取消订单 走填写取消原因逻辑
				this.discountOrderDialog = false;
				this.cancelPopupShow = true;
			} else if (this.discountOrderType == 'goPayOrder') {
				//付款 跳转支付页面
				this.$wsf.go('Pay', { orderMoney: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, businessType: 100,
					paySceneType: 101 //电商订单
				});
			}
		},
		//合并支付/取消订单 取消按钮
		discountOrderCancel() {
			if (this.discountOrderType == 'cancelOrder') {
				//直接买了 跳转支付页面
				this.$wsf.go('Pay', { orderMoney: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, businessType: 100,
					paySceneType: 101 //电商订单
				});
			} else if (this.discountOrderType == 'goPayOrder') {
				//取消 关闭弹窗
				this.discountOrderDialog = false;
				this.discountOrderType = '';
				this.discountOrderData = {};
			}
		},
		performanceScoreTotal(list) {
			if (!list || list.length < 1) {
				return 0;
			} else {
				let point = 0;
				list.forEach(item => {
					if (item.performanceScore && item.performanceScore > 0) {
						let num = item.performanceScore * item.num;
						point += num;
					}
				});
				return point;
			}
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
			this.$u.api
				.QueryCustomerOrders(this.queryForm)
				.then(res => {
					this.isLoading = false;
					uni.stopPullDownRefresh();

					if (this.queryForm.pageNum === 0 && res.data.list.length === 0) {
						this.isEmpty = true;
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
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.queryForm).then(res => {
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
					this.queryForm.pageNum++;
					this.hasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
		// 切换订单列表状态
		changeOrderStatus(e) {
			console.log('e', e);
			this.orderIndex = e;
			this.orderList = [];
			this.resetQueryForm();
			console.log(' this.orderStatusList[e]', this.orderStatusList[e]);
			this.queryForm.status = this.orderStatusList[e].status;
			this.loadOrderList();
		},
		// 重置搜索条件
		resetQueryForm() {
			// if (this.isEmpty) {
			// 	// 必须清除推荐商品列表
			// 	this.flowList = [];
			// 	this.$refs.recommedList.clearList()
			// }

			this.isEmpty = false;
			this.hasMore = true;
			this.queryForm.pageNum = 0;
		},
		// 计算商品数量
		countGoodsNum(item) {
			let count = 0;
			console.log('item', item);
			item.forEach(el => {
				count += el.num;
			});
			return count;
		},
		// 跳转店铺
		goToStore(item) {
			console.log('跳转店铺或首页', item);
			if (item.storeId != 0) {
				this.$wsf.go('StoreIndex', { storeName: item.storeName, storeId: item.storeId });
			} else {
				this.$wsf.go('Index');
			}
		},
		// 跳转详情
		goToOrderDetail(item) {
			console.log('跳转订单详情', item);
			/* ToDo 跳转订单详情、电动车跳电动车详情 */
			if(item.orderType == 12){
				this.$wsf.go("motorOrderDetail", {
					orderId: item.id,
					backStatus: item.backStatus,
				});
			} else {
				this.$wsf.go('PendingPayment', { orderId: item.id, backStatus: item.backStatus });
			}
		},
		// 跳转支付页面
		goToPay(item) {
			if (item.platformCouponCode) {
				this.$u.api.checkOrder(item.id).then(res => {
					this.discountOrderType = 'goPayOrder';
					if (res.data && res.data.orderList.length > 0) {
						this.discountOrderData = res.data;
						this.discountOrderDialog = true;
					} else {
						this.$wsf.go('Pay', { orderMoney: item.price, orderCode: item.orderCode, businessType: 100,
							paySceneType: 101 //电商订单
						});
					}
				});
			} else {
				let params = {
					orderId: item.id
				}
				this.$u.api.SelectWsOrderInfoByOrderId(params).then(res => {
					if(res.code == 200) {
						let list = res.data.orderInfoVos
						if(list && list.length < 2) {
							if(res.data.fqzPrice && res.data.fqzPrice > 0) {
								this.mergeOrderData = res.data
							 	this.mergeOrderData.orderCode = item.orderCode
								this.fqzConfirmDialog = true
							} else {
								this.$wsf.go('Pay', { orderMoney: res.data.totalAmount, orderCode: item.orderCode, businessType: 100,
									paySceneType: 101 //电商订单
								});
							}
						} else if(list && list.length >= 2) {
							this.mergeOrderData = res.data
							this.mergeOrderPopup = true
						}
					}
				})
			}
		},
		handleFqzConfirm() {
			this.fqzConfirmDialog = false
			this.$wsf.go('Pay', { orderMoney: this.mergeOrderData.orderFqzAmount, orderCode: this.mergeOrderData.orderCode, businessType: 100,
				paySceneType: 101 //电商订单
			});
		},
		// 打开取消订单模块弹窗
		openCancelPopup(item) {
			if (item.platformCouponCode) {
				this.$u.api.checkOrder(item.id).then(res => {
					this.discountOrderType = 'cancelOrder';
					if (res.data && res.data.orderList.length > 0) {
						this.discountOrderData = res.data;
						this.discountOrderDialog = true;
					} else {
						this.orderType = item.orderType;
						this.cancelPopupShow = true;
						this.cancelInformation = 0;
						this.isAddCart = false;
						this.selectOrderId = item.id;
						this.isVirtual = item.orderType == 7;
					}
				});
			} else {
				this.orderType = item.orderType;
				this.cancelPopupShow = true;
				this.cancelInformation = 0;
				this.isAddCart = false;
				this.selectOrderId = item.id;
				this.isVirtual = item.orderType == 7;
			}
		},
		// 选择取消原因
		selectInformation(item, idx) {
			this.$nextTick(function() {
				this.cancelInformation = this.informationList[idx].value;
			});
		},
		// 取消订单
		cancelOrder() {
			if (this.cancelInformation <= 0) {
				this.$u.showToast('请选择取消原因');
				return;
			}
			// 发送请求
			let reason = this.informationList.filter(el => {
				return el.value == this.cancelInformation;
			})[0].label;

			if (this.discountOrderType == 'cancelOrder' && this.discountOrderData.orderIdList && this.discountOrderData.orderIdList.length > 0) {
				let params = {
					orderIdList: this.discountOrderData.orderIdList,
					addCart: this.isAddCart,
					reason: reason
				};
				this.$u.api.cancelOrderBatch(params).then(res => {
					if (res.code == 200) {
						this.$u.toast('取消成功');
						this.cancelPopupShow = false;
						this.discountOrderType = '';
						this.discountOrderData = {};
						this.resetQueryForm();
						this.orderList = [];
						this.loadOrderList();
					} else {
						this.$u.toast(res.description);
					}
				});
			} else {
				this.$u.api.CancelOrder({ orderId: this.selectOrderId, reason, addCart: this.isAddCart }).then(res => {
					console.log('res', res);
					this.resetQueryForm();
					this.orderList = [];
					this.loadOrderList();
					// 关闭弹窗
					this.cancelPopupShow = false;
				});
			}
		},
		// 打开弹窗
		async openConfirm(type, item) {
			this.selectOrderId = item.id;
			this.confirmInfo.type = type;
			console.log(item, '*&^^%');
			if (type === 'invoice') {
				const {id,price} = item;
				//已开票
				if(item.invoiceFlag != null && item.invoiceFlag != 0){
					this.$wsf.go('orderInvoice', { orderId:id, price });
					return;
				}
				let options = {},
					storeServiceConfig = item.storeServiceConfig,
					tagsurl = '';
				Object.keys(storeServiceConfig).forEach(key => {
					if (storeServiceConfig[key]) {
						if (key == 'staffId') {
							options.staffid = storeServiceConfig[key];
						} else {
							options[key] = storeServiceConfig[key];
						}
					}
				});
				if (options.staffid) {
					tagsurl = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${item.id}`;
				} else {
					tagsurl = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${item.id}`;
				}
				let obj = '';
				let ysfData = {
					id: item.id,
					title: `订单号: ${item.orderCode}`,
					desc: item.skus[0].skuName,
					picture: item.skus[0].skuImage,
					tagsurl,
					note: `￥${item.price}`,
					navigateToUrl: `/orderModule/pages/orderList/orderList?status=${this.orderIndex}`,
					...options
				};
				obj = JSON.stringify(ysfData);
				uni.setStorageSync('YSFDATA', obj);
				// 发票模块
				this.confirmInfo.title = '非自营订单的发票由商家开具，具体金额以实际开票为准。如有疑问，请联系商家。';
				this.confirmInfo.activeText = '联系商家';
				this.confirmInfo.cancelText = '取消';
			} else if (type === 'delete') {
				// 删除模块
				this.confirmInfo.title = '确认删除此订单？';
				this.confirmInfo.activeText = '删除';
				this.confirmInfo.cancelText = '取消';
			} else if (type === 'receipt') {
				// 收货模块
				await this.$u.api.JudgeRefund({orderId: item.id}).then(res => {
					if(res.data == 1) {
						this.confirmInfo.title = '您是否收到该订单商品？';
						this.confirmInfo.activeText = '已收货';
						this.confirmInfo.cancelText = '未收货';
					} else {
						this.confirmInfo.title = '订单中存在退款申请中商品，确认收货则默认撤销申请。';
						this.confirmInfo.activeText = "确认";
            this.confirmInfo.cancelText = "取消";
					}
				})

			} else if (type === 'cancel') {
				// 取消申请
				this.confirmInfo.title = '确认取消退款申请？';
				this.confirmInfo.activeText = '确认';
				this.confirmInfo.cancelText = '再想想';
				this.selectOrderId = item.backOrderId
			}
			this.showConfirm = true;
		},
		// 弹窗确认
		activeConfirm() {
			if (this.confirmInfo.type == 'invoice') {
				this.serviceTel();
				// 发票模块
				this.showConfirm = false;
				// let phoneNumber = "0755-23061865"
				// uni.makePhoneCall({
				//     phoneNumber: phoneNumber
				// });
			} else if (this.confirmInfo.type == 'delete') {
				this.$u.api.DeleteOrder({ orderId: this.selectOrderId }).then(res => {
					this.resetQueryForm();
					this.orderList = [];
					this.loadOrderList();
					this.$u.toast('删除成功');
					this.showConfirm = false;
				});
			} else if (this.confirmInfo.type == 'receipt') {
				this.$u.api.ConfirmReceipt({ orderId: this.selectOrderId }).then(res => {
					this.resetQueryForm();
					this.orderList = [];
					this.loadOrderList();
					this.$u.toast('确认收货成功');
					this.showConfirm = false;
				});
			} else if (this.confirmInfo.type == 'cancel') {
				this.$u.api.cancelReturn({ id: this.selectOrderId }).then(res => {
					this.$u.toast('取消申请成功');
					this.resetQueryForm();
					this.orderList = [];
					this.loadOrderList();
					this.showConfirm = false;
				});
			}
		},
		// 再次购买
		buyAgain(item) {
			console.log(item,'sssssssssssssss')
			if(item.orderType != 12) {
				let list = item.skus;
				if (list && list.length) {
					let buyNowRequestList = [];
					list.forEach(n => {
						let skuObj = {
							skuId: n.skuId,
							recommendToken: null,
							num: n.num,
							sourceType: item.sourceType,
							storeId: item.storeId,
						};
						buyNowRequestList.push(skuObj);
					});
					buyNowRequestList = JSON.stringify(buyNowRequestList);
					if(list && list.length > 1) {
						this.$wsf.go("Settlement", { buyNowRequestList, cart: 1 });
					} else {
						this.$wsf.go("Settlement", { buyNowRequestList });
					}
				}
			} else {
				this.$wsf.go('ToMotor',{skuId: item.skus[0].skuId});
			}
		},
		// 申请退款
		goToRefund(item) {
			this.$wsf.go('Refund', { orderId: item.id, receiptType: item.status == 3 ? 1 : 0 });
		},
		// 前往物流详情
		goToTraces(item) {
			this.$wsf.go('trackingCells');
		},
		// 前往退单列表
		goToBackOrder() {
			this.$wsf.go('BackOrderList');
		}
	}
};
</script>
<style lang="scss" scoped>
.applet-order-list-wrap {
	padding-bottom: 60rpx;
	.applet-order-list-tabs {
		background-color: skyblue;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
	}
	.applet-order-list-body {
		.applet-order-list-order {
			// 商品卡片
			&-item {
				// height: 420rpx;
				background-color: #fff;
				border-radius: 20rpx;
				margin-top: 24rpx;
				padding: 0 36rpx 40rpx;
				// 商品卡片 - 头部
				&-header {
					width: 100%;
					height: 90rpx;
					padding-top: 10rpx;
					line-height: 100rpx;
					position: relative;
					&-orderNo {
						color: #000000;
						font-weight: 500;
						font-size: 28rpx;
						width: 450rpx;
						&-name {
							color: #000000;
							font-weight: 500;
							font-size: 28rpx;
							max-width: 420rpx;
						}
						&-text {
							font-size: 28rpx;
							color: #adadad;
						}
					}
					&-status {
						text-align: right;
						&-text {
							color: #999999;
							font-size: 26rpx;
						}
						&-line {
							width: 1px;
							height: 18rpx;
							background-color: #eaeaea;
							margin-left: 16rpx;
						}
						&-delete-btn {
							padding: 20rpx 0 20rpx 16rpx;
						}
					}
				}
				// 商品卡片 - 中间内容区
				&-body {
					width: 100%;
					height: 160rpx;
					margin: 12rpx 0;
					position: relative;
					// 商品卡片 - 中间内容区 - 单商品信息
					&-sku {
						height: 160rpx;
						position: relative;
						&-title {
							width: 310rpx;
							color: #000000;
							font-size: 26rpx;
						}
						&-virtual-tag {
							width: 60rpx;
							height: 32rpx;
							line-height: 32rpx;
							background: #e95762;
							border-radius: 10rpx 20rpx 20rpx 0rpx;
							opacity: 0.8;
							color: #ffffff;
							font-size: 20rpx;
							text-align: center;
							position: absolute;
							top: 0;
						}
					}
					// 商品卡片 - 中间内容区 - 多商品信息
					&-scroll {
						height: 160rpx;
						white-space: nowrap;

						&-item {
							display: inline-block;
							height: 160rpx;
							width: 160rpx;
							margin-right: 24rpx;
							border-radius: 10rpx;
							overflow: hidden;
						}
						&-placeholder {
							display: inline-block;
							height: 160rpx;
							width: 180rpx;
						}
					}

					// 商品卡片 - 中间内容区 - 结算信息
					&-info {
						position: absolute;
						right: 0;
						top: 0;
						width: 180rpx;
						height: 160rpx;
						background-color: rgba(255, 255, 255, 0.9);
						&-price {
							width: 100%;
							font-size: 22rpx;
							color: #000000;
							font-weight: 500;
							text-align: right;
						}
						&-total {
							width: 100%;
							text-align: right;
							font-size: 22rpx;
							color: #666666;
						}
						&-point {
							color: #e60113;
							font-size: 26rpx;
							width: 100%;
							text-align: right;
						}
						.performance-mark {
							margin-left: auto;
        		  margin-top: 10rpx;
	      			padding: 0 8rpx;
	      			display: inline-flex;
	      			align-items: center;
	      			height: 32rpx;
	      			border-radius: 4rpx;
	      			border: 1rpx solid #FD302C;
	      			color: #FD302C;
	      			font-size: 20rpx;
	      		}
					}
				}
				// 商品卡片 - 底部按钮区
				&-footer {
					width: 100%;
					padding-top: 36rpx;
				}
			}
		}
	}
}

// 取消订单模块
.applet-cancel-order-wrap {
	padding: 0 36rpx 0rpx;
	.applet-cancel-order-tips {
		width: 100%;
		height: 160rpx;
		background: #f5f5f5;
		border-radius: 4px;
		padding-left: 20rpx;
		padding-top: 36rpx;
		margin-bottom: 60rpx;
		&-title {
			font-size: 26rpx;
			font-weight: 400;
			color: #000000;
			line-height: 30rpx;
			margin-bottom: 24rpx;
		}
		&-text {
			font-size: 26rpx;
			font-weight: 400;
			color: #666666;
			line-height: 36rpx;
		}
	}
	.applet-cancel-order-radio {
		&-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 36rpx;
			margin-bottom: 26rpx;
		}
		&-item {
			height: 84rpx;
			line-height: 84rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #000000;
		}
	}
}
.applet-cancel-order-footer {
	&-switch {
		height: 100rpx;
		&-text {
			font-size: 26rpx;
			color: #000000;
			font-weight: 500;
		}
	}
	&-btn {
		width: 678rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 38rpx;
		background-color: #e60113;
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
	}
	.disable {
		background-color: #fbd2d5;
	}
}
.applet-template-recommend {
	padding: 0 24rpx;
}

.discount-order-container {
	padding: 0 36rpx;
	.order-auto-box {
		overflow-y: auto;
		height: 520rpx;
		.discount-order {
			padding-top: 40rpx;
			.discount-order-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 48rpx;
				color: #000;
				font-size: 28rpx;
				.left-part {
					max-width: 406rpx;
				}
				.right-part {
					font-weight: 500;
				}
			}
			.discount-order-count {
				color: #666;
				line-height: 48rpx;
				font-size: 28rpx;
			}
		}
	}
	.order-total-box {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		padding-top: 40rpx;
		.text {
			color: #000;
			font-size: 28rpx;
			line-height: 32rpx;
		}
		.symbol {
			font-size: 22rpx;
			color: #e60113;
			font-weight: 500;
		}
		.price {
			color: #e60113;
			font-size: 36rpx;
			font-weight: 600;
			line-height: 36rpx;
		}
	}
}
.fqz-confirm-dialog {
	text-align: center;
	padding-top: 40rpx;
	.fqz-column {
		font-size: 28rpx;
		line-height: 32rpx;
		color: #666;
		.light {
			color: #e60113;
		}
	}
}
/deep/.wsf-mode-footer{
	height: auto !important;
}
</style>
