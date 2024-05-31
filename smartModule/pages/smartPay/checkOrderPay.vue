<template>
  <view class="payres-contain">
    <wsf-nav-bar
      @onBackBtnClick="openModal()"
      title="支付结果"
      :hasBack="true"
      bgColor="transparent"
      class="nav-bar"
      @getNavHeight="getNavHeight"
    ></wsf-nav-bar>
    <view class="payres-wraper">
      <!-- 支付结果 -->
      <view class="payres" :style="[orderStyle]">
        <!-- 提示语 -->
        <view class="notice-box">
          <!-- <image
            class="notice-img"
          ></image> -->
          <view
            class="notice-img"
          ></view>
          <u-notice-bar
            :speed="80"
            :volume-icon="false"
            type="none"
            border-radius="24"
            padding="16rpx 16rpx 16rpx 64rpx"
            font-size="24"
            color="#444"
            bg-color="#FFD152"
            :list="['注意：万顺福平台及销售商不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作。']"
          ></u-notice-bar>
        </view>
        
        <!-- 内容 -->
        <view class="payres-content">
          <view class="payres-content__img"></view>
          <view class="payres-content__desc">支付失败</view>
          <view class="payres-content__money" v-if="isPaySuccess">¥2399.00</view>
          <view class="payres-content__btn-wraper" :style="[btnWraperStyle]">
            <view class="payres-content__btn">查看订单</view>
            <view class="payres-content__btn special">再来一笔</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 支付异常提醒弹窗 -->
    <wsf-confirm
      v-model="showPayErrorConfirm"
      title="支付异常提醒"
      activeText="去设置"
      :hideConfirm="true"
      cancelText="我知道了"
    >
      <view slot="context">
        <view class="pay-error-confirm-content">1.余额扣款失败，订单已取消，已付金额将予以原路退回，请您留意查收</view>
        <view>2.如还需购买，请您重新加购～</view>
      </view>
      <view slot="button" class="pay-error-confirm-button" @tap="goToOrder()">
        我知道了
      </view>
    </wsf-confirm>
  </view>
</template>

<script>
const app = getApp();
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
export default {
  components: {
    wsfConfirm,
    wsfNavBar,
  },
  data() {
    return {
      navHeight: 0, // 导航高度
      isPaySuccess: true,
    };
  },
  onLoad(options) {

  },
  onShow() {

  },
	computed: {
    orderStyle() {
      return {
        paddingTop: `${this.navHeight}px`
      }
    },
    btnWraperStyle() {
      return {
        marginTop: (this.isPaySuccess ? `30rpx` : `48rpx`)
      }
    }
	},
  methods: {
    // 获取导航栏高速
    getNavHeight(height) {
      this.navHeight = height
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-contain {
  height: 100vh;
  background-color: #fff;
}
.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
}

.payres-wraper {
  .payres {
    background: linear-gradient(360deg, #ffffff 0%, #FFBE0C 50%, #FFBE0C 100%);
    height: 824rpx;
  }
  .notice-box {
    width: 686rpx;
    margin: 0 auto;
    position: relative;
  }
  .notice-img {
    width: 40rpx;
    height: 40rpx;
    background: #EEEEEE;
    position: absolute;
    top: 10rpx;
    left: 16rpx;
  }
  .payres-content {
    width: 686rpx;
    height: 470rpx;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/payed.png);
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
  }
  .payres-content__img {
    width: 160rpx;
    height: 160rpx;
    background: #F1F1F1;
  }
  .payres-content__desc {
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
    margin-top: 8rpx;
  }
  .payres-content__money {
    font-size: 32rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #C3C3C3;
    line-height: 40rpx;
    margin-top: 12rpx;
  }
  .payres-content__btn-wraper {
    display: flex;
    align-items: center;
  }
  .payres-content__btn {
    width: 260rpx;
    height: 80rpx;
    background: #F6F6F6;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #6E6E6E;
    line-height: 80rpx;
    text-align: center;
    margin: 0 12rpx;
  }
  .payres-content__btn.special {
    background: #FFBE0C;
    color: #191919;
  }
  
}
  
.pay-error-confirm-button {
  width: 208rpx;
  height: 60rpx;
  border-radius: 29rpx;
  border: 1px solid #E60113;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #EA0213;
  font-weight: bold;
}

.pay-error-confirm-content{
  margin-bottom: 16rpx; 
  line-height: 44rpx;
}
</style>
