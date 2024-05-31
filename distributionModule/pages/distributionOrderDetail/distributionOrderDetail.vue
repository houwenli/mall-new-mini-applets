<template>
	<view class="detail">
		<u-cell-group title="分销奖励">
			<u-cell-item title="结算状态：" :border-bottom="false" :arrow="false" :value-style="{color: transStatusColor[detailData.commissionStatus]}"
				:value="detailData.commissionStatusName"></u-cell-item>
			<u-cell-item v-if="detailData.commissionStatus != 3" title="佣 金：" :border-bottom="false" :arrow="false" :value="detailData.advanceCommission">
			</u-cell-item>
			<u-cell-item v-if="detailData.commissionStatus != 3 && detailData.recommendUserType == 1" title="绩效分：" :border-bottom="false" :arrow="false" :value="detailData.performanceScore">
			</u-cell-item>
		</u-cell-group>
		<u-cell-group title="订单信息">
			<u-cell-item title="购买时间：" :border-bottom="false" :arrow="false" :value-style="{color:'#999999'}"
				:value="detailData.createTime"></u-cell-item>
			<u-cell-item title="用户手机号：" :border-bottom="false" :arrow="false" :value="detailData.buyPhone | phoneNumberHide">
			</u-cell-item>
			<u-cell-item title="订单号：" :border-bottom="false" :arrow="false" :value="detailData.distributionOrderCode">
			</u-cell-item>
			<u-cell-item title="商品名称：" :border-bottom="false" :arrow="false" :value="detailData.skuName"></u-cell-item>
			<u-cell-item title="商品图片：" :border-bottom="false" :arrow="false">
				<u-image width="80" height="80" border-radius="6" :src="detailData.skuImage" @tap="previewImg(detailData.skuImage)"></u-image>
			</u-cell-item>
			<u-cell-item title="实付金额：" :border-bottom="false" :arrow="false" :value="detailData.payAmount">
			</u-cell-item>
			<u-cell-item title="购买数量：" :border-bottom="false" :arrow="false" :value="detailData.buyCount"></u-cell-item>
			<u-cell-item v-if="detailData.backNum" title="退款数量：" :border-bottom="false" :arrow="false" :value="detailData.backNum"></u-cell-item>
			<u-cell-item title="计佣金额：" :border-bottom="false" :arrow="false" :value="detailData.commissionAmount">
			</u-cell-item>
		</u-cell-group>
		<view class="return-status" v-if="detailData.commissionStatus == 3">用户申请退款</view>
	</view>
</template>

<script>
	const transStatus = {
		1: '待结算',
		2: '已结算',
		3: '已关闭',
	}
	export default {
		data() {
			return {
				detailData: {},
				transStatusColor: {
					0: '#999',
					1: '#E60113',
					2:'#E60113',
					3: '#999'
				}
			}
		},
		onLoad({
			id,
			distributionOrderCode
		}) {
			this.$u.api.QueryDistributionOrderDetail({
				id,
				distributionOrderCode
			}).then(({
				code,
				data
			}) => {
				if (code == 200) {
					data.commissionStatusName = transStatus[data.commissionStatus];
					this.detailData = data;
					this.detailData.commissionAmount = this.detailData.commissionAmount.toString()
					this.detailData.payAmount = this.detailData.payAmount.toString()
				}
			})
		},
		methods: {
			previewImg(img) {
    	  uni.previewImage({
    	    current: 0,
    	    urls: [img],
    	    indicator: "default"
    	  })
    	},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding-bottom:calc(env(safe-area-inset-bottom) - 40rpx);
		/deep/.u-cell-title {
			font-size: 32rpx;
			color: #000;
			font-weight: bold;
		}

		/deep/.u-cell-item-box {
			border-radius: 20px;
		}

		/deep/.u-cell_title {
			font-size: 28rpx;
			color: #000;
		}

		/deep/.u-cell__value {
			font-size: 28rpx;
			color: #000;
		}

		/deep/.u-image {
			display: inline-block;
		}

		.return-status {
			margin: 40rpx 0;
			text-align: center;
			line-height: 28rpx;
			color: #999;
			font-size: 28rpx;
		}
	}
</style>
