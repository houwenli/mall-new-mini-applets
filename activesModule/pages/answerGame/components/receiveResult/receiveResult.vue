<template>
  <view class="popup-container">
    <image
      :class="
        receivType === 'receivedSuccessfully'
          ? 'container-bg'
          : 'fail-container-bg'
      "
      :src="srcImg"
    ></image>
    <view
      class="coupon-container"
      :style="{
        marginTop: receivType === 'receivedSuccessfully' ? '283rpx' : '0rpx',
      }"
    >
      <view
        @click="selectCoupon(item)"
        class="coupon-item"
        v-if="receivType === 'receivedSuccessfully'"
      >
        <view class="left">
          <view class="coupon-img">
            <image class="image" :src="successCoupon.url"></image>
          </view>
          <view class="info">
            <view class="goods-name" v-if="successCoupon.showName">{{
              successCoupon.showName
            }}</view>
            <view
              class="goods-time"
              v-if="successCoupon.packCouponTimeLimitTxt"
            >
              <view class="time-text">{{
                successCoupon.packCouponTimeLimitTxt.split(" ")[0]
              }}</view>
              <view class="time-text">{{
                successCoupon.packCouponTimeLimitTxt.split(" ")[1]
              }}</view>
            </view>
          </view>
        </view>
        <view class="right">
          <view class="goods-pire" v-if="successCoupon.faceValue">
            <view
              v-if="
                successCoupon.couponsType == 1 || successCoupon.couponsType == 3
              "
            >
              <span class="pire-icon">￥</span>
              <span class="pire">{{ successCoupon.faceValue / 100 }}</span>
            </view>
            <view v-else>
              <span class="pire">{{ successCoupon.faceValue / 100 }}</span>
              <span class="pire-type">折</span>
            </view>
          </view>
          <view class="goods-rule" v-if="successCoupon.couponUseInfoTxt">{{
            successCoupon.couponUseInfoTxt
          }}</view>
          <image
            @click="goDetail()"
            class="uaer-but"
            :src="`${mallImg}/activity/women-Day/lijishiyong.png`"
          ></image>
        </view>
        <image
          :src="`${mallImg}/activity/women-Day/youhuiquan_mengban.png`"
          class="mask"
          v-if="item.isMask"
        ></image>
      </view>
      <view class="redo-button" @click="playAgain()">再玩一次</view>
      <view class="my-coupon-button" @click="openMyCoupon()">我的优惠券</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "receiveResult",
  props: {
    receivType: {
      type: String,
      default: "receivedFail",
    },
    successCoupon: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    srcImg() {
      if (this.receivType === "receivedSuccessfully") {
        return `${this.mallImg}/activity/women-Day/lingqu_guang.png`;
      } else {
        return `${this.mallImg}/activity/women-Day/huobao.png`;
      }
    },
  },
  data() {
    return {
      mallImg: this.$mallImg,
    };
  },

  methods: {
    async playAgain() {
      uni.navigateBack();
    },
    goDetail() {
      this.$wsf.go("SkuDetail", { spuId: this.successCoupon.spuId ,enterType:'answer'});
    },
    // 返回游戏首页打开优惠券弹窗
    openMyCoupon() {
      uni.setStorageSync("type", "openMyCoupon");
      uni.navigateBack();
    },
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .container-bg {
    width: 750rpx;
    height: 936rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -56%);
  }
  .fail-container-bg {
    width: 100%;
    height: 537rpx;
  }
  .coupon-container {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0rpx 42rpx;
    margin-top: 283rpx;
    z-index: 200;
    .coupon-item {
      background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png")
        no-repeat;
      background-size: 100% auto;
      margin: 20rpx 0rpx;
      display: flex;
      position: relative;
      width: 100%;
      border-radius: 40rpx;
      overflow: hidden;

      .left {
        flex: 1;
        padding: 10rpx;
        display: flex;
        .coupon-img {
          min-width: 178rpx;
          width: 178rpx;
          // max-width: 79px;
          height: 178rpx;
          border-radius: 40rpx;
          margin-right: 10px;
          overflow: hidden;
          .image {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .goods-name {
          font-size: 26rpx;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #000000;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 2; //行数
          line-clamp: 2;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
          margin-top: 16rpx;
        }
        .goods-time {
          margin-bottom: 11rpx;
          .time-text {
            font-size: 24rpx;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #e23e87;
            line-height: 26rpx;
          }
        }
      }
      .right {
        width: 220rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .goods-pire {
          display: flex;
          height: 26px;
          line-height: 26px;
          .pire-icon {
            font-size: 24rpx;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #f54695;
          }
          .pire {
            font-size: 60rpx;
            font-family: Arial;
            font-weight: bold;
            color: #f54695;
          }
          .pire-type {
            font-size: 24rpx;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #f54695;
          }
        }
      }
      .uaer-but {
        margin-top: 4rpx;
        width: 168rpx;
        height: 60rpx;
      }
      .goods-rule {
        font-size: 24rpx;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #4c4a4b;
      }
    }
    .redo-button {
      background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png")
        no-repeat;
      background-size: 100% 100%;
      width: 451rpx;
      height: 146rpx;
      line-height: 160rpx;
      margin-top: 56rpx;
      text-align: center;
      font-size: 50rpx;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 2rpx 2rpx #000000;
    }
    .my-coupon-button {
      margin: auto;
      margin-top: 48rpx;
      width: 439rpx;
      height: 115rpx;
      border: 1px solid #ffffff;
      border-radius: 58rpx;
      text-align: center;
      line-height: 115rpx;
      font-size: 25px;
      font-family: Source Han Sans CN;
      font-weight: 300;
      color: #ffffff;
    }
  }
}
</style>
