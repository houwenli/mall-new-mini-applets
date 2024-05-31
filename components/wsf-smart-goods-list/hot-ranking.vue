<template>
  <view class="hot-ranking" :style="{background: `url(${item.listSaleSet.imgUrl})`}">
		<view class="hot-ranking-container">
			<view class="hot-ranking-goods" v-for="(n,i) in item.listSaleSet.imgList" :key="i">
				<image class="hot-ranking-top" :src="hotRankIcon[i]" />
				<image class="hot-ranking-goods-img" :src="n.imgUrl" @tap="handleProduct(n)" />
				<image class="hot-ranking-add" :src="hotRankAddIcon" @tap="handleAddCart(n)" />
				<view class="hot-ranking-price">
					<text class="hot-ranking-price-normal">¥</text>
					<text class="hot-ranking-price-plus">{{n.price * 100/10000 | priceInt}}</text>
					<text class="hot-ranking-price-normal">.{{n.price * 100/10000 | priceFloat}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      hotRankIcon: {
				0: this.$oss + 'wsf-mall/activity/hot-first.png',
				1: this.$oss + 'wsf-mall/activity/hot-second.png',
				2: this.$oss + 'wsf-mall/activity/hot-third.png',
			},
      hotRankAddIcon: this.$oss + 'wsf-mall/activity/hot-add.png',
    };
  },
  methods: {
    handleAddCart(n) {
			this.$emit("handleAddCart", n)
		},
    handleProduct(n) {
			this.$emit('goodsClick', n)
		},
  },
};
</script>

<style scoped lang="scss">
.hot-ranking {
	padding-top: 80rpx;
	height: 538rpx;
	border-radius: 16rpx;
	// background-color: #fff;
	margin-bottom: 20rpx;
	width: 344rpx;
	position: relative;
	background-size: 100% 100%;
	.hot-ranking-banner {
		width: 100%;
		height: 102rpx;
		display: block;
	}
	.hot-ranking-title {
		position: absolute;
		left: 20rpx;
		top: 18rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #fff;
	}
	.hot-ranking-container {
		// margin-top: -22rpx;
		height: 458rpx;
		// background: #fff;
		border-radius: 24rpx 24rpx 16rpx 16rpx;
		overflow: hidden;
		.hot-ranking-goods {
			margin: 38rpx 16rpx 0 20rpx;
			height: 100rpx;
			position: relative;
			.hot-ranking-top {
				width: 36rpx;
				height: 48rpx;
				position: absolute;
				left: -4rpx;
				top: -22rpx;
			}
			.hot-ranking-add {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				right: 0;
				bottom: 0;
			}
			.hot-ranking-goods-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 4rpx;
			}
			.hot-ranking-price {
				display: inline-block;
				margin: 26rpx 0 8rpx 18rpx;
				color: #FE3718;
				font-weight: bold;
				vertical-align: top;
				.hot-ranking-price-normal {
					font-size: 28rpx;
				}
				.hot-ranking-price-plus {
					font-size: 48rpx;
				}
			}
		}
	}
}
</style>
