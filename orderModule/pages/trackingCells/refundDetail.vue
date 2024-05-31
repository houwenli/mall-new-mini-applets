<template>
	<view class="applet-tracking-order">
		<!-- 订单追踪头部信息展示 -->
		<view class="applet-tracking-order-header u-margin-bottom-24 u-padding-left-36 u-padding-top-40 u-padding-bottom-40 u-flex u-row-between u-col-left">
			<view class="applet-tracking-order-header-info u-flex u-row-left u-row-center">
				<view class="applet-tracking-order-header-info-key">订单编号:</view>
				<view class="applet-tracking-order-header-info-value">{{ orderCode }}</view>
			</view>
			<view v-if="logStatus == 1" class="applet-tracking-order-header-info u-flex u-row-left u-row-center">
				<view class="applet-tracking-order-header-info-value">
					<text class="applet-tracking-order-header-info-key">取消/退款进度:</text>
					<text style="color: #E60113;">{{ logStatus | logStatusDict }}</text>
					<text>待商家审核，预计最迟{{ countDown }}天之内为您审核</text>
				<!-- 	<u-count-down
						:show-days="false"
						:show-seconds="false"
						separator="zh"
						separator-size="26"
						separator-color="#E60113"
						color="#E60113"
						font-size="26"
						:timestamp="countDown"
					></u-count-down> -->
				</view>
			</view>
			<view v-else-if="logStatus == 3" class="applet-tracking-order-header-info u-flex u-row-left u-row-center">
				<view class="applet-tracking-order-header-info-key" style="min-width: 70px;">拒绝原因：</view>
				<view class="applet-tracking-order-header-info-value">{{ remark }}</view>
			</view>
			<view v-else class="applet-tracking-order-header-info u-flex u-row-left u-row-center">
				<view class="applet-tracking-order-header-info-key">取消/退款进度:</view>
				<view class="applet-tracking-order-header-info-value">{{ logStatus | logStatusDict }}</view>
			</view>
		</view>
		<!-- 物流信息内容 -->
		<view class="applet-tracking-time-line">
			<u-time-line>
				<template v-for="(item, idx) in tracesList">
					<u-time-line-item :key="idx" nodeTop="4">
						<template v-slot:node>
							<view class="u-node" :class="{ 'u-node-select': idx <= 0 }"></view>
						</template>
						<template v-slot:content>
							<view class="u-order-desc" :style="{ color: idx <= 0 ? '#000000' : '#999999' }">{{ item.message }}</view>
							<view class="u-order-time">{{ item.createTime }}</view>
						</template>
					</u-time-line-item>
				</template>
			</u-time-line>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			orderCode: '',
			logStatus: 0,
			tracesList: [
				{
					message: '您的订单已取消。如您使用了优惠券等，请查看取消进度详情'
				},
				{
					message: '您的取消申请已提交'
				}
			],
			countDown: 0,
			remark:''
		};
	},
	onLoad(options) {
		this.orderId = options.orderId;
		this.orderCode = options.orderCode;
		if (options.cancelTime) {
			this.tracesList = this.tracesList.map(el => {
				el.createTime = options.cancelTime;
				return el;
			});
		}
	},
	onShow() {
		this.loadBackOrderLog();
	},
	methods: {
		// 获取退单列表
		loadBackOrderLog() {
			this.$u.api.QueryBackOrderLog({ orderCode: this.orderCode }).then(res => {
				let that = this;
				this.logStatus = res.data? res.data.status : 11;
				this.remark = res.data.remark? res.data.remark : '';
				if (res.data.backOrderLogDescVOs) {
					this.tracesList = res.data.backOrderLogDescVOs;
					if (res.data.status == 1) {
						let endTime = res.data.endTime.replace(/\-/g, '/')
						endTime = new Date(endTime).getTime()
						let nowTime = res.data.nowTime.replace(/\-/g, '/')
						nowTime = new Date(nowTime).getTime()
						if (endTime - nowTime > 0) {
						  // this.countDown = (endTime - nowTime) / 1000
							//向上取整转化成天
							let countDownTime = endTime - nowTime
							let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
							this.countDown = countDownDay
						}
						// setTimeout(function() {
						// 	that.autoApplyRefundPassOrder();
						// }, this.countDown < 1? 1000 : this.countDown * 1000);
					}
				}
			});
		},
		// 自动通过订单
		autoApplyRefundPassOrder() {
			this.$u.api.ApplyRefundPass({ orderCode: this.orderCode }).then(res => {
				this.loadBackOrderLog();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.applet-tracking-order-header {
	// height: 229rpx;
	flex-direction: column;
	align-items: flex-start;
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	&-info {
		line-height: 50rpx;
		&-key {
			margin-right: 16rpx;
			color: #666666;
			font-size: 28rpx;
		}
		&-value {
			margin-right: 12rpx;
			font-size: 28rpx;
			color: #000;
		}
		&-copy {
			width: 68rpx;
			height: 36rpx;
			background: #f5f5f5;
			border-radius: 16rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #000000;
			text-align: center;
		}
	}
}
.applet-tracking-time-line {
	border-radius: 20rpx;
	padding: 40rpx 36rpx;
	margin-bottom: 60rpx;
	background-color: #fff;
	.u-node {
		width: 18rpx;
		height: 18rpx;
		background: #dbdbdb;
		border: 4rpx solid #eeeeee;
		border-radius: 18rpx;
		overflow: hidden;
		box-sizing: content-box;
	}
	.u-node-select {
		background: #e60113;
		border: 4rpx solid #ffd8db;
	}

	.u-order-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #999999;
		line-height: 40rpx;
		margin-bottom: 16rpx;
	}
	.u-order-desc {
		font-size: 24rpx;
		color: #999999;
		line-height: 40rpx;
		margin-bottom: 16rpx;
	}
	.u-order-time {
		font-size: 22rpx;
		color: #999999;
		line-height: 24rpx;
		margin-bottom: 40rpx;
	}
	/deep/ .u-time-axis-item {
		margin-bottom: 0;
	}
}
</style>
