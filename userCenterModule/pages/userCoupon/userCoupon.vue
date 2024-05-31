<template>
	<view>
		<view class="showfixedtop">
			<wsf-nav-bar :placeholder="true" :fixed="true" :shadow="false" bgColor="#fff" color="#red" :hasBack="true" @onBackBtnClick="onBackBtnClick">
				<view slot="custom-title" class="coupon-header-title">
					<view class="coupon-radio-box">
						<view class="coupon-radio" :class="{ active: couponType == 1 }" @click="changeCouponType(1)">店铺券({{ pageCount.storeUsableCount }})</view>
						<view class="coupon-radio" :class="{ active: couponType == 2 }" @click="changeCouponType(2)">平台券({{ pageCount.platformUsableCount }})</view>
					</view>
				</view>
			</wsf-nav-bar>
			<view class="header-tabs">
				<block v-for="(item, index) in tabList" :key="index">
					<view class="tabs" :class="{ active: tabIndex == item.id }" @click="changeTab(item)">
						<text>{{ item.name + '(' + item.number + ')' }}</text>
						<i v-if="tabIndex == item.id"></i>
					</view>
				</block>
			</view>
		</view>

		<view class="footer" @click="navigateTo('couponCenter')">
			<image class="coupon-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/coupon_icon02%402x.png" alt="" />
			<text>领取更多优惠券</text>
			<img class="go-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/jt%402x.png" alt="" />
		</view>

		<view class="coupon-list" v-if="!isEmpty">
			<block v-for="(item, index) in pageList" :key="index">
				<view class="coupon-box" v-if="couponType == 1 && tabIndex == 0">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<view class="main-ticket store-padding">
							<view class="coupon-name">限购【{{ item.storeName }}】店铺商品</view>
							<view class="coupon-indate">{{ $u.timeFormat(new Date(item.startTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.endTime).getTime(), 'yyyy.mm.dd') }}</view>
						</view>
						<view class="stub-ticket useful-store-ticket">
							<view class="coupon-price">
								<text class="symbol">￥</text>
								<text class="int-price">{{ skuPriceInt(item.couponFull.price) }}</text>
								<text class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</text>
							</view>
							<view class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</view>
							<view class="coupon-use-button store-button" @click="goStore(item)">去使用</view>
						</view>
					</view>
				</view>

				<view class="coupon-box" v-if="couponType == 1 && tabIndex == 1">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<img class="mark-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ysy%402x.png" alt="" />
						<view class="main-ticket store-padding">
							<view class="coupon-name unuseful-text">限购【{{ item.storeName }}】店铺商品</view>
							<view class="coupon-indate unuseful-text">
								{{ $u.timeFormat(new Date(item.startTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.endTime).getTime(), 'yyyy.mm.dd') }}
							</view>
						</view>
						<view class="stub-ticket unuseful-stub-ticket">
							<view></view>
							<view class="coupon-price">
								<text class="symbol">￥</text>
								<text class="int-price">{{ skuPriceInt(item.couponFull.price) }}</text>
								<text class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</text>
							</view>
							<view class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</view>
							<view></view>
						</view>
					</view>
				</view>

				<view class="coupon-box" v-if="couponType == 1 && tabIndex == 2">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<img class="mark-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ygq%402x.png" alt="" />
						<view class="main-ticket store-padding">
							<view class="coupon-name unuseful-text">限购【{{ item.storeName }}】店铺商品</view>
							<view class="coupon-indate unuseful-text">
								{{ $u.timeFormat(new Date(item.startTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.endTime).getTime(), 'yyyy.mm.dd') }}
							</view>
						</view>
						<view class="stub-ticket unuseful-stub-ticket">
							<view></view>
							<view class="coupon-price">
								<text class="symbol">￥</text>
								<text class="int-price">{{ skuPriceInt(item.couponFull.price) }}</text>
								<text class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</text>
							</view>
							<view class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</view>
							<view></view>
						</view>
					</view>
				</view>

				<view class="coupon-box" v-if="couponType == 2 && tabIndex == 0">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<view class="main-ticket platform-padding">
							<view class="coupon-name">
								<block v-if="item.permittedType == 0">全平台商品可用</block>
								<block v-else-if="item.permittedType == 1">{{ `限${item.permittedCatesString}类商品可用` }}</block>
								<block v-else-if="item.permittedType == 2">平台部分商品可用</block>
							</view>
							<view class="coupon-indate">
								{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }} - {{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
							</view>
							<view class="coupon-explain" @click="changeExpand(index)">
								<text>使用说明</text>
								<img class="coupon-explain-icon" v-if="expand" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more01%402x.png" alt="" />
								<img class="coupon-explain-icon" v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more02%402x.png" alt="" />
							</view>
						</view>
						<view class="stub-ticket useful-platform-ticket">
							<view class="coupon-price">
								<text class="symbol" v-if="item.type != 2">￥</text>
								<text class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</text>
								<text class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</text>
								<text class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</text>
								<text class="float-price" v-else>折</text>
							</view>
							<view class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</view>
							<view class="coupon-use-button platform-button" @click="navigateTo('costCoupon', { id: item.id })">去使用</view>
						</view>
					</view>
					<view class="coupon-detail" v-if="item.isExpand">
						<block v-if="item.description"><view v-html="item.description"></view></block>
						<block v-else>
							<p class="default-text">
								<text v-if="item.permittedType == 0">1. 全平台商品可用</text>
								<text v-else-if="item.permittedType == 1">{{ `1. 限${item.permittedCatesString}类商品可用` }}</text>
								<text v-else-if="item.permittedType == 2">1. 平台部分商品可用</text>
							</p>
							<p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
						</block>
					</view>
				</view>

				<view class="coupon-box" v-if="couponType == 2 && tabIndex == 1">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<img class="mark-img platform-position" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ysy%402x.png" alt="" />
						<view class="main-ticket platform-padding">
							<view class="coupon-name unuseful-text">
								<block v-if="item.permittedType == 0">全平台商品可用</block>
								<block v-else-if="item.permittedType == 1">{{ `限${item.permittedCatesString}类商品可用` }}</block>
								<block v-else-if="item.permittedType == 2">平台部分商品可用</block>
							</view>
							<view class="coupon-indate unuseful-text">
								{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }} - {{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
							</view>
							<view class="coupon-explain" @click="changeExpand(index)">
								<text>使用说明</text>
								<img class="coupon-explain-icon" v-if="expand" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more01%402x.png" alt="" />
								<img class="coupon-explain-icon" v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more02%402x.png" alt="" />
							</view>
						</view>
						<view class="stub-ticket unuseful-stub-ticket">
							<view></view>
							<view class="coupon-price">
								<text class="symbol" v-if="item.type != 2">￥</text>
								<text class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</text>
								<text class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</text>
								<text class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</text>
								<text class="float-price" v-else>折</text>
							</view>
							<view class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</view>
							<view></view>
						</view>
					</view>
					<view class="coupon-detail" v-if="item.isExpand">
						<block v-if="item.description"><view v-html="item.description"></view></block>
						<block v-else>
							<p class="default-text">
								<text v-if="item.permittedType == 0">1. 全平台商品可用</text>
								<text v-else-if="item.permittedType == 1">{{ `1. 限${item.permittedCatesString}类商品可用` }}</text>
								<text v-else-if="item.permittedType == 2">1. 平台部分商品可用</text>
							</p>
							<p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
						</block>
					</view>
				</view>

				<view class="coupon-box" v-if="couponType == 2 && tabIndex == 2">
					<view class="coupon-card">
						<text class="top-round-corner"></text>
						<text class="bottom-round-corner"></text>
						<img class="mark-img platform-position" v-if="item.isClosed" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/yzf%402x.png" alt="" />
						<img class="mark-img platform-position" v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ygq%402x.png" alt="" />
						<view class="main-ticket platform-padding">
							<view class="coupon-name unuseful-text">
								<block v-if="item.permittedType == 0">全平台商品可用</block>
								<block v-else-if="item.permittedType == 1">{{ `限${item.permittedCatesString}类商品可用` }}</block>
								<block v-else-if="item.permittedType == 2">平台部分商品可用</block>
							</view>
							<view class="coupon-indate unuseful-text">
								{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }} - {{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
							</view>
							<view class="coupon-explain" @click="changeExpand(index)">
								<text>使用说明</text>
								<img class="coupon-explain-icon" v-if="expand" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more01%402x.png" alt="" />
								<img class="coupon-explain-icon" v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/more02%402x.png" alt="" />
							</view>
						</view>
						<view class="stub-ticket unuseful-stub-ticket">
							<view></view>
							<view class="coupon-price">
								<text class="symbol" v-if="item.type != 2">￥</text>
								<text class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</text>
								<text class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</text>
								<text class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</text>
								<text class="float-price" v-else>折</text>
							</view>
							<view class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</view>
							<view></view>
						</view>
					</view>
					<view class="coupon-detail" v-if="item.isExpand">
						<block v-if="item.description"><view v-html="item.description"></view></block>
						<block v-else>
							<p class="default-text">
								<text v-if="item.permittedType == 0">1. 全平台商品可用</text>
								<text v-else-if="item.permittedType == 1">{{ `1. 限${item.permittedCatesString}类商品可用` }}</text>
								<text v-else-if="item.permittedType == 2">1. 平台部分商品可用</text>
							</p>
							<p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
						</block>
					</view>
				</view>
			</block>
			<u-loadmore margin-top="20" ref="backTop" :loadText="loadText" bg-color="#f3f3f3" color="#999" :status="loadStatus"></u-loadmore>
		</view>
		<view class="empty-module" v-else>
			<view class="empty-part">
				<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Discount_bg%402x.png"></image>
				<p>您目前没有{{tabIndex == 0 ? '可使用' : tabIndex == 1 ? '已使用' : tabIndex == 2 ? '已失效' : '可使用'}}的优惠券</p>
			</view>
		</view>
	</view>
</template>

<script>
import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
export default {
	components: {
		wsfNavBar
	},
	data() {
		return {
			isEmpty:false,
			pageCount: {
				platformFailedCount: 0,
				platformUsableCount: 0,
				platformUsedCount: 0,
				storeFailedCount: 0,
				storeUsableCount: 0,
				storeUsedCount: 0,
				usableTotalCount: 0
			},
			expand: false,
			couponType: 1,
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
				status: 1,
				pageNum: 0,
				pageSize: 10
			},
			usableList: [],
			pageList: [],
			tabIndex: 0,
			tabList: [
				{
					id: 0,
					name: '可使用',
					mark: 'usable',
					number: 0
				},
				{
					id: 1,
					name: '已使用',
					mark: 'used',
					number: 0
				},
				{
					id: 2,
					name: '已失效',
					mark: 'past',
					number: 0
				}
			],
			isShowStore: 0
		};
	},
	filters: {
		formatDate(timeDate) {
			let time;
			if (timeDate) {
				let newDate = new Date(timeDate.replace(/-/g, '/'));
				time = newDate.getFullYear() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getDate();
			} else {
				time = '';
			}
			return time;
		}
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
		this.pageUserCoupons();
		this.getCouponTotal();
	},
	onReachBottom() {
		if (this.couponType == 2) {
			this.getPlatformCoupon();
		} else if (this.couponType == 1) {
			this.pageUserCoupons();
		}
	},
	methods: {
		skuPriceInt(price) {
			let intPrice = 0,
				floatPrice = 0;
			if (!price) {
				price = 0;
			} else {
				price = price.toFixed(2).split('.')[0];
			}
			return price;
		},
		skuPriceFloat(price) {
			let intPrice = 0,
				floatPrice = 0;
			if (!price) {
				price = 0;
			} else {
				price = price.toFixed(2).split('.')[1];
			}
			return price;
		},
		changeExpand(index) {
			this.pageList[index].isExpand = !this.pageList[index].isExpand;
			this.pageList = Object.assign([], this.pageList);
		},
		changeCouponType(type) {
			this.couponType = type;
			this.queryForm.pageNum = 0;
			this.hasMore = true;
			this.pageList = [];
			this.setPageCount();
			if (type == 2) {
				this.getPlatformCoupon();
			} else if (type == 1) {
				this.pageUserCoupons();
			}
		},
		onBackBtnClick() {
			uni.navigateBack();
		},
		//获取用户的优惠券总数
		getCouponTotal() {
			this.$u.api.QueryCouponCount().then(res => {
				this.pageCount = res.data;
				this.setPageCount();
			});
		},
		setPageCount() {
			for (let i in this.tabList) {
				if (this.tabList[i].id == 0) {
					this.tabList[i].number = this.couponType == 1 ? this.pageCount.storeUsableCount : this.pageCount.platformUsableCount;
				} else if (this.tabList[i].id == 1) {
					this.tabList[i].number = this.couponType == 1 ? this.pageCount.storeUsedCount : this.pageCount.platformUsedCount;
				} else if (this.tabList[i].id == 2) {
					this.tabList[i].number = this.couponType == 1 ? this.pageCount.storeFailedCount : this.pageCount.platformFailedCount;
				}
			}
		},
		getusableList() {
			this.$u.api.QueryUserCoupons().then(res => {
				this.usableList = res.data;
			});
		},
		pageUserCoupons() {
			console.log(this.pageList, 'this.pageList');
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QuerypageUserCoupons(this.queryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				this.pageList = this.pageList.concat(res.data.list);
				this.queryForm.pageNum++;
				this.hasMore = res.data.list.length === 10;
				this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
				this.isEmpty = this.pageList.length > 0 ? false : true;
			})
		},
		getPlatformCoupon() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.pagePlatformCoupon(this.queryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				this.pageList = this.pageList.concat(res.data.records);
				for (let i in this.pageList) {
					this.pageList[i].isExpand = false;
				}
				console.log(this.pageList,'this.pageList');
				this.queryForm.pageNum++;
				this.hasMore = res.data.records.length === 10;
				this.loadStatus = res.data.records.length === 10 ? 'loadmore' : 'nomore';
				this.isEmpty = this.pageList.length > 0 ? false : true;
			})
		},
		changeTab(item) {
			if (this.tabIndex != item.id) {
				this.pageList = [];
				this.hasMore = true;
				this.queryForm.pageNum = 0;
				this.tabIndex = item.id;
				switch (this.tabIndex) {
					case 0:
						this.queryForm.status = 1;
						break;
					case 1:
						this.queryForm.status = 2;
						break;
					case 2:
						this.queryForm.status = 3;
						break;
				}
				if (this.couponType == 2) {
					this.getPlatformCoupon();
				} else if (this.couponType == 1) {
					this.pageUserCoupons();
				}
			}
		},
		goStore(item) {
			this.navigateTo('StoreIndex', { storeId: item.storeId, storeName: item.storeName });
		},
		navigateTo(sceneName, params) {
			this.$wsf.go(sceneName, params);
		}
	}
};
</script>

