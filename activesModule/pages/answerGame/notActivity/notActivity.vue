<template>
  <view class="page-container">
    <!--返回按钮 -->
    <view
      class="back-but"
      @click="goBack()"
      :style="{
        top: searchBarTop + 'px',
        height: searchBarHeight + 'px',
      }"
    >
      <image
        class="back-img"
        :src="`${mallImg}/activity/women-Day/fanhui_hei.png`"
      ></image>
    </view>
    <image class="bgc-top" :src="`${mallImg}/activity/women-Day/datiye_background_top.png`"></image>
    <view class="content">
      <image
        class="gift-img"
        :src="`${mallImg}/activity/women-Day/lingquan_wuquan.png`"
      ></image>
      <view class="text-title">券已经发完！</view>
      <view class="text-Subtitle">抱歉！您来晚了~</view>
      <view class="go-mall-index-buttom" @click="goTo()">到商城首页逛逛</view>
      <image
        class="bgc-bottom"
        :src="`${mallImg}/activity/women-Day/datiye_background_bottom.png`"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  name: "notActivity",
  data() {
    return {
      mallImg: this.$mallImg,
      searchBarTop: 0,
      searchBarHeight: 0,
    };
  },
  onShow() {
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    this.searchBarTop = menuButtonInfo.top;
    this.searchBarHeight = menuButtonInfo.height;
  },
  //   分享到朋友圈
  onShareTimeline() {
    return {
      title: "万顺福女神节，最高88元优惠券等你来赢！",
      path: "activesModule/pages/answerGame/landingPage/landingPage?enterType=share",
      imageUrl: `${this.mallImg}/activity/women-Day/share-img200.jpg`,
    };
  },
  //   分享给好友
  onShareAppMessage() {
    return {
      title: "万顺福女神节，最高88元优惠券等你来赢！",
      path: "activesModule/pages/answerGame/landingPage/landingPage?enterType=share",
      imageUrl: `${this.mallImg}/activity/women-Day/share-img54.jpg`,
    };
  },
  methods: {
    goBack() {
        this.$wsf.go("GameLandingPage",{},'redirectTo');
    },
    goTo() {
      this.$wsf.go("Index");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  padding: 135rpx 25rpx;
  background: linear-gradient(90deg, #ffadb1 0%, #ffcbce 100%);

  .back-but {
    width: 50px;
    border-radius: 16px;
    background: rgba(253, 244, 244, 0.8);
    position: fixed;
    left: 10px;
    z-index: 10;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .back-img {
      width: 11px;
      height: 20px;
      margin-right: 3px;
    }
  }
  .bgc-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 202rpx;
  }
  .bgc-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 303rpx;
  }
  .content {
    box-shadow: 0px 3px 12px #f98a8a;
    height: 100%;
    background: #f7f3f7;
    border-radius: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .gift-img {
    width: 248rpx;
    height: 212rpx;
    margin-bottom: 38rpx;
  }
  .text-title {
    font-size: 48rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000;
    margin-bottom: 27rpx;
  }
  .text-Subtitle {
    font-size: 39rpx;
    font-family: Source Han Sans CN;
    font-weight: 300;
    color: #999999;
    margin-bottom: 114rpx;
  }
  .go-mall-index-buttom {
    width: 439rpx;
    height: 115rpx;
    border: 1px solid #f54695;
    border-radius: 58rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #f54695;
  }
}
</style>
