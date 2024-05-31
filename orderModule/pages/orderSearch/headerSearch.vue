<template>
    <view class="back-top">
        <view class="topback" :style="{ background: topbackBgColor || '#ffffff', height: iStatusBarHeight + 'px'}"></view>
        <view class="box-top" :style="{ background: topSearch ? '#ffffff' : '', height: headerIconHeight + 'px' }">
            <view class="icon-left" @click="goUponelevel"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt=""></view>
            <view class="icon-left more" @click="goOverlay"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png" alt=""></view>
            <view class="title" :style="{ paddingRight: capsuleRight + 'px' }">{{ title }}</view>      
        </view>
        <view v-if="showOverlay" class="indicator_" @click="showOverlay = false">
            <view class="img_"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-triangle.png" alt=""></view>
            <view class="listTime" @click="goIndex()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-homePage.png" alt="">
                <span>首页</span>
            </view>
            <view class="listTime" @click="goCart()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-shoppingTrolley.png" alt="">
                <span>购物车</span>
            </view>
            <view class="listTime" @click="goRecord()">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-personage.png" alt="">
                <span>个人中心</span>
            </view>
        </view>
        <view class="show-overlay" v-if="showOverlay" @click="showOverlay = false"></view>
        
        <slot name="listFilter"></slot>
    </view>
</template>

<script>
export default {
    props: {
        topSearch: {
            type: Boolean,
            default() {
                return false
            }
        },
        enterType:{
            type:String,
            default:''
        },
        // 点击首页回到地址
        to: {
            type: String
        },
        isShowSearch: {
            type: Boolean,
            default:true
        },
        title: {
            type: String,
            default: ''
        },
        topbackBgColor: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            iStatusBarHeight: 0,
            showOverlay: false,
            headerIconHeight: 0,
            capsuleRight: 0
        }
    },
    mounted () {
        let { height, top, left } = getApp().globalData.capsule;
        let { statusBarHeight, screenWidth } = uni.getSystemInfoSync()
        this.iStatusBarHeight = statusBarHeight;
        this.headerIconHeight = (top - this.iStatusBarHeight) * 2 + height;
        this.capsuleRight = screenWidth - left
    },
    methods: {
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
        goUponelevel() {
            if (this.enterType === "answer") {
                uni.navigateBack({
                delta: 2,
                });
            } else {
                uni.navigateBack({
                delta: 1,
                });
            }
        },
        goOverlay() {
            this.showOverlay = !this.showOverlay
        },
    },
    // onReady() {
        //动态修改状态栏的颜色
        // uni.setNavigationBarColor({
        //     frontColor: '#000000',
        //     backgroundColor: '#ff0000'
        // })
    // },
}
</script>

<style scoped lang="scss">
.back-top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .show-overlay {
    position: fixed;
    z-index: 10;
    top: 0;
    height: 100vh;
    width: 100%;
  }
  .topback {
      background: #ffffff;
      width: 100%;
  }
  .box-top {
      display: flex;
      height: 44px;
      align-items: center;
      width: 100%;
  }
  .icon-left {
      width: 64rpx;
      height: 64rpx;
      background: rgba(255,255,255,0.9);
      border-radius: 16rpx;
      border: 1rpx solid rgba(151,151,151,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 24rpx;
      img {
          width: 40rpx;
          height: 40rpx;
      }
  }
  .title {
    flex: 1;
    font-size: 32rpx;
    text-align: center;
    font-weight: 400;
    color: #191919;
  }
  .more {
      margin-left: 16rpx;
  }
  .search {
      width: 346rpx;
      height: 64rpx;
      background: rgba(255,255,255,0.9);
      border-radius: 37rpx;
      border: 1rpx solid rgba(151,151,151,0.2);
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
  position: relative;
  z-index: 11;
  width: 232rpx;
  box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189,194,204,0.04), 0rpx -4rpx 16rpx 0rpx rgba(189,194,204,0.08), 0rpx -2rpx 12rpx 0rpx rgba(189,194,204,0.06);
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-left: 24rpx;
  margin-top: 28rpx;
  padding: 8rpx 24rpx;
  position: relative;
  .img_ {
    position: absolute;
    width: 32rpx;
    height: 16rpx;
    top: -26rpx;
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