<template>
    <view class="back-top">
        <view class="topback" :style="{ height: iStatusBarHeight + 'px' }"></view>
        <view class="box-top" :style="{ height: boxTopHeight + 'px' }">
            <view class="icon-left" @click="goBack"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" /></view>
            <view class="icon-left more" @click="goOverlay">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png" alt="" />
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
            <view class="title">
                {{ pageTitle || '更多好物，等你挑选' }}
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            iStatusBarHeight: {
                type: Number,
                default: 0
            },
            boxTopHeight: {
                type: Number,
                default: 0
            },

            pageTitle: {
                type: [String, Object],
                default: '更多好物，等你挑选'
            }
        },
        data() {
          return {
            showOverlay: false
          }
        },
        methods: {
            goBack() {
                // 分享进来返回商城首页
                if (this.enterType === "share") {
                    this.$wsf.go("Index");
                }
                //   返回上一个小程序
                if (getCurrentPages().length === 1) {
                    uni.navigateBackMiniProgram();
                } else {
                    uni.navigateBack({
                        delta: 1,
                    });
                }
            },

            goOverlay() {
                this.showOverlay = !this.showOverlay;
            },

            goCart() {
              this.$smart.go('SmartCart')
            },
            goRecord() {
              this.$smart.go('SmartUCenter');
            },
            goIndex() {
              if(this.to) {
                this.$smart.go(this.to)
              } else {
                this.$smart.go('SmartIndex')
              }
            },
            /* 跳转 */
            navigationTo(sceneName) {
                this.$smart.go(sceneName);
            },
        },
    }
</script>
<style lang="less" scoped>
        .back-top {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 101;
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          .topback {
            background: #ffffff;
            width: 100%;
          }
          .box-top {
            display: flex;
            align-items: center;
            width: 100%;
            height: 88rpx;
            background-color: #fff;
          }
          .title {
            flex-grow: 1;
            text-align: center;
            margin-right: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            font-size: 16px;
            font-weight: bold;
          }
          .icon-left {
            position: relative;
            width: 64rpx;
            height: 64rpx;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 16rpx;
            border: 1rpx solid rgba(151, 151, 151, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 24rpx;
            img {
              width: 40rpx;
              height: 40rpx;
            }
          }
          .more {
            margin-left: 16rpx;
          }
          .search {
            width: 346rpx;
            height: 64rpx;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 37rpx;
            border: 1rpx solid rgba(151, 151, 151, 0.2);
            display: flex;
            flex-shrink: 0;
            align-items: center;
            margin-left: 24rpx;
            img {
              width: 32rpx;
              height: 32rpx;
              padding-left: 16rpx;
            }
            span {
              font-size: 28rpx;
              padding-left: 16rpx;
              color: #999999;
            }
          }
        }
        .indicator_ {
      width: 232rpx;
      box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189, 194, 204, 0.04),
        0rpx -4rpx 16rpx 0rpx rgba(189, 194, 204, 0.08),
        0rpx -2rpx 12rpx 0rpx rgba(189, 194, 204, 0.06);
      background: #ffffff;
      border-radius: 16rpx;
      padding: 8rpx 24rpx;
      top: 45px;
      left: 50%;
      transform: translate(-50%, 0%);
      position: absolute;
      .img_ {
        position: absolute;
        width: 32rpx;
        height: 16rpx;
        top: -23rpx;
        left: 41%;
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
