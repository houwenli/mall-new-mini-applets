<template>
    <view class="back-top" :style="[backTopStyle]">
        <view class="topback" :style="[mergeTopbackStyle]"></view>
        <view class="box-top" :style="[mergeBoxTopStyle]">
            <view class="icon-left" @click="goUponelevel">
                <image :src="diyBackImg"></image>
            </view>
            <view class="icon-left more" @click="goOverlay" v-if="showMore">
                <image :src="diyMenuImg"></image>
                <view v-if="showOverlay" class="indicator_">
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
            </view>
            <!-- 如果有搜索框，优先展示 -->
            <view class="search" @click="navigationTo('Search')" v-if="isShowSearch">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/search.png" alt="">
                <span>搜索商品</span>
            </view>
            <!-- 接着展示title -->
            <view v-else-if="title" class="title" :style="[mergeTitleStyle]">{{ title }}</view>
            <!-- 最后展示自定义内容 -->
            <view v-else :style="[mergeTitleStyle]" class="slot-area">
                <slot name="title-diy"></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        // 点击首页回到地址
        to: {
            type: String
        },
        isShowSearch: { // 是否展示搜索框，优先于title
            type: Boolean,
            default: false
        },
        backTopStyle: { // 顶部整体样式，比如可以设置背景图，背景色等等
            type: Object,
            default: {}
        },
        topbackBgColor: { // 顶部填充颜色
            type: String,
            default: 'transparent'
        },
        boxTopBgClor: { // 胶囊区域填充颜色
            type: String,
            default: 'transparent'
        },
        title: { // 标题
            type: String,
            default: ''
        },
        titleStyle: { // 标题样式
            type: Object,
            default: {}
        },
        isShowDiyBack: { // 自定义返回是否展示
            type: Boolean,
            default: true
        },
        diyBackImg: { // 自定义返回图片
            type: String,
            default: 'https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png'
        },
        isShowDiyMenu: { // 自定义菜单是否展示
            type: Boolean,
            default: true
        },
        diyMenuImg: { // 自定义菜单图片
            type: String,
            default: 'https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png'
        },
        showMore:{ // 是否展示自更多菜单
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            iStatusBarHeight: 0, // 顶部填充区域高度
            headerIconHeight: 0, // 顶部胶囊区域高度
            showOverlay: false, // 是否展示路由菜单
            capsuleRight: 0, // 右侧胶囊
        }
    },
    computed: {
        mergeTitleStyle() {
            let style = {
                marginRight: this.capsuleRight + 'px'
            }
            return Object.assign(style, this.titleStyle)
        },
        mergeTopbackStyle() {
            return { 
                background: this.topbackBgColor,
                height: this.iStatusBarHeight + 'px'
            }
        },
        mergeBoxTopStyle() {
            return { 
                background: this.boxTopBgClor,
                height: this.headerIconHeight + 'px'
            }
        },
    },
    mounted () {
        this.initNavBar()
    },
    methods: {
        // 初始化navbar，获取属性参数
        initNavBar() {
            let { height, top, left } = getApp().globalData.capsule;
            let { statusBarHeight, screenWidth } = uni.getSystemInfoSync()
            this.iStatusBarHeight = statusBarHeight;
            this.headerIconHeight = (top - this.iStatusBarHeight) * 2 + height;
            this.capsuleRight = screenWidth - left

            this.$emit('navBarInfo', {
                capsule: {
                    height, top, left
                },
                allHeight: this.iStatusBarHeight + this.headerIconHeight
            })
        },
        goCart() {
            this.$smart.go("SmartCart")
        },
        goRecord() {
            this.$smart.go("SmartUCenter")
        },
        goIndex() {
            if(this.to) {
                this.$smart.go(this.to)
            } else {
                this.$smart.go("SmartIndex")
            }
        },
        /* 跳转 */
        navigationTo(sceneName) {
            this.$smart.go(sceneName);
        },
        goUponelevel() {
            uni.navigateBack({
                delta: 1,
            });
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
      position: relative;
      image {
          width: 40rpx;
          height: 40rpx;
      }
  }
  .slot-area {
    flex: 1;
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
  width: 232rpx;
  box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189,194,204,0.04), 0rpx -4rpx 16rpx 0rpx rgba(189,194,204,0.08), 0rpx -2rpx 12rpx 0rpx rgba(189,194,204,0.06);
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
  position: absolute;
  top: 90rpx;
  left: 50%;
  transform: translateX(-50%);
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