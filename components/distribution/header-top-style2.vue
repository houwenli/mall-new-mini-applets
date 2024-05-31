<template>
    <view>
        <view class="header-title" :class="{ brunet: bgType == 2 }" :style="{ height: headerIconHeight + 'px' }">
            <!-- 深色 -->
            <block v-if="bgType == 2">
                <view class="header-back" @tap="goBack">
                    <img class="icon-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png" alt="" />
                </view>

                <view class="header-more" @tap="handShowOverlay">
                    <img class="icon-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/feature-list-icon-white-2x.png" alt="" />
                </view>

                <img class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-white-2x.png" alt="" />
            </block>

            <!-- 浅色 -->
            <block v-else>
                <view class="header-back" @tap="goBack">
                    <img class="icon-img" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
                </view>

                <view class="header-back" @tap="handShowOverlay">
                    <img class="icon-img" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png" alt="" />
                </view>

                <img class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-grey-2x.png" alt="" />
            </block>
        </view>
        <view v-if="showOverlay" class="indicator_">
            <view class="img_"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-triangle.png" alt="" /></view>
            <view class="listTime" @click="goIndex()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-homePage.png" alt="" />
                <span>首页</span>
            </view>
            <view class="listTime" @click="goCart()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-shoppingTrolley.png" alt="" />
                <span>购物车</span>
            </view>
            <view class="listTime" @click="goRecord()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-personage.png" alt="" />
                <span>个人中心</span>
            </view>
        </view>
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
        data() {
            return {
                showOverlay: false
            };
        },
        methods: {
            goBack() {
                // 分享进来返回商城首页
                // if (this.enterType === 'share') {
                //     this.$wsf.go('Index');
                // }
                //   返回上一个小程序
                
                uni.navigateBackMiniProgram();
                
            },

            goCart() {
                this.$smart.go('SmartCart')
            },
            goRecord() {
                this.$smart.go('SmartUCenter');
            },
            goIndex() {
                this.showOverlay = false
                this.$smart.go('SmartIndex')
            },
            /* 跳转 */
            navigationTo(sceneName) {
                this.$wsf.go(sceneName);
            },
            goUponelevel() {
                if (this.enterType === 'answer') {
                    uni.navigateBack({
                        delta: 2
                    });
                } else {
                    uni.navigateBack({
                        delta: 1
                    });
                }
            },

            handShowOverlay() {
                this.showOverlay = !this.showOverlay;
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
        .header-back {
            width: 64rpx;
            height: 64rpx;
            background: #fff;
            border-radius: 16rpx;
            border: 1rpx solid rgba(151, 151, 151, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 16rpx;
            .icon-img {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .header-more {
            margin-right: 16rpx;
            width: 64rpx;
            height: 64rpx;
            .icon-img {
                width: 100%;
                height: 100%;
            }
        }

        .header-icon {
            margin-left: 8rpx;
            width: 232rpx;
            height: 44rpx;
        }
    }
    .brunet {
        .header-back {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.2);
        }
    }
    .indicator_ {
        position: fixed;
        z-index: 999;
        left: 0;
        width: 232rpx;
        box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189, 194, 204, 0.04), 0rpx -4rpx 16rpx 0rpx rgba(189, 194, 204, 0.08),
            0rpx -2rpx 12rpx 0rpx rgba(189, 194, 204, 0.06);
        background: #ffffff;
        border-radius: 16rpx;
        margin-left: 24rpx;
        margin-top: 16rpx;
        padding: 8rpx 24rpx;
        .img_ {
            position: absolute;
            width: 10rpx;
            height: 8rpx;
            top: -26rpx;
            left: 49%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .listTime {
            height: 80rpx;
            display: flex;
            align-items: center;
            img {
                width: 40rpx;
                height: 40rpx;
            }
            span {
                font-size: 26rpx;
                color: #444444;
                padding-left: 24rpx;
            }
        }
    }
</style>
