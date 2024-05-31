<template>
	<view class="status-process-box" v-if="pageData" :style="{'paddingTop':pagePaddingTop+'px'}">
        <view class="service-store">
			本次售后服务将由 {{ pageData.storeName }} 为你提供
		</view>
        <view v-if="serverStatusDict[Number(pageData.status)]" class="close-box">
            <image class="close-img" :src="imageUrl"></image>
            <view class="close-text">{{ serverStatusDict[Number(pageData.status)] }}</view>
        </view>
        <view class="process-content" v-else>
            <view class="steps-item" v-for="(item, index) in statusList" :key="index">
                <view class="steps-content">
                    <image class="steps-icon" :src="stepsIcon(index)"></image>
                    <view class="steps-text" :class="{ 'font-white': statusIndex >= index }">{{ item.name }}</view>
                </view>
                <view v-if="index !== statusList.length-1" class="steps-line" :class="{ 'steps-line-white': statusIndex > index }" :style="{'width':lineWidth}"></view>
            </view>
        </view>
        
	</view>
</template>

<script>
    export default {
        name:'statusProcess',
        props:{
            // 审核流程的节点合集
            statusList:{
                type:Array,
                default:()=>[]
            },
            pageData:{
                type:Object,
                default:()=>{}
            },
            // 节点连接线宽度
            lineWidth:{
                type:String,
                default:'76rpx'
            }
        },
        data() {
            return {
                pagePaddingTop:'',
                serverStatusDict: {
                    5:'服务单关闭',
                    9:'服务单关闭',
                    14:'服务单已关闭',
                    17:'服务单已关闭',
                    11:'服务单取消',
                },
                imgUrlList:[
                    'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liucheng_1.png',
                    'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liucheng_2.png',
                    'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liucheng_3.png',
                ]
            };
        },
        created(){
            let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
            let titlePadding = menuButtonInfo.top-statusBarHeight
            let titleHeight = titlePadding*2+32
            this.pagePaddingTop = titleHeight+statusBarHeight
        },
        computed:{
            imageUrl(){
                if(Number(this.pageData.status) === 11){
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_quxiao.png'
                }else{
                    return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_guanbi.png'
                }
            },
            //当前流程节点所在的索引
            statusIndex(){
                return this.statusList.findIndex(item=>{
                    return item.status.includes(this.pageData.status*1)
                })
            }
        },
        methods:{
            stepsIcon(index){
                   if(this.statusIndex === index){
                        return this.imgUrlList[1]
                   }
                   if(this.statusIndex > index){
                        return this.imgUrlList[0]
                   }
                   return this.imgUrlList[2]
                
            },
        }
    }
</script>

<style lang="scss" scoped>
.status-process-box {
	height: 200rpx;
	display: flex;
	background: linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%);
    align-items: center;
    flex-direction: column;
    box-sizing: content-box;
	&-title {
		text-align: center;
		width: 100%;
		padding: 0 40rpx;
		font-size: 32rpx;
		color: #fff;
	}
    .process-content{
        height: 200rpx;
	    display: flex;
	    justify-content: center;
        align-items: flex-start;
    }
	.service-store {
	    font-size: 22rpx;
	    text-align: center;
        color: #FFFFFF;
        margin-bottom: 16rpx;
    }
    .steps-item{
        display: flex;
        align-items: center;
    }
    .steps-content{
        position: relative;
    }
    .steps-text{
        position: absolute;
        top: 48rpx;
        font-size: 22rpx;   
        white-space: nowrap;
        transform: translate(-50%, 0%);
        left:50%;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.4);
    }
    .steps-icon{
        width: 40rpx;
        height: 40rpx;
        display: block;
    }
    .steps-line{
        width: 86rpx;
        height: 2rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.4);
        margin: 0rpx 16rpx;
    }
    .steps-line-white{
        border: 2rpx solid #FFFFFF;
    }
    .font-white {
	    color: #fff !important;
    }
    .close-img{
        width: 40rpx;
        height: 40rpx;
        display: block;
        margin: auto;
        margin-bottom: 8rpx;
    }
    .close-text{
        font-size: 22rpx;
        font-weight: 500;
        color: #FFFFFF;
    }
}
</style>