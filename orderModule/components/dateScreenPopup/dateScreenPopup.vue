<template>
    <u-popup v-model="show" mode="bottom" class="u-date-popup" :border-radius="24" :mask-close-able="false" :mask-custom-style="{backgroundColor:'rgba(0, 13, 29, 0.6)'}">
            <view class="date-popup-title">
                下单时间
                <image src="@/static/img/icon/close-icon.png" class="date-popup-header-close-icon" @click="closeDatePopup()"></image>
            </view>
		    <view class="date-option-box">
                <view  v-for="(item,index) in dateOption" :key="index" @click="dateSelected(item.value)" class="option-item" :class="{'option-item-selected':timeType === item.value}">{{ item.label }}</view>
		    </view>
            <view class="date-popup-bottom">
                <view class="resetting-btn bottom-btn-font" @click="resetting()">重置</view>
                <view class="confirm-btn bottom-btn-font" @click="confirm()">确定</view>
            </view>
	</u-popup>
</template>

<script>
    export default {
        name:'dateScreenPopup',
        data(){
            return{
                timeType:0,//筛选时间类型
                dateOption:[
                    {
                        value:0,
                        label:'全部'
                    },
                    {
                        value:1,
                        label:'一月内'
                    },
                    {
                        value:2,
                        label:'一个月至三个月'
                    },
                    {
                        value:3,
                        label:'三个月至六个月'
                    },
                    {
                        value:4,
                        label:'六个月至一年'
                    },
                    {
                        value:5,
                        label:'一年以上'
                    }
                ],
            }
        },
        props:{
            show: {
                type: Boolean,
                default: false,
            },
        },
        methods:{
            // 关闭日期筛选弹窗
            closeDatePopup(){
                this.$emit("update:show", false);
            },
            // 重置日期选择
            resetting(){
                this.timeType = 0
            },
            // 
            confirm(){
                this.$emit('confirmDate', this.timeType);
            },
            // 选择日期
            dateSelected(val){
                console.log('选中了:',val)
                this.timeType = val
            }
        }
    }
</script>

<style lang="scss" scoped>
.u-date-popup{
    .date-popup-title{
        padding: 24rpx 0rpx;
        margin: 0rpx 24rpx;
        text-align: center;
        position: relative;
        font-size: 32rpx;
    }
    .date-popup-header-close-icon{
        width: 54rpx;
        height: 40rpx;
        position:absolute;
        right: 0rpx;
    }
    .date-option-box{
        display: flex;
        flex-wrap: wrap;
        height: 328rpx;
        padding-top: 24rpx;
        justify-content: center;
        align-content: flex-start;
    }
    .option-item{
        width: 310rpx;
        height: 56rpx;
        border-radius: 28rpx;
        background: #F6F6F6;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        line-height: 56rpx;
        text-align: center;
        margin: 0rpx 17rpx 20rpx 17rpx;
        border: 1rpx solid #F6F6F6;
    }
    .option-item-selected{
        border: 1rpx solid #FF0A35;
        background: rgba(255,231,235,0.5);
        color: #FF0A35;
    }
    .date-popup-bottom{
        margin: 0rpx 24rpx;
        padding: 8rpx 0rpx;
        background: #FFFFFF;
        box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189,194,204,0.2);
        display: flex;
        padding-bottom: env(safe-area-inset-bottom);
    }
    .bottom-btn-font{
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 80rpx;
        text-align: center;
    }
    .resetting-btn{
        width: 338rpx;
        height: 80rpx;
        border-radius: 40rpx;
        border: 2rpx solid #C3C3C3;
        color: #444444;
        margin-right: 26rpx;
    }
    .confirm-btn{
        width: 338rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 40rpx;
        color: #FFF9E9;
    }
}
</style>