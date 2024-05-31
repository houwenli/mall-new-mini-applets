<template>
	<view class="page">
		<view class="rules">
			<view>1. 每笔订单按照一定比例进行返佣，最终以入账金额为准。</view>
			<view>2. 订单佣金结算需等待该订单完结后，以该订单最终实付价格进行佣金结算，订单最终实付价格不包含<text>已退货、退款商品</text>。</view>
			<view>3. 推广后用户下单生成一条正向待结算佣金流水，若用户退款、退货则按照退款比例生成一条负向的待结算佣金流水。</view>
			<view>4. 佣金结算后点击【提现】到“我的账户”进行提现</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100%;
		background-color: #FFF;
	}
.rules{
	
	padding: 32rpx;
	view{
		font-size: 28rpx;
		color: #333;
		padding: 0 0 32rpx;
		text{
			font-weight: bold;
		}
	}
}
</style>
