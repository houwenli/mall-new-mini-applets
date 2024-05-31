<template>
  <view class="popup-container">
    <view class="content-outer">
      <view class="content-centre">
        <image
          @click="close()"
          class="close-img"
          :src="`${mallImg}/activity/women-Day/paihangbang_guanbi.png`"
        ></image>
        <image
          class="bg-top"
          :src="`${mallImg}/activity/women-Day/youhuiquan_top.png`"
        ></image>
        <scroll-view :scroll-y="true" class="content-inner">
          <view class="coupon-list" v-if="couponList && couponList.length > 0">
            <view
              v-for="(item, index) in couponList"
              :key="index"
              :class="
                item.unavailableReasonList
                  ? 'coupon-container overdue'
                  : 'coupon-container'
              "
            >
              <view class="coupon-item">
                <view class="left">
                  <view class="coupon-img">
                    <image :src="item.url" />
                  </view>
                  <view class="info">
                    <view class="goods-name" v-if="item.commodityName">{{
                      item.commodityName
                    }}</view>
                    <view>
                      <view v-if="item.effectiveEndTime" class="goods-time">
                        <view class="time-text">有效日期至：</view>
                        <view class="time-text">{{
                          item.effectiveEndTime.split(" ")[0]
                        }}</view>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="right">
                  <view
                    v-if="item.couponsType == 1 || item.couponsType == 3"
                    class="prie-box"
                  >
                    <span class="pire-icon">￥</span>
                    <span class="pire">{{ item.faceValue / 100 }}</span>
                  </view>
                  <view v-else>
                    <span class="pire">{{ item.faceValue / 100 }}</span>
                    <span class="pire-type">折</span>
                  </view>
                  <view class="condition" v-if="item.couponsType == 1">
                    满{{ item.amountLimitation / 100 }}元可用
                  </view>
                  <view class="condition" v-if="item.couponsType == 2"
                    >无门槛</view
                  >
                  <view class="condition" v-if="item.couponsType == 3">
                    满{{ item.faceValue / 100 }}元可用
                  </view>
                  <image
                    @click="goDetail(item)"
                    class="to-use"
                    :src="`${mallImg}/activity/women-Day/lijishiyong.png`"
                  ></image>
                </view>

                <!-- 不可用优惠券加图层置灰 -->
              </view>
              <view class="mask" v-if="item.unavailableReasonList"></view>
              <view v-if="item.unavailableReasonList" class="goods-not-time">
                不可用原因：{{ item.unavailableReasonList.join("、") }}
              </view>
            </view>
          </view>
          <view class="not-have-coupon" v-if="hasCoupon">
            <image
              class="gift-img"
              :src="`${mallImg}/activity/women-Day/lingquan_wuquan.png`"
            ></image>
            <view class="not-have-coupon-text">您还没有优惠券</view>
            <view class="not-have-coupon-text">游戏挑战成功即有机会领取</view>
            <image
              @click="startGame()"
              class="begin-button"
              :src="`${mallImg}/activity/women-Day/shouye_kaishiyouxi.png`"
            ></image>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.selectCoupon();
  },
  data() {
    return {
      couponList: null,
      hasCoupon: false,
      mallImg: this.$mallImg,
    };
  },
  methods: {
    async selectCoupon() {
      try {
        let res = await this.$u.api.getMyCouponList();
        if (res.code === 200) {
          this.couponList = res.data.userCouponList || [];
          this.hasCoupon = this.couponList.length < 1;
        }
      } catch (error) {
        console.error(error);
      }
    },
    goDetail(item) {
      this.$wsf.go("SkuDetail", { spuId: item.spuId});
    },
    startGame() {
      this.$emit("update:show", false);
      this.$emit("startGame", false);
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
  padding: 190rpx 27rpx 134rpx 27rpx;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 100;
  .content-outer {
    width: 100%;
    height: 100%;
    background: #fba5cc;
    border-radius: 30rpx;
    padding: 20rpx 10rpx;
  }
  .content-centre {
    width: 100%;
    height: 100%;
    background: #e23e87;
    border-radius: 30rpx;
    padding: 14rpx 0rpx 17rpx 0rpx;
  }
  .bg-top {
    width: 393rpx;
    height: 139rpx;
    position: absolute;
    top: 112rpx;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 150;
  }
  .close-img {
    width: 69rpx;
    height: 69rpx;
    position: absolute;
    top: 150rpx;
    right: 8rpx;
    z-index: 150;
  }
  .content-inner {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #f7f3f7;
    box-shadow: 0rpx 6rpx 3rpx 0rpx rgba(0, 0, 0, 0.16);
    border-radius: 30rpx;
    padding: 57rpx 0rpx;
    box-sizing: border-box;
  }
  .coupon-list {
    width: 100%;
    padding: 0rpx 12rpx;
    .coupon-container {
      height: 199rpx;
      margin-bottom: 19rpx;
      position: relative;
      border-radius: 40rpx;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .coupon-item {
        background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png")
          no-repeat;
        background-size: 100% 100%;
        display: flex;
        height: 199rpx;

        .left {
          flex: 1;
          padding: 10rpx;
          display: flex;
          height: 100%;
          .coupon-img {
            width: 178rpx;
            // max-width: 178rpx;
            // min-height: 178rpx;
            height: 178rpx;
            border-radius: 40rpx;
            margin-right: 10rpx;
            overflow: hidden;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .goods-name {
            font-size: 26rpx;
            line-height: 32rpx;
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
            padding-top: 16rpx;
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
          width: 214rpx;
          height: 100%;
          position: relative;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 14rpx;
          .prie-box {
            display: flex;
          }
          .pire-icon {
            margin-top: 5rpx;
            font-size: 24rpx;
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
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #f54695;
          }
          .condition {
            font-size: 24rpx;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #4c4a4b;
          }
          .to-use {
            display: inline-block;
            width: 164rpx;
            height: 60rpx;
            margin-top: 4rpx;
          }
        }
        .use-buttom {
          width: 60px;
          height: 20px;
          background: #ffffff;
          border-radius: 10px;
          color: #fe4c47;
          text-align: center;
        }
      }
      .mask {
        background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/bukeyong_mengban.png");
        background-size: 101.5% 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
      .goods-not-time {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #000000;
        text-align: center;
      }
    }
    .overdue {
      height: 256rpx;
    }
  }
  .not-have-coupon {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
    .gift-img {
      width: 348rpx;
      height: 256rpx;
      margin-bottom: 46rpx;
    }
    .not-have-coupon-text {
      font-size: 36rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #999999;
    }
    .begin-button {
      width: 452rpx;
      height: 152rpx;
      margin-top: 54rpx;
    }
  }
}
</style>
