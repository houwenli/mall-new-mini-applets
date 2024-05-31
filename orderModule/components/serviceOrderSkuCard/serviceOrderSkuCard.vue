<template>
   	<view class="goods-info-card">
		<view class="goods-info" @click="goToSku(skuData.skuId)">
			<image class="goods-image" :src="skuData.skuImage"></image>
			<view class="goods-name">
				<view>
					<view class="goods-skuname">{{ skuData.skuName }}</view>
					<view class="goods-num">
						{{ '申请数量: ' + pageData.num }}
					</view>
				</view>
                <view class="money-shoppingTrolley">
                   
					<!-- <view class="money-icon money-font">￥</view> -->
                    <view class="fqz-num">{{skuData.integralPoint}}福气值+{{ skuData.unitPrice&&String(skuData.unitPrice).split('.')[0] }}</view>
                    <view class="fqz-num">{{ getDecimal }}</view>
				</view>
			</view>
		</view>
		<view class="service-btn u-border-top" @click="serviceTel">
            <image class="sku-service-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/service_new.png"></image>
			<text>联系客服</text>
		</view>
	</view>
</template>

<script>
    export default {
        name:'',
        props:{
            pageData:{
                type:Object,
                default:()=>{}
            },
            skuData:{
                type:Object,
                default:()=>{}
            },
        },
        computed:{
            getDecimal(){
                if(this.skuData&&this.skuData.unitPrice){
                    let decimal = String(this.skuData.unitPrice).split('.')[1]
                    return `.${decimal?decimal:'00'}`
                }else{
                    return ''
                }
            }
        },
        methods:{
            goToSku(id) {
			    if(this.pageData.orderType == 9) {
			    	this.$wsf.go('SkuDetail', { skuId: id, storeIdNumber: this.pageData.buyStoreId, sourceType: 2 });
			    } else {
			    	this.$wsf.go('SkuDetail', { skuId: id });
			    }
		    },
        }
    }
</script>

<style lang="scss" scoped>
// 商品信息模块
.goods-info-card{
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    margin: 0rpx 24rpx 24rpx 24rpx;
    .goods-info{
        display: flex;
        margin-bottom: 32rpx;
    }
    .goods-name{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .goods-skuname{
        margin-bottom: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .goods-num{
        font-size: 22rpx;
        color: #999999;
        line-height: 30rpx;
    }
    .goods-image{
        width: 204rpx;
        height: 204rpx;
        border-radius: 16rpx;
        margin-right: 16rpx;
    }
    .money-shoppingTrolley {
        display: flex;
        align-items: flex-end;
		width: 100%;
        .money-font{
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #191919;
        }
        .money-icon{
            line-height: 38rpx;
            font-size: 24rpx;
        }
        .money-integer{
            line-height: 40rpx;
            font-size: 32rpx;
        }
        .money-decimal{
            line-height: 36rpx;
            font-size: 26rpx;
        }
	}
    .service-btn {
		padding-top: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text {
			margin-left: 8rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #444444;
		}
        .sku-service-img{
            width: 40rpx;
            height: 40rpx;
        }
	}
    .fqz-num {
        font-size: 22rpx;
        font-weight: 600;
        color: #191919;
        .special {
            font-size: 32rpx;
            font-weight: bold;
        }
    }
}
</style>