<style scoped lang="scss">
.showfixedtop {
	.coupon-header-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 52rpx;
		width: 368rpx;
		.coupon-radio-box {
			border-radius: 26rpx;
			overflow: hidden;
			border: 2rpx solid #e60113;
			.coupon-radio {
				float: left;
				width: 164rpx;
				height: 52rpx;
				line-height: 52rpx;
				text-align: center;
				color: #e60113;
			}
			.active {
				background-color: #e60113;
				color: #fff;
			}
		}
	}

	.header-tabs {
		// position: fixed;
		// top: 129rpx;
		z-index: 999;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		.tabs {
			font-weight: bold;
			text-align: center;
			height: 100%;
			flex: 1;
			position: relative;
			font-size: 28rpx;
			color: #000;
			display: inline-block;
			line-height: 100rpx;
			i {
				position: absolute;
				bottom: 16rpx;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 56rpx;
				height: 6rpx;
				background: #e60113;
				border-radius: 4rpx;
				overflow: hidden;
				&.active {
					font-weight: bold;
				}
			}
		}
	}
}

.coupon-list {
	margin-bottom: 96rpx;
	padding: 0 24rpx;
	.coupon-box {
		margin-top: 20rpx;
		.coupon-card {
			position: relative;
			display: flex;
			height: 200rpx;
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			.top-round-corner {
				background-color: #f5f5f5;
				position: absolute;
				top: -12rpx;
				right: 200rpx;
				transform: translate(50%, 0);
				height: 24rpx;
				width: 24rpx;
				border-radius: 0 0 50% 50%;
			}
			.bottom-round-corner {
				background-color: #f5f5f5;
				position: absolute;
				bottom: -12rpx;
				right: 200rpx;
				transform: translate(50%, 0);
				height: 24rpx;
				width: 24rpx;
				border-radius: 50% 50% 0 0;
			}
			.mark-img {
				width: 148rpx;
				height: 108rpx;
				position: absolute;
				right: 218rpx;
				bottom: 0;
			}
			.platform-position {
				right: 280rpx;
			}
			.platform-padding {
				padding: 20rpx 36rpx;
			}
			.store-padding {
				padding: 36rpx;
			}
			.main-ticket {
				width: 502rpx;
				display: inline-flex;
				flex-direction: column;
				justify-content: space-between;
				.coupon-name {
					font-weight: 500;
					line-height: 40rpx;
					color: #000;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2; //显示的行
				}
				.coupon-indate {
					color: #666;
					font-size: 22rpx;
					line-height: 32rpx;
				}
				.unuseful-text {
					color: #999;
				}
				.coupon-explain {
					color: #999;
					display: inline-flex;
					align-items: center;
					justify-content: space-between;
					line-height: 24rpx;
					.coupon-explain-icon {
						width: 24rpx;
						height: 24rpx;
					}
				}
			}
			.stub-ticket {
				padding: 16rpx 0;
				width: 200rpx;
				display: inline-flex;
				flex-direction: column;
				justify-content: space-around;
				.coupon-price {
					width: 100%;
					display: inline-flex;
					justify-content: center;
					align-items: baseline;
					color: #fff;
					.symbol {
						font-size: 28rpx;
						line-height: 28rpx;
					}
					.int-price {
						font-size: 64rpx;
						line-height: 68rpx;
					}
					.float-price {
						font-size: 28rpx;
						line-height: 28rpx;
					}
				}
				.coupon-condition {
					font-size: 24rpx;
					width: 100%;
					text-align: center;
					color: #fff;
				}
				.coupon-use-button {
					width: 120rpx;
					height: 40rpx;
					background: #fff;
					border-radius: 30rpx;
					line-height: 40rpx;
					text-align: center;
					margin: 0 auto;
					font-size: 20rpx;
				}
				.store-button {
					color: #fe8c02;
				}
				.platform-button {
					color: #e60113;
				}
			}
			.useful-platform-ticket {
				background: linear-gradient(135deg, #ff6b77 0%, #e60113 100%);
			}
			.useful-store-ticket {
				background: linear-gradient(134deg, #ffba66 0%, #fe8c02 100%);
			}
			.unuseful-stub-ticket {
				background: #999;
			}
		}
		.coupon-detail {
			background: linear-gradient(180deg, #f2f2f2 0%, #ffffff 100%);
			padding: 16rpx 36rpx;
			.default-text {
				color: #999;
				line-height: 32rpx;
				font-size: 22rpx;
				text {
					font-size: 22rpx;
				}
			}
		}
	}
}
.empty-module {
		padding: 250rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		.empty-part {
			image {
				width: 180rpx;
				height: 180rpx;
			}
			p {
				text-align: center;
				margin-top: 10rpx;
				color: #999;
			}
		}
	}
.coupon-container {
	padding: 24rpx;

	.card-a {
		// min-height: 282rpx;
		padding-bottom: 10rpx;
	}
	.card-b {
		height: 200rpx;
		position: relative;
		.left-radius {
			background-color: #f5f5f5;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			left: 0;
			height: 24rpx;
			width: 24rpx;
			border-radius: 0 50% 50% 0;
		}
		.right-radius {
			background-color: #f5f5f5;
			position: absolute;
			top: 50%;
			transform: translate(50%, -50%);
			right: 0;
			height: 24rpx;
			width: 24rpx;
			border-radius: 50% 0 0 50%;
		}
	}
	.coupon {
		margin-bottom: 24rpx;
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		.store-name {
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 1px dashed #bababa;
			position: relative;
			.left-radius {
				background-color: #f5f5f5;
				position: absolute;
				bottom: -12rpx;
				left: 0;
				transform: translate(-50%, 0);
				height: 24rpx;
				width: 24rpx;
				border-radius: 0 50% 50% 0;
			}
			.right-radius {
				background-color: #f5f5f5;
				position: absolute;
				bottom: -12rpx;
				right: 0;
				transform: translate(50%, 0);
				height: 24rpx;
				width: 24rpx;
				border-radius: 50% 0 0 50%;
			}
		}
		.coupon-list {
			padding: 20rpx 14rpx 0 14rpx;
		}
		.detail-a {
			margin-top: 10rpx;
			margin-bottom: 30rpx;
			height: 140rpx;
		}
		.detail-b {
			padding: 30rpx 14rpx;
			height: 100%;
		}
		.detail {
			.img-box {
				background: #f5f5f5;
				display: inline-flex;
				width: 140rpx;
				height: 140rpx;
				border-radius: 8rpx;
				justify-content: center;
				align-items: center;
				image {
					width: 100%;
					height: 100%;
				}
				.empty {
					width: 84rpx;
					height: 84rpx;
				}
			}
			.content {
				margin-left: 20rpx;
				display: inline-block;
				width: 336rpx;
				vertical-align: top;
				.red {
					color: $wsf-color-red;
				}
				.grey {
					color: #bababa;
				}
				.price {
					font-size: 24rpx;
					.price-num {
						font-size: 48rpx;
						font-weight: bold;
					}
				}
				.describe {
					line-height: 28rpx;
					margin: 8rpx 0 8rpx;
				}
				.date {
					color: #999;
				}
			}
			.status {
				vertical-align: top;
				display: inline-block;
				.btn {
					display: inline-block;
					width: 120rpx;
					height: 48rpx;
					background: $wsf-color-red;
					border-radius: 28rpx;
					line-height: 48rpx;
					text-align: center;
					color: #fff;
					font-size: 20rpx;
				}
				image {
					width: 144rpx;
					height: 144rpx;
				}
			}
		}
	}
}
.footer {
	position: fixed;
	z-index: 99;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 92rpx;
	background: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	text {
		font-weight: 600;
		color: #000;
		font-size: 28rpx;
		margin-left: 6rpx;
		margin-right: 16rpx;
	}
	.coupon-icon {
		width: 40rpx;
		height: 40rpx;
	}
	.go-icon {
		width: 36rpx;
		height: 24rpx;
	}
}
</style>
