<template>
    <view class="header-title" :style="{ height: headerIconHeight + 'px' }">
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
        }
    };
</script>
<style lang="scss" scoped>
    .header-title {
        display: flex;
        align-items: center;
        box-sizing: content-box;
        padding-left: 24rpx;

        .header-icon {
            width: 232rpx;
            height: 44rpx;
        }
    }
</style>
