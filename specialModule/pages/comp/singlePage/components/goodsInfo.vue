<template>
	<div class='goods-info-box' @click.stop='toDetails(item)'>
		<div class='product-price'>
			<span class='spu_price'>
				<span class='spu_price_btn_yuan'>
					<span class='spu_price_btn_icon'>¥</span>
					<span class="spu_price_btn_pre_price">{{ prePrice | priceInt }}</span>
              		<span class="spu_price_btn_dian_price">{{ prePrice | priceFloat }}</span>
				</span>

				<span :class="{ spu_price_btn: isCouponLable, 'active-price': !isCouponLable }"
					v-if='item.price != finalPrice'>
					<span class='spu_price_btn_text' v-if='isCouponLable'>券后</span>
					<span class='spu_price_btn_icon'
						:style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">¥</span>
					<span class='spu_price_btn_pre_price'
						:style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">{{ finalPrice | priceInt
						}}</span>
					<span class='spu_price_btn_dian_price'
						:style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">{{ finalPrice | priceFloat
						}}</span>
				</span>
			</span>
		</div>

		<div v-if="showName" class='goods-name u-line-2'>{{ item.name }}</div>
	</div>
</template>

<script>
// import { formatPrice } from '@/utils/utils'
export default {
	props: {
		item: {
			type: Object,
			default: () => {
				return {};
			},
		},
		showName: {
			type: Boolean,
			default: true
		}
	},
	filters: {
		priceInt(price) {
			let int;
			if (price && Number(price) < 10000) {
				int = Number(price).toFixed(2).split(".")[0];
			} else if (price && Number(price) >= 10000) {
				int = parseInt(price);
			} else {
				int = "0";
			}
			return int;
		},
		priceFloat(price) {
			let float;
			if (price && Number(price) < 10000) {
				float = "." + Number(price).toFixed(2).split(".")[1];
			} else if (price && Number(price) >= 10000) {
				float = "";
			} else {
				float = ".00";
			}
			return float;
		},
	},
	computed: {
		isCouponLable() {
      		let skuLable = this.item.skuLable
      		return skuLable && skuLable.couponLable && skuLable.couponLable.length != 0 && skuLable.couponLable[0].afterCouponPrice
    	},

    	finalPrice() {
			let skuLable = this.item.skuLable,
          	price = this.item.price
        	if (this.isCouponLable) {
        	  price = skuLable.couponLable[0].afterCouponPrice
        	}
        	return price
    	},

		prePrice({item}) {
			let price = item.price
        	if (!this.isCouponLable || (this.isCouponLable && item.price != item.skuLable.finalPrice)) {
        	  price = item.skuLable.finalPrice
        	}

        	return price
		}
	},

	methods: {
		// 价格展示处理
		setPrice(item) {
			return formatPrice(item).split(".");
		},

		toDetails(e) {
			let skuId = e.id || e.skuId,
				sourceType = e.sourceType || e.goodsSource || 1
			// this.$wsf.go("SkuDetail", { skuId });
			if (e.goodsSource == 4) {
				this.$wsf.go('ToMotor', { skuId, sourceType });
			} else {
				this.$wsf.go('SkuDetail', { skuId, sourceType });
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.goods-info-box {
	overflow: hidden;
	position: absolute;
	left: 0;
	right: 0;
	margin: 0 24rpx;
	padding: 24rpx;
	background-color: #fff;
	border-radius: 24rpx;
	bottom: calc(120rpx + constant(safe-area-inset-bottom));
	bottom: calc(120rpx + env(safe-area-inset-bottom));
	z-index: 10;
	transform: translateZ(100px);
}

.product-price {
	padding-bottom: 24rpx;
}

.spu_price {
	color: #e60113;
	display: flex;
	align-items: center;
	.spu_price_btn_yuan {
		display: flex;
		align-items: baseline;
		height: 56rpx;
		line-height: 56rpx;

		>.spu_price_btn_icon {
			font-size: 32rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ff0a35;
		}

		>.spu_price_btn_pre_price {
			font-size: 60rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ff0a35;
			white-space: nowrap;
		}

		>.spu_price_btn_dian_price {
			font-size: 32rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ff0a35;
		}
	}

	.spu_price_btn {
		margin-left: 8rpx;
		padding: 0 16rpx;
		color: #fff;
		font-weight: normal;
		width: fit-content;
		height: 56rpx;
		line-height: 56rpx;
		background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
		border-radius: 30rpx 30rpx 30rpx 4rpx;
		.spu_price_btn_text {
			margin-right: 8rpx;
			font-size: 22rpx;
			font-weight: bold;
			color: #ffffff;
			vertical-align: bottom;
		}

		.spu_price_btn_icon {
			font-size: 26rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ffffff;
		}

		.spu_price_btn_pre_price {
			font-size: 40rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ffffff;
		}

		.spu_price_btn_dian_price {
			font-size: 26rpx;
			font-family: AlternateBold;
			font-weight: bold;
			color: #ffffff;
		}
	}
}

.goods-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #111111;
	line-height: 40rpx;
}

.active-price {
	color: #c3c3c3;
	display: flex;
	align-items: baseline;
	height: 40rpx;
	line-height: 40rpx;
	margin-top: 16rpx;
	margin-left: 6rpx;


	display: flex;
	position: relative;
	align-items: baseline;

	.spu_price_btn_icon {
		font-size: 22rpx;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}

	.spu_price_btn_pre_price {
		font-size: 32rpx;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}

	.spu_price_btn_dian_price {
		font-size: 22rpx;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}
}
</style>
