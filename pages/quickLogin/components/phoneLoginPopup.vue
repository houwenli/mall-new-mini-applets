<!-- 已登陆过直接获取手机号登录 -->
<template>
  <view class="popup-wraper">
    <u-popup v-model="showModel" mode="bottom" border-radius="16" :safe-area-inset-bottom="true" @close="close" :mask-custom-style="maskCustomStyle">
      <view class="popup">
        <image src="@/static/img/icon/close-icon.png" class="popup-close-icon" @click="close()"></image>
        <view class="title">
          <image :src="wsfLogo" class="title-icon"></image>
          <text class="title-word">万顺福商城</text>
        </view>
        <view class="desc">
          <view class="desc-main">申请获取并验证你的手机号</view>
          <view class="desc-sub">用于登录验证身份</view>
        </view>
        <view class="phone-number" @click="emitPhoneLogin">{{ dealPhonenumber }}</view>
        <view class="other-login" @click="goLogin">使用其他手机号登录</view>
      </view>
    </u-popup>
  </view>
</template>

<script>

import { phonenumberDim } from '@/common/utils'

export default {
  data() {
    return {
      // 是否展示弹窗
      showModel: false,

      // 使用图片
      wsfLogo: `${this.$smartImg}/home/wsf-logo.png`,
    }
  },
  options: {
    styleIsolation: 'shared'
  },
  props: {
    signal: {
      type: Number,
      default: 0,
    },
    initPhoneNumber: {
      type: Number | String,
      default: 0,
    }
  },
  watch: {
    signal() {
      this.showModel = true
    }
  },
  computed: {
    maskCustomStyle() {
			return {
				backgroundColor: 'rgba(0, 13, 29, 0.6)'
			}
		},
    // 处理之后的手机号码，脱敏
    dealPhonenumber() {
      return phonenumberDim(this.initPhoneNumber)
    }
  },
  methods: {
		close() {
      this.showModel = false
		},
    // 其他手机号登录
    goLogin() {
      this.$smart.go("TextLogin");
      this.close()
    },
    // emit手机号登录
    emitPhoneLogin() {
      this.$emit('initPhoneLogin')
      this.close()
    }
  },
};
</script>

<style scoped lang="scss">
.popup {
	color: #000000;
	position: relative;
  background: #FAFAFB;
	padding: 48rpx 32rpx 96rpx;
	padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
  .popup-close-icon {
		width: 54rpx;
		height: 40rpx;
		position:absolute;
		right: 24rpx;
		top: 52rpx;
	}
  .title {
    display: flex;
    align-items: center;
  }
  .title-icon {
    width: 48rpx;
    height: 48rpx;
  }
  .title-word {
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
    margin-left: 10rpx;
  }
  .desc {
    margin-top: 64rpx;
  }
  .desc-main {
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  .desc-sub {
    height: 34rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
    margin-top: 8rpx;
  }
  .phone-number {
    height: 120rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
    margin-top: 48rpx;
  }
  .other-login {
    text-align: center;
    height: 34rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FF450C;
    line-height: 34rpx;
    margin-top: 32rpx;
  }
}

/deep/ .u-drawer-bottom{
  background-color: #FAFAFB;
}
</style>
