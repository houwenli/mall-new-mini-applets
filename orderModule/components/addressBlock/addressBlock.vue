<template>
    <div class="address-content">
        <image class="address-icon" :src="imageUrl"></image>
        <view class="address-info">
			<view class="name-mobile">
                <view>
                    <span class="name-mobile-text name">{{ dataObj.name }}</span>
                    <span class="name-mobile-text">{{ dataObj.mobile }}</span>
                    <p style="color:red" v-if="componentType==1&&dataObj.yzSource&& dataObj.yzSource!=0">(备注：退换货详细地址，务必咨询客服后再进行操作)</p>
                </view>
                <view class="copy-btn" @click="setClipboardData(dataObj.name + ' ' + dataObj.mobile + ' ' + dataObj.detailAddress)">复制</view>
			</view>
			<view class="address-text"> {{ getAddress }}</view>
        </view>
    </div>
</template>

<script>
    export default {
        name:'addressBlock',
        props:{
            // 1寄 2收
            componentType:{
                type:[Number,String],
                default:1
            },
            dataObj:{
                type:Object,
                default:()=>{}
            }
        },
        computed:{
            imageUrl(){
                if(this.componentType == 1){
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_ji_yuan.png'
                }else{
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_shou_yuan.png'
                }
            },
            getAddress(){
                if(this.componentType == 1){
                    return this.dataObj.detailAddress
                }
                if(this.componentType == 2){
                    return `${this.dataObj.address.split(',').join(' ')} ${this.dataObj.detailAddress}`
                }

            }
        },
        mounted(){
            console.log(this.dataObj)
        },
        methods:{
            // 复制到剪贴板
		    setClipboardData(data) {
		    	uni.setClipboardData({ data: data });
		    },
        }
    }
</script>

<style lang="scss" scoped>
.address-content{
    display: flex;
    align-items: center;
    .address-icon{
        width: 48rpx;
        height: 48rpx;
        margin-right: 16rpx;
    }
    .address-info{
        flex: 1;
    }
    .name-mobile{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;
    }
    .name-mobile-text{
        font-size: 26rpx;
        font-weight: 500;
        color: #191919;
    }
    .name{
        margin-right: 16rpx;
    }
    .address-text{
        font-size: 26rpx;
        font-weight: 400;
        color: #6E6E6E;
    }
    .copy-btn{
        width: 76rpx;
        font-size: 22rpx;
        height: 34rpx;
        line-height: 34rpx;
        background: #F7F7F7;
        border-radius: 17rpx;
        text-align: center;
        margin-left: 24rpx;
    }
}
</style>