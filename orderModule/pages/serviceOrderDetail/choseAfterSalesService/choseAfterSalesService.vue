<template>
	<view class="select-after-sales-type-page-content">
		<view class="service-store">
			本次售后服务将由
			<span>{{ orderInfo.storeName }}</span>
			为你提供
		</view>
		<view class="after-service-card">
			<view class="shop-info" :key="index" @click="goToSku(orderInfo.returnSku.skuId)">
				<image class="sku-img" :src="orderInfo.returnSku.skuImage"></image>
				<view class="txt-info">
					<view class="sku-name">{{ orderInfo.returnSku.skuName }}</view>
					<view class="money-shoppingTrolley">
						<view class="money">￥{{ priceFilter(orderInfo.returnSku?orderInfo.returnSku.unitPrice:'') }}</view>
                        <view class="sku-num">x{{ orderInfo.returnSku.num }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="after-service-option">
			<!-- <view class="after-service-option-column" :class="{ 'disable-style': orderInfo.overDueStatus == 1 }" @click="toSalesReturn"> -->
			<view class="after-service-option-column" @click="toSalesReturn('SalesReturn')" v-if="isShowReturnColumn && orderInfo.orderType != 10">
				<view class="flex-box u-flex u-row-between">
					<view class="u-flex">
						<span class="turn-back-text">退货</span>
					</view>
					<view class="u-flex">
						<p class="hint-text" v-if="orderInfo.overDueStatus == 0">已超过规定的退货时间</p>
						<p class="hint-text" v-else>{{ getEffectiveTime }}</p>
						<image class="after-service-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
					</view>
				</view>
			</view>
			
			<view class="after-service-option-column" @click="toSalesReturn('ExchangeGoods')" v-if="isShowExchangeColumn">
				<view class="flex-box u-flex u-row-between">
					<view class="u-flex">
						<span class="turn-back-text">换货</span>
					</view>
					<view class="u-flex">
						<p class="hint-text" v-if="orderInfo.overDueStatus == 0">已超过规定的换货时间</p>
						<p class="hint-text" v-else>{{ getEffectiveTime }}</p>
						<image class="after-service-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
					</view>
				</view>
			</view>
			<!-- 商品校验提示弹窗 -->
			<wsf-confirm v-model="hintDialogShow" :title="hintDialogText" activeText="我知道了" @confirm="hintDialogShow = false"></wsf-confirm>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { priceFilter } from '@/common/wsfFilter.js';
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
export default {
	components: {
		wsfConfirm
	},
	data() {
		return {
			hintDialogText: '',
			hintDialogShow: false,
			isShowReturnColumn: true, //显示退货栏
			isShowExchangeColumn: true, //显示换货栏
			priceFilter,
			orderInfo: {},
			orderId: null,
			orderSkuId: null,
			productInfo: {},
			intoType: -1
		};
	},
	onLoad(option) {
		console.log(option, 'option');
		this.orderId = option.orderId
		this.orderSkuId = option.orderSkuId
		this.intoType = option.type;
		this.getData()
	},
    computed:{
        getEffectiveTime(){
            if(this.orderInfo.receivingTime){
                return dayjs(this.orderInfo.receivingTime).add(7, 'day').format('YYYY-MM-DD')+'前可申请'
            }else{
                return ''
            }
        }
    },
	methods: {
		// 获取商品数据
		getData() {
			if(this.intoType == 1) {
				let data = {
					orderId: this.orderId,
					orderSkuId: this.orderSkuId
				};
				this.$u.api.queryorderforreturn(data).then(res => {
					this.orderInfo = res.data;
                    // 如果是实体店订单不可以换货
                    if(Number(this.orderInfo.orderType) === 9){
                        this.isShowExchangeColumn = false
                    }
				});
			} else if(this.intoType == 2) {
				this.$u.api.backorderdetail({ id: this.orderId }).then(res => {
					this.orderInfo = res.data;
					// 判断此单之前是什么售后类型
					let type = res.data.type
					if(type == '2') { //退货
					  this.isShowExchangeColumn = false
					} else if(type == '3') { //换货
					  this.isShowReturnColumn = false
					}
				})
			}
		
		},
		// 前往商品详情
		goToSku(id) {
			this.$wsf.go('SkuDetail', { skuId: id });
		},
		async toSalesReturn(name) {
			// if (this.orderInfo.overDueStatus == 1) return;
			if (name == 'SalesReturn') {
				this.$wsf.go( name, { orderId: this.orderId, orderSkuId: this.orderSkuId, type: this.intoType, orderType: 2 }, "redirectTo");
			} else if (name == 'ExchangeGoods') {
				console.log('this.orderInfo',this.orderInfo);
				// let data = {
				//   spuId: this.orderInfo.returnSku.spuId
				// }
				// let response = await this.$store.dispatch('AFTER_SALES_CONFIG/checkExchangeSkuOrSpu', data);
				// if(response.data !== 1) {
				//   this.hintDialogText = response.description
				//   this.hintDialogShow = true
				//   return
				// }
				// this.$store.commit('AFTER_SALES_CONFIG/LOAD_EXCHANGE_GOODS_DATA', true)
				this.$wsf.go( name, { orderId: this.orderId, orderSkuId: this.orderSkuId, type: this.intoType, orderType: 3 }, "redirectTo");
			}
		}
	}
};
</script>

<style scoped lang="scss">
.select-after-sales-type-page-content{
    padding: 0rpx 20rpx;
}
.disable-style {
	opacity: 0.5;
}
.service-store {
	font-size: 22rpx;
	padding: 20rpx 0;
	color: #999;
	span {
		color: $wsf-color-red;
	}
}

.after-service-option {
	margin-bottom: 24rpx;
	overflow: hidden;
	.after-service-option-column {
		border-top: 1rpx solid #f2f2f2;
		padding: 28rpx 24rpx;
        background: #FFFFFF;
        border-radius: 16rpx;
		margin-bottom: 20rpx;
		.flex-box {
			.disable-handle {
				opacity: 0.5;
			}
			.turn-back-Icon {
				width: 36rpx;
				height: 36rpx;
			}
			.turn-back-text {
                font-size: 26rpx;
                color: #191919;
			}
			.hint-text {
				font-size: 22rpx;
                color: #191919;
			}
		}
		&:first-child {
			border: none;
		}
	}
    .after-service-icon{
        margin-left: 12rpx;
        width: 32rpx;
        height: 32rpx;
    }
}

.after-service-card {
	margin-bottom: 20rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 20rpx;
	
	.shop-info {
		width: 100%;
		display: flex;
		// margin-bottom: 60rpx;
		.sku-img {
			width: 148rpx;
			height: 148rpx;
			border-radius: 16rpx;
			margin-right: 16rpx;
		}
        .sku-name{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
		.txt-info {
            flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			text {
				font-size: 22rpx;
				font-weight: 400;
				color: #999999;
			}
			.money-shoppingTrolley {
				width: 100%;
				display: flex;
				justify-content: space-between;
				.money {
					font-size: 28rpx;
					font-weight: 600;
					color: #000000;
				}
                .sku-num{
                    font-size: 26rpx;
                    color: #999999;
                }
			}
		}
	}
}
</style>
