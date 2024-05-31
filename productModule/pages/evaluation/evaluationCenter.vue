<template>
	<view>
		<view class="applet-evaluation-tabs">
			<u-tabs
				:list="statusList"
				active-color="#E60113"
				font-size="28"
				height="100"
				bar-width="60"
				:bar-style="{ bottom: '8rpx' }"
				:is-scroll="false"
				:current="tabsIndex"
				@change="changeTabsStatus"
			></u-tabs>
		</view>
		<view v-if="tabsIndex <= 0 ? unevaluatedList.length <= 0 : customerCommentList.length <= 0" class="applet-evaluation-empty u-flex flex-column">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-evaluation-empty-tips">没有{{ statusList[tabsIndex].name }}的商品哦〜</view>
		</view>
		<view class="applet-evaluation-list">
			<!-- 待评价商品列表 -->
			<template v-for="(item, idx) in unevaluatedList">
				<view v-show="tabsIndex == 0" class="applet-evaluation-list-wait-item u-flex flex-column" :key="idx">
					<view class="applet-evaluation-list-wait-item-header u-flex u-row-left u-col-center">
						<template v-if="isShowStore > 0" >
							<image src="@/static/img/icon/cat_shop@2x.png" style="height: 32rpx; width: 32rpx;margin-right: 6rpx;" mode="" @click.stop="goToStore(item)"></image>
							<view class="u-line-1 " @click.stop="goToStore(item)">{{ item.storeName }}</view>
							<image src="@/static/img/icon/arrow_right@2x.png" style="height: 20rpx; width: 8rpx;margin-left: 14rpx;" mode="" @click.stop="goToStore(item)"></image>
						</template>
					</view>
					<view class="applet-evaluation-list-wait-item-sku u-flex-1 u-flex u-col-top" @click.stop="goToSku(item)">
						<view class="applet-evaluation-list-wait-item-sku-image"><image :src="item.skuImage" style="height: 100%;width: 100%;" mode=""></image></view>
						<view class="applet-evaluation-list-wait-item-sku-info u-line-2">{{ item.skuName }}</view>
					</view>
					<view class="applet-evaluation-list-wait-item-btn" @click="goToComment(item)">评价</view>
				</view>
			</template>

			<!-- 已评价商品列表 -->
			<template v-for="(item, idx) in customerCommentList">
				<view v-show="tabsIndex == 1" class="applet-evaluation-list-confirm-item u-flex flex-column" :key="idx">
					<view class="applet-evaluation-list-confirm-item-header u-flex u-row-left u-col-center">
						<template v-if="isShowStore > 0">
							<image
								src="@/static/img/icon/cat_shop@2x.png"
								style="height: 32rpx; width: 32rpx;margin-right: 6rpx;"
								mode=""
								@click.stop="goToStore(item)"
							></image>
							<view class="u-line-1 " @click.stop="goToStore(item)">{{ item.storeName }}</view>
							<image
								src="@/static/img/icon/arrow_right@2x.png"
								style="height: 20rpx; width: 8rpx;margin-left: 14rpx;"
								mode=""
								@click.stop="goToStore(item)"
							></image>
						</template>
					</view>
					<view class="applet-evaluation-list-confirm-item-sku u-flex u-col-top">
						<view class="applet-evaluation-list-confirm-item-sku-image">
							<image :src="item.skuImage" style="height: 100%;width: 100%;" mode="" @click.stop="goToSku(item)"></image>
						</view>
						<view class="applet-evaluation-list-confirm-item-sku-info">
							<view class="applet-evaluation-list-confirm-item-sku-info-name u-line-1" @click.stop="goToSku(item)">{{ item.skuName }}</view>

							<view class="applet-evaluation-list-confirm-item-sku-info-rate">
								<text class="u-margin-right-8">评价</text>
								<u-rate :count="5" :disabled="true" v-model="item.score" size="24"></u-rate>
								<view v-if="item.anonymous > 0" class="applet-evaluation-list-confirm-item-sku-info-rate-anonymous">已匿名</view>
							</view>
						</view>
					</view>
					<view class="applet-evaluation-list-confirm-item-comment">{{ item.comment }}</view>
				</view>
			</template>
		</view>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
