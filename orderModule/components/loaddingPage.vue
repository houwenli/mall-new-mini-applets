<template>
    <view class="loadding-page">
        <view class="loadding-icon"></view>
        <view class="loadding-text">加载中…</view>
    </view>
</template>
<style lang="less" scoped>
    .loadding-page {
        padding-top: 340rpx;
        text-align: center;
    }
    .loadding-icon {
        background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/loading-160-80-%202.gif');
        background-size: 100% 100%;
        display: inline-block;
        position: relative;
        width: 160rpx;
        height: 80rpx;
    }
    .loadding-text {
        font-size: 20rpx;
        color: #90969e;
        line-height: 28rpx;
    }
</style>
