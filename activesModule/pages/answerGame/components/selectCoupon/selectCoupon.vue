<template>
  <view class="popup-container">
    <!-- 背景图 -->
    <image
      class="container-bgc"
      :src="`${mallImg}/activity/women-Day/lingquan_tiaozhanchenggong.png`"
    ></image>
    <!-- 头像光 -->
    <image
      class="header-light"
      :src="`${mallImg}/activity/women-Day/tiaozhan_guang.png`"
    ></image>
    <!-- 头像 -->
    <view class="header-box">
      <image
        class="header-img"
        :src="`${mallImg}/activity/women-Day/touxiang.png`"
      ></image>
    </view>

    <!-- 优惠券内容 -->
    <view class="coupon-container">
      <scroll-view :scroll-y="true" class="coupon-list">
        <view
          v-for="(item, index) in couponList"
          :key="index"
          @click="selectCoupon(item)"
          class="coupon-item"
          :style="{ marginTop: index === 0 ? '0rpx' : '20rpx' }"
        >
          <view class="left">
            <view class="coupon-img">
              <image class="image" :src="item.url"></image>
            </view>
            <view class="info">
              <view class="goods-name">{{ item.showName }}</view>
              <view class="goods-time" v-if="item.packCouponTimeLimitTxt">
                <view class="time-text"
                  >{{ item.packCouponTimeLimitTxt.split(" ")[0] }}：</view
                >
                <view class="time-text">{{
                  item.packCouponTimeLimitTxt.split(" ")[1]
                }}</view>
              </view>
            </view>
          </view>
          <view class="right">
            <view class="goods-pire">
              <view
                v-if="item.couponsType == 1 || item.couponsType == 3"
                class="pire-box"
              >
                <span class="pire-icon">￥</span>
                <span class="pire">{{ item.faceValue / 100 }}</span>
              </view>
              <view v-else>
                <span class="pire">{{ item.faceValue / 100 }}</span>
                <span class="pire-type">折</span>
              </view>
            </view>
            <view class="goods-rule">{{ item.couponUseInfoTxt }}</view>
          </view>
          <image
            :src="`${mallImg}/activity/women-Day/youhuiquan_mengban.png`"
            class="mask"
            v-if="item.isMask"
          ></image>
        </view>
      </scroll-view>

      <view
        class="confirm confirm-img"
        v-if="itemCoupon"
        @click="itemCoupon && receive()"
      >
        <image
          class="image"
          :src="`${mallImg}/activity/women-Day/dati_xiayiti.png`"
        ></image>
        <view class="confirm-text">领取优惠券</view></view
      >
      <view v-else class="confirm confirm-grey">领取优惠券</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "selectCoupon",
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    listData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.couponList = this.$u.deepClone(newVal);
        this.couponList[0].couponsType = 1;
      },
    },
  },
  data() {
    return {
      itemCoupon: null, //选中的卡券
      couponList: [],
      mallImg: this.$mallImg,
    };
  },

  methods: {
    selectCoupon(coupon) {
      coupon.isMask = false;
      this.itemCoupon = coupon;
      this.couponList.forEach((item, index) => {
        if (item.giftId != coupon.giftId) {
          this.$set(item, "isMask", true);
          this.$forceUpdate();
        }
      });
      console.log(this.couponList, "this.couponList");
    },
    async receive() {
      let params = {
        activityId: this.itemCoupon.activityId,
        couponId: this.itemCoupon.id,
        sendNumber: this.itemCoupon.sendNumber,
      };
      try {
        let res = await this.$u.api.addCouponDistribute(params);
        if (res.code === 200) {
          let paramsRecord = {
            claimNum: this.itemCoupon.sendNumber,
            id: this.options.id,
            nodeType: 3,
          };
          // 领取成功添加一条记录
          await this.$u.api.addRecord(paramsRecord);
          this.$emit(
            "isShowReceiveResult",
            "receivedSuccessfully",
            this.itemCoupon
          );
        } else {
          this.$emit("isShowReceiveResult", "receivedFail");
        }
      } catch (error) {
        console.log(error);
        this.$emit("isShowReceiveResult", "receivedFail");
      }
    },
    close() {
      this.$emit("update:show", false);
    },
    open() {},
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  height: 1624rpx;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 100;
  .container-bgc {
    width: 100%;
    height: 1437rpx;
    position: absolute;
    top: 84rpx;
    left: 0;
    z-index: 50;
  }
  .header-light {
    position: absolute;
    top: 73rpx;
    z-index: 200;
    width: 100%;
    z-index: 20;
  }
  .header-box {
    position: absolute;
    top: 153rpx;
    left: 50%;
    z-index: 40;
    transform: translate(-50%, 0%);
    width: 173rpx;
    height: 173rpx;
    border: 6rpx solid #f9adae;
    border-radius: 50%;
    .header-img {
      width: 100%;
      height: 100%;
    }
  }
}
.coupon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 620rpx 70rpx 185rpx 70rpx;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}
.coupon-list {
  width: 100%;
  overflow: auto;
  z-index: 100;
  .coupon-item {
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png")
      no-repeat;
    background-size: 100% 100%;
    margin-top: 20rpx;
    display: flex;
    height: 200rpx;
    position: relative;
    width: 100%;
    border-radius: 40rpx;
    overflow: hidden;
    .mask {
      height: 100%;
      position: absolute;
      width: 100%;
    }

    .left {
      flex: 1;
      padding: 10rpx;
      display: flex;
      height: 100%;
      .coupon-img {
        width: 178rpx;
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
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16rpx 0rpx 11rpx 0rpx;
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
      }
      .goods-time {
        .time-text {
          font-size: 24rpx;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #e23e87;
          line-height: 26rpx;
        }
      }
    }
    // & .left:before {
    //   content: '';
    //   position: absolute;
    //   top: 50%;
    //   //   background: #a75236;
    //   background: #00ff62;
    //   width: 5px;
    //   height: 5px;
    // }
    .right {
      width: 204rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .goods-pire {
        display: flex;
        height: 26px;
        margin-bottom: 16rpx;
        .pire-box {
          display: flex;
        }
        .pire-icon {
          font-size: 24rpx;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #f54695;
          margin-top: 6rpx;
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
    .goods-rule {
      font-size: 24rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #4c4a4b;
    }
  }
}
.confirm {
  font-size: 50rpx;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #7a7a7a;
  line-height: 115rpx;
  z-index: 100;
  margin-top: 64rpx;
  text-align: center;
}
.confirm-grey {
  width: 439rpx;
  height: 115rpx;
  background: #cdcdcd;
  border-radius: 58rpx;
}
.confirm-img {
  width: 452rpx;
  position: relative;
  z-index: 80;

  .image {
    position: absolute;
    width: 425rpx;
    height: 144rpx;
    top: 50%;
    left: 0;
    transform: translate(0%, -55%);
  }
  .confirm-text {
    z-index: 100;
    position: relative;
    top: 50%;
    transform: translate(0%, -50%);
    font-size: 50rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0rpx 2rpx 2rpx #000000;
  }
}
</style>
