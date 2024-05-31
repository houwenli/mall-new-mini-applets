<template>
	<view class="table-u">
		<view class="specification">
			<img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-specification.png" alt="">
			<span>商品规格</span>
		</view>
		<view class="view-table">
			<view class="tr" v-for="(item, index) in paramList" :key="index">
				<view class="td-1">{{ item.attributeName }}</view>
				<view class="td-2">{{ item.attributeValue }}</view>
			</view>
		</view>
		<view class="btn" v-if="skuData.spuAttributeValues && skuData.spuAttributeValues.length > 7" @click="changeExpand">
			<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${!isExpand?'btn-btom':'btn-top'}.png`" alt="">
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			expandIcon: 'arrow-down',
			isExpand: false,
			showList: [],
		};
	},
	props: {
		skuData: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	computed: {
		paramList() {
			let list = this.skuData.spuAttributeValues
			if(list && list.length > 7 && !this.isExpand) {
				list = list.slice(0, 7)
			}
			return list
		}
	},
	methods: {
		changeExpand() {
			if (this.isExpand) {		
				this.expandIcon = 'arrow-down';
			} else {
				this.expandIcon = 'arrow-up';
			}
			this.isExpand = !this.isExpand;
		}
	}
};
</script>

<style scoped lang="scss">
.table-u {
	margin: 20rpx 24rpx;
	padding: 30rpx 24rpx 24rpx 24rpx;
	background: #ffffff;
	border-radius: 24rpx;
	.specification {
		display: flex;
		align-items: center;
		padding-bottom: 24rpx;
		img {
			width: 32rpx;
			height: 34rpx;
		}
		span {
			padding-left: 8rpx;
			font-size: 26rpx;
            color: #191919;
		}
	}
}
.view-table {
	border: 1px solid #EEEEEE;
	.tr {
		display: flex;
		border-bottom: 1px solid #EEEEEE;
		.td-1 {
			width: 176rpx;
			flex-shrink: 0;
			padding: 22rpx 16rpx 20rpx 16rpx;
			font-size: 22rpx;
			color: #999999;
		}
		.td-2 {
			width: 100%;
			padding: 22rpx 16rpx 20rpx 16rpx;
			font-size: 22rpx;
			color: #999999;
			border-left: 1px solid #EEEEEE;
		}
	}
	.tr:last-child {
		border-bottom: none;
	}
}
.btn {
	width: 122rpx;
	height: 32rpx;
	border-radius: 16rpx;
	margin: 0 auto;
	margin-top: 24rpx;
	img {
		width: 121rpx;
		height: 31rpx;
		display: block;
	}
}
</style>
