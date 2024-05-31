<template>
	<view class="page">
		<view class="main">
      <image class="logo" :src="authorizeMain"></image>
      <image class="text" :src="authorizeTitle"></image>
    </view>
    <u-popup :mask-close-able="false" v-model="show" mode="bottom" border-radius="32" :safe-area-inset-bottom="true">
      <view class="box">
        <view class="title">{{title}}</view>
        <view class="content">{{content}}</view>
        
        <view class="buttons-wraper">
          <view class="aggre-wraper">
            <image class="read-flag" :src="readFlagIcon" @click="readAggre"></image>我已阅读并同意<view class="url" @tap.stop="goPrivacyAgm">《用户隐私协议》</view>
          </view>
          <view class="buttons">
            <view class="disagree" @tap.stop="disagree">不同意</view>
            <button class="agree" id="agree-btn" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agree">阅读并同意</button>
          </view>
        </view>
      </view>
    </u-popup>
	</view>
</template>

<script>
import privacyAuthorization from "@/common/services/privacyAuthorization"
export default {
  components: {
  },
  data() {
    return {
      // 页面中使用到的图片
      authorizeMain: `${this.$smartImg}/home/authorize-main.png`,
      authorizeTitle: `${this.$smartImg}/home/authorize-title.png`,
      
      show: true, // 是否展示弹窗
      jumpUrl: '', // 回跳链接
      readFlag: false, // 是否阅读协议

      title: "万顺福平台协议，隐私政策",
      content: "您在使用万顺福产品/服务前，请您务必审慎阅读、充分理解隐私政策中相关条款内容，当您确认点击同意，即表示您已经充分理解并同意该条款，该条款将构成对您具有法律约束力的文件。隐私政策主要包含以下内容：个人信息的手机使用规则及设备权限的调用情况。本弹窗并不会直接开启相关权限，我们会就具体权限开启另行征得您的同意。",
    }
  },
  computed: {
    readFlagIcon() {
      return this.readFlag ? `${this.$mallImg}/order/can_choose.png` : `${this.$smartImg}/cart/cart-sku-nomal.png`
    }
  },
  onLoad({url}) {
    if(url){
      this.jumpUrl = decodeURIComponent(url);
    }
  },
  methods: {
    readAggre() {
      this.readFlag = !this.readFlag
    },
    agree() {
      // 没有阅读直接返回
      if(!this.readFlag) {
        this.$u.toast(`请阅读并勾选同意用户隐私协议`);
        return
      }
      privacyAuthorization.agree();
      if(!this.jumpUrl){
        wx.navigateBack();
      }
      this.$smart.go(this.jumpUrl)
    },
    disagree() {
      privacyAuthorization.disagree();
      // 检查隐私协议的页面如果存在则返回页面
      if(getCurrentPages().length > 1){
        wx.navigateBack();
        return;
      }
      wx.exitMiniProgram();
    },
    goPrivacyAgm() {
      this.$smart.go('https://m.wsfmall.com/app/smartlife/privacypolicy')
    },
  }
}
</script>

<style scoped lang="scss">
.page,
.main {
  height: 100%;
}

.main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.main .logo {
  width: 638rpx;
  height: 838rpx;
  display: block;
}

.main .text {
  width: 380rpx;
  height: 127rpx;
  margin: 126rpx auto 0;
  display: block;
}
.box {
  overflow: hidden;
}

.box .title {
  height: 50rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #000D1D;
  line-height: 50rpx;
  margin: 24rpx 32rpx 0;
}

.box .content {
  font-size: 26rpx;
  font-weight: 400;
  color: #999999;
  line-height: 40rpx;
  margin: 20rpx 32rpx 0;
}

.aggre-wraper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  font-size: 24rpx;
  font-weight: 400;

  .read-flag {
    width: 32rpx;
    height: 32rpx;
    background-size: 100% 100%;
    margin-right: 8rpx;
  }
  .url {
    font-size: 24rpx;
    color: #FFBE0C;
  }
}

.buttons-wraper {
  margin: 32rpx 0 0;
  padding: 16rpx 0;
  background: #FFFFFF;
  box-shadow: 0rpx -8rpx 40rpx 0rpx rgba(0,13,29,0.05);
  border-radius: 24rpx 24rpx 0rpx 0rpx;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 24rpx;
}

.buttons .disagree {
  width: 224rpx;
  height: 80rpx;
  border-radius: 40rpx;
  border: 1rpx solid #C3C3C3;
  font-size: 32rpx;
  font-weight: 500;
  color: #6E6E6E;
  text-align: center;
  line-height: 80rpx;
  margin-right: 24rpx;
}
.buttons .agree {
  width: 454rpx;
  height: 80rpx;
  background: $wsf-linear-bg;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  text-align: center;
  line-height: 80rpx;
  margin: 0;
}
.buttons .agree::after {
  border: none;
  border-radius: 0;
}

</style>
