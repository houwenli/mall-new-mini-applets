<template>
  <view class="page">
    <wsf-nav-bar :status-bar="true" title=" " :hasBack="false"></wsf-nav-bar>
    <view class="title">
      <image
        class="title-icon"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/classify-empty.png"
      ></image>
    </view>
    <view class="content">
      <view class="content-title"> 账号登录异常提示 </view>
      <view class="content-desc">
        检测到您账号登录异常，建议您按照如下方法
      </view>
      <view class="content-column">
        <view class="dot"></view>
        <view class="content-word"> 通过万顺叫车小程序进入商城 </view>
      </view>
      <view class="content-column">
        <view class="dot"></view>
        <view class="content-word"> 通过万顺叫车APP进入商城 </view>
      </view>
      <view class="content-column">
        <view class="dot"></view>
        <view class="content-word">
          联系客服处理，服务热线：<text class="light">400 642 4888</text>
        </view>
      </view>
      <view class="hint" style="margin-top: 12rpx">温馨提示：</view>
      <view class="hint">通过万顺叫车小程序或APP进入商城余额支付更便捷哦</view>
    </view>
    <view class="bottom">
      <view class="bottom-box">
        <button class="button agree-button" @tap="serviceTel()">
          联系客服
        </button>
        <button class="button disagree-button" @tap="goLogin()">
          暂不处理
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
export default {
  components: {
    wsfNavBar,
  },
  data() {
    return {
     
    };
  },
  onLoad(option) {

  },
  methods: {
    // 联系客服
    serviceTel() {
    	let phoneNumber = '0755-4006424888';
    	uni.makePhoneCall({
    		phoneNumber: phoneNumber
    	});
    },
    goLogin() {
      this.$wsf.go("QuickLogin",{},"redirectTo")
    }
  },
};
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  background-color: #fff;
  .title {
    padding: 64rpx 0 60rpx;
    display: flex;
    justify-content: center;
    .title-icon {
      width: 360rpx;
      height: 360rpx;
    }
  }
  .content {
    padding: 0 48rpx;
    .content-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #000;
      line-height: 40rpx;
      padding-bottom: 12rpx;
    }
    .content-desc {
      color: #666;
      font-size: 28rpx;
      line-height: 40rpx;
      padding-bottom: 36rpx;
    }
    .content-column {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18rpx;
      .dot {
        width: 8rpx;
        height: 8rpx;
        background: #333;
        border-radius: 50%;
      }
      .content-word {
        width: 634rpx;
        font-size: 26rpx;
        color: #333;
        line-height: 48rpx;
        .light {
          color: #ea0213;
        }
      }
    }
    .hint {
      font-size: 24rpx;
      color: #666;
      line-height: 34rpx;
    }
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    .bottom-box {
      margin: 0 48rpx;
      padding-bottom: 40rpx;
      .button {
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .agree-button {
        background: #E60113;
        border-radius: 50rpx;
        font-size: 32rpx;
        color: #fff;
      }
      .disagree-button {
        font-size: 32rpx;
        color: #666;
        background-color: #fff;
        margin-top: 16rpx;
        &::after {
          border: 0;
        }
      }
    }
  }
}
</style>
