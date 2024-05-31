<template>
    <div class="logistics-box" @click="goToTrace" :style="{'margin-bottom': marginBottom}">
        <view class="left">
            <image class="address-icon" :src="imageUrl"></image>
            <view class="logistics-value logis-company-name">{{ dataObj.logisCompanyName }}</view>
            <view class="logistics-value">{{ dataObj.waybillCode }}</view>
        </view>
        <image class="right-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
    </div>
</template>

<script>
    export default {
        name:'logisticsInfo',
        props:{
            // 1寄 2收
            componentType:{
                type:[Number,String],
                default:1
            },
            dataObj:{
                type:Object,
                default:()=>{}
            },
            orderId:{
                type:[Number,String],
                default:''
            },
            marginBottom:{
                type:String,
                default:'16rpx'
            }
        },
        computed:{
            imageUrl(){
                if(this.componentType == 1){
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_jichu.png'
                }else{
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_jihui.png'
                }
            }
        },
        methods:{
		    goToTrace() {
				this.$wsf.go('trackingCells', {
                    isSfterSales:true,
					id: this.orderId,
					type: Number(this.componentType) === 1 ? 0 : 1
				});
			},
        }
    }
</script>

<style lang="scss" scoped>
.logistics-box{
    padding: 18rpx 24rpx;
    background: #FAFAFA;
    border-radius: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 16rpx;
    .address-icon{
        width: 52rpx;
        height: 32rpx;
        margin-right: 8rpx;
    }
    .left{
        display: flex;
        align-items: center;
    }
    .logistics-value{
        font-size: 26rpx;
        color: #191919;
    }
    .logis-company-name{
        margin-right: 8rpx;
    }
    .right-icon{
        width: 32rpx;
        height: 32rpx;
    }
}

</style>