<template>
    <div class="header-content" :style="{background:bgColor}">
        <view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
        <view class="title-bar" :style="{height:titleHeight+'px',lineHeight:titleHeight+'px'}">
            <view class="return-btn" @click="goBack()">
                <image class="return-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_fanhui.png"></image>
            </view>
           {{ title }}
        </view>
      
    </div>
</template>

<script>
    export default {
        name:'serviceOrderHeader',
        props:{
            title:{
                type:String,
                default:'服务单详情'
            },
            bgColor:{
                type:String,
                default:''
            },
        },
        data() {
            return {
                statusBarHeight:'',//状态栏高度
                titleHeight:''//标题高度
            };
        },
        created(){
            let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight

            let titlePadding = menuButtonInfo.top-this.statusBarHeight
            this.titleHeight = titlePadding*2+32

        },
        methods:{
            goBack(){
                uni.navigateBack({
				    //uni.navigateTo跳转的返回，默认1为返回上一级
				    delta: 1
			    });
            }
        }
    }
</script>

<style lang="scss" scoped>
.header-content{
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 100;

    .title-bar{
        position: relative;
        font-size: 40rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 88rpx;
        text-align: center;
    }
    .return-btn{
        width: 64rpx;
        height: 64rpx;
        background: rgba(30,30,30,0.2);
        border-radius: 16rpx;
        border: 1rpx solid rgba(151,151,151,0.2);
        position: absolute;
        left: 24rpx;
        top:50%;
        transform:translate(0%,-50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .return-icon{
        width: 40rpx;
        height: 40rpx;
    }
}
</style>