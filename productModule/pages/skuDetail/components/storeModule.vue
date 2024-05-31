<template>
	<view class="u-padding-top-40 u-padding-bottom-40 u-padding-left-24 u-padding-right-24">
		<view class="store-module u-flex u-row-between">
			<view class="store-info">
				<view class="image-box">
					<image :src="skuData.storeScore.storeInfo.avatarPicture || shopImg"></image>
				</view>
				<view class="detail">
					<view class="title u-line-1">{{ skuData.storeName }}</view>
					<view class="mark u-line-1 u-font-13">{{ followNum + 10000 }}人关注</view>
					<view class="star">
						<span class="u-font-10 u-margin-right-6">综合体验</span>
						<u-rate v-model="score" :disabled="true" :size="16" :gutter="2"></u-rate>
					</view>
				</view>
			</view>
			<view class="store-into" @click="goStore">进店</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		skuData: {
			type: Object,
			default() {
				return {};
			}
		}
	},

  data() {
    return {
      shopImg: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/shop_icon%402x.png'
    }
  },

	computed: {
		score() {
			// let num;
			// if (this.skuData.storeScore) {
			// 	num = (this.skuData.storeScore.descScore + this.skuData.storeScore.sellerScore + this.skuData.storeScore.logisticsScore) / 3;
			// }
			return 5;
		},
		followNum() {
			let num = this.skuData.storeFollowNum;
			if (num > 10000) {
				num = parseFloat(num / 10000).toFixed(1) + '万';
			}
			return num;
		}
	},
	methods: {
		goStore() {
			this.$emit('goStore');
		}
	}
};
</script>

<style scoped lang="scss">
.store-module {
	height: 120rpx;
	.store-info {
		.image-box {
			display: inline-block;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			border: 1px solid #ddd;
			padding: 6rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.detail {
			display: inline-block;
			margin-left: 20rpx;
			.title {
				font-size: 30rpx;
				line-height: 40rpx;
				font-weight: bold;
				padding-bottom: 16rpx;
				max-width: 420rpx;
			}
			.mark {
				color: #999;
				line-height: 26rpx;
			}
		}
	}
	.store-into {
		width: 124rpx;
		height: 52rpx;
		border-radius: 26rpx;
		border: 1px solid $wsf-color-red;
		color: $wsf-color-red;
		line-height: 52rpx;
		text-align: center;
		font-size: 26rpx;
		font-weight: bold;
	}
}
</style>
