<template>
    <view class="header-title" :style="{ height: headerIconHeight + 'px' }">
        <view class="header-back" @tap="toIndex">
            <img v-if="bgType == 1" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
            <img v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png">
        </view>
        <img v-if="bgType == 2" class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-white-2x.png" alt="" />
        <img v-else class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-grey-2x.png" alt="" />
    </view>
</template>
<script>
    export default {
        props: {
            headerIconHeight: {
                type: Number
            },
            bgType: {
                type: [String, Number]
            }
        },
        methods: {
            toIndex() {
                this.$wsf.go('Index')
            }
        },
    };
</script>
<style lang="scss" scoped>
    .header-title {
        display: flex;
        align-items: center;
        box-sizing: content-box;
        padding-left: 24rpx;
        .header-back {
            margin-right: 16rpx;
            img {
                width: 45rpx;
                height: 45rpx;
            }
        }

        .header-icon {
            width: 232rpx;
            height: 44rpx;
        }
    }
</style>
