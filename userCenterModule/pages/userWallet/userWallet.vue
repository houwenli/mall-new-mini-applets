<template>
	<view class="applet-wallet-wrap">
		<view class="applet-wallet-header">
			<view class="applet-wallet-header-title">钱包余额（ 元 ）</view>
			<u-count-to
				class="applet-wallet-header-price"
				ref="uCountTo"
				duration="1000"
				start-val="0"
				:end-val="totalPredeposit | priceFilter"
				color="#fff"
				:autoplay="false"
				:decimals="2"
				font-size="65"
			></u-count-to>
		</view>
		<u-tabs class="applet-wallet-tabs" height="100" active-color="#e60113" :list="tabsList" :is-scroll="false" :current="current" @change="tabsChange"></u-tabs>
		<view class="applet-wallet-body">
			<u-empty v-if="transactionRecordList.length === 0 && isEnd" margin-top="140" text="数据为空" mode="list"></u-empty>
			<template v-for="item in transactionRecordList">
				<view class="applet-wallet" :key="item.id">
					<view class="applet-wallet-type">{{ item.remark }}</view>
					<view :class="item.transType == '1' || item.transType == '3' || item.transType  == '4' ? 'active applet-wallet-price' : 'applet-wallet-price'">{{ item.transType == '1' || item.transType == '3' || item.transType  == '4' ? '+' : '-' }}{{ item.money | priceFilter }}</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 请求参数
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
				filterType: 1 // 数据类型 1 - 全部  2 - 收入 3 - 支出
			},
			current: 0, // 激活的tabs栏
			isEnd: false, // 是否结束
			isLoading: true, //是否正在加载
			totalPredeposit: 0, // 钱包总额
			tabsList: [
				{
					name: '全部'
				},
				{
					name: '收入'
				},
				{
					name: '支出'
				}
			],
			transactionRecordList: [] // 交易记录列表
		};
	},
	onShow() {
		this.loadTotalPredeposits();
		this.loadPredeposits();
	},
	onReachBottom() {
		this.loadPredeposits();
	},
	methods: {
		//加载钱包总额
		loadTotalPredeposits() {
			let that = this;
			this.$u.api.TotalPredeposit().then(res => {
				this.$refs.uCountTo.start();
				this.totalPredeposit = res.data;
			});
		},
		// tab栏切换监听
		tabsChange(e) {
			this.queryForm.pageNum = 0;
			this.current = e;
			this.queryForm.filterType = e + 1;
			this.transactionRecordList = [];
			this.isEnd = false;
			this.loadPredeposits();
		},
		// 加载余额变更明细
		loadPredeposits() {
			if (this.isEnd) return;
			let that = this;
			this.$u.api.Predeposits(this.queryForm).then(res => {
				this.queryForm.pageNum++;
				this.isEnd = res.data.list.length < 10;
				this.transactionRecordList = this.transactionRecordList.concat(res.data.list);
			});
		}
	}
};
</script>

<style lang="scss">
.applet-wallet-wrap {
	.applet-wallet-header {
		padding: 50rpx 57rpx 30rpx;
		background-color: $wsf-color-red;
		&-title {
			color: #fff;
			font-size: 26rpx;
			line-height: 40rpx;
		}
		&-price {
			line-height: 100rpx;
		}
	}
	.applet-wallet-body {
		.applet-wallet {
			padding: 20rpx;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&-type {
				height: 80rpx;
				line-height: 80rpx;
				color: #999;
			}
			&-price {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 50rpx;
			}
			.active {
				color: $wsf-color-red;
			}
		}
	}
}
</style>