import { evaluationCenterStatusList } from '@/common/wsfRules.js';
export default {
	data() {
		return {
			statusList: evaluationCenterStatusList,
			tabsIndex: 0,
			unevaluatedList: [],
			unevaluatedQueryForm: {
				pageNum: 0,
				pageSize: 10,
				hasmore: true
			},
			customerCommentList: [],
			customerCommentQueryForm: {
				pageNum: 0,
				pageSize: 10,
				hasmore: true
			},
			isLoading: false,
			isShowStore: 0,
			scrollTop:0,
			orderIds: ''
		};
	},
	onLoad(options) {
		if(options.orderIds) {
			this.orderIds = options.orderIds
		}
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore // 判断商城信息
		this.resetList();
		this.loadList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onReachBottom() {
		this.loadList();
	},
	methods: {
		// 切换状态
		changeTabsStatus(e) {
			this.tabsIndex = e;
			this.loadList();
		},
		loadList() {
			if (this.tabsIndex <= 0) {
				if (this.isLoading || !this.unevaluatedQueryForm.hasmore) return;
				this.loadUnevaluatedList();
			} else {
				if (this.isLoading || !this.customerCommentQueryForm.hasmore) return;
				this.loadCustomerCommentList();
			}
		},
		// 获取待评价列表
		loadUnevaluatedList() {
			this.isLoading = true;
			this.$u.api
				.Unevaluated({...this.unevaluatedQueryForm, orderIds: this.orderIds})
				.then(res => {
					this.isLoading = false;
					this.unevaluatedList = this.unevaluatedList.concat(res.data.list);
					if (res.data.list.length >= 10) {
						this.unevaluatedQueryForm.pageNum++;
					} else {
						this.unevaluatedQueryForm.hasmore = false;
					}
				})
				.catch(err => {
					this.isLoading = false;
				});
		},
		// 获取已评价列表
		loadCustomerCommentList() {
			this.isLoading = true;
			this.$u.api
				.CustomerComment({...this.customerCommentQueryForm, orderIds: this.orderIds})
				.then(res => {
					this.isLoading = false;
					this.customerCommentList = this.customerCommentList.concat(res.data.list);
					if (res.data.list.length >= 10) {
						this.customerCommentQueryForm.pageNum++;
					} else {
						this.customerCommentQueryForm.hasmore = false;
					}
				})
				.catch(err => {
					this.isLoading = false;
				});
		},
		// 跳转评价模块
		goToComment(item) {
			const commentData = {
				skuId: item.skuId,
				orderId: item.orderId,
				storeId: item.storeId,
				storeName: item.storeName,
				skuName: item.skuName,
				skuImage: item.skuImage
			};
			this.$wsf.go('Comment', commentData);
		},
		// 重置列表内容
		resetList() {
			(this.unevaluatedList = []),
				(this.unevaluatedQueryForm = {
					pageNum: 0,
					pageSize: 10,
					hasmore: true
				}),
				(this.customerCommentList = []),
				(this.customerCommentQueryForm = {
					pageNum: 0,
					pageSize: 10,
					hasmore: true
				});
		},
		// 前往商铺
		goToStore(item) {
			// console.log('item', item);
			this.$wsf.go('StoreIndex', { storeId: item.storeId, storeName: item.storeName });
		},
		// 前往商品
		goToSku(e) {
			// console.log(item.skuId,"item.skuId-----------++++")
			// this.$wsf.go('SkuDetail', { skuId: item.skuId });

			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.skuId});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.skuId });
			}
		},
	}
};
</script>

<style lang="scss">
.applet-evaluation-tabs {
	padding-right: 340rpx;
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	overflow: hidden;
	position: sticky;
	top: 0;
	z-index: 888;
}
.applet-evaluation-empty {
	padding-top: 220rpx;
	&-tips {
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		margin-top: 10rpx;
		line-height: 40rpx;
	}
}
.applet-evaluation-list {
	padding-top: 24rpx;
	// 待评价订单列表
	.applet-evaluation-list-wait-item {
		height: 342rpx;
		border-radius: 20rpx;
		margin-bottom: 24rpx;
		padding: 0 36rpx 0;
		background-color: #fff;
		overflow: hidden;
		position: relative;
		&-header {
			width: 100%;
			height: 112rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 112rpx;
		}
		&-sku {
			width: 100%;
			padding-bottom: 70rpx;
			&-image {
				height: 160rpx;
				width: 160rpx;
				margin-right: 24rpx;
				border: 1rpx solid #eeeeee;
			}
			&-info {
				padding-top: 6rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #000000;
				line-height: 38rpx;
				width: 494rpx;
			}
		}
		&-btn {
			position: absolute;
			width: 152rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			right: 36rpx;
			bottom: 40rpx;
			color: $wsf-color-red;
			border: 1rpx solid currentColor;
		}
	}
	// 已评价订单列表
	.applet-evaluation-list-confirm-item {
		background-color: #fff;
		margin-bottom: 24rpx;
		// height: 334rpx;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		padding: 0 36rpx 28rpx;
		&-header {
			width: 100%;
			height: 112rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 112rpx;
		}
		&-sku {
			width: 100%;
			margin-bottom: 24rpx;
			&-image {
				height: 120rpx;
				width: 120rpx;
				margin-right: 24rpx;
				border: 1rpx solid #eeeeee;
			}
			&-info {
				padding-top: 6rpx;
				width: 494rpx;
				&-name {
					font-weight: 400;
					font-size: 26rpx;
					color: #999999;
					line-height: 38rpx;
					margin-bottom: 24rpx;
				}
				&-rate {
					font-size: 26rpx;
					font-weight: 400;
					color: #000000;
					line-height: 28rpx;
					position: relative;
					&-anonymous {
						height: 100%;
						float: right;
						margin-right: 6rpx;
						font-size: 26rpx;
						color: #cccccc;
					}
				}
			}
		}
		&-comment {
			width: 100%;
			word-break:break-all;
			word-wrap:break-word;
		}
	}
}
</style>
