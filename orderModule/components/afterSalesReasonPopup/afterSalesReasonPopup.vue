<template>
    <u-popup v-model="show" mode="bottom" :safe-area-inset-bottom="true" :border-radius="24" :mask-close-able="false" :mask-custom-style="{backgroundColor:'rgba(0, 13, 29, 0.6)'}">
		<view class="applet-settlement-popup-wrap">
			<view class="applet-settlement-popup-header">
				<view class="applet-settlement-popup-header-title">
                    申请原因
				    <image src="@/static/img/icon/close-icon.png" class="dapplet-settlement-popup-close-icon" @click="closePopup()"></image>
                </view>
			</view>
			<scroll-view scroll-y="true" class="reason-list-box">
				<view class="reason-item" v-for="(item, index) in returnWayInfo" :key="index" @click="changeReturnWayId(item.id)">
					<text>{{ item.name }}</text>
					<view
                    :class="item.id === choseReturnWayId
                        ? 'reason-item-checked'
                        : 'reason-item-check'"
                    ></view>
				</view>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script>
    export default {
        name:'afterSalesReasonPopup',
        props:{
            show: {
                type: Boolean,
                default: false,
            },
            choseReturnWayId:{
                type: [String,Number],
                default: null,
            },
            returnWayInfo: {
                type: Array,
                default: () => [
			    	{
			    		id: 1,
			    		name: '卖家发错货'
			    	},
			    	{
			    		id: 2,
			    		name: '发票问题'
			    	},
			    	{
			    		id: 3,
			    		name: '七天无理由'
			    	},
			    	{
			    		id: 4,
			    		name: '商品与页面描述不符'
			    	},
			    	{
			    		id: 5,
			    		name: '质量问题'
			    	},
			    	{
			    		id: 6,
			    		name: '其他'
			    	}
			    ],
            }
        },
        data() {
            return {
			    
            };
        },
        methods:{
            closePopup(){
                this.$emit("update:show", false);
            },
            changeReturnWayId(id){
                this.$emit('changeReturnWayId',id)
            }
        }
    }
</script>

<style lang="scss" scoped>
.applet-settlement-popup-wrap {
	color: #000000;
	position: relative;
	background-color: #fff;
    padding: 0rpx 24rpx;
	.applet-settlement-popup-header {
        padding: 24rpx 0rpx;
        margin-bottom: 24rpx;
        text-align: center;
		&-title {
			font-size: 32rpx;
			font-weight: 400;
			color: #191919;
		    position: relative;
		}
        .dapplet-settlement-popup-close-icon{
            width: 54rpx;
            height: 40rpx;
            position:absolute;
            right: 0rpx;
        }
	}
    .reason-list-box{
        padding-bottom: 12rpx;
    }
    .reason-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72rpx;
        padding: 0rpx 10rpx 0rpx 24rpx;
        margin-bottom: 12rpx;
    }
    .reason-item-checked{
        width: 32rpx;
		height: 32rpx;
		background-size: 100% 100%;
		background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
    }
    .reason-item-check{
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        border: 2rpx solid #c3c3c3;
    }
}
</style